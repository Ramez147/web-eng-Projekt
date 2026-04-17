import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
  category: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Wie lange dauert die Integration?",
    answer: "Dank Next.js SDK und REST-API bist du oft in unter 15 Minuten live.",
    value: "item-1",
    category: "Onboarding",
  },
  {
    question: "Sind meine Daten sicher?",
    answer: "Ja. DSGVO-konform, verschlüsselt gehostet und mit klaren Rollenrechten abgesichert.",
    value: "item-2",
    category: "Security",
  },
  {
    question: "Kann ich White-Label anbieten?",
    answer: "Ja. Der Enterprise-Plan unterstützt White-Label-Branding und individuelle Domains.",
    value: "item-3",
    category: "Branding",
  },
  {
    question: "Kann ich Shopify oder WooCommerce anbinden?",
    answer: "Ja. Du kannst Shopsysteme, eigene Apps oder Backend-Services direkt per API verbinden.",
    value: "item-4",
    category: "Integrations",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <div className="faq-shell">
        <div className="faq-header-panel">
          <p className="faq-kicker">Frequently asked</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Fragen, die fast jedes Team zuerst stellt{" "}
            <span className="bg-linear-to-b from-primary/60 to-primary bg-clip-text text-transparent">
              bevor es startet
            </span>
          </h2>
          <p className="faq-subtitle">
            Alles auf einen Blick: Integration, Sicherheit, Branding und Anbindungen.
          </p>

          <div className="faq-meta-grid">
            <div className="faq-meta-card">
              <span className="faq-meta-number">15 Min</span>
              <span className="faq-meta-label">bis zum Setup</span>
            </div>
            <div className="faq-meta-card">
              <span className="faq-meta-number">API-first</span>
              <span className="faq-meta-label">für jede Plattform</span>
            </div>
          </div>
        </div>

        <Accordion
          type="single"
          collapsible
          className="faq-accordion"
        >
          {FAQList.map(({ question, answer, value, category }: FAQProps) => (
            <AccordionItem
              key={value}
              value={value}
              className="faq-accordion-item"
            >
              <AccordionTrigger className="faq-accordion-trigger text-left no-underline hover:no-underline">
                <span className="faq-question-wrap">
                  <span className="faq-question">{question}</span>
                  <span className="faq-tag">{category}</span>
                </span>
              </AccordionTrigger>

              <AccordionContent className="faq-accordion-content">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <h3 className="font-medium mt-7 text-center md:text-left">
        Noch Fragen?{" "}
        <a
          rel="noreferrer noopener"
          href="#cta"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Demo vereinbaren
        </a>
      </h3>
    </section>
  );
};
