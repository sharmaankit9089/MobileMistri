import { useParams, Link } from "react-router-dom";
import { useContent } from "../lib/content";
import EnquirySheet from "../components/EnquirySheet";
import BrandIcon from "../components/BrandIcon";
import { ShieldCheck, Clock4, BadgeIndianRupee, ArrowRight } from "lucide-react";

export default function CityPage() {
  const { city, brand } = useParams();
  const { content } = useContent();
  if (!content) return null;
  const c = content.cities.find((x) => x.slug === city);
  const b = brand ? content.brands.find((x) => x.slug === brand) : null;
  if (!c) return (
    <div className="max-w-3xl mx-auto p-20 text-center">
      <h1 className="font-display text-3xl text-slate-700">City not found</h1>
      <Link to="/" className="mm-btn-secondary mt-6">Go home</Link>
    </div>
  );

  const title = b ? `${b.name} repair in ${c.name}` : `Mobile repair in ${c.name}`;
  const subtitle = b
    ? `Certified ${b.name} technicians in ${c.name}. Doorstep repair with genuine parts and 6–12 month warranty — delivered in 60-90 minutes.`
    : `Doorstep mobile repair in ${c.name} — every major brand, every major model. Transparent pricing, verified experts, up to 12-month warranty.`;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-zinc-50 to-blue-50/40">
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#002FA7]/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#002FA7]/20 text-[#002FA7] text-xs font-semibold px-4 py-2 rounded-full mb-6">
            {c.region} · Doorstep service
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-zinc-900 leading-tight">
            {title.split(" in ")[0]} in <span className="text-[#002FA7]">{c.name}</span>
          </h1>
          <p className="mt-5 text-zinc-500 max-w-2xl text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <EnquirySheet
              trigger={<button className="mm-btn-primary" data-testid="city-get-quote">Get free quote <ArrowRight className="h-4 w-4" /></button>}
              defaultValues={{ city: c.name, brand: b?.slug || "" }}
              source={`city-${c.slug}${b ? "-" + b.slug : ""}`}
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
            { i: ShieldCheck, t: "6–12 month warranty" },
            { i: Clock4, t: "60–90 min on-site ETA" },
            { i: BadgeIndianRupee, t: "Transparent quotes" },
          ].map((x, i) => (
            <div key={i} className="mm-card p-6 flex items-center gap-4">
              <x.i className="h-6 w-6 text-[color:var(--mm-orange)]" />
              <div className="font-display text-lg font-semibold text-[color:var(--mm-navy)]">{x.t}</div>
            </div>
          ))}
        </div>
      </section>

      {!b && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="label-kicker">Brands we fix in {c.name}</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>
            Every brand. Every model. In {c.name}.
          </h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.brands.map((br) => (
              <Link key={br.slug} to={`/city/${c.slug}/${br.slug}`} className="mm-card p-6 flex flex-col gap-3" data-testid={`city-brand-${br.slug}`}>
                <BrandIcon slug={br.slug} className="w-8 h-8 text-[color:var(--mm-navy)]" />
                <div className="font-display text-lg font-semibold text-[color:var(--mm-navy)]">{br.name}</div>
                <div className="text-sm text-slate-500">{br.tag} in {c.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {b && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="label-kicker">Popular {b.name} repairs in {c.name}</div>
          <div className="mt-6 flex flex-wrap gap-2">
            {b.models.map((m) => (
              <EnquirySheet
                key={m}
                trigger={<button className="mm-chip" data-testid={`city-model-${m}`}>{m}</button>}
                defaultValues={{ brand: b.slug, model: m, city: c.name }}
                source={`city-${c.slug}-${b.slug}-model`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="label-kicker">Services in {c.name}</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>Doorstep services available</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.services.map((s) => (
            <div key={s.slug} className="mm-card p-6">
              <div className="font-display text-lg font-semibold text-[color:var(--mm-navy)]">{s.name}</div>
              <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
              <div className="mt-3 text-sm font-semibold text-[color:var(--mm-navy)]">
                Transparent pricing
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
