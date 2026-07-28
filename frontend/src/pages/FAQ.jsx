import { useContent } from "../lib/content";
import { useSEO } from "../lib/useSEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export default function FAQ() {
  const { content } = useContent();

  // useSEO must be called before any early returns (Rules of Hooks)
  useSEO({
    title: "FAQ — Doorstep Mobile Repair Questions Answered | MobileMistri",
    description: "Everything you need to know about MobileMistri's doorstep repair: pricing, warranty, parts, data safety, technician vetting, service cities, and how our no-fix-no-fee policy works.",
    canonical: "https://www.mobilemistri.com/faq",
  });

  if (!content) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="label-kicker">Frequently asked</div>
        <h1 className="mt-2 font-display text-4xl md:text-6xl font-semibold" style={{ color: "var(--mm-navy)" }}>
          Questions, answered.
        </h1>
        <Accordion type="single" collapsible className="mt-10">
          {content.faq.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-item-${i}`}>
              <AccordionTrigger className="text-left font-medium text-[color:var(--mm-navy)]">{f.q}</AccordionTrigger>
              <AccordionContent className="text-slate-600">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-20 pt-16 border-t border-zinc-200">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-display text-zinc-900 mb-4">Your Questions About Doorstep Mobile Repair, Answered</h2>
            <p className="text-zinc-600 mb-4">
              We know that handing over your expensive smartphone for repair can bring up a lot of questions. From concerns about data privacy to worries about fake spare parts, the traditional cell phone repair industry leaves much to be desired. That is why MobileMistri has completely overhauled the mobile repairing process. Our comprehensive smartphone repair FAQ section covers everything from our upfront pricing model to our stringent mobile part sourcing standards.
            </p>
            <p className="text-zinc-600 mb-4">
              If you have a cracked iPhone screen, a rapidly draining Samsung battery, or a dead OnePlus motherboard, you can rest assured that our background-verified mobile mechanics have the right phone repair tools and OEM-grade parts to fix it. We stand confidently behind every cell phone repair with a rock-solid 6 to 12-month warranty. Didn't find the mobile repair answer you were looking for? Feel free to call our customer support helpline or book a free phone diagnostic visit today.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
