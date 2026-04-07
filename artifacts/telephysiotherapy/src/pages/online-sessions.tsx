import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCreateEnquiry } from "@workspace/api-client-react";
import { CheckCircle2, Monitor, Video, Clock, Shield, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: <Monitor className="w-6 h-6 text-primary" />,
    title: "Full Clinical Assessment",
    description: "Our physiotherapists conduct thorough assessments via video, observing posture, movement, and functional limitations."
  },
  {
    icon: <Video className="w-6 h-6 text-primary" />,
    title: "Secure Video Platform",
    description: "All sessions are conducted through an encrypted, GDPR-compliant video platform. Your health information is always protected."
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Flexible Scheduling",
    description: "Book appointments that fit your schedule — including early mornings, evenings, and weekends."
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Continuity of Care",
    description: "Your treatment records, exercise programs, and progress notes are all accessible through your personal dashboard."
  }
];

export default function OnlineSessions() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const createEnquiry = useCreateEnquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    createEnquiry.mutate(
      {
        data: {
          name: name.trim(),
          email: email.trim(),
          message: `Enquiry for online tele-physiotherapy session from ${name}`,
          type: "online_session",
        }
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast({ title: "Enquiry received", description: "We'll be in touch within 24 hours." });
        },
        onError: () => {
          toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                Online Physiotherapy Sessions
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Expert physiotherapy care delivered directly to you through a secure video consultation. Same clinical quality. Zero travel time.
              </p>
              <ul className="space-y-3">
                {[
                  "Qualified physiotherapists",
                  "Evidence-based assessment and treatment",
                  "Personalised home exercise programs",
                  "Progress tracked in your dashboard"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enquiry Form */}
            <div className="bg-card border border-card-border rounded-3xl p-10 shadow-md">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Enquiry Received</h3>
                  <p className="text-muted-foreground">
                    Thank you, {name}. A member of our team will contact you within 24 hours to arrange your first session.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-foreground mb-2">Book Your First Session</h2>
                  <p className="text-muted-foreground text-sm mb-6">Enter your details and we will be in touch within 24 hours.</p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="enquiry-name" className="text-sm font-medium mb-2 block">Full Name</Label>
                      <Input
                        id="enquiry-name"
                        data-testid="input-enquiry-name"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="enquiry-email" className="text-sm font-medium mb-2 block">Email Address</Label>
                      <Input
                        id="enquiry-email"
                        data-testid="input-enquiry-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={createEnquiry.isPending}
                      data-testid="button-enquire"
                    >
                      {createEnquiry.isPending ? "Submitting..." : "Enquire Now"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Why Online Physiotherapy?</h2>
            <p className="text-muted-foreground text-lg">Research confirms tele-physiotherapy is highly effective for most musculoskeletal conditions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-card border border-card-border rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-16">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Register & Book", description: "Create your patient account, complete a short pre-assessment questionnaire, and book your preferred time slot." },
              { step: "2", title: "Your Online Assessment", description: "Connect with your physiotherapist via secure video. They will assess your condition, take a full history, and observe your movement." },
              { step: "3", title: "Receive Your Plan", description: "Your personalised treatment plan and home exercise program are uploaded to your dashboard immediately after your session." },
              { step: "4", title: "Track Your Progress", description: "Log your pain levels and completed exercises daily. Your physiotherapist reviews your progress and adjusts the plan accordingly." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
