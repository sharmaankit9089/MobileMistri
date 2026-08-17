import { useParams, Link } from "react-router-dom";
import { useContent } from "../lib/content";
import { useSEO } from "../lib/useSEO";
import Breadcrumbs from "../components/Breadcrumbs";
import EnquirySheet from "../components/EnquirySheet";
import { 
  ShieldCheck, Clock4, BadgeIndianRupee, MapPin, Wrench, Smartphone, 
  BatteryCharging, Plug, ChevronRight, CheckCircle2, AlertTriangle, 
  Cpu, Camera, Zap, Wifi, HardDrive, Check
} from "lucide-react";
import { slugify } from "../lib/slugify";
import { parseSpintax } from "../lib/spintax";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export default function ModelPage() {
  const { city, model: modelSlug, repairSlug } = useParams();
  const { content } = useContent();

  let foundModelName = "";
  let foundBrand = null;
  if (content && content.brands) {
    for (const b of content.brands) {
      const match = b.models.find(m => slugify(m) === modelSlug);
      if (match) {
        foundModelName = match;
        foundBrand = b;
        break;
      }
    }
  }

  const foundService = content?.services?.find(s => s.slug === repairSlug);
  const c = city && content?.cities ? content.cities.find((x) => x.slug === city) : null;
  const isGeneric = !foundService;
  const repairName = foundService ? foundService.name : "Repair";
  const repairNameLower = foundService ? foundService.name.toLowerCase() : "repair";

  const pageTitle = c 
    ? `${foundModelName} ${repairName} in ${c.name} | Doorstep Service | MobileMistri`
    : `${foundModelName} ${repairName} at Doorstep | MobileMistri`;
    
  const pageDesc = c
    ? `Book expert ${foundModelName} ${repairNameLower} in ${c.name}. ${foundService ? foundService.desc : "Genuine parts & warranty at your doorstep in 90 mins."}`
    : `Expert ${foundModelName} ${repairNameLower} at your doorstep. Get 6-12 months warranty on ${foundBrand?.name || ''} parts.`;
    
  const canonical = c 
    ? `https://www.mobilemistri.com/${modelSlug}/${repairSlug || 'repair'}/${c.slug}`
    : `https://www.mobilemistri.com/${modelSlug}/${repairSlug || 'repair'}`;

  useSEO({
    title: foundModelName ? pageTitle : "Model Not Found",
    description: pageDesc,
    canonical
  });

  if (!foundModelName) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-display text-zinc-900">Model Not Found</h1>
        <p className="mt-4 text-zinc-600">The requested device could not be found in our database.</p>
        <Link to="/" className="mt-8 mm-btn-primary inline-flex">Return Home</Link>
      </div>
    );
  }

  const seed = `${city || 'all'}-${modelSlug}-${repairSlug || 'repair'}`;

  const specs = [
    { title: "Processor & Thermal Limits", icon: Cpu, desc: parseSpintax("{Modern|Advanced} multi-core processors often suffer from {thermal throttling|heat issues} and {architectural degradation|performance drops} over years of {intensive|heavy} usage (gaming, AI tasks). This {significantly|greatly} impacts FPS and UI responsiveness when battery voltage drops.", seed) },
    { title: "Display Matrix & Digitizer", icon: Smartphone, desc: parseSpintax("The OLED/LCD matrix dictates {visual fidelity|screen quality}. Prolonged physical stress can cause {digitizer failure|touch issues}, {dead pixels|screen bleeding}, oleophobic coating wear, or display flex cable detachment, necessitating a {certified|professional} panel replacement.", seed) },
    { title: "Optical Image Stabilization", icon: Camera, desc: parseSpintax("OIS mechanisms and CMOS sensors degrade due to {micro-vibrations|physical impacts} and dust ingress. A compromised lens array results in {focus hunting|blurry photos}, chromatic aberration, and {severe|noticeable} artifacting during low-light photography.", seed) },
    { title: "Biometric & Depth Sensors", icon: Camera, desc: parseSpintax("The front-facing optics array is {essential|critical} for biometric authentication. {Micro-fractures|Small cracks} or moisture near the proximity sensors can {permanently disable|disrupt} face-scanning algorithms and degrade {computational photography|selfie quality}.", seed) },
    { title: "NAND Flash Memory", icon: HardDrive, desc: parseSpintax("Internal storage has a {finite|limited} number of write cycles. Approaching storage limits causes {severe|extreme} memory paging, directly resulting in system thermal spikes, {application crashes|app freezing}, and {catastrophic OS boot loops|system failure}.", seed) },
    { title: "Lithium-Ion Degradation", icon: BatteryCharging, desc: parseSpintax("Batteries experience {irreversible|permanent} chemical aging. After 500+ charge cycles, internal resistance increases, leading to {erratic voltage drops|fast draining}, {thermal swelling|heating}, and unpredictable system shutdowns even at {20%|30%} capacity.", seed) },
    { title: "RF Antennas & Baseband", icon: Wifi, desc: parseSpintax("RF modems are highly sensitive to {physical shocks|drops}. Micro-fractures on the logic board's network IC or antenna decoupling can result in {permanent|frequent} 'No Service' errors or weak {5G|cellular} reception.", seed) },
    { title: "Kernel-Level Software", icon: Zap, desc: parseSpintax("Kernel updates require {optimal|perfect} hardware communication. A failing internal component can trigger {kernel panics|system crashes}, resulting in {permanent boot loops|software failure} or infinite logo screens during firmware upgrades.", seed) },
  ];

  const faqs = [
    { q: `How long does the ${foundModelName} ${repairNameLower} take ${c ? `in ${c.name}` : ''}?`, a: parseSpintax(`Most {interventions|repairs}, including ${repairNameLower} operations, are {completed|finished} within a 30 to 60-minute window at your location. Complex motherboard micro-soldering may require {lab pickup|store visit}.`, seed) },
    { q: `Is there a warranty on the ${foundBrand.name} ${foundModelName} ${repairNameLower}?`, a: parseSpintax("{Absolutely|Yes}. We stand by our {technical expertise|repair quality} with a comprehensive 6 to 12-month service warranty, covering both the {OEM-grade|genuine} replacement part and the labor.", seed) },
    { q: `Do you provide doorstep service everywhere ${c ? `in ${c.name}` : 'in the city'}?`, a: parseSpintax(`{Yes|Certainly}, our mobile repair units cover all major pin codes ${c ? `across ${c.name}` : 'in the city'}. We bring the {tools|equipment}, ESD mats, and parts directly to your {home, office, or local cafe|doorstep}.`, seed) },
    { q: `Will I lose my data during the ${repairNameLower}?`, a: parseSpintax(`{Zero data loss guaranteed|Your data is completely safe}. Because our technicians perform the ${repairNameLower} directly in your presence, your data remains {fully encrypted and untouched|100% secure}.`, seed) },
  ];

  const locString = c ? `in ${c.name}` : "at your doorstep";

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: foundBrand.name, path: `/brand/${foundBrand.slug}` },
    { label: foundModelName, path: `/${modelSlug}/repair` },
    ...(c ? [{ label: c.name, path: `/city/${c.slug}` }] : []),
    { label: repairName, path: canonical, current: true }
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${foundModelName} ${repairName}`,
    "description": pageDesc,
    "provider": { "@type": "LocalBusiness", "name": "MobileMistri", "url": "https://www.mobilemistri.com/" },
    "areaServed": c ? c.name : "India",
    "brand": { "@type": "Brand", "name": foundBrand.name },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": foundService?.price_from || 799,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <div className="bg-white">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* HERO */}
      <section className="bg-gradient-to-br from-white via-zinc-50 to-blue-50/40 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#002FA7]/20 text-[#002FA7] text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              {c ? `${c.region} · ${c.name}` : "Available PAN India"}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-zinc-900 mb-6 leading-tight">
              {foundModelName} <span className="text-[#002FA7]">{repairName}</span> <br/> 
              {locString}.
            </h1>
            <p className="text-lg text-zinc-600 mb-8 max-w-2xl">
              Expert doorstep {foundModelName} {repairNameLower} across {c ? c.name : 'your city'}. Genuine {foundBrand.name} parts, up to 365 days warranty, technician arrives within 90 minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Starting from</p>
                <p className="text-3xl font-display font-bold text-zinc-900">₹{foundService?.price_from || 799}</p>
              </div>
              <EnquirySheet 
                trigger={<button className="mm-btn-primary px-8 h-12 text-lg">Book {c ? `in ${c.name}` : 'Repair'}</button>}
                defaultValues={{ brand: foundBrand.slug, model: foundModelName, city: c?.slug, issue: foundService?.name || "" }}
                source={`model-hero-${modelSlug}`}
              />
            </div>
          </div>
          <div className="hidden lg:flex flex-1 justify-center relative">
            <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-3xl -z-10 w-3/4 h-3/4 m-auto"></div>
            <img src="/assets/hero-repair.webp" alt={`${foundModelName} repair`} className="max-w-md w-full object-contain drop-shadow-2xl" onError={(e) => e.target.style.display='none'} />
          </div>
        </div>
      </section>

      {/* DETAILED SPECS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-zinc-900 mb-4">Detailed Specifications That Explain Real Usage</h2>
            <p className="text-zinc-600">
              Instead of showing only short specs, this section explains how each feature affects daily performance, battery life, camera quality, connectivity, software experience, and long-term reliability for your {foundModelName} {locString}.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {specs.map((s, i) => (
              <div key={i}>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-900 mb-2">{s.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM DOORSTEP CONTENT */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-zinc-900 mb-6">Premium Doorstep {repairName} for {foundModelName} {locString}</h2>
          <div className="prose prose-slate max-w-none text-zinc-600 space-y-6">
            <p>
              {parseSpintax(`{Looking for|Searching for} an {authorized-level|expert} ${repairNameLower} for your ${foundBrand.name} ${foundModelName} ${locString}? MobileMistri {bridges the gap between|offers} premium service and {ultimate|complete} convenience. Our {ESD-compliant|certified} technicians bring an entire {micro-repair lab|repair toolkit} directly to your location, {eliminating the archaic process of|saving you from} surrendering your primary device for days.`, seed)}
            </p>
            <p>
              {parseSpintax(`Your ${foundBrand.name} flagship demands {precision engineering|expert care}. We {deploy strict ESD protocols|follow strict guidelines} and utilize {specialized heating plates|advanced tools} and precision drivers to access your device. The entire ${repairNameLower} is executed {transparently|openly} right before your eyes in 30-45 minutes, ensuring {zero risk of data harvesting|your data is completely secure} or component swapping.`, seed)}
            </p>
            <p>
              {parseSpintax(`Experience {industry-leading|top-tier} ${foundModelName} diagnostics and repair starting at just ₹${foundService?.price_from || 799}. Every hardware intervention is {validated|checked} through post-repair diagnostic software and is {reinforced by|backed by} an {ironclad|reliable} 6-12 month replacement warranty. We don't just fix phones; we {restore them to factory-grade tolerances|make them like new}.`, seed)}
            </p>
            <p>
              {parseSpintax(`Modern mobile architectures utilize {IP68-rated adhesive gaskets|strong water-resistant seals} and microscopic flex cables. {Uncertified repairs|Local shops} often destroy these seals or short out motherboards. Our engineers specialize in ${foundBrand.name}'s {proprietary internal schematics|internal designs}, {guaranteeing that|ensuring} your ${foundModelName} is restored with {surgical precision|expert care}.`, seed)}
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE FIX (STEPS) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-zinc-900 mb-12">How we fix your {foundModelName} {locString}.</h2>
              <div className="space-y-8">
                {[
                  parseSpintax(`{Initiate|Book} your ${foundModelName} ${repairNameLower} online in under 30 seconds.`, seed),
                  parseSpintax(`Our ${c ? c.name : 'regional'} dispatch team {verifies your hardware issue|confirms your booking} within 10 minutes.`, seed),
                  parseSpintax(`A certified MobileMistri technician {arrives at your location|reaches your doorstep} within 90 minutes.`, seed),
                  parseSpintax(`Precision ${repairNameLower} is conducted {transparently|right in front of you} in 30–60 minutes.`, seed),
                  parseSpintax(`Digital warranty {activated|issued} & payment {processed|collected} only after complete validation.`, seed)
                ].map((step, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-[#002FA7] font-display font-semibold flex items-center justify-center rounded-full mr-4 border border-blue-100">
                      0{i + 1}
                    </div>
                    <div className="pt-1.5 text-lg font-medium text-zinc-700">{step}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-8 lg:p-12 border border-zinc-200">
              <h3 className="font-display text-2xl text-zinc-900 mb-6">Signs you need a {repairName} for {foundModelName}</h3>
              <p className="text-zinc-600 mb-8">{parseSpintax(`Not sure if your device actually needs a repair? Look out for these {common warning signs|symptoms} that indicate your ${foundBrand.name} ${foundModelName} requires {professional attention|expert care} ${locString}. Ignoring these can lead to secondary motherboard damage.`, seed)}</p>
              <ul className="space-y-4">
                {[
                  parseSpintax("{Visible physical trauma|Clear physical damage}, structural bending, or glass fragmentation near critical hardware.", seed),
                  parseSpintax("{Severe thermal throttling|Heavy overheating}, UI stuttering, or {spontaneous kernel panics|sudden restarts}.", seed),
                  parseSpintax("Hardware functionality is {erratic|unstable}; sensors or ports fail {intermittently|randomly} due to microscopic logic board fractures.", seed),
                  parseSpintax("Firmware flashes, factory resets, and safe-mode diagnostics fail to resolve the {underlying hardware defect|hardware issue}.", seed)
                ].map((s, i) => (
                  <li key={i} className="flex items-start text-zinc-600 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US GRID */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl">Why Choose Us?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BadgeIndianRupee className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pay After Repair</h3>
              <p className="text-slate-400 text-sm">No advance payment required. Pay only after your {foundModelName} {repairNameLower} is completed successfully.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock4 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">90 Min Service {c ? `in ${c.name}` : ''}</h3>
              <p className="text-slate-400 text-sm">We dispatch a technician immediately to your location for rapid repairs.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Warranty Backed</h3>
              <p className="text-slate-400 text-sm">Hassle-free device repair with robust 6 to 12-month service warranty support.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Genuine Parts</h3>
              <p className="text-slate-400 text-sm">We source high-grade, precision-tested components to ensure your {foundModelName} functions like new.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white cv-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-zinc-900">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-medium text-zinc-800 hover:text-[#002FA7] text-lg">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-zinc-600 text-base leading-relaxed pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* OTHER REPAIRS FOR THIS MODEL */}
      {content?.services && (
        <section className="py-20 bg-slate-50 border-t border-slate-200 cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl text-zinc-900 mb-8">Other {foundModelName} repairs {locString}.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.services.filter(s => s.slug !== repairSlug).slice(0, 6).map((s, i) => (
                <Link key={i} to={`/${modelSlug}/${s.slug}${c ? '/' + c.slug : ''}`} className="bg-white border border-slate-200 p-6 rounded-xl hover:border-[#002FA7]/30 transition-colors flex items-center justify-between group">
                  <div>
                    <div className="font-semibold text-zinc-900 mb-1">{foundModelName} {s.name} {c ? `in ${c.name}` : ''}</div>
                    <div className="text-sm text-slate-500">Starting ₹{s.price_from || 799}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#002FA7] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* SERVICEABLE LOCATIONS */}
      {content?.cities && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="label-kicker">Serviceable Locations</div>
            <h2 className="font-display text-2xl text-zinc-900 mt-2 mb-8">Book {c ? 'in another city' : 'in your city'}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {content.cities.map(cityObj => (
                <Link key={cityObj.slug} to={`/${modelSlug}/${repairSlug || 'screen-replacement'}/${cityObj.slug}`} className="mm-chip">
                  Repair in {cityObj.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
    </>
  );
}
