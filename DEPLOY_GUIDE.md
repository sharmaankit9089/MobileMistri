# MobileMistri — Deploy & Edit Guide

This guide explains how to deploy MobileMistri.com to a custom domain and how to make content changes after launch.

---

## 1. Deploy to a new domain (Emergent)

1. Open your Emergent project → click **Deploy** in the top-right.
2. Choose **Deploy to production**. Emergent builds the frontend + backend and gives you a public URL like `https://mobilemistri.preview.emergentagent.com`.
3. To connect your own domain (e.g. `mobilemistri.com`):
   - Go to **Settings → Custom Domain** in Emergent.
   - Enter `mobilemistri.com` (and `www.mobilemistri.com`).
   - Emergent shows you two DNS records (CNAME/A). Add them at your domain registrar (GoDaddy, Namecheap, Cloudflare).
   - Wait 5–30 minutes for DNS to propagate. SSL is auto-provisioned.
4. Once the custom domain is live, **update `REACT_APP_BACKEND_URL`** in `/app/frontend/.env` to your domain and redeploy.

---

## 2. Environment variables to set before launch

File: `/app/backend/.env`

| Var | What it does | Example |
|---|---|---|
| `ADMIN_EMAIL` | Email to log into `/admin/login` | `owner@mobilemistri.com` |
| `ADMIN_PASSWORD` | Password for admin login (change in production!) | `StrongPass@123` |
| `JWT_SECRET` | Signs admin tokens — regenerate with `openssl rand -hex 32` | `<64-char-hex>` |
| `RESEND_API_KEY` | Enables email notifications. Get from [resend.com](https://resend.com) → API Keys | `re_xxxxxxxxxx` |
| `SENDER_EMAIL` | "From" address — verify the sending domain on Resend first | `hello@mobilemistri.com` |
| `NOTIFY_EMAIL` | Where new enquiry/booking emails go | `leads@mobilemistri.com` |
| `MONGO_URL` | Already configured — leave as-is | (Emergent-managed) |

After editing `.env`, restart backend: `sudo supervisorctl restart backend`.

---

## 3. Edit content (no code required)

All public-facing data lives in **`/app/backend/content.py`**. Just open it, change the Python lists, and save. Hot-reload picks up changes instantly. No front-end rebuild needed.

### Add a new city
```python
CITIES = [
    # ... existing ...
    {"slug": "chennai", "name": "Chennai", "region": "South"},
]
```

### Add a new brand (or add more models to Apple etc.)
```python
BRANDS = [
    # ... existing ...
    {
        "slug": "vivo",
        "name": "Vivo",
        "tag": "Vivo repair",
        "models": ["V40", "V30 Pro", "X100 Pro", "T3 Ultra"],
    },
]
```
Note: every brand automatically gets `"Other model (specify)"` appended so users can always type a custom model.

### Change a service price
Edit `SERVICES` — change `"price_from": 1499` to whatever you want.

### Edit FAQ, testimonials, issues
Edit the `FAQ`, `TESTIMONIALS`, `ISSUES` arrays in the same file.

### Edit phone number / email in UI
Header + Footer phone: search for `98765 43210` in `/app/frontend/src/components/Header.jsx` and `Footer.jsx`.
Final CTA phone: `/app/frontend/src/pages/Home.jsx`.

---

## 4. Access the admin dashboard

- URL: `https://<your-domain>/admin/login`
- Log in with `ADMIN_EMAIL` + `ADMIN_PASSWORD` from `.env`.
- See **stats** (total enquiries/bookings), full **enquiries table**, full **bookings table**.
- Refresh / Log out buttons top-right.

Every form submission on the site is saved to MongoDB + emailed to `NOTIFY_EMAIL` (when Resend is configured).

---

## 5. SEO — what's already done

- Per-brand pages: `/brand/apple`, `/brand/samsung`, …
- Per-city pages: `/city/delhi`, `/city/mumbai`, …
- Combo pages (highest volume): `/city/delhi/apple`, `/city/bangalore/oneplus`, etc.
- Footer contains interlinks for every city × brand combination (great for crawlers).
- `<title>` + `<meta description>` + `<meta keywords>` + Open Graph tags already set in `/app/frontend/public/index.html`.
- To add more long-tail pages (e.g. `/screen-replacement-in-delhi`), duplicate `CityPage.jsx` logic.

### Recommended next SEO steps
1. Submit `sitemap.xml` to Google Search Console (generate one listing all city × brand routes).
2. Add Google Analytics 4 / GTM snippet in `public/index.html`.
3. Get backlinks from tech blogs, local directories (JustDial, Sulekha, Google My Business).
4. Add schema.org `LocalBusiness` + `FAQPage` JSON-LD to boost rich results.

---

## 6. Making code changes after deploy

- **Hot reload is on.** Save a file → the change goes live automatically in preview.
- For production, redeploy from Emergent after pushing changes.
- Never delete existing env keys from `.env` — add new ones below.
- Use `sudo supervisorctl restart backend` only after editing `.env` or installing new Python packages.

---

Need help? Email `support@mobilemistri.com` (replace with yours).
