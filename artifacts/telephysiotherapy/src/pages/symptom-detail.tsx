import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListSymptoms } from "@workspace/api-client-react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SymptomDetail() {
  const params = useParams<{ id: string }>();
  const symptomId = parseInt(params.id ?? "0", 10);
  const { data: symptoms, isLoading } = useListSymptoms();

  const symptom = symptoms?.find(s => s.id === symptomId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (!symptom) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Condition not found</h1>
        <Link href="/symptoms">
          <Button variant="outline">Back to Conditions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/symptoms" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 block text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Conditions
          </Link>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <span className="text-3xl font-bold text-primary">{symptom.bodyPart[0]}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">{symptom.name}</h1>
          <p className="text-primary font-medium">Affecting: {symptom.bodyPart}</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg max-w-none text-foreground mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">{symptom.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-12">
            <div className="bg-card border border-card-border rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Common Causes</h2>
              <ul className="space-y-2">
                {symptom.commonCauses.split(",").map((cause, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {cause.trim()}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Treatment Approaches</h2>
              <ul className="space-y-2">
                {symptom.treatments.split(",").map((treatment, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {treatment.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-primary rounded-2xl p-8 text-primary-foreground text-center">
            <h2 className="text-2xl font-bold mb-3">Struggling with {symptom.name.toLowerCase()}?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Our physiotherapists can assess your condition and provide an evidence-based treatment plan, all from the comfort of your home.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register">
                <Button variant="secondary" size="lg" className="h-12">
                  Book Appointment <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services/online">
                <Button variant="outline" size="lg" className="h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white">
                  Learn About Online Sessions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
