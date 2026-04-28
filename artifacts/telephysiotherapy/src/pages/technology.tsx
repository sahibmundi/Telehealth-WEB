import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListServices } from "@workspace/api-client-react";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Technology() {
  const { data: services, isLoading } = useListServices();
  const techServices = services?.filter(s => s.type === "technology") ?? [];

  return (
    <div className="flex flex-col w-full">
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge variant="outline" className="mb-4">Advanced Modalities</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Physiotherapy with Advanced Technology
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We combine the expertise of our physiotherapists with the latest evidence-based technology modalities to accelerate your recovery.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-2xl p-8">
                    <Skeleton className="w-12 h-12 rounded-xl mb-5" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))
              : techServices.map((service) => (
                  <div key={service.id} className="bg-card border border-card-border rounded-2xl p-8 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{service.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">{service.description}</p>
                    {service.features && (
                      <ul className="space-y-1.5 mt-auto">
                        {service.features.split(",").map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                            {feature.trim()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Interested in a specific modality?</h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Book an assessment and our physiotherapists will recommend the most appropriate modality for your condition.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Ask a Question <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
