import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmiBanner() {
  return (
    <Link
      to="/book"
      data-testid="emi-banner"
      className="block bg-gradient-to-r from-[#002FA7] via-[#0046D1] to-[#002FA7] text-white text-xs sm:text-sm font-semibold tracking-wide hover:brightness-110 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" aria-hidden="true" />
        <span>
          <span className="hidden sm:inline">Limited offer · </span>
          <b>No-Cost EMI</b> <span className="hidden sm:inline">available — pay in 3 / 6 / 9 easy installments.</span> <u>Book now →</u>
        </span>
      </div>
    </Link>
  );
}
