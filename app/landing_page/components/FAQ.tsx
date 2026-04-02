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
}

const FAQList: FAQProps[] = [
  {
    question: "Wie lange dauert die Integration?",
    answer: "Dank Next.js SDK und REST-API bist du oft in unter 15 Minuten live.",
    value: "item-1",
  },
  {
    question: "Sind meine Daten sicher?",
    answer: "Ja. DSGVO-konform, verschlüsselt gehostet und mit klaren Rollenrechten abgesichert.",
    value: "item-2",
  },
  {
    question: "Kann ich White-Label anbieten?",
    answer: "Ja. Der Enterprise-Plan unterstützt White-Label-Branding und individuelle Domains.",
    value: "item-3",
  },
  {
    question: "Kann ich Shopify oder WooCommerce anbinden?",
    answer: "Ja. Du kannst Shopsysteme, eigene Apps oder Backend-Services direkt per API verbinden.",
    value: "item-4",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Fragen, die fast jedes Team zuerst stellt{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          bevor es startet
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
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
