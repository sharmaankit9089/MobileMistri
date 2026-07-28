import { useContent } from "../lib/content";
import { Link } from "react-router-dom";
import { useSEO } from "../lib/useSEO";
import { MapPin } from "lucide-react";

export default function Cities() {
  const { content } = useContent();

  // useSEO must be called before any early returns (Rules of Hooks)
  useSEO({
    title: "Mobile Repair in 10 Indian Cities | Delhi, Mumbai, Bangalore & More | MobileMistri",
    description: "Doorstep mobile repair available in Delhi, Noida, Gurgaon, Ghaziabad, Faridabad, Hyderabad, Bangalore, Pune, Mumbai & Chennai. Verified technicians, 60–90 min ETA, genuine parts.",
    canonical: "https://www.mobilemistri.com/cities",
  });

  if (!content) return null;

  const citiesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "MobileMistri Service Cities",
    "description": "Doorstep mobile repair available across 10 major Indian cities",
    "itemListElement": content.cities.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "City",
        "name": c.name,
        "url": `https://www.mobilemistri.com/city/${c.slug}`
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citiesSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="label-kicker">Service cities</div>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-semibold" style={{ color: "var(--mm-navy)" }}>
          We come to you. All over India.
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl">Currently live in 10 cities. Our verified technicians reach every major pincode in each service area.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.cities.map((c) => (
            <Link key={c.slug} to={`/city/${c.slug}`} data-testid={`cities-card-${c.slug}`} className="mm-card p-6 flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,90,0,0.1)" }}>
                <MapPin className="h-5 w-5 text-[color:var(--mm-orange)]" />
              </div>
              <div>
                <div className="font-display text-xl font-semibold" style={{ color: "var(--mm-navy)" }}>{c.name}</div>
                <div className="text-sm text-slate-500">{c.region} · Mobile repair at doorstep</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-20 pt-16 border-t border-zinc-200">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h2 className="text-3xl font-display text-zinc-900 mb-6">Pan-India Doorstep Mobile Repair Network</h2>
            <p className="text-zinc-600 mb-4">
              Finding a reliable cell phone repair shop in a bustling metropolis can be a daunting task. Between navigating heavy traffic and waiting in long queues at authorized smartphone repair centers, getting your phone fixed often feels like a full-day commitment. MobileMistri solves this problem by bringing the mobile service center directly to you. Our expansive pan-India mobile repairing network ensures that whether you are in the heart of Delhi, the IT corridors of Bangalore, or the busy streets of Mumbai, a certified phone repair mechanic is never more than 90 minutes away.
            </p>
            <p className="text-zinc-600 mb-4">
              We operate seamlessly across all 10 major metropolitan areas including Noida, Gurgaon, Ghaziabad, Faridabad, Pune, Hyderabad, and Chennai. By leveraging hyper-local mobile repair technician routing, we guarantee an ultra-fast ETA. Every cell phone repair expert in our network undergoes rigorous background checks and technical training, ensuring that the person arriving at your doorstep is both trustworthy and highly skilled. Stop searching for "mobile repair shop near me" and let our on-site smartphone repair experts come to you with guaranteed original parts and upfront pricing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
