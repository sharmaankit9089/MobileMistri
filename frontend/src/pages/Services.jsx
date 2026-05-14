import { useContent } from "../lib/content";
import { Link } from "react-router-dom";
import EnquirySheet from "../components/EnquirySheet";
import { Wrench, BatteryCharging, Smartphone, Plug, Square, Droplets, Camera, Cpu, Stethoscope, Cpu as Microchip } from "lucide-react";

const ICONS = { Smartphone, BatteryCharging, Plug, Square, Droplets, Camera, Cpu, Stethoscope, Microchip };

export default function Services() {
  const { content } = useContent();
  if (!content) return null;
  return (
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
    </div>
  );
}
