import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreatePatient } from "@workspace/api-client-react";
import { CheckCircle2, Shield, IndianRupee } from "lucide-react";

const FEE_OPTIONS = [
  { label: "Standard Online Consultation — ₹500 / session", value: "₹500" },
  { label: "Extended Online Consultation (60 min) — ₹800 / session", value: "₹800" },
  { label: "Follow-up Session — ₹300 / session", value: "₹300" },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    occupation: "",
    fees: "₹500",
    consent: false,
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
          age: form.age ? parseInt(form.age) : undefined,
          gender: form.gender || undefined,
          occupation: form.occupation.trim() || undefined,
          fees: form.fees,
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
    <div className="min-h-screen bg-muted flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">Create Your Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Register to book appointments and access your patient portal.</p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* Section: Personal Details */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Personal Details</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium">Full Name *</Label>
                  <Input id="reg-name" placeholder="Your full name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="reg-age" className="mb-1.5 block text-sm font-medium">Age</Label>
                    <Input id="reg-age" type="number" min="1" max="120" placeholder="Age" value={form.age} onChange={(e) => setForm(f => ({ ...f, age: e.target.value }))} />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium">Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => setForm(f => ({ ...f, gender: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="reg-occupation" className="mb-1.5 block text-sm font-medium">Occupation</Label>
                  <Input id="reg-occupation" placeholder="e.g. Teacher, Engineer, Student..." value={form.occupation} onChange={(e) => setForm(f => ({ ...f, occupation: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Section: Contact */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Contact Information</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium">Email Address *</Label>
                  <Input id="reg-email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
                <div>
                  <Label htmlFor="reg-phone" className="mb-1.5 block text-sm font-medium">Phone Number *</Label>
                  <Input id="reg-phone" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} required />
                </div>
              </div>
            </div>

            {/* Section: Consultation Fee */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Consultation Fee</p>
              <div className="space-y-3">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Select Session Type</Label>
                  <Select value={form.fees} onValueChange={(v) => setForm(f => ({ ...f, fees: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <IndianRupee className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Your selected fee: <span className="font-semibold text-foreground">{form.fees} per session</span>. Payment is collected at the time of the consultation.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <Checkbox
                id="reg-consent"
                checked={form.consent}
                onCheckedChange={(checked) => setForm(f => ({ ...f, consent: !!checked }))}
                className="mt-0.5"
              />
              <Label htmlFor="reg-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I consent to TelePhysio storing and processing my personal health information for the purpose of providing physiotherapy services. I understand I can withdraw this consent at any time.
              </Label>
            </div>

            <Button type="submit" className="w-full h-11 sm:h-12" disabled={createPatient.isPending || !form.consent}>
              {createPatient.isPending ? "Creating Account..." : "Create Account & Book"}
            </Button>
          </form>

          <div className="mt-5 flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            Your information is encrypted and secure
          </div>
        </div>

        <div className="mt-6 bg-card border border-card-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-semibold text-foreground mb-3 text-sm">What happens next?</h3>
          <ul className="space-y-2">
            {[
              "Your patient account is created instantly",
              "Access your personal dashboard and patient ID",
              "Book your first appointment with a specialist",
              "Complete your assessment form online",
              "Receive your personalised treatment plan"
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
