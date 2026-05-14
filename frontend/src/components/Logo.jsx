import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function Logo({ className = "", dark = false }) {
  return (
    <Link to="/" data-testid="brand-logo-link" className={`flex items-center gap-2 ${className}`}>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ background: "var(--mm-orange)" }}
      >
        <Wrench className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span
        className="font-display text-xl font-semibold tracking-tight"
        style={{ color: dark ? "#fff" : "var(--mm-navy)" }}
      >
        MobileMistri
      </span>
    </Link>
  );
}
