import { useParams, Link } from "react-router-dom";
import { useContent } from "../lib/content";
import { useSEO } from "../lib/useSEO";
import EnquirySheet from "../components/EnquirySheet";
import BrandIcon from "../components/BrandIcon";
import { ShieldCheck, Clock4, BadgeIndianRupee, ArrowRight, MapPin, Wrench } from "lucide-react";
import { parseSpintax } from "../lib/spintax";
import { slugify } from "../lib/slugify";
import { BRAND_SEO_DATA, CITY_SEO_DATA, CITY_ARTICLE_SPINTAX } from "../lib/seoContent";

export default function CityPage() {
  const { city, brand } = useParams();
  const { content } = useContent();
  const c = content?.cities?.find((x) => x.slug === city);
  const b = brand && content ? content.brands.find((x) => x.slug === brand) : null;
  const seed = `${city}-${brand || 'all'}`;

  const citySeoRaw = c ? (CITY_SEO_DATA[c.slug] || { areas: [], local_text: "" }) : { areas: [], local_text: "" };
  const brandSeoRaw = b ? (BRAND_SEO_DATA[b.slug] || {}) : {};
  
  const citySeo = { ...citySeoRaw, local_text: parseSpintax(citySeoRaw.local_text, seed) };
  const brandSeo = { 
    ...brandSeoRaw, 
    premium_messaging: parseSpintax(brandSeoRaw.premium_messaging, seed),
    faq_a: parseSpintax(brandSeoRaw.faq_a, seed),
    common_heading: parseSpintax(brandSeoRaw.common_heading, seed)
  };

  const articleHtml = c ? parseSpintax(CITY_ARTICLE_SPINTAX, seed)
    .replaceAll("[CITY]", c.name)
    .replaceAll("[BRAND]", b ? b.name : "mobile") : "";

  const title = c ? (b ? `${b.name} repair in ${c.name}` : `Mobile repair in ${c.name}`) : "City Not Found";
  const subtitle = c ? (b
    ? `${brandSeo.premium_messaging || `Certified ${b.name} technicians in ${c.name}.`} Doorstep repair with genuine parts and 6–12 month warranty — delivered in 60-90 minutes.`
    : `Doorstep mobile repair in ${c.name} — every major brand, every major model. Transparent pricing, verified experts, up to 12-month warranty.`) : "";

  const seoTitle = c ? (b
    ? `${b.name} Repair in ${c.name} | Doorstep Service | MobileMistri`
    : `Mobile Repair in ${c.name} | Doorstep Service | MobileMistri`) : "City Not Found";
  const canonical = c ? (b
    ? `https://www.mobilemistri.com/city/${c.slug}/${b.slug}`
    : `https://www.mobilemistri.com/city/${c.slug}`) : "";

  useSEO({ title: seoTitle, description: subtitle, canonical });

  if (!content) return null;
  if (!c) return (
    <div className="max-w-3xl mx-auto p-20 text-center">
      <h1 className="font-display text-3xl text-slate-700">City not found</h1>
      <Link to="/" className="mm-btn-secondary mt-6">Go home</Link>
    </div>
  );

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": b ? `MobileMistri - ${b.name} Repair ${c.name}` : `MobileMistri - Mobile Repair ${c.name}`,
    "image": "https://www.mobilemistri.com/logo.png",
    "url": canonical,
    "telephone": "+919650061347",
    "areaServed": {
      "@type": "City",
      "name": c.name
    },
    "priceRange": "₹₹",
    "brand": b ? b.name : "Multi-brand",
    "description": subtitle
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  };

  if (b && brandSeo.faq_q) {
    faqSchema.mainEntity.push({
      "@type": "Question",
      "name": brandSeo.faq_q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": brandSeo.faq_a
      }
    });
  }

  faqSchema.mainEntity.push({
    "@type": "Question",
    "name": b ? `Do you provide ${b.name} doorstep repair in ${c.name}?` : `Do you provide doorstep mobile repair in ${c.name}?`,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": `Yes, we provide 60-90 minute doorstep repair across ${c.name}, including areas like ${citySeo.areas.slice(0, 3).join(", ")}.`
    }
  });

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
              trigger={<button className="mm-btn-primary" data-testid="city-get-quote">{brandSeo.cta || "Get free quote"} <ArrowRight className="h-4 w-4" /></button>}
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
        <div className="mt-8 bg-[#EEF2FF] rounded-2xl p-6 text-[color:var(--mm-navy)] flex items-start gap-4">
          <MapPin className="h-6 w-6 shrink-0 text-[color:var(--mm-orange)]" />
          <p className="text-sm md:text-base">{citySeo.local_text} Our service areas include <strong>{citySeo.areas.join(", ")}</strong> and more.</p>
        </div>
      </section>

      {b && brandSeo.issues && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="label-kicker">Expertise</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>{brandSeo.common_heading || `Common ${b.name} Issues We Fix in ${c.name}`}</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {brandSeo.issues.map((issue, i) => (
              <div key={i} className="mm-card p-5 border-l-4 border-l-[#FF5A00]">
                <Wrench className="h-5 w-5 text-slate-400 mb-3" />
                <div className="font-semibold text-[color:var(--mm-navy)]">{issue}</div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            {b.models.map((m) => {
              if (m === "Other model (specify)") {
                return (
                  <EnquirySheet
                    key={m}
                    trigger={<button className="mm-chip" data-testid={`city-model-${m}`}>{m}</button>}
                    defaultValues={{ brand: b.slug, model: m, city: c.name }}
                    source={`city-${c.slug}-${b.slug}-model`}
                  />
                );
              }
              return (
                <Link key={m} to={`/${slugify(m)}/screen-replacement/${c.slug}`} className="mm-chip" data-testid={`city-model-link-${m}`}>
                  {m}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="label-kicker">FAQ</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>{b ? `${b.name} Repair FAQs in ${c.name}` : `Common Questions`}</h2>
        <div className="mt-8 space-y-4">
          {faqSchema.mainEntity.map((faq, i) => (
            <div key={i} className="mm-card p-6">
              <h3 className="font-semibold text-lg text-[color:var(--mm-navy)]">{faq.name}</h3>
              <p className="mt-2 text-slate-600">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

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

      {articleHtml && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="label-kicker">About MobileMistri in {c.name}</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold mb-6" style={{ color: "var(--mm-navy)" }}>{b ? `${b.name} ` : ''}Repair Service in {c.name}</h2>
          <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
        </section>
      )}
    </div>
  );
}
