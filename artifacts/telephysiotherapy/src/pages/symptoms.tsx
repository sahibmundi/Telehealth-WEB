import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListSymptoms } from "@workspace/api-client-react";
import { ArrowRight } from "lucide-react";

export default function Symptoms() {
  const { data: symptoms, isLoading } = useListSymptoms();

  return (
    <div className="flex flex-col w-full">
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Conditions We Treat</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our physiotherapists are experienced in treating a wide range of musculoskeletal conditions. Find your condition below to learn more.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-2xl p-8">
                    <Skeleton className="h-6 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-6" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                ))
              : (symptoms ?? []).map((symptom) => (
                  <div
                    key={symptom.id}
                    data-testid={`card-symptom-${symptom.id}`}
                    className="bg-card border border-card-border rounded-2xl p-8 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                      <span className="text-primary font-bold text-lg">{symptom.bodyPart[0]}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{symptom.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                      {symptom.description.slice(0, 120)}...
                    </p>
                    <div className="flex gap-3">
                      <Link href={`/symptoms/${symptom.id}`}>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm">
                          Book Appointment <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
