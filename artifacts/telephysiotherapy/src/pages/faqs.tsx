import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListFaqs } from "@workspace/api-client-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function Faqs() {
  const { data: faqs, isLoading } = useListFaqs();

  const categories = faqs
    ? [...new Set(faqs.map(f => f.category).filter(Boolean))] as string[]
    : [];

  return (
    <div className="flex flex-col w-full">
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about our tele-physiotherapy service.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-border rounded-xl p-5">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {categories.map((category) => (
                <div key={category} className="mb-10">
                  <Badge variant="outline" className="mb-4">{category}</Badge>
                  <Accordion type="single" collapsible className="space-y-3">
                    {faqs
                      ?.filter(f => f.category === category)
                      .map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={`faq-${faq.id}`}
                          className="border border-border rounded-xl px-6 data-[state=open]:border-primary/20 data-[state=open]:bg-primary/2"
                          data-testid={`faq-item-${faq.id}`}
                        >
                          <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              ))}
            </>
          )}

          <div className="mt-16 bg-primary/5 border border-primary/10 rounded-2xl p-10 text-center">
            <h2 className="text-xl font-bold text-foreground mb-3">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our team is happy to answer any questions before you book. Reach out to us directly.
            </p>
            <Link href="/contact">
              <Button className="h-11 px-8">
                Contact Us <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
