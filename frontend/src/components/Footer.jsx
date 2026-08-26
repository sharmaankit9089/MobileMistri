import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useContent } from "../lib/content";
import { Mail, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/cities", label: "Cities" },
  { to: "/about", label: "About us" },
  { to: "/faq", label: "FAQ" },
  { to: "/book", label: "Book a repair" },
];

export default function Footer() {
  const { content } = useContent();
  const brands = content?.brands || [];
  const cities = content?.cities || [];
  return (
    <footer style={{ background: "var(--mm-navy)", color: "#fff" }} className="mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand block */}
          <div className="md:col-span-4">
            <Logo dark />
            <p className="mt-4 text-sm text-slate-300 max-w-xs">
              India's trusted doorstep mobile repair brand — verified experts, genuine parts, up to 12-month warranty.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-[color:var(--mm-orange)]" />
                <a href="tel:+919650061347" data-testid="footer-phone">+91 96500 61347</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[color:var(--mm-orange)]" />
                <a href="mailto:info@mobilemistri.com" data-testid="footer-email">info@mobilemistri.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--mm-orange)]" /> Pan India · 10 cities live
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[color:var(--mm-orange)]" /> 6–12 month warranty on every repair
              </li>
            </ul>
          </div>

          {/* Collapsible columns */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="footer-lists">
              <div className="flex flex-col border-b border-white/10 md:border-0 pb-6 md:pb-0">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 mb-4">
                  Cities
                </h3>
                <ul className="space-y-2 text-sm">
                  {cities.map((c) => (
                    <li key={c.slug}>
                      <Link to={`/city/${c.slug}`} data-testid={`footer-city-${c.slug}`} className="text-slate-300 hover:text-white transition-colors">
                        Mobile repair in {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col border-b border-white/10 md:border-0 pb-6 md:pb-0">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 mb-4">
                  Brands
                </h3>
                <ul className="space-y-2 text-sm">
                  {brands.filter((b) => b.slug !== "other").map((b) => (
                    <li key={b.slug}>
                      <Link to={`/brand/${b.slug}`} data-testid={`footer-brand-${b.slug}`} className="text-slate-300 hover:text-white transition-colors">
                        {b.name === "Apple iPhone" ? "Apple iPhone" : `${b.name}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col pb-6 md:pb-0">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-sm">
                  {QUICK_LINKS.map((q) => (
                    <li key={q.to}>
                      <Link to={q.to} data-testid={`footer-quick-${q.label.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-300 hover:text-white transition-colors">
                        {q.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/admin/login" className="text-slate-400 hover:text-white text-xs">Admin login</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer band */}
      <div className="border-t border-white/10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-400 leading-relaxed" data-testid="footer-disclaimer">
          © {new Date().getFullYear()} MobileMistri provides independent mobile repair services. We are not affiliated with or authorized by Apple, Samsung, Xiaomi, or any other brand. All trademarks, logos, and brand names are the property of their respective owners. · Ring N Relax Services Private Limited · All rights reserved.
        </div>
      </div>
    </footer>
  );
}
