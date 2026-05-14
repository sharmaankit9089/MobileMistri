import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import EnquirySheet from "./EnquirySheet";
import { Menu, X, PhoneCall } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/cities", label: "Cities" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200"
      style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(14px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-[color:var(--mm-navy)]" : "text-slate-600 hover:text-[color:var(--mm-navy)]"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:+919650061347"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[color:var(--mm-navy)] px-3"
            data-testid="header-call-btn"
          >
            <PhoneCall className="h-4 w-4" /> +91 96500 61347
          </a>
          <Link
            to="/book"
            data-testid="header-book-link"
            className="hidden sm:inline-flex mm-btn-secondary text-sm"
          >
            Book repair
          </Link>
          <EnquirySheet
            trigger={
              <button className="mm-btn-primary !px-4 !py-2 sm:!px-6 sm:!py-3 text-[13px]" data-testid="header-get-quote-btn">
                Get quote
              </button>
            }
          />
          <button
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-200"
            onClick={() => setOpen((o) => !o)}
            data-testid="header-mobile-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white" data-testid="mobile-menu">
          <div className="px-4 py-3 flex flex-col gap-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-slate-700"
                data-testid={`nav-mobile-${n.label.toLowerCase()}`}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-2 mm-btn-secondary text-sm text-center justify-center"
            >
              Book repair
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
