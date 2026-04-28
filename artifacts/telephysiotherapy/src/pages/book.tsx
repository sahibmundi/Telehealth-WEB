import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateAppointment } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import {
  CheckCircle2,
  Calendar,
  Stethoscope,
  User,
  ArrowRight,
  ChevronRight,
  IndianRupee,
  LogIn,
  FileText,
  Inbox,
  Video,
  MapPin,
} from "lucide-react";

const SERVICES = [
  {
    value: "Initial Assessment",
    label: "Initial Assessment",
    desc: "First-time consultation to assess your condition",
    duration: 60,
    fee: "₹500",
  },
  {
    value: "Online Consultation",
    label: "Online Consultation",
    desc: "Follow-up or ongoing treatment session",
    duration: 45,
    fee: "₹400",
  },
  {
    value: "Follow-up Session",
    label: "Follow-up Session",
    desc: "Quick review of progress and exercise plan",
    duration: 30,
    fee: "₹300",
  },
  {
    value: "Postural Analysis",
    label: "Postural Analysis",
    desc: "Detailed assessment of posture and movement",
    duration: 60,
    fee: "₹500",
  },
  {
    value: "Exercise Prescription",
    label: "Exercise Prescription",
    desc: "Personalised home exercise programme",
    duration: 45,
    fee: "₹400",
  },
];

const SESSION_MODES = [
  {
    value: "online",
    label: "Online (Video Consultation)",
    desc: "Meet your physiotherapist from home over a secure video link.",
    icon: Video,
  },
  {
    value: "in-person",
    label: "In-Person (Clinic Visit)",
    desc: "Face-to-face consultation at our clinic with hands-on care.",
    icon: MapPin,
  },
];

const DOCTORS = [
  {
    value: "Dr. Supreet Bindra",
    name: "Dr. Supreet Bindra",
    spec: "Musculoskeletal & Back Pain",
    quals: "PhD Physiotherapy · 12+ yrs experience",
    photo:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  },
  {
    value: "Dr. Pankajpreet Singh",
    name: "Dr. Pankajpreet Singh",
    spec: "Neurological Physiotherapy",
    quals: "PhD Physiotherapy · 10+ yrs experience",
    photo:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
  },
  {
    value: "No preference",
    name: "No preference",
    spec: "Let us assign the best fit",
    quals: "Our team will pair you with the right specialist.",
    photo:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop",
  },
];

const STEPS = ["Service", "Mode", "Specialist", "Details", "Confirm"];

export default function Book() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const isLoggedIn = !!user;
  const existingPatientId = user?.id ?? null;
  const existingPatientName = user?.name ?? "";

  const [request, setRequest] = useState({
    serviceType: "",
    sessionMode: "",
    doctor: "",
    duration: 60,
    fee: "₹500",
    preferredDate: "",
    reason: "",
  });

  const createAppointment = useCreateAppointment();

  const selectedDoctor = DOCTORS.find((d) => d.value === request.doctor);
  const selectedMode = SESSION_MODES.find((m) => m.value === request.sessionMode);
  const today = new Date().toISOString().split("T")[0];

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleServiceSelect = (svc: (typeof SERVICES)[0]) => {
    setRequest((r) => ({
      ...r,
      serviceType: svc.value,
      duration: svc.duration,
      fee: svc.fee,
    }));
  };

  const handleConfirm = async () => {
    if (!existingPatientId) {
      setLocation("/login");
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        createAppointment.mutate(
          {
            data: {
              patientId: existingPatientId,
              patientName: existingPatientName,
              serviceType: request.serviceType,
              duration: request.duration,
              physiotherapist:
                request.doctor && request.doctor !== "No preference"
                  ? request.doctor
                  : null,
              preferredDate: request.preferredDate || null,
              sessionMode: request.sessionMode || null,
              reason: request.reason.trim() || null,
            },
          },
          { onSuccess: () => resolve(), onError: reject },
        );
      });

      setDone(true);
    } catch {
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!authLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
        <div className="bg-card border border-card-border rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to book</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            You need an account before requesting an appointment. It only takes a minute.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 border border-border hover:bg-muted transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-16">
        <div className="bg-card border border-card-border rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-5">
            <Inbox className="w-8 h-8 text-yellow-700" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Request Submitted
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your appointment request for{" "}
            <span className="font-semibold text-foreground">{request.serviceType}</span>{" "}
            has been sent to our care team. We&apos;ll review and confirm a date and
            time within 24 hours, and notify you by email and SMS once it&apos;s
            scheduled.
          </p>
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Service:</span>{" "}
              <span className="font-medium">{request.serviceType}</span>
            </p>
            {selectedMode && (
              <p className="text-sm">
                <span className="text-muted-foreground">Mode:</span>{" "}
                <span className="font-medium">{selectedMode.label}</span>
              </p>
            )}
            {request.doctor && request.doctor !== "No preference" && (
              <p className="text-sm">
                <span className="text-muted-foreground">Specialist:</span>{" "}
                <span className="font-medium">{request.doctor}</span>
              </p>
            )}
            {request.preferredDate && (
              <p className="text-sm">
                <span className="text-muted-foreground">Preferred date:</span>{" "}
                <span className="font-medium">{request.preferredDate}</span>
              </p>
            )}
            <p className="text-sm">
              <span className="text-muted-foreground">Fee:</span>{" "}
              <span className="font-medium">{request.fee}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setLocation("/dashboard")} className="w-full h-11">
              Go to My Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="w-full h-11"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-10 sm:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Request an Appointment
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Tell us what care you need. Our clinical team will review and schedule a
            confirmed slot for you.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                    i === step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-6 sm:w-12 h-0.5 mb-4 mx-1 transition-colors ${
                    i < step ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-card-border rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
          {/* ── STEP 0: Select Service ── */}
          {step === 0 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                What type of session do you need?
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Select the service that best fits your needs.
              </p>
              <div className="space-y-3">
                {SERVICES.map((svc) => (
                  <button
                    key={svc.value}
                    onClick={() => handleServiceSelect(svc)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      request.serviceType === svc.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {svc.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {svc.desc}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">{svc.fee}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  className="w-full h-11"
                  disabled={!request.serviceType}
                  onClick={handleNext}
                >
                  Continue <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Session mode ── */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                How would you like to be seen?
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Choose between an online video consultation or an in-person clinic
                visit.
              </p>
              <div className="space-y-3 mb-6">
                {SESSION_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const active = request.sessionMode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      onClick={() =>
                        setRequest((r) => ({ ...r, sessionMode: mode.value }))
                      }
                      className={`w-full text-left rounded-xl border p-4 transition-all flex items-start gap-4 ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40 hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm">
                          {mode.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-11">
                  Back
                </Button>
                <Button
                  className="flex-1 h-11"
                  disabled={!request.sessionMode}
                  onClick={handleNext}
                >
                  Continue <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Specialist ── */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Choose your specialist
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Pick a preferred physiotherapist or let us assign one for you.
              </p>

              <div className="space-y-3 mb-6">
                {DOCTORS.map((doc) => (
                  <button
                    key={doc.value}
                    onClick={() => setRequest((r) => ({ ...r, doctor: doc.value }))}
                    className={`w-full text-left rounded-xl border p-4 transition-all flex items-center gap-4 ${
                      request.doctor === doc.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover object-top shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm">
                        {doc.name}
                      </p>
                      <p className="text-xs text-primary font-medium">{doc.spec}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {doc.quals}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-11">
                  Back
                </Button>
                <Button
                  className="flex-1 h-11"
                  disabled={!request.doctor}
                  onClick={handleNext}
                >
                  Continue <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Date + Reason ── */}
          {step === 3 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Share a few details
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Let us know your preferred date and what you&apos;d like help with.
                Our care team will confirm a specific time slot for you.
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Preferred Date
                    (optional)
                  </Label>
                  <Input
                    type="date"
                    min={today}
                    value={request.preferredDate}
                    onChange={(e) =>
                      setRequest((r) => ({ ...r, preferredDate: e.target.value }))
                    }
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Our scheduler will pick the time that works best within clinic
                    hours and confirm it with you.
                  </p>
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> What would you
                    like help with?
                  </Label>
                  <Textarea
                    rows={4}
                    placeholder="e.g. Lower back pain for the past 2 weeks, worse when sitting. Looking for an exercise plan I can do at home."
                    value={request.reason}
                    onChange={(e) =>
                      setRequest((r) => ({ ...r, reason: e.target.value }))
                    }
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Sharing context helps us pair you with the right specialist and
                    prepare for your session.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-11">
                  Back
                </Button>
                <Button className="flex-1 h-11" onClick={handleNext}>
                  Continue <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Confirm ── */}
          {step === 4 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Review your request
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                We&apos;ll send this to our scheduling team. You&apos;ll receive an
                email and SMS once a slot is confirmed.
              </p>

              <div className="space-y-3 mb-6">
                {selectedDoctor && selectedDoctor.value !== "No preference" && (
                  <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                    <img
                      src={selectedDoctor.photo}
                      alt={selectedDoctor.name}
                      className="w-12 h-12 rounded-xl object-cover object-top"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {selectedDoctor.name}
                      </p>
                      <p className="text-xs text-primary">{selectedDoctor.spec}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> Service
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {request.serviceType}
                    </p>
                  </div>
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" /> Fee
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {request.fee}
                    </p>
                  </div>
                  {selectedMode && (
                    <div className="p-3.5 bg-muted rounded-xl border border-border col-span-2">
                      <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                        <selectedMode.icon className="w-3 h-3" /> Session mode
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedMode.label}
                      </p>
                    </div>
                  )}
                  {request.preferredDate && (
                    <div className="p-3.5 bg-muted rounded-xl border border-border col-span-2">
                      <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Preferred date
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {request.preferredDate}
                      </p>
                    </div>
                  )}
                </div>

                {request.reason && (
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> What you&apos;d like help with
                    </p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {request.reason}
                    </p>
                  </div>
                )}

                {existingPatientName && (
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                      <User className="w-3 h-3" /> Patient
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {existingPatientName}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-11">
                  Back
                </Button>
                <Button
                  className="flex-1 h-11"
                  onClick={handleConfirm}
                  disabled={createAppointment.isPending}
                >
                  {createAppointment.isPending ? "Sending..." : "Submit Request"}{" "}
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
