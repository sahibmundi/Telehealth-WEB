import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, Users, Heart, Stethoscope, ArrowRight } from "lucide-react";

const values = [
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: "Patient-Centred Care",
    description: "Every decision we make starts with the question: what is best for this patient? Your wellbeing is our north star."
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Clinical Excellence",
    description: "Our physiotherapists are highly qualified practitioners who keep their skills current through ongoing professional development."
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Accessibility for All",
    description: "We believe everyone deserves access to expert physiotherapy, regardless of location, mobility, or schedule constraints."
  },
  {
    icon: <Stethoscope className="w-6 h-6 text-primary" />,
    title: "Evidence-Based Practice",
    description: "Our treatment approaches are grounded in the latest clinical research and proven outcomes data."
  }
];

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Clinical Director & Senior Physiotherapist",
    speciality: "MSK & Sports Rehabilitation",
    bio: "With over 15 years of clinical experience, Dr. Mitchell leads our team with a passion for evidence-based practice and patient education."
  },
  {
    name: "James Okafor",
    role: "Senior Physiotherapist",
    speciality: "Neurology & Post-Surgical Rehab",
    bio: "James specialises in complex neurological conditions and post-operative rehabilitation, helping patients regain independence and quality of life."
  },
  {
    name: "Dr. Priya Sharma",
    role: "Specialist Physiotherapist",
    speciality: "Chronic Pain & Electrotherapy",
    bio: "Dr. Sharma is our technology specialist, with expertise in advanced electrotherapy modalities and chronic pain management."
  }
];

export default function About() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            About TelePhysio
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We are a team of dedicated physiotherapists who believe that exceptional rehabilitation care should be available to everyone, anywhere.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                TelePhysio was founded on a simple but powerful belief: the geography of where you live should not determine the quality of physiotherapy care you receive.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We set out to build a clinic that combines the clinical rigour of the best in-person practices with the accessibility and convenience of modern technology. The result is a service that thousands of patients now rely on for their recovery journeys.
              </p>
              <ul className="space-y-3">
                {[
                  "Fully qualified and registered physiotherapists",
                  "Comprehensive initial assessments",
                  "Ongoing care and progress tracking",
                  "Advanced technology modalities"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/5 rounded-3xl p-10 border border-primary/10">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "2,000+", label: "Patients Treated" },
                  { number: "15+", label: "Years Combined Experience" },
                  { number: "98%", label: "Patient Satisfaction" },
                  { number: "50+", label: "Conditions Treated" }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4">
                    <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-card-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Meet the Team</h2>
            <p className="text-muted-foreground text-lg">Experienced, qualified professionals dedicated to your recovery.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-card border border-card-border rounded-2xl p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl font-bold text-primary">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{member.speciality}</p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to begin your recovery?</h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Register today and take the first step towards better health with our expert team.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Book Appointment <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
