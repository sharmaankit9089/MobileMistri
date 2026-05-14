import { useParams, Link } from "react-router-dom";
import { useContent } from "../lib/content";
import BrandIcon from "../components/BrandIcon";
import EnquirySheet from "../components/EnquirySheet";
import { ShieldCheck, BadgeIndianRupee, Clock4, MapPin, ArrowRight } from "lucide-react";

export default function BrandPage() {
  const { brand } = useParams();
  const { content } = useContent();
  const b = content?.brands?.find((x) => x.slug === brand);

  if (!content) return null;
  if (!b) return (
    <div className="max-w-3xl mx-auto p-20 text-center">
      <h1 className="font-display text-3xl text-slate-700">Brand not found</h1>
      <Link to="/" className="mm-btn-secondary mt-6">Go home</Link>
    </div>
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-zinc-50 to-blue-50/40">
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#002FA7]/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#002FA7]/20 text-[#002FA7] text-xs font-semibold px-4 py-2 rounded-full mb-6">
            Brand repair
          </div>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
              <BrandIcon slug={b.slug} className="h-7 w-7 text-[#002FA7]" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-zinc-900 leading-tight">
              {b.name} repair at your <span className="text-[#002FA7]">doorstep</span>
            </h1>
          </div>
          <p className="mt-5 text-zinc-500 max-w-2xl text-lg">
            Certified {b.name} technicians, OEM-grade parts, and up to 12-month warranty — across Delhi, Mumbai, Bangalore and 6 more cities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <EnquirySheet
              trigger={<button className="mm-btn-primary" data-testid="brand-get-quote">Get {b.name} quote <ArrowRight className="h-4 w-4" /></button>}
              defaultValues={{ brand: b.slug }}
              source={`brand-${b.slug}`}
            />
            <Link to="/book" className="mm-btn-secondary">
              Book step-by-step
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { i: ShieldCheck, t: "Genuine parts + warranty", d: "OEM-grade parts with 6–12 month cover." },
            { i: BadgeIndianRupee, t: "Transparent pricing", d: "Rate-card quote before the technician arrives." },
            { i: Clock4, t: "60–90 min ETA", d: "Doorstep fix in most PINs across service cities." },
          ].map((x, i) => (
            <div key={i} className="mm-card p-6" data-testid={`brand-trust-${i}`}>
              <x.i className="h-6 w-6 text-[color:var(--mm-orange)]" />
              <div className="mt-4 font-display text-lg font-semibold text-[color:var(--mm-navy)]">{x.t}</div>
              <p className="text-sm text-slate-600 mt-1">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="label-kicker">Models we service</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>All {b.name} models ({b.models.length})</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {b.models.map((m) => (
            <EnquirySheet
              key={m}
              trigger={<button className="mm-chip" data-testid={`brand-model-chip-${m}`}>{m}</button>}
              defaultValues={{ brand: b.slug, model: m }}
              source={`brand-${b.slug}-model`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="label-kicker">Available cities</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>{b.name} repair near you</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {content.cities.map((c) => (
            <Link key={c.slug} to={`/city/${c.slug}/${b.slug}`} className="mm-chip" data-testid={`brand-city-${c.slug}`}>
              <MapPin className="h-3.5 w-3.5 mr-2" /> {b.name} repair in {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
