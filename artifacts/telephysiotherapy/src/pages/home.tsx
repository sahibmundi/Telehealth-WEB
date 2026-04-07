import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Star, Activity, PhoneCall, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-muted">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="Expert Physiotherapy at Home" 
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 mb-6 backdrop-blur-md">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Trusted Online Clinic</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Expert Physiotherapy,<br/>
              <span className="text-primary">From Your Home.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
              Experience world-class rehabilitation and pain management without the waiting room. Our certified physiotherapists provide tailored care through secure video consultations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                  Book Appointment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/services/online">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-white/10 hover:bg-white/20 border-white/20 text-white">
                  Learn About Online Care
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-foreground bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=115e59`} alt="Patient" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm font-medium text-white/90">Trusted by 2,000+ patients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Why Choose TelePhysio?</h2>
            <p className="text-muted-foreground text-lg">We combine clinical excellence with digital convenience to deliver better outcomes, faster.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-8 h-8 text-primary" />,
                title: "Expert Practitioners",
                description: "Our team consists of certified specialists with years of clinical experience in various modalities."
              },
              {
                icon: <PhoneCall className="w-8 h-8 text-primary" />,
                title: "Convenient Access",
                description: "Connect with your physiotherapist from anywhere. No commuting, no waiting rooms, just direct care."
              },
              {
                icon: <Heart className="w-8 h-8 text-primary" />,
                title: "Personalized Plans",
                description: "Every body is different. Get a custom recovery plan designed specifically for your condition and goals."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to start your recovery?</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Book your initial consultation today and take the first step towards a pain-free life.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base h-14 px-10">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
