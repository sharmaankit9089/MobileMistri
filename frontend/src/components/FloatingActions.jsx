import { Phone, MessageCircle } from "lucide-react";

const PHONE = "+919650061347";
const WA_NUMBER = "919650061347";
const WA_TEXT = encodeURIComponent("Hi MobileMistri! I need help with my phone repair.");

export default function FloatingActions() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur-md shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.12)]"
      data-testid="floating-actions"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2">
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          data-testid="floating-whatsapp-btn"
          className="flex items-center justify-center gap-2 py-4 sm:py-3 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold text-sm transition-colors"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={2.4} />
          <span>WhatsApp Us</span>
        </a>
        <a
          href={`tel:${PHONE}`}
          aria-label="Call MobileMistri"
          data-testid="floating-call-btn"
          className="flex items-center justify-center gap-2 py-4 sm:py-3 bg-[#002FA7] hover:bg-[#00227A] text-white font-semibold text-sm transition-colors"
        >
          <Phone className="w-5 h-5" strokeWidth={2.4} />
          <span className="hidden sm:inline">Call </span>
          <span>+91 96500 61347</span>
        </a>
      </div>
    </div>
  );
}
