import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, Users, Heart, Stethoscope, ArrowRight, GraduationCap, Building2 } from "lucide-react";

const values = [
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: "Patient-Centred Care",
    description: "Every decision we make starts with the question: what is best for this patient? Your wellbeing is our north star."
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Clinical Excellence",
    description: "Our physiotherapists are highly qualified, gold-medallist practitioners who keep their skills current through ongoing research."
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Accessibility for All",
    description: "We believe everyone deserves access to expert physiotherapy, regardless of location, mobility, or schedule."
  },
  {
    icon: <Stethoscope className="w-6 h-6 text-primary" />,
    title: "Evidence-Based Practice",
    description: "Our treatment approaches are grounded in the latest clinical research and proven outcomes data."
  }
];

const team = [
  {
    name: "Dr. Supreet Bindra",
    photo: "/dr-supreet.jpeg",
    qualifications: "BPT (Gold Medallist), MPT in Musculoskeletal Physiotherapy (Gold Medallist), PhD (Back Pain)",
    role: "Associate Professor and Head",
    department: "Department of Physiotherapy",
    university: "Sri Guru Granth Sahib World University, Fatehgarh Sahib",
    speciality: "Musculoskeletal & Back Pain Specialist",
    bio: "Dr. Supreet Bindra is a double gold medallist with exceptional expertise in musculoskeletal physiotherapy and back pain research. As Head of the Department of Physiotherapy, she brings rigorous academic excellence and clinical insight to every patient interaction."
  },
  {
    name: "Dr. Pankajpreet Singh",
    photo: "/dr-pankaj.jpeg",
    qualifications: "BPT, MPT in Neurological Physiotherapy, PhD",
    role: "Associate Professor and Dean",
    department: "Faculty of Allied and Health-Care Sciences",
    university: "Sri Guru Granth Sahib World University, Fatehgarh Sahib",
    speciality: "Neurological Physiotherapy Specialist",
    bio: "Dr. Pankajpreet Singh is a distinguished neurological physiotherapy specialist and Dean of the Faculty of Allied and Health-Care Sciences. His advanced expertise helps patients with complex neurological conditions regain function and independence."
  }
];

export default function About() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            About TelePhysio
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
            Led by PhD-qualified academics and gold-medallist clinicians, we bring university-level physiotherapy expertise directly to your home.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                TelePhysio was founded on a simple but powerful belief: the geography of where you live should not determine the quality of physiotherapy care you receive.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                Our team — led by gold-medallist academics and PhD-qualified specialists — brings university-level clinical excellence directly into your home through secure video consultations.
              </p>
              <ul className="space-y-3">
                {[
                  "PhD-qualified and gold-medallist physiotherapists",
                  "Comprehensive initial assessments online",
                  "Personalised home exercise programmes",
                  "Progress tracked through your patient dashboard"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/5 rounded-3xl p-6 sm:p-10 border border-primary/10">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { number: "2×", label: "Gold Medallists" },
                  { number: "PhD", label: "Qualified Specialists" },
                  { number: "MSK+", label: "Neuro Specialities" },
                  { number: "Online", label: "Anywhere Access" }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 sm:p-4">
                    <p className="text-3xl sm:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.number}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">Meet Our Experts</h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              PhD-qualified academics and clinicians dedicated to your recovery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="bg-card border border-card-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-64 sm:h-72 bg-primary/5">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{member.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{member.speciality}</p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground font-medium leading-relaxed">{member.qualifications}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{member.university}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">Our Values</h2>
            <p className="text-muted-foreground text-base sm:text-lg">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-card p-6 sm:p-8 rounded-2xl border border-card-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  {value.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">Ready to begin your recovery?</h2>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
            Register today and book your first online consultation with our expert team.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-11 sm:h-12 px-8 font-semibold">
              Book Appointment <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
