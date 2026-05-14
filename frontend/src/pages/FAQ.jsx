import { useContent } from "../lib/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export default function FAQ() {
  const { content } = useContent();
  if (!content) return null;
  return (
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
    </div>
  );
}
