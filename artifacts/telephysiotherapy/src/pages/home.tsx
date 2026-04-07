import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Star, Activity, PhoneCall, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Activity className="w-6 h-6 text-primary" />,
    title: "Expert Practitioners",
    description: "Certified specialists with years of clinical experience across a wide range of physiotherapy modalities."
  },
  {
    icon: <PhoneCall className="w-6 h-6 text-primary" />,
    title: "Convenient Access",
    description: "Connect with your physiotherapist from anywhere. No commuting, no waiting rooms, just direct care."
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: "Personalised Plans",
    description: "Every body is different. Get a custom recovery plan designed specifically for your condition and goals."
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Secure & Confidential",
    description: "All consultations are conducted through a fully encrypted, GDPR-compliant video platform."
  }
];

const steps = [
  { step: "1", title: "Register", description: "Create your patient account in minutes." },
  { step: "2", title: "Consult", description: "Meet your physiotherapist via secure video." },
  { step: "3", title: "Recover", description: "Follow your personalised plan and track progress." },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-muted">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Expert Physiotherapy at Home"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 py-16 sm:py-20">
          <div className="max-w-xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 mb-5 backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs sm:text-sm font-medium tracking-wide">Trusted Online Clinic</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
              Expert Physiotherapy,<br />
              <span className="text-primary">From Your Home.</span>
            </h1>

            <p className="text-sm sm:text-lg text-white/80 mb-8 leading-relaxed">
              Experience world-class rehabilitation and pain management without the waiting room. Our certified physiotherapists provide tailored care through secure video consultations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8">
                  Book Appointment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services/online">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  Learn About Online Care
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-foreground bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=115e59`} alt="Patient" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-xs sm:text-sm font-medium text-white/90">Trusted by 2,000+ patients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">Why Choose TelePhysio?</h2>
            <p className="text-muted-foreground text-base sm:text-lg">We combine clinical excellence with digital convenience to deliver better outcomes, faster.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-card p-6 sm:p-8 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">How It Works</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Getting started with TelePhysio takes just minutes.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {steps.map((item, i) => (
              <div key={i} className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-4 text-left sm:text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "2,000+", label: "Patients Treated" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "15+", label: "Years Experience" },
              { number: "50+", label: "Conditions Treated" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.number}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-6">Ready to start your recovery?</h2>
          <p className="text-base sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10">
            Book your initial consultation today and take the first step towards a pain-free life.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-sm sm:text-base h-12 sm:h-14 px-8 sm:px-10">
              Get Started Now
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
