import { useParams, Link } from "react-router-dom";
import { useContent } from "../lib/content";
import { useSEO } from "../lib/useSEO";
import BrandIcon from "../components/BrandIcon";
import EnquirySheet from "../components/EnquirySheet";
import Breadcrumbs from "../components/Breadcrumbs";
import { ShieldCheck, BadgeIndianRupee, Clock4, MapPin, ArrowRight, Wrench } from "lucide-react";
import { parseSpintax } from "../lib/spintax";
import { slugify } from "../lib/slugify";
import { BRAND_SEO_DATA, BRAND_ARTICLE_SPINTAX } from "../lib/seoContent";

export default function BrandPage() {
  const { brand } = useParams();
  const { content } = useContent();
  const b = content?.brands?.find((x) => x.slug === brand);
  
  const brandSeoRaw = b ? (BRAND_SEO_DATA[b.slug] || {}) : {};
  const seed = `${brand}-only`;
  
  const brandSeo = { 
    ...brandSeoRaw, 
    premium_messaging: parseSpintax(brandSeoRaw.premium_messaging, seed),
    faq_a: parseSpintax(brandSeoRaw.faq_a, seed),
    common_heading: parseSpintax(brandSeoRaw.common_heading, seed)
  };
  
  const articleHtml = b ? parseSpintax(BRAND_ARTICLE_SPINTAX, seed).replaceAll("[BRAND]", b.name) : "";

  useSEO({
    title: b ? `${b.name} Repair at Doorstep | Genuine Parts | MobileMistri` : "Brand Not Found",
    description: b ? `Certified ${b.name} technicians across Delhi, Mumbai, Bangalore & 7 more cities. OEM-grade parts, 6–12 month warranty, 60–90 min doorstep ETA. Book now.` : "",
    canonical: b ? `https://www.mobilemistri.com/brand/${b.slug}` : "",
  });

  if (!content) return null;
  if (!b) return (
    <div className="max-w-3xl mx-auto p-20 text-center">
      <h1 className="font-display text-3xl text-slate-700">Brand not found</h1>
      <Link to="/" className="mm-btn-secondary mt-6">Go home</Link>
    </div>
  );

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": `${b.name} Mobile Repair`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "MobileMistri",
      "image": "https://www.mobilemistri.com/logo.png"
    },
    "areaServed": content.cities.map(c => ({
      "@type": "City",
      "name": c.name
    })),
    "brand": {
      "@type": "Brand",
      "name": b.name
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  };

  if (brandSeo.faq_q) {
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
    "name": `Do you use genuine parts for ${b.name} repair?`,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": `Yes, we use OEM-grade genuine parts for all ${b.name} repairs. Every repair comes with a 6-12 month service warranty.`
    }
  });

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: b.name, path: canonical, current: true }
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={breadcrumbs} />

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
            {brandSeo.premium_messaging || `Certified ${b.name} technicians, OEM-grade parts, and up to 12-month warranty — across Delhi, Mumbai, Bangalore and 6 more cities.`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <EnquirySheet
              trigger={<button className="mm-btn-primary" data-testid="brand-get-quote">{brandSeo.cta || `Get ${b.name} quote`} <ArrowRight className="h-4 w-4" /></button>}
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

      {brandSeo.issues && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="label-kicker">Expertise</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>{brandSeo.common_heading || `Common ${b.name} Issues We Fix`}</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {brandSeo.issues.map((issue, i) => (
              <div key={i} className="mm-card p-5 border-l-4 border-l-[#002FA7]">
                <Wrench className="h-5 w-5 text-slate-400 mb-3" />
                <div className="font-semibold text-[color:var(--mm-navy)]">{issue}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="label-kicker">Models we service</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>All {b.name} models ({b.models.length})</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {b.models.map((m) => {
            if (m === "Other model (specify)") {
              return (
                <EnquirySheet
                  key={m}
                  trigger={<button className="mm-chip" data-testid={`brand-model-chip-${m}`}>{m}</button>}
                  defaultValues={{ brand: b.slug, model: m }}
                  source={`brand-${b.slug}-model`}
                />
              );
            }
            return (
              <Link key={m} to={`/${slugify(m)}/screen-replacement`} className="mm-chip" data-testid={`brand-model-link-${m}`}>
                {m}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 cv-auto">
        <div className="label-kicker">FAQ</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold" style={{ color: "var(--mm-navy)" }}>{b.name} Repair FAQs</h2>
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 cv-auto">
        <div className="label-kicker">About {b.name} Repair</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold mb-6" style={{ color: "var(--mm-navy)" }}>{b.name} Service Information</h2>
        <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
      </section>
    </div>
  );
}
