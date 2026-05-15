from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import asyncio
import logging
from datetime import datetime, timezone, timedelta, date
from typing import List, Optional

import bcrypt
import jwt
import resend
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

from content import BRANDS, CITIES, SERVICES, ISSUES, FAQ, TESTIMONIALS

# ---------- setup ----------
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("mobilemistri")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGO = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@mobilemistri.com").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL", ADMIN_EMAIL)

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="MobileMistri API")
api = APIRouter(prefix="/api")

# ---------- helpers ----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def get_admin(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(auth[7:], JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("role") != "admin":
            raise HTTPException(401, "Not authorized")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

async def send_email_safe(to_email: str, subject: str, html: str) -> Optional[str]:
    """Send via Resend. Silently log and return None if key missing/sending fails."""
    if not RESEND_API_KEY:
        logger.info(f"[email skipped — no RESEND_API_KEY] to={to_email} subject={subject}")
        return None
    try:
        params = {"from": SENDER_EMAIL, "to": [to_email], "subject": subject, "html": html}
        res = await asyncio.to_thread(resend.Emails.send, params)
        return res.get("id") if isinstance(res, dict) else None
    except Exception as e:
        logger.error(f"Resend failed: {e}")
        return None

def enquiry_email_html(e: dict) -> str:
    rows = "".join(
        f"<tr><td style='padding:6px 12px;color:#64748b;font-size:13px'>{k}</td>"
        f"<td style='padding:6px 12px;font-weight:600'>{v or '-'}</td></tr>"
        for k, v in [
            ("Name", e.get("name")),
            ("Phone", e.get("phone")),
            ("City", e.get("city")),
            ("Brand", e.get("brand")),
            ("Model", e.get("model")),
            ("Issue", e.get("issue")),
            ("Message", e.get("message")),
            ("Source", e.get("source")),
            ("Received", e.get("created_at")),
        ]
    )
    return f"""
    <div style="font-family:Arial,sans-serif;background:#FAFAFA;padding:24px">
      <div style="max-width:560px;margin:auto;background:#fff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden">
        <div style="background:#0B1B3D;color:#fff;padding:20px 24px">
          <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.7">MobileMistri</div>
          <div style="font-size:20px;font-weight:700;margin-top:4px">New enquiry received</div>
        </div>
        <table style="width:100%;border-collapse:collapse">{rows}</table>
        <div style="padding:16px 24px;border-top:1px solid #E2E8F0;background:#FAFAFA;color:#64748b;font-size:12px">
          Reply to this enquiry within 15 mins for best conversion.
        </div>
      </div>
    </div>
    """

# ---------- models ----------
class EnquiryIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    phone: str
    city: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    issue: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "website"

class Enquiry(EnquiryIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"

class BookingIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    phone: str
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    brand: str
    model: str
    issue: str
    notes: Optional[str] = None
    preferred_date: Optional[str] = None
    preferred_slot: Optional[str] = None

class Booking(BookingIn):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"

class StatusUpdate(BaseModel):
    status: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    email: str
    role: str = "admin"

# ---------- routes: public ----------
@api.get("/")
async def root():
    return {"service": "MobileMistri", "status": "ok"}

@api.get("/content")
async def content():
    return {
        "brands": BRANDS,
        "cities": CITIES,
        "services": SERVICES,
        "issues": ISSUES,
        "faq": FAQ,
        "testimonials": TESTIMONIALS,
    }

@api.post("/enquiries", response_model=Enquiry)
async def create_enquiry(payload: EnquiryIn):
    e = Enquiry(**payload.model_dump())
    doc = e.model_dump()
    try:
        await db.enquiries.insert_one(doc.copy())
    except Exception as exc:
        logger.warning(f"Skipping DB insert for enquiry: {exc}")
    # fire-and-forget admin notification
    asyncio.create_task(send_email_safe(
        NOTIFY_EMAIL,
        f"New MobileMistri enquiry — {e.name}",
        enquiry_email_html(doc),
    ))
    return e

@api.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingIn):
    b = Booking(**payload.model_dump())
    doc = b.model_dump()
    try:
        await db.bookings.insert_one(doc.copy())
    except Exception as exc:
        logger.warning(f"Skipping DB insert for booking: {exc}")
    asyncio.create_task(send_email_safe(
        NOTIFY_EMAIL,
        f"New MobileMistri booking — {b.brand} {b.model} ({b.city})",
        enquiry_email_html(doc),
    ))
    if b.email:
        customer_html = f"""
        <div style="font-family:Arial,sans-serif;padding:24px;background:#FAFAFA">
          <div style="max-width:560px;margin:auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #E2E8F0">
            <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#FF5A00;font-weight:700">MobileMistri</div>
            <h2 style="color:#0B1B3D;margin:8px 0 16px">Booking received ✓</h2>
            <p>Hi {b.name},</p>
            <p>Your doorstep repair request for <b>{b.brand} {b.model}</b> in <b>{b.city}</b> has been received. Our team will call you on <b>{b.phone}</b> within 15 minutes to confirm the slot.</p>
            <p style="color:#64748B;font-size:13px">Booking ID: <b>{b.id[:8].upper()}</b></p>
          </div>
        </div>"""
        asyncio.create_task(send_email_safe(b.email, "Your MobileMistri booking is confirmed", customer_html))
    return b

# ---------- routes: admin ----------
@api.post("/admin/login", response_model=TokenOut)
async def admin_login(body: LoginIn):
    email = body.email.lower()
    user = await db.admins.find_one({"email": email}, {"_id": 0})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    return TokenOut(access_token=create_token(email), email=email)

@api.get("/admin/me")
async def admin_me(user=Depends(get_admin)):
    return {"email": user["sub"], "role": user["role"]}

@api.get("/admin/enquiries")
async def list_enquiries(user=Depends(get_admin)):
    items = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items

@api.get("/admin/bookings")
async def list_bookings(user=Depends(get_admin)):
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items

@api.get("/admin/stats")
async def admin_stats(user=Depends(get_admin)):
    return {
        "enquiries": await db.enquiries.count_documents({}),
        "bookings": await db.bookings.count_documents({}),
        "new_enquiries": await db.enquiries.count_documents({"status": "new"}),
    }

ALLOWED_STATUSES = {"new", "contacted", "converted", "lost"}

@api.patch("/admin/enquiries/{eid}/status")
async def update_enquiry_status(eid: str, body: StatusUpdate, user=Depends(get_admin)):
    if body.status not in ALLOWED_STATUSES:
        raise HTTPException(400, f"Invalid status. Must be one of {sorted(ALLOWED_STATUSES)}")
    res = await db.enquiries.update_one({"id": eid}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(404, "Enquiry not found")
    return {"id": eid, "status": body.status}

@api.patch("/admin/bookings/{bid}/status")
async def update_booking_status(bid: str, body: StatusUpdate, user=Depends(get_admin)):
    if body.status not in ALLOWED_STATUSES:
        raise HTTPException(400, f"Invalid status. Must be one of {sorted(ALLOWED_STATUSES)}")
    res = await db.bookings.update_one({"id": bid}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(404, "Booking not found")
    return {"id": bid, "status": body.status}

# ---------- seo: sitemap + robots ----------

# Priority tiers for cities and brands
_CITY_PRIORITY = {
    "delhi": "0.9", "noida": "0.9", "gurgaon": "0.9",
    "hyderabad": "0.9", "bangalore": "0.9", "mumbai": "0.9",
}
_BRAND_PRIORITY = {
    "apple": "0.9", "samsung": "0.9",
    "oneplus": "0.8", "xiaomi": "0.8", "google-pixel": "0.8",
}
_METRO_CITIES = {"delhi", "noida", "gurgaon", "hyderabad", "bangalore", "mumbai"}
_TOP_BRANDS   = {"apple", "samsung"}
_MID_BRANDS   = {"oneplus", "xiaomi", "google-pixel"}


@app.get("/sitemap.xml", include_in_schema=False)
async def sitemap():
    today   = date.today().isoformat()
    base    = "https://www.mobilemistri.com"
    entries = []

    def url(loc, priority, freq):
        return (
            f"  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>{freq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            f"  </url>"
        )

    def url_inline(loc, priority, freq):
        return (
            f"  <url>"
            f"<loc>{loc}</loc>"
            f"<lastmod>{today}</lastmod>"
            f"<changefreq>{freq}</changefreq>"
            f"<priority>{priority}</priority>"
            f"</url>"
        )

    # Core pages
    core = [
        ("/",        "1.0", "weekly"),
        ("/book",    "0.9", "weekly"),
        ("/services","0.9", "monthly"),
        ("/cities",  "0.8", "monthly"),
        ("/about",   "0.7", "monthly"),
        ("/faq",     "0.7", "monthly"),
    ]
    entries.append("  <!-- CORE PAGES -->")
    for path, pri, freq in core:
        entries.append(url(f"{base}{path}", pri, freq))

    # City pages
    entries.append("\n  <!-- CITY PAGES -->")
    for city in CITIES:
        pri = _CITY_PRIORITY.get(city["slug"], "0.8")
        entries.append(url(f"{base}/city/{city['slug']}", pri, "weekly"))

    # Brand pages (exclude 'other')
    entries.append("\n  <!-- BRAND PAGES -->")
    for brand in BRANDS:
        if brand["slug"] == "other":
            continue
        pri = _BRAND_PRIORITY.get(brand["slug"], "0.7")
        entries.append(url(f"{base}/brand/{brand['slug']}", pri, "monthly"))

    # City × Brand combinations (exclude 'other' brand)
    entries.append("\n  <!-- CITY x BRAND PAGES -->")
    for city in CITIES:
        entries.append(f"  <!-- {city['name']} -->")
        for brand in BRANDS:
            if brand["slug"] == "other":
                continue
            cs, bs = city["slug"], brand["slug"]
            if cs in _METRO_CITIES and bs in _TOP_BRANDS:
                pri = "0.8"
            elif cs in _METRO_CITIES and bs in _MID_BRANDS:
                pri = "0.7"
            else:
                pri = "0.6"
            entries.append(url_inline(f"{base}/city/{cs}/{bs}", pri, "monthly"))

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
        '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n'
        '                            https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n'
        + "\n".join(entries)
        + "\n</urlset>"
    )
    return Response(content=xml, media_type="application/xml")


@app.get("/robots.txt", include_in_schema=False)
async def robots():
    content = (
        "# www.mobilemistri.com — robots.txt\n"
        "\n"
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "# Block admin section from indexing\n"
        "Disallow: /admin\n"
        "Disallow: /admin/\n"
        "\n"
        "# Block API and query strings\n"
        "Disallow: /api/\n"
        "Disallow: /*?*\n"
        "\n"
        "Sitemap: https://www.mobilemistri.com/sitemap.xml\n"
    )
    return Response(content=content, media_type="text/plain")


# ---------- include + cors ----------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- startup ----------
@app.on_event("startup")
async def seed_admin():
    try:
        existing = await db.admins.find_one({"email": ADMIN_EMAIL})
        if not existing:
            await db.admins.insert_one({
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info(f"Admin seeded: {ADMIN_EMAIL}")
        elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
            await db.admins.update_one({"email": ADMIN_EMAIL},
                                       {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
            logger.info(f"Admin password updated from .env")
    except Exception as e:
        logger.warning(f"Skipping admin seed, MongoDB connection failed: {e}")

@app.on_event("shutdown")
async def shutdown():
    client.close()
