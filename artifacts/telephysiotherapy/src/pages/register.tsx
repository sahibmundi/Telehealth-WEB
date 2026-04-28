import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type AuthUser } from "@/hooks/use-auth";
import { CheckCircle2, Shield, IndianRupee, Lock } from "lucide-react";

const FEE_OPTIONS = [
  { label: "Standard Online Consultation — ₹500 / session", value: "₹500" },
  { label: "Extended Online Consultation (60 min) — ₹800 / session", value: "₹800" },
  { label: "In-Person Clinic Consultation — ₹700 / session", value: "₹700" },
  { label: "Follow-up Session — ₹300 / session", value: "₹300" },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setSession } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    occupation: "",
    fees: "₹500",
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.consent
    ) {
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          age: form.age ? parseInt(form.age, 10) : null,
          gender: form.gender || null,
          occupation: form.occupation.trim() || null,
          fees: form.fees,
          consentGiven: form.consent,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          (body && typeof body.error === "string" && body.error) ||
          "Could not create your account.";
        setError(message);
        return;
      }

      const token = body.token as string;
      const patient = body.patient as AuthUser;
      setSession(token, patient);
      toast({ title: "Account created", description: "Welcome to TelePhysio!" });
      setLocation("/dashboard");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Create Your Account
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Register to book appointments and access your patient portal.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

            {/* Section: Personal Details */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Personal Details
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="reg-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="reg-age" className="mb-1.5 block text-sm font-medium">
                      Age
                    </Label>
                    <Input
                      id="reg-age"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Age"
                      value={form.age}
                      onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block text-sm font-medium">Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
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
                  <Label htmlFor="reg-occupation" className="mb-1.5 block text-sm font-medium">
                    Occupation
                  </Label>
                  <Input
                    id="reg-occupation"
                    placeholder="e.g. Teacher, Engineer, Student..."
                    value={form.occupation}
                    onChange={(e) => setForm((f) => ({ ...f, occupation: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Section: Contact */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Contact Information
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-phone" className="mb-1.5 block text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="reg-phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Password */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Account Security
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium">
                    Password *
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                    }
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Section: Consultation Fee */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Consultation Fee
              </p>
              <div className="space-y-3">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Select Session Type</Label>
                  <Select
                    value={form.fees}
                    onValueChange={(v) => setForm((f) => ({ ...f, fees: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <IndianRupee className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Your selected fee:{" "}
                    <span className="font-semibold text-foreground">
                      {form.fees} per session
                    </span>
                    . Payment is collected at the time of the consultation.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <Checkbox
                id="reg-consent"
                checked={form.consent}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, consent: !!checked }))
                }
                className="mt-0.5"
              />
              <Label
                htmlFor="reg-consent"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                I consent to TelePhysio storing and processing my personal health
                information for the purpose of providing physiotherapy services. I
                understand I can withdraw this consent at any time.
              </Label>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 sm:h-12"
              disabled={submitting || !form.consent}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-5 flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            Your information is encrypted and secure
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <div className="mt-6 bg-card border border-card-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-semibold text-foreground mb-3 text-sm">What happens next?</h3>
          <ul className="space-y-2">
            {[
              "Your patient account is created instantly",
              "Access your personal dashboard and patient ID",
              "Book your first appointment with a specialist",
              "Complete your assessment form online",
              "Receive your personalised treatment plan",
            ].map((step, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
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
