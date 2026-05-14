# MobileMistri — Product Requirements Document

**Last updated:** 2026-02-21

## Original problem statement
Build MobileMistri.com — a doorstep mobile repair platform for 8 brands (Apple, Samsung, OnePlus, Xiaomi, Google Pixel, Nothing, Realme, Motorola) across 9 Indian cities (Delhi, Noida, Gurgaon, Ghaziabad, Faridabad, Hyderabad, Bangalore, Pune, Mumbai). Take client input (brand, model, problem, name, number), rank top on SEO, floating top-right enquiry form, UK-inspired UI (uBreakiFix / Asurion / iSmash). Final theme matched to [screen-fix-now reference](https://screen-fix-now.preview.emergentagent.com/): white background + `#002FA7` royal blue + Outfit font.

## User choices
- Scope: 1c — full booking + marketing + SEO pages
- Backend: 2b — MongoDB + Resend email notifications
- Admin: 3a — JWT-protected admin dashboard
- Design: 4c — design agent decided; later overridden to match screen-fix-now reference (white + royal blue + Outfit)
- Deploy guide + JSON-like content config: Yes

## Personas
- **Phone user (B2C)** — wants trustworthy, quick doorstep repair with warranty
- **SMB / fleet** — needs fast turnaround on multiple devices
- **Admin / operator** — reviews incoming enquiries and bookings

## Architecture
- **Backend:** FastAPI + Motor (async MongoDB) + bcrypt + PyJWT + Resend
- **Frontend:** React 19 + React Router + Tailwind + shadcn/ui + Outfit/Figtree fonts + sonner toasts + lucide-react + react-icons/si
- **Content:** Single `/app/backend/content.py` (Python lists) — editable by non-devs
- **Auth:** JWT bearer token in `localStorage` (admin only); seeded from env
- **Email:** Resend (admin notification + customer confirmation). Gracefully skipped when `RESEND_API_KEY` empty.

## What's been implemented (2026-02-21)
- Homepage with reference-matched hero (white bg, royal blue `#002FA7`, Outfit font), inline callback form on the right, dark zinc-950 stats strip, brands row, services grid, how-it-works, cities grid, testimonials, blue final-CTA section
- Floating top-right "Get Quote" → shadcn `Sheet` slide-over (EnquirySheet component)
- Multi-step `/book` flow: Brand → Model → Issue → Details, with validation + booking summary + success page
- "Other brand" option + "Other model (specify)" on every brand with custom text-input fallback (both in inline form, slide-over, and booking flow)
- Brand SEO pages: `/brand/:brand`
- City SEO pages: `/city/:city` and combo pages `/city/:city/:brand`
- Services page, Cities page, FAQ accordion, About page, 404 page
- Footer with long-tail city × brand SEO interlinks + Admin link
- Admin JWT auth — `/admin/login` + `/admin` dashboard showing stats, enquiries table, bookings table, logout
- Meta tags, Open Graph, SEO keywords already in `public/index.html`
- Resend email integration (admin notification + customer confirmation) — gracefully no-op when key empty
- DEPLOY_GUIDE.md with full deploy + content editing instructions
- Admin credentials in `/app/memory/test_credentials.md`: `admin@mobilemistri.com` / `MobileMistri@2026`

## Testing status
- Iteration 3: **17 backend tests passed** + **full Playwright E2E** verified (home, /book, /brand/apple, /city/delhi, admin flow)

## Prioritised backlog
### P0 (required before business launch)
1. Add real Resend API key + verified sender domain
2. Update admin password in `.env`
3. Point custom domain `mobilemistri.com` to Emergent
4. Add Google Analytics / GTM snippet
5. Generate + submit `sitemap.xml`

### P1 (near-term)
1. WhatsApp click-to-chat floating button (currently only phone)
2. Protection plans / extended warranty purchase page (user mentioned this in brief)
3. `LocalBusiness` + `FAQPage` JSON-LD schema for rich results
4. Status update in admin: mark enquiry as Contacted / Converted / Lost
5. CSV export of leads from admin dashboard
6. OTP verification on phone field (Twilio / MSG91) to reduce fake leads

### P2 (growth)
1. City + brand expansion (Chennai, Kolkata, Ahmedabad, etc.)
2. Blog / content marketing section for long-tail SEO
3. Customer review collection post-repair (Google reviews + on-site)
4. Technician app for dispatch (separate mini-app)
5. Corporate SLA tier / B2B dashboard
6. AMC & Protection plan subscription checkout (Stripe / Razorpay)

## Next tasks
- Collect production `RESEND_API_KEY`, `ADMIN_PASSWORD`, custom domain from user → redeploy
- Implement P1 item #2 (Protection plans page) as next feature
