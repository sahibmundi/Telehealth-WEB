import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListServices } from "@workspace/api-client-react";
import { ArrowRight, Clock, CheckCircle2, Monitor, Zap } from "lucide-react";

const typeIcon = {
  in_person: <CheckCircle2 className="w-4 h-4" />,
  online: <Monitor className="w-4 h-4" />,
  technology: <Zap className="w-4 h-4" />,
};

const typeLabel = {
  in_person: "In Person",
  online: "Online",
  technology: "Technology",
};

const typeBg = {
  in_person: "bg-primary/10 text-primary",
  online: "bg-secondary/10 text-secondary-foreground",
  technology: "bg-accent text-accent-foreground",
};

export default function Services() {
  const { data: services, isLoading } = useListServices();

  const inPersonServices = services?.filter(s => s.type === "in_person") ?? [];
  const onlineServices = services?.filter(s => s.type === "online") ?? [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Comprehensive physiotherapy care, delivered in-person or through secure online consultations.
          </p>
        </div>
      </section>

      {/* In-Person Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Badge variant="outline" className="mb-4">Clinic Services</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Physiotherapy Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Our in-clinic services offer hands-on treatment using the latest evidence-based techniques and advanced technology modalities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-2xl p-8">
                    <Skeleton className="w-12 h-12 rounded-xl mb-5" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))
              : inPersonServices.map((service) => (
                  <div key={service.id} className="bg-card border border-card-border rounded-2xl p-8 flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{service.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.description}</p>
                    {service.features && (
                      <ul className="mt-4 space-y-1">
                        {service.features.split(",").slice(0, 3).map((feature, i) => (
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

      {/* Online Sessions CTA */}
      <section className="py-24 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Digital Care</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
                Online / Tele-Physiotherapy Sessions
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our online sessions deliver the same quality of care as an in-person appointment — through a secure video platform. No travel, no waiting rooms. Just expert physiotherapy wherever you are.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Full assessment capability from your home",
                  "Personalised treatment plan in your first session",
                  "Home exercise program delivered to your dashboard",
                  "Follow-up sessions to track your progress",
                  "Access your session recordings and notes"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/services/online">
                <Button size="lg" className="h-12 px-8">
                  Learn More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-card border border-card-border rounded-3xl p-10">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="mb-6 pb-6 border-b border-card-border last:border-0 last:pb-0 last:mb-0">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))
                : onlineServices.map((service, i) => (
                    <div key={service.id} className={`${i < onlineServices.length - 1 ? "pb-6 mb-6 border-b border-card-border" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Monitor className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Not sure which service is right for you?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Book an initial consultation and our physiotherapists will assess your needs and recommend the best course of treatment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8">Book Appointment</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-12 px-8">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
