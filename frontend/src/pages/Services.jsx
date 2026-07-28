import { useContent } from "../lib/content";
import { Link } from "react-router-dom";
import { useSEO } from "../lib/useSEO";
import EnquirySheet from "../components/EnquirySheet";
import { Wrench, BatteryCharging, Smartphone, Plug, Square, Droplets, Camera, Cpu, Stethoscope, Cpu as Microchip } from "lucide-react";

const ICONS = { Smartphone, BatteryCharging, Plug, Square, Droplets, Camera, Cpu, Stethoscope, Microchip };

export default function Services() {
  const { content } = useContent();

  // useSEO must be called before any early returns (Rules of Hooks)
  useSEO({
    title: "Mobile Repair Services | Screen, Battery, Water Damage & More | MobileMistri",
    description: "Doorstep mobile repair services: screen replacement, battery replacement, charging port, back glass, water damage recovery, speaker/mic/camera & motherboard repairs. Genuine parts, 6–12 month warranty across 10 Indian cities.",
    canonical: "https://www.mobilemistri.com/services",
  });

  if (!content) return null;

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mobile Repair Services by MobileMistri",
    "itemListElement": content.services.map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Service",
        "name": s.name,
        "description": s.desc,
        "provider": { "@type": "LocalBusiness", "name": "MobileMistri" },
        "areaServed": "IN",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": s.price_from,
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="label-kicker">Services</div>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-semibold" style={{ color: "var(--mm-navy)" }}>
          Everything we fix, on-site.
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl">Hardware, software, liquid damage — MobileMistri handles it all with a 6–12 month service warranty.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.services.map((s) => {
            const Icon = ICONS[s.icon] || Wrench;
            return (
              <div key={s.slug} className="mm-card p-8" data-testid={`svc-${s.slug}`}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,90,0,0.1)" }}>
                  <Icon className="h-6 w-6 text-[color:var(--mm-orange)]" />
                </div>
                <div className="mt-5 font-display text-xl font-semibold" style={{ color: "var(--mm-navy)" }}>{s.name}</div>
                <p className="text-sm text-slate-600 mt-2">{s.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[color:var(--mm-navy)]">
                    Transparent pricing
                  </span>
                  <EnquirySheet
                    trigger={<button className="text-sm font-semibold text-[color:var(--mm-orange)]" data-testid={`svc-quote-${s.slug}`}>Get quote →</button>}
                    defaultValues={{ issue: s.name }}
                    source={`service-${s.slug}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <Link to="/book" className="mm-btn-primary">Book a repair</Link>
        </div>

        <div className="mt-20 pt-16 border-t border-zinc-200">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h2 className="text-3xl font-display text-zinc-900 mb-6">Comprehensive Mobile Repair Services Near You</h2>
            <p className="text-zinc-600 mb-4">
              At MobileMistri, we pride ourselves on offering a full spectrum of hardware and software mobile repair services. While a shattered smartphone screen or a degraded phone battery are the most common issues our customers face, our technicians are also expertly trained in complex micro-soldering and motherboard-level cell phone repairing. Whether your mobile device has suffered severe water damage or simply has a loose charging port, our robust mobile diagnostic process ensures we pinpoint the exact fault without unnecessary part replacements.
            </p>
            <p className="text-zinc-600 mb-4">
              Quality is paramount to our mobile service model. We exclusively stock premium, OEM-grade spare parts for all major cell phone brands. Unlike unverified local phone repair shops, we never compromise on the integrity of your device. Every mobile screen replacement restores your smartphone's original touch sensitivity and color accuracy, and every cell phone battery replacement ensures maximum health capacity without overheating risks.
            </p>
            <h3 className="text-2xl font-display text-zinc-900 mt-8 mb-4">Why Professional Smartphone Diagnosis Matters</h3>
            <p className="text-zinc-600 mb-4">
              Modern smartphones are incredibly intricate devices, tightly sealed with adhesives and delicate flex cables. Attempting DIY cell phone repairs or handing your phone to an untrained mechanic often leads to permanent logic board damage, broken Face ID, or lost water resistance. Our mobile repairing specialists use professional-grade cell phone repair tools, heating mats, and safe-pry techniques to open mobile devices securely right at your doorstep. Backed by our 6 to 12-month phone repair warranty, you can trust MobileMistri for reliable, secure, and professional mobile repair services.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
