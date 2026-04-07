import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCreatePatient } from "@workspace/api-client-react";
import { CheckCircle2, Shield } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    consent: false
  });

  const createPatient = useCreatePatient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.consent) return;

    createPatient.mutate(
      {
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          consentGiven: form.consent,
        }
      },
      {
        onSuccess: (patient) => {
          localStorage.setItem("patientId", String(patient.id));
          localStorage.setItem("patientName", patient.name);
          toast({ title: "Account created", description: "Welcome to TelePhysio!" });
          setLocation("/dashboard");
        },
        onError: () => {
          toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Register to book appointments and track your recovery.</p>
        </div>

        <div className="bg-card border border-card-border rounded-3xl p-10 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="reg-name" className="mb-2 block text-sm font-medium">Full Name</Label>
              <Input
                id="reg-name"
                data-testid="input-reg-name"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="reg-email" className="mb-2 block text-sm font-medium">Email Address</Label>
              <Input
                id="reg-email"
                data-testid="input-reg-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="reg-phone" className="mb-2 block text-sm font-medium">Phone Number</Label>
              <Input
                id="reg-phone"
                data-testid="input-reg-phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <Checkbox
                id="reg-consent"
                data-testid="checkbox-reg-consent"
                checked={form.consent}
                onCheckedChange={(checked) => setForm(f => ({ ...f, consent: !!checked }))}
                required
              />
              <Label htmlFor="reg-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I consent to TelePhysio storing and processing my personal health information for the purpose of providing physiotherapy services. I understand I can withdraw this consent at any time.
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={createPatient.isPending || !form.consent}
              data-testid="button-reg-submit"
            >
              {createPatient.isPending ? "Creating Account..." : "Create Account & Book"}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            Your information is encrypted and secure
          </div>
        </div>

        <div className="mt-8 bg-card border border-card-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-3 text-sm">What happens next?</h3>
          <ul className="space-y-2">
            {[
              "Your account is created instantly",
              "Access your personal dashboard",
              "Book your first appointment",
              "Receive your treatment plan"
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
