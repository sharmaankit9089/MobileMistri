import { Link } from "react-router-dom";
import { useContent } from "../lib/content";
import { useSEO } from "../lib/useSEO";
import EnquirySheet from "../components/EnquirySheet";
import BrandIcon from "../components/BrandIcon";
import InlineEnquiryForm from "../components/InlineEnquiryForm";
import { ShieldCheck, Clock4, BadgeIndianRupee, Wrench, CircleCheck, Truck, Star, ChevronRight, Smartphone, BatteryCharging, Plug, Square, Droplets, Camera, Cpu, Stethoscope, ArrowRight, Phone, Award, MapPin, HandCoins, Undo2, PackageCheck, Cpu as Microchip } from "lucide-react";

const SVC_ICONS = { Smartphone, BatteryCharging, Plug, Square, Droplets, Camera, Cpu, Stethoscope, Microchip };

const STATS = [
  { icon: Award, n: "30K+", l: "Repairs Done" },
  { icon: Clock4, n: "60–90 Min", l: "Avg Doorstep ETA" },
  { icon: ShieldCheck, n: "100%", l: "Genuine Parts" },
  { icon: MapPin, n: "10 Cities", l: "Pan India Service" },
  { icon: Star, n: "4.9 ★", l: "Average Rating" },
];

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.mobilemistri.com/#localbusiness",
  "name": "MobileMistri",
  "image": "https://www.mobilemistri.com/og-image.jpg",
  "url": "https://www.mobilemistri.com/",
  "telephone": "+919650061347",
  "priceRange": "₹₹",
  "description": "India's trusted doorstep mobile repair service. Expert technicians for iPhone, Samsung, OnePlus, Xiaomi, Google Pixel & more across 10 cities.",
  "areaServed": [
    "Delhi", "Noida", "Gurgaon", "Ghaziabad", "Faridabad",
    "Hyderabad", "Bangalore", "Pune", "Mumbai", "Chennai"
  ],
  "serviceType": "Mobile Phone Repair",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "09:00",
      "closes": "21:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "30000",
    "bestRating": "5"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Mobile Repair Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Screen Replacement" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Battery Replacement" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Charging Port Repair" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Water Damage Recovery" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Back Glass Replacement" } }
    ]
  }
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does doorstep mobile repair work?",
      "acceptedAnswer": { "@type": "Answer", "text": "Book via the form or call. Our verified technician reaches your doorstep within 60-90 minutes, diagnoses the issue in front of you, gives a transparent quote, and fixes it on-site in most cases." }
    },
    {
      "@type": "Question",
      "name": "Do you use genuine parts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We use OEM/original-grade parts with a 6-12 month service warranty. The part grade is disclosed to you before repair begins." }
    },
    {
      "@type": "Question",
      "name": "What is the warranty on repairs?",
      "acceptedAnswer": { "@type": "Answer", "text": "Every repair carries a standardised 6-month service warranty. Screen & battery replacements carry a 12-month warranty on our Premium tier." }
    },
    {
      "@type": "Question",
      "name": "Which cities do you serve?",
      "acceptedAnswer": { "@type": "Answer", "text": "Delhi, Noida, Gurgaon, Ghaziabad, Faridabad, Hyderabad, Bangalore, Pune, Mumbai, and Chennai — with more cities launching soon." }
    },
    {
      "@type": "Question",
      "name": "Is there any visit charge?",
      "acceptedAnswer": { "@type": "Answer", "text": "A small convenience fee may apply for doorstep visits — fully waived on confirmed repairs. The exact amount is shared with you upfront when you book." }
    },
    {
      "@type": "Question",
      "name": "How are technicians vetted?",
      "acceptedAnswer": { "@type": "Answer", "text": "All technicians undergo background verification, in-house certification, and continuous training. Your data never leaves your phone and repairs happen in front of you." }
    }
  ]
};

export default function Home() {
  const { content } = useContent();

  useSEO({
    title: "MobileMistri — Doorstep Mobile Repair in Delhi, Mumbai, Bangalore & 10 Cities",
    description: "Expert doorstep mobile repair for iPhone, Samsung, OnePlus, Xiaomi & more. Verified technicians reach your home in 60–90 min. Genuine parts, 6–12 month warranty, transparent pricing.",
    canonical: "https://www.mobilemistri.com/",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <div>
      {/* HERO — white bg with soft blue blobs, reference-style */}
      <section className="pt-8 min-h-[90vh] flex flex-col justify-center relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-blue-50/40" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#002FA7]/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 rounded-full bg-[#002FA7]/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#002FA7]/20 text-[#002FA7] text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                Technicians Available Now in 10 Cities
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-[1.05] mb-5 font-display">
                Your Phone.<br />Fixed At<br />
                <span className="text-[#002FA7]">Your Doorstep.</span>
              </h1>
              <p className="text-lg text-zinc-500 mb-8 leading-relaxed max-w-lg">
                Expert mobile repair at your home or office. Best Mobile Care At Home — Screen replacement, battery repair, back glass, water damage. Genuine parts. Transparent pricing. 6–12 month warranty.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/book" className="mm-btn-primary" data-testid="hero-book-btn">
                  Book Repair Now <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="tel:+919650061347" className="mm-btn-secondary" data-testid="hero-call-btn">
                  <Phone className="w-5 h-5" /> Call Now
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-600">
                <span className="flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-green-500" /> Free Visit</span>
                <span className="flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-green-500" /> No Fix, No Fee</span>
                <span className="flex items-center gap-1.5"><CircleCheck className="w-4 h-4 text-green-500" /> 6–12 Month Warranty</span>
              </div>
            </div>

            {/* Inline enquiry form card — exactly like reference */}
            <div className="fade-up mm-card p-7 md:p-8 shadow-sm">
              <h2 className="font-display text-xl text-zinc-900 mb-1">Get a Free Callback</h2>
              <p className="text-zinc-400 text-sm mb-6">Tell us your problem — we'll call you in minutes.</p>
              <InlineEnquiryForm />
              <p className="text-center text-xs text-zinc-400 mt-4">
                Or <Link to="/book" className="text-[#002FA7] font-semibold hover:underline" data-testid="full-booking-link">schedule a full booking with date &amp; time</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DARK STATS STRIP — zinc-950 like reference */}
      <div className="bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1" data-testid={`stat-${i}`}>
                <s.icon className="w-5 h-5 text-[#00A3FF]" />
                <span className="text-white font-display text-xl">{s.n}</span>
                <span className="text-zinc-400 text-xs">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST PROMISES — Pay After Repair / Pickup-Drop / 12-Month Warranty */}
      <section className="py-12 bg-white border-b border-zinc-100" data-testid="trust-promises">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { i: HandCoins,   t: "Pay After Repair",       d: "No advance. Pay only after your phone is fixed and you're satisfied." },
            { i: PackageCheck,t: "Free Pickup & Drop",     d: "Can't be on-site? We pick up, repair at our hub, and drop back — at no extra cost." },
            { i: ShieldCheck, t: "12-Month Warranty",      d: "Up to 12 months on screen and battery replacements. 6 months on every other repair." },
          ].map((x, i) => (
            <div key={i} className="flex items-start gap-4" data-testid={`trust-promise-${i}`}>
              <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                <x.i className="w-5 h-5 text-[#002FA7]" />
              </div>
              <div>
                <div className="font-display text-base text-zinc-900">{x.t}</div>
                <p className="text-zinc-500 text-xs leading-relaxed mt-1">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-14 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <p className="label-kicker mb-2">Supported Brands</p>
          <h2 className="font-display text-3xl sm:text-4xl text-zinc-900">We Repair All Major Brands</h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {content?.brands?.map((b) => (
            <Link key={b.slug} to={`/brand/${b.slug}`} data-testid={`home-brand-card-${b.slug}`}
              className="flex items-center gap-3 px-5 py-4 bg-white border border-zinc-200 rounded-xl hover:border-[#002FA7] hover:text-[#002FA7] text-zinc-700 font-semibold text-sm transition-colors">
              <BrandIcon slug={b.slug} className="w-5 h-5" />
              <span>{b.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="label-kicker mb-2">What We Fix</p>
            <h2 className="font-display text-3xl sm:text-4xl text-zinc-900 mb-3">Complete Mobile Repair Services</h2>
            <p className="text-zinc-500 text-base max-w-xl">From cracked screens to water damage — our certified technicians fix it all at your doorstep with genuine parts and warranty.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content?.services?.map((s) => {
              const Icon = SVC_ICONS[s.icon] || Wrench;
              return (
                <div key={s.slug} className="mm-card p-6 group" data-testid={`home-service-card-${s.slug}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-4 group-hover:bg-[#002FA7] transition-colors">
                    <Icon className="w-5 h-5 text-[#002FA7] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-base text-zinc-900 mb-2">{s.name}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
                  <div className="mt-4 text-xs font-semibold text-[#002FA7]">
                    Transparent pricing
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label-kicker mb-2">How It Works</p>
          <h2 className="font-display text-3xl sm:text-4xl text-zinc-900 mb-10">Four Steps. Zero Hassle.</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { t: "Tell us what's broken", d: "Fill the quote form or call — 30 seconds." },
              { t: "Get a transparent price", d: "We quote before we arrive. No surprises." },
              { t: "Expert reaches your door", d: "Background-verified technician within 90 mins." },
              { t: "Fixed on-site + warranty", d: "Repaired in front of you with 6–12 month cover." },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="font-display text-6xl text-[#002FA7]/15">0{i + 1}</div>
                <div className="mt-2 font-display text-lg text-zinc-900">{step.t}</div>
                <p className="mt-1 text-sm text-zinc-500">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY — storefront image */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
              <img
                src="https://customer-assets.emergentagent.com/job_quick-phone-repair-4/artifacts/549c59kb_ChatGPT%20Image%20Apr%2020%2C%202026%2C%2001_22_06%20AM.png"
                alt="MobileMistri store with in-store repair counter and doorstep service technicians"
                className="w-full h-auto block"
                loading="lazy"
                data-testid="brand-storefront-img"
              />
            </div>
            <div className="lg:col-span-2">
              <p className="label-kicker mb-2">See us in action</p>
              <h2 className="font-display text-3xl sm:text-4xl text-zinc-900 mb-4">
                Walk into our repair center. Or let us <span className="text-[#002FA7]">walk to you.</span>
              </h2>
              <p className="text-zinc-600 leading-relaxed mb-6">
                MobileMistri runs a hybrid network of neatly-branded <b>Mobile Repair Hubs</b> for walk-in &amp; while-you-wait repairs, plus a rapid <b>Doorstep Mobile Service</b> fleet that reaches your home or office in 60–90 minutes. Same genuine parts. Same mobile repair warranty. Your choice of convenience.
              </p>
              <ul className="space-y-3 text-sm text-zinc-700">
                <li className="flex items-start gap-3"><CircleCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /> <span><b>In-Store Repairs</b> — screen, battery, charging port, back glass, water damage fixed while you wait</span></li>
                <li className="flex items-start gap-3"><CircleCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /> <span><b>Doorstep Service</b> — uniformed, verified technicians with a portable repair kit</span></li>
                <li className="flex items-start gap-3"><CircleCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /> <span><b>Fast · Trusted · Warranty-backed</b> — repairs done in front of you with a 6–12 month guarantee</span></li>
              </ul>
              <Link to="/book" className="mm-btn-primary mt-8" data-testid="brandstory-book-btn">
                Book a repair now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="label-kicker mb-2">Service Areas</p>
            <h2 className="font-display text-3xl sm:text-4xl text-zinc-900 mb-3">Serving 10 Major Indian Cities</h2>
            <p className="text-zinc-500 text-base max-w-md mx-auto">Doorstep repair available across Delhi NCR, South India, and West India. Expanding rapidly.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {content?.cities?.map((c) => (
              <Link key={c.slug} to={`/city/${c.slug}`} className="mm-card p-4 text-center group" data-testid={`home-city-chip-${c.slug}`}>
                <MapPin className="w-5 h-5 text-[#002FA7] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-display text-sm text-zinc-900">{c.name}</p>
                <p className="text-zinc-400 text-xs mt-0.5">{c.region}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RESTORE BANNER — pre-testimonials */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100" data-testid="restore-banner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="label-kicker mb-3">Like-new again</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-zinc-900 mb-6 leading-[1.05]">
            Restore Your Mobile to <span className="text-[#002FA7]">Like-New Condition</span>
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
            MobileMistri offers professional at-home mobile repair services for smartphones, tablets, and smartwatches. Our certified technicians provide fast, reliable, and affordable phone repair right at your doorstep. Whether you need a screen replacement, battery repair, or any other service, our expert team is dedicated to restoring your device quickly and efficiently without you ever leaving the comfort of your home. Enjoy convenient, high-quality repair services designed to get you back to your digital life in no time.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="label-kicker mb-2">Customer Reviews</p>
            <h2 className="font-display text-3xl sm:text-4xl text-zinc-900 mb-3">30,000+ Happy Customers</h2>
            <p className="text-zinc-500 text-base max-w-md mx-auto">Real customers. Real phones. Real fixes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {content?.testimonials?.map((t, i) => (
              <div key={i} className="mm-card bg-zinc-50 p-6" data-testid={`home-testimonial-${i}`}>
                <div className="flex text-yellow-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <p className="font-display text-sm text-zinc-900">{t.name}</p>
                  <p className="text-zinc-400 text-xs">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO ARTICLE CONTENT */}
      <section className="py-20 bg-zinc-50 border-t border-zinc-100 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h2 className="text-3xl font-display text-zinc-900 mb-6">India's Most Trusted Doorstep Mobile Repair Service</h2>
            <p className="text-zinc-600 mb-4">
              In today's fast-paced digital world, a broken smartphone can bring your entire day to a halt. We understand the urgency of getting your device back online. <strong>MobileMistri</strong> is India's leading doorstep mobile repair service, offering same-day smartphone repair near you. Whether you are dealing with a shattered screen, a rapidly draining battery, a malfunctioning charging port, or even severe liquid damage, our certified mobile mechanics are equipped to handle it all right in front of your eyes.
            </p>
            <p className="text-zinc-600 mb-4">
              Our mobile repair network spans across 10 major Indian cities including Delhi, Noida, Gurgaon, Bangalore, Mumbai, Pune, and Hyderabad. By bringing the mobile service center to you, we eliminate the hassle of commuting through traffic and waiting for days to get your cell phone fixed. We specialize in mobile repairing for all major brands such as <strong>Apple iPhone, Samsung Galaxy, OnePlus, Xiaomi, Google Pixel, Motorola, and Realme</strong>. 
            </p>
            <h3 className="text-2xl font-display text-zinc-900 mt-8 mb-4">Why MobileMistri is the Industry Standard for Phone Repair</h3>
            <p className="text-zinc-600 mb-4">
              Security and trust are at the core of our phone repair operations. When you hand over your phone at a local repair shop, your private data is often at risk. With our on-site mobile repair model, 100% of the phone repair process happens right in front of you, ensuring complete data privacy. We exclusively use premium, OEM-grade replacement parts, allowing us to confidently back every mobile screen and battery replacement with a comprehensive 6 to 12-month service warranty. Furthermore, our "No Fix, No Fee" policy guarantees that you only pay when your cell phone is successfully restored. Experience the future of mobile repairing—book an appointment today and get your smartphone fixed in under 90 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA — full blue */}
      <section className="py-20 bg-[#002FA7]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Stop Living with a Broken Phone</h2>
          <p className="text-blue-200 text-base mb-8 max-w-xl mx-auto">Book now and a certified technician will be at your door within 90 minutes. Same-day service guaranteed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/book" className="inline-flex items-center justify-center gap-2 bg-white text-[#002FA7] hover:bg-zinc-50 font-bold px-8 py-4 rounded-full text-base transition-colors" data-testid="cta-book-link">
              Book Repair Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+919650061347" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:border-white font-semibold px-8 py-4 rounded-full text-base transition-colors">
              <Phone className="w-5 h-5" /> +91 96500 61347
            </a>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
