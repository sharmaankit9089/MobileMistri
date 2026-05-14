from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import asyncio
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
import resend
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
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
