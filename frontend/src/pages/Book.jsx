import { useMemo, useState, useEffect } from "react";
import { useContent } from "../lib/content";
import { useSEO } from "../lib/useSEO";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { submitBooking } from "../lib/api";
import { lookupCityByPin } from "../lib/pincode";
import { toast } from "sonner";
import { Check, ArrowLeft, ArrowRight, Loader2, MapPin, AlertTriangle } from "lucide-react";
import BrandIcon from "../components/BrandIcon";
import { Link } from "react-router-dom";

const STEPS = ["Brand", "Model", "Issue", "Details"];

const BOOKING_BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.mobilemistri.com/" },
    { "@type": "ListItem", "position": 2, "name": "Book Repair", "item": "https://www.mobilemistri.com/book" }
  ]
};

export default function Book() {
  const { content } = useContent();

  useSEO({
    title: "Book Doorstep Mobile Repair | Schedule Online in 60 Seconds | MobileMistri",
    description: "Book a certified mobile repair technician to your doorstep in Delhi, Noida, Gurgaon, Mumbai, Bangalore & 5 more cities. Choose brand, model & issue — technician arrives in 90 min.",
    canonical: "https://www.mobilemistri.com/book",
  });

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    brand: "", model: "", issue: "", custom_model: "",
    name: "", phone: "", email: "", city: "", address: "", pincode: "",
    preferred_date: "", preferred_slot: "", notes: "",
  });

  const brandObj = useMemo(() => content?.brands?.find((b) => b.slug === data.brand), [content, data.brand]);
  const detectedCity = useMemo(() => lookupCityByPin(data.pincode), [data.pincode]);

  // Auto-fill city when we detect one from the pincode
  useEffect(() => {
    if (detectedCity && data.city !== detectedCity) {
      setData((d) => ({ ...d, city: detectedCity }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedCity]);

  const canNext = [
    !!data.brand,
    !!data.model && (data.model !== "Other model (specify)" || !!data.custom_model.trim()),
    !!data.issue,
    data.name.trim() && /^[6-9]\d{9}$/.test(data.phone) && /^\d{6}$/.test(data.pincode) && data.preferred_slot,
  ][step];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...data };
      if (!payload.email) delete payload.email;
      if (payload.model === "Other model (specify)" && payload.custom_model) {
        payload.model = payload.custom_model;
      }
      delete payload.custom_model;
      const res = await submitBooking(payload);
      setDone(res);
      toast.success("Booking confirmed. Redirecting to WhatsApp...");
      setTimeout(() => {
        const text = `*Hi MobileMistri, I just booked a repair!*\n
*Booking ID:* ${res.id.slice(0, 8).toUpperCase()}
*Name:* ${payload.name}
*Phone:* ${payload.phone}
*Device:* ${payload.brand} ${payload.model}
*Issue:* ${payload.issue}
*Pincode:* ${payload.pincode}
*Slot:* ${payload.preferred_slot}`;
        window.location.href = `https://wa.me/919650061347?text=${encodeURIComponent(text)}`;
      }, 2000);
    } catch (err) {
      toast.error("Could not submit. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!content) return <div className="max-w-3xl mx-auto p-10 text-slate-500">Loading…</div>;

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="mm-card p-10 text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-semibold" style={{ color: "var(--mm-navy)" }}>Booking confirmed</h1>
          <p className="mt-3 text-slate-600">
            Booking ID <b>{done.id.slice(0, 8).toUpperCase()}</b> — our verified technician will reach pincode <b>{done.pincode}</b> in the <b>{done.preferred_slot}</b> slot. We'll call <b>{done.phone}</b> within 15 minutes to confirm exact address.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link to="/" className="mm-btn-secondary" data-testid="booking-home-link">Back home</Link>
            <a href="tel:+919650061347" className="mm-btn-primary">Call us now</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BOOKING_BREADCRUMB_SCHEMA) }} />
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <div className="label-kicker">Book a doorstep repair</div>
      <h1 className="mt-2 font-display text-3xl md:text-5xl font-semibold" style={{ color: "var(--mm-navy)" }}>
        4 quick steps. Mobile Repair Expert at your door.
      </h1>

      {/* Steps header */}
      <div className="mt-8 mb-4 flex items-center gap-2 sm:gap-3" data-testid="booking-steps">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 sm:gap-3 flex-1">
            <div
              className={`flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold border-2 transition-colors ${
                i < step
                  ? "bg-[color:var(--mm-orange)] border-[color:var(--mm-orange)] text-white"
                  : i === step
                  ? "border-[color:var(--mm-orange)] text-[color:var(--mm-orange)]"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              {i < step ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : i + 1}
            </div>
            <div className={`text-[11px] sm:text-sm font-medium whitespace-nowrap ${i === step ? "text-[color:var(--mm-navy)]" : "text-slate-500 hidden sm:block"}`}>{s}</div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="mt-10 mm-card p-6 md:p-10">
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl font-semibold" style={{ color: "var(--mm-navy)" }}>Pick your brand</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {content.brands.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => setData((d) => ({ ...d, brand: b.slug, model: "" }))}
                  data-testid={`book-brand-${b.slug}`}
                  className={`p-4 rounded-xl border-2 flex flex-col items-start gap-3 transition-all text-left ${
                    data.brand === b.slug
                      ? "border-[color:var(--mm-orange)] bg-orange-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <BrandIcon slug={b.slug} className="w-7 h-7 text-[color:var(--mm-navy)]" />
                  <div>
                    <div className="font-semibold text-[color:var(--mm-navy)]">{b.name}</div>
                    <div className="text-xs text-slate-500">{b.models.length}+ models</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold" style={{ color: "var(--mm-navy)" }}>Pick your {brandObj?.name} model</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[28rem] overflow-y-auto pr-1">
              {brandObj?.models.map((m) => (
                <button
                  key={m}
                  onClick={() => setData((d) => ({ ...d, model: m }))}
                  data-testid={`book-model-${m}`}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    data.model === m
                      ? "border-[color:var(--mm-orange)] bg-orange-50 text-[color:var(--mm-navy)]"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {data.model === "Other model (specify)" && (
              <div className="mt-4">
                <Label>Specify your model *</Label>
                <Input
                  value={data.custom_model}
                  onChange={(e) => setData({ ...data, custom_model: e.target.value })}
                  placeholder="e.g. Vivo V30 Pro"
                  data-testid="book-custom-model"
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold" style={{ color: "var(--mm-navy)" }}>What's the issue?</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {content.issues.map((i) => (
                <button
                  key={i}
                  onClick={() => setData((d) => ({ ...d, issue: i }))}
                  data-testid={`book-issue-${i}`}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    data.issue === i
                      ? "border-[color:var(--mm-orange)] bg-orange-50 text-[color:var(--mm-navy)]"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold" style={{ color: "var(--mm-navy)" }}>Your details</h2>
            <p className="text-sm text-zinc-500 mt-1">Just 4 quick details — we'll call you to confirm address.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Full name *</Label>
                <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} data-testid="book-name" placeholder="Rahul Sharma" />
              </div>
              <div>
                <Label>Mobile *</Label>
                <Input value={data.phone} maxLength={10} onChange={(e) => setData({ ...data, phone: e.target.value })} data-testid="book-phone" placeholder="9876543210" />
              </div>
              <div>
                <Label>Pincode *</Label>
                <Input value={data.pincode} maxLength={6} onChange={(e) => setData({ ...data, pincode: e.target.value.replace(/\D/g, "") })} data-testid="book-pincode" placeholder="110001" />
                {data.pincode.length === 6 && (
                  detectedCity ? (
                    <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2" data-testid="pin-success">
                      <MapPin className="w-3.5 h-3.5" /> Great — we serve <b>{detectedCity}</b>. A technician is available.
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" data-testid="pin-unserved">
                      <AlertTriangle className="w-3.5 h-3.5" /> We don't operate here yet — but we'll WhatsApp you a partner referral.
                    </div>
                  )
                )}
              </div>
              <div className="sm:col-span-2">
                <Label>Preferred slot *</Label>
                <Select value={data.preferred_slot} onValueChange={(v) => setData({ ...data, preferred_slot: v })}>
                  <SelectTrigger data-testid="book-slot"><SelectValue placeholder="Select a slot" /></SelectTrigger>
                  <SelectContent>
                    {["ASAP (within 90 min)", "10 AM – 1 PM", "1 PM – 4 PM", "4 PM – 7 PM", "7 PM – 9 PM"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm">
              <div className="font-semibold text-[color:var(--mm-navy)]">Summary</div>
              <div className="mt-1 text-slate-600">
                {brandObj?.name} · {data.model || "—"} · {data.issue || "—"}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)} data-testid="book-back-btn">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button className="mm-btn-primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)} data-testid="book-next-btn">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="mm-btn-primary" disabled={!canNext || submitting} onClick={handleSubmit} data-testid="book-submit-btn">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Confirm booking <ArrowRight className="h-4 w-4" /></>}
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12 text-center">
        <p className="text-sm text-slate-500 leading-relaxed">
          <strong>Instant Doorstep Mobile Repair Booking:</strong> Our secure booking platform instantly routes your request to a background-verified MobileMistri cell phone repair technician near you. We operate under a strict "No Fix, No Fee" policy—you will only be charged if your smartphone is successfully repaired. All mobile repairing services include OEM-grade parts and are backed by a 6 to 12-month phone repair warranty for complete peace of mind.
        </p>
      </div>
      </div>
    </>
  );
}
