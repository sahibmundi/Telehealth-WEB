import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateAppointment } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import {
  CheckCircle2, Calendar, Clock, Stethoscope, User, ArrowRight,
  ChevronRight, IndianRupee, Shield, Video, LogIn
} from "lucide-react";

const SERVICES = [
  { value: "Initial Assessment", label: "Initial Assessment", desc: "First-time consultation to assess your condition", duration: 60, fee: "₹500" },
  { value: "Online Consultation", label: "Online Consultation", desc: "Follow-up or ongoing treatment session", duration: 45, fee: "₹400" },
  { value: "Postural Analysis", label: "Postural Analysis", desc: "Camera-assisted posture and movement assessment", duration: 45, fee: "₹400" },
  { value: "Exercise Prescription", label: "Exercise Prescription", desc: "Personalised home exercise programme design", duration: 30, fee: "₹300" },
  { value: "Follow-up Session", label: "Follow-up Session", desc: "Progress review and plan adjustment", duration: 30, fee: "₹300" },
];

const DOCTORS = [
  {
    value: "Dr. Supreet Bindra",
    name: "Dr. Supreet Bindra",
    spec: "Musculoskeletal & Back Pain",
    quals: "BPT (Gold Medallist), MPT Musculoskeletal (Gold Medallist), PhD",
    photo: "/dr-supreet.jpeg",
  },
  {
    value: "Dr. Pankajpreet Singh",
    name: "Dr. Pankajpreet Singh",
    spec: "Neurological Physiotherapy",
    quals: "BPT, MPT Neurological Physiotherapy, PhD",
    photo: "/dr-pankaj.jpeg",
  },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

const STEPS = ["Service", "Doctor & Time", "Your Details", "Confirm"];

export default function Book() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const isLoggedIn = !!user;
  const existingPatientId = user?.id ?? null;
  const existingPatientName = user?.name ?? "";

  const [booking, setBooking] = useState({
    serviceType: "",
    doctor: "",
    date: "",
    time: "",
    duration: 60,
    fee: "₹500",
  });

  const createAppointment = useCreateAppointment();

  const selectedDoctor = DOCTORS.find(d => d.value === booking.doctor);

  const today = new Date().toISOString().split("T")[0];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleServiceSelect = (svc: typeof SERVICES[0]) => {
    setBooking(b => ({ ...b, serviceType: svc.value, duration: svc.duration, fee: svc.fee }));
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
              serviceType: booking.serviceType,
              sessionDate: booking.date,
              sessionTime: booking.time,
              duration: booking.duration,
              physiotherapist: booking.doctor,
            }
          },
          { onSuccess: () => resolve(), onError: reject }
        );
      });

      setDone(true);
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
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
            You need an account before booking an appointment. It only takes a minute.
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
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Appointment Booked!</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your appointment with <span className="font-semibold text-foreground">{booking.doctor}</span> on{" "}
            <span className="font-semibold text-foreground">{booking.date}</span> at{" "}
            <span className="font-semibold text-foreground">{booking.time}</span> has been requested.
            We'll confirm within 24 hours.
          </p>
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Service:</span> <span className="font-medium">{booking.serviceType}</span></p>
            <p className="text-sm"><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{booking.duration} min</span></p>
            <p className="text-sm"><span className="text-muted-foreground">Fee:</span> <span className="font-medium">{booking.fee}</span></p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setLocation("/dashboard")} className="w-full h-11">
              Go to My Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")} className="w-full h-11">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Online physiotherapy with PhD-qualified specialists</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                  "bg-muted-foreground/20 text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${i === step ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-10 sm:w-16 h-0.5 mb-4 mx-1 transition-colors ${i < step ? "bg-primary" : "bg-muted-foreground/20"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-card-border rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">

          {/* ── STEP 0: Select Service ── */}
          {step === 0 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">What type of session do you need?</h2>
              <p className="text-sm text-muted-foreground mb-5">Select the service that best fits your needs.</p>
              <div className="space-y-3">
                {SERVICES.map((svc) => (
                  <button
                    key={svc.value}
                    onClick={() => handleServiceSelect(svc)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      booking.serviceType === svc.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{svc.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{svc.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">{svc.fee}</p>
                        <p className="text-xs text-muted-foreground">{svc.duration} min</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <Button className="w-full h-11" disabled={!booking.serviceType} onClick={handleNext}>
                  Continue <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Doctor & Date/Time ── */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">Choose your physiotherapist & time</h2>
              <p className="text-sm text-muted-foreground mb-5">Both specialists accept online appointments.</p>

              {/* Doctor selection */}
              <div className="space-y-3 mb-6">
                {DOCTORS.map((doc) => (
                  <button
                    key={doc.value}
                    onClick={() => setBooking(b => ({ ...b, doctor: doc.value }))}
                    className={`w-full text-left rounded-xl border p-4 transition-all flex items-center gap-4 ${
                      booking.doctor === doc.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    <img src={doc.photo} alt={doc.name} className="w-14 h-14 rounded-xl object-cover object-top shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm">{doc.name}</p>
                      <p className="text-xs text-primary font-medium">{doc.spec}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{doc.quals}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Date */}
              <div className="mb-4">
                <Label className="mb-1.5 block text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Preferred Date
                </Label>
                <Input
                  type="date"
                  min={today}
                  value={booking.date}
                  onChange={(e) => setBooking(b => ({ ...b, date: e.target.value }))}
                />
              </div>

              {/* Time slots */}
              {booking.date && (
                <div className="mb-4">
                  <Label className="mb-2 block text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Available Time Slots
                  </Label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setBooking(b => ({ ...b, time: t }))}
                        className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                          booking.time === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="mb-6">
                <Label className="mb-1.5 block text-sm font-medium">Session Duration</Label>
                <Select value={String(booking.duration)} onValueChange={(v) => setBooking(b => ({ ...b, duration: parseInt(v) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-11">Back</Button>
                <Button className="flex-1 h-11" disabled={!booking.doctor || !booking.date || !booking.time} onClick={handleNext}>
                  Continue <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Confirm patient ── */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Welcome back, {existingPatientName}!
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Your account details are saved. We&apos;ll use them for this booking.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1 h-11">
                    Back
                  </Button>
                  <Button className="flex-1 h-11" onClick={handleNext}>
                    Continue <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-1">Confirm your booking</h2>
              <p className="text-sm text-muted-foreground mb-5">Please review the details before confirming.</p>

              <div className="space-y-3 mb-6">
                {/* Doctor card */}
                {selectedDoctor && (
                  <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                    <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="w-12 h-12 rounded-xl object-cover object-top" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{selectedDoctor.name}</p>
                      <p className="text-xs text-primary">{selectedDoctor.spec}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Stethoscope className="w-3 h-3" /> Service</p>
                    <p className="text-sm font-semibold text-foreground">{booking.serviceType}</p>
                  </div>
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                    <p className="text-sm font-semibold text-foreground">{booking.date}</p>
                  </div>
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</p>
                    <p className="text-sm font-semibold text-foreground">{booking.time}</p>
                  </div>
                  <div className="p-3.5 bg-muted rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Fee</p>
                    <p className="text-sm font-semibold text-foreground">{booking.fee}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-muted rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3" /> Patient
                  </p>
                  <p className="text-sm font-semibold text-foreground">{existingPatientName}</p>
                  {user?.email && (
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                      {user.phone ? ` · ${user.phone}` : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-primary/5 rounded-xl border border-primary/10 text-sm text-muted-foreground">
                  <Video className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>A secure video link will be sent to your email once the appointment is confirmed (within 24 hours).</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" /> Payment collected at time of consultation
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1 h-11">Back</Button>
                <Button
                  className="flex-1 h-11"
                  onClick={handleConfirm}
                  disabled={createAppointment.isPending}
                >
                  {createAppointment.isPending ? "Confirming..." : "Confirm Booking"}
                  <CheckCircle2 className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
