import { Link } from "wouter";
import { ArrowRight, Activity, PhoneCall, Heart, Shield, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Activity className="w-6 h-6 text-primary" />,
    title: "PhD-Qualified Experts",
    description: "Our team is led by double gold-medallist, PhD-qualified physiotherapists from Sri Guru Granth Sahib World University."
  },
  {
    icon: <PhoneCall className="w-6 h-6 text-primary" />,
    title: "Convenient Online Access",
    description: "Connect with your physiotherapist from anywhere. No commuting, no waiting rooms — just direct, expert care."
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: "Personalised Treatment",
    description: "Every patient receives a custom rehabilitation plan designed specifically for their condition and recovery goals."
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Secure & Confidential",
    description: "All consultations take place through a fully encrypted, confidential video platform."
  }
];

const steps = [
  { step: "1", title: "Register", description: "Create your free patient account in minutes." },
  { step: "2", title: "Book", description: "Choose a date and time that suits you." },
  { step: "3", title: "Consult", description: "Meet your specialist via secure video call." },
  { step: "4", title: "Recover", description: "Follow your personalised plan and track your progress." },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Online physiotherapy consultation"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-foreground/30" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 py-20 sm:py-24">
          <div className="max-w-xl text-white">
            {/* Institution badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 mb-5">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span className="text-[11px] sm:text-xs font-medium text-white/90">Sri Guru Granth Sahib World University, Fatehgarh Sahib</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
              Expert Physiotherapy,<br />
              <span className="text-primary">From Your Home.</span>
            </h1>

            <p className="text-sm sm:text-lg text-white/80 mb-8 leading-relaxed">
              Get assessed and treated by PhD-qualified physiotherapists through secure video consultations — without leaving home.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold">
                  Book Appointment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-white/10 hover:bg-white/20 border-white/30 text-white"
                >
                  Meet Our Doctors
                </Button>
              </Link>
            </div>

            <ul className="space-y-2">
              {[
                "Double gold-medallist, PhD-qualified specialists",
                "Personalised home exercise & treatment plans",
                "Secure, confidential video sessions",
              ].map((point, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Institution Banner */}
      <section className="bg-primary/5 border-y border-primary/10 py-5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <Building2 className="w-6 h-6 text-primary shrink-0" />
            <p className="text-sm sm:text-base text-foreground font-medium">
              Department of Physiotherapy, <span className="text-primary font-semibold">Sri Guru Granth Sahib World University</span>, Fatehgarh Sahib, Punjab
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">Why Choose TelePhysio?</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Clinical excellence combined with the convenience of online care.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-card p-6 sm:p-8 rounded-2xl border border-card-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground text-base sm:text-lg">From registration to recovery — all in four simple steps.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {steps.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-lg mb-4 shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Doctors */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">Meet Your Specialists</h2>
            <p className="text-muted-foreground text-base sm:text-lg">PhD-qualified academics dedicated to your recovery.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {[
              {
                photo: "/dr-supreet.jpeg",
                name: "Dr. Supreet Bindra",
                quals: "BPT (Gold Medallist), MPT Musculoskeletal (Gold Medallist), PhD",
                role: "Associate Professor & Head of Physiotherapy",
                spec: "Musculoskeletal & Back Pain"
              },
              {
                photo: "/dr-pankaj.jpeg",
                name: "Dr. Pankajpreet Singh",
                quals: "BPT, MPT Neurological Physiotherapy, PhD",
                role: "Associate Professor & Dean, Allied Health Sciences",
                spec: "Neurological Physiotherapy"
              }
            ].map((doc, i) => (
              <div key={i} className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col sm:flex-row items-stretch">
                <div className="sm:w-36 h-48 sm:h-auto shrink-0">
                  <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">{doc.spec}</p>
                  <h3 className="text-lg font-bold text-foreground mb-1">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{doc.quals}</p>
                  <p className="text-xs text-foreground/70">{doc.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/about">
              <Button variant="outline" className="h-10 px-6">
                View Full Profiles <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-6">Ready to start your recovery?</h2>
          <p className="text-base sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Register today, book your first appointment, and start your personalised recovery journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-12 px-10 text-base font-semibold">
                Register & Book Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-12 px-10 text-base font-semibold bg-white/10 hover:bg-white/20 border-white/30 text-white">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
