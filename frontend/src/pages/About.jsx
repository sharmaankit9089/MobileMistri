import { useSEO } from "../lib/useSEO";
import EnquirySheet from "../components/EnquirySheet";
import { Link } from "react-router-dom";
import { ShieldCheck, BadgeIndianRupee, Users, Truck } from "lucide-react";

const VALUES = [
  { i: ShieldCheck, t: "Trust-first", d: "6–12 month warranty on every repair. Genuine parts only. Repairs happen in front of you." },
  { i: BadgeIndianRupee, t: "Transparent pricing", d: "Rate-card quotes shared before the technician arrives. Zero hidden charges." },
  { i: Users, t: "Verified experts", d: "Every technician is background-checked, internally certified, and trained continuously." },
  { i: Truck, t: "Dual presence", d: "Walk into a MobileMistri Support Hub — or let our doorstep fleet come to you." },
];

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MobileMistri",
  "legalName": "Ring N Relax Services Pvt. Ltd.",
  "url": "https://www.mobilemistri.com/",
  "description": "India's most trusted doorstep mobile repair brand. Verified technicians, genuine OEM-grade parts, transparent pricing and 6–12 month service warranty across 11 cities.",
  "foundingDate": "2022",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.mobilemistri.com/logo.png"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9650061347",
    "contactType": "customer support",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi"]
  },
  "areaServed": [
    "Delhi", "Noida", "Gurgaon", "Ghaziabad", "Faridabad",
    "Hyderabad", "Bangalore", "Pune", "Mumbai", "Chennai"
  ]
};

export default function About() {
  useSEO({
    title: "About MobileMistri | India's Trusted Doorstep Mobile Repair Brand",
    description: "MobileMistri (a unit of Ring N Relax Services Pvt. Ltd.) organises India's fragmented mobile repair market with verified technicians, genuine parts, transparent pricing and a 6–12 month warranty — at your door or at our Support Hubs.",
    canonical: "https://www.mobilemistri.com/about",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />
    <div>
      <section className="bg-gradient-to-br from-white via-zinc-50 to-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="label-kicker mb-2">About MobileMistri</p>
              <h1 className="font-display text-4xl md:text-6xl text-zinc-900 leading-[1.05]">
                India's most trusted <span className="text-[#002FA7]">doorstep</span> mobile repair brand.
              </h1>
              <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
                A unit of Ring N Relax Services Pvt. Ltd., MobileMistri organises India's fragmented mobile repairing market with verified technicians, genuine parts, transparent pricing and a 6–12 month service warranty — delivered at your door or at our neatly-branded Mobile Repair Support Hubs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <EnquirySheet trigger={<button className="mm-btn-primary" data-testid="about-cta">Talk to us</button>} source="about" />
                <Link to="/book" className="mm-btn-secondary">Book a repair</Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
              <img
                src="https://customer-assets.emergentagent.com/job_quick-phone-repair-4/artifacts/549c59kb_ChatGPT%20Image%20Apr%2020%2C%202026%2C%2001_22_06%20AM.png"
                alt="MobileMistri storefront — in-store repairs plus doorstep service"
                className="w-full h-auto block"
                data-testid="about-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label-kicker mb-2">What we stand for</p>
          <h2 className="font-display text-3xl sm:text-4xl text-zinc-900 mb-10">Four promises we don't break.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => (
              <div key={i} className="mm-card p-6" data-testid={`about-value-${i}`}>
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-4">
                  <v.i className="w-5 h-5 text-[#002FA7]" />
                </div>
                <div className="font-display text-lg text-zinc-900">{v.t}</div>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mm-card p-8">
              <div className="font-display text-xl text-zinc-900">Our mission</div>
              <p className="mt-2 text-zinc-600 leading-relaxed">To make post-warranty phone care as dependable as the devices themselves — fast, transparent, and convenient for every Indian.</p>
            </div>
            <div className="mm-card p-8">
              <div className="font-display text-xl text-zinc-900">Our belief</div>
              <p className="mt-2 text-zinc-600 leading-relaxed">Repair should never feel like a black box. Every customer deserves to watch their device being fixed, know the exact price upfront, and walk away with a warranty.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-zinc-50 pt-10 pb-20 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 prose prose-slate">
          <h2 className="text-3xl font-display text-zinc-900 mb-6">Redefining Mobile Repair Trust in India</h2>
          <p className="text-zinc-600 mb-4">
            For years, the Indian mobile repair market has been plagued by unorganized cell phone repair shops, counterfeit spare parts, and a severe lack of data privacy. MobileMistri was founded with a singular vision: to bring absolute transparency and enterprise-grade professionalism to the post-warranty mobile repairing industry. By operating a hybrid model of state-of-the-art physical Smartphone Repair Hubs and a massive fleet of doorstep technicians, we provide a unified, trusted phone repair experience for millions of smartphone users across the country.
          </p>
          <p className="text-zinc-600 mb-4">
            Our commitment to mobile service quality goes beyond just using genuine parts. Every MobileMistri mechanic undergoes an exhaustive multi-level background check and intensive technical training before they are certified to handle your device. Whether it is an Apple iPhone screen replacement, a Samsung Galaxy battery fix, or a OnePlus logic board repair, our experts follow strict SOPs (Standard Operating Procedures) to ensure safe teardowns and flawless reassembly. When you book a mobile repair with us, you are not just getting a quick fix—you are investing in the longevity and security of your mobile device, backed by an ironclad 6 to 12-month cell phone repair warranty.
          </p>
        </div>
      </div>
      </div>
    </>
  );
}
