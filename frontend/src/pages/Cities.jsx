import { useContent } from "../lib/content";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function Cities() {
  const { content } = useContent();
  if (!content) return null;
  return (
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
    </div>
  );
}
