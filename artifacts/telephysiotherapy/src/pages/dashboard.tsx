import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPatient,
  useListAppointments,
  useGetPatientAssessments,
  useGetPatientExercises,
  useGetPatientProgress,
  useCreateAssessment,
  useCreateProgressEntry,
  useCreateAppointment,
  useGetAppointmentSummary,
  getGetPatientAssessmentsQueryKey,
  getGetPatientProgressQueryKey,
  getListAppointmentsQueryKey,
  getGetAppointmentSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar, Activity, Dumbbell, ClipboardList, User, LogOut,
  CheckCircle2, Clock, Video, Camera, CameraOff, IndianRupee,
  Stethoscope, MapPin
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-muted text-muted-foreground border-border"
}

const statusLabels: Record<string, string> = {
  pending: "Pending review",
  confirmed: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled"
};

const BODY_PARTS = [
  { id: "head", label: "Head / Neck", x: 50, y: 8 },
  { id: "shoulder-l", label: "Left Shoulder", x: 30, y: 22 },
  { id: "shoulder-r", label: "Right Shoulder", x: 70, y: 22 },
  { id: "chest", label: "Chest", x: 50, y: 28 },
  { id: "upper-back", label: "Upper Back", x: 50, y: 30 },
  { id: "elbow-l", label: "Left Elbow", x: 22, y: 38 },
  { id: "elbow-r", label: "Right Elbow", x: 78, y: 38 },
  { id: "lower-back", label: "Lower Back", x: 50, y: 44 },
  { id: "wrist-l", label: "Left Wrist", x: 16, y: 52 },
  { id: "wrist-r", label: "Right Wrist", x: 84, y: 52 },
  { id: "hip-l", label: "Left Hip", x: 38, y: 54 },
  { id: "hip-r", label: "Right Hip", x: 62, y: 54 },
  { id: "knee-l", label: "Left Knee", x: 36, y: 70 },
  { id: "knee-r", label: "Right Knee", x: 64, y: 70 },
  { id: "ankle-l", label: "Left Ankle", x: 35, y: 87 },
  { id: "ankle-r", label: "Right Ankle", x: 65, y: 87 },
  { id: "foot-l", label: "Left Foot", x: 33, y: 95 },
  { id: "foot-r", label: "Right Foot", x: 67, y: 95 },
];

function BodyChart({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="space-y-3">
      <div className="relative bg-primary/5 border border-primary/10 rounded-xl overflow-hidden" style={{ paddingBottom: "110%" }}>
        {/* Simple body outline using SVG */}
        <svg viewBox="0 0 100 110" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Body outline */}
          <ellipse cx="50" cy="9" rx="9" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          <rect x="36" y="18" width="28" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          <rect x="20" y="20" width="16" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          <rect x="64" y="20" width="16" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          <rect x="36" y="48" width="12" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          <rect x="52" y="48" width="12" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          <rect x="33" y="82" width="12" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          <rect x="55" y="82" width="12" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary/20" />
          {/* Interactive dots */}
          {BODY_PARTS.map((part) => (
            <g key={part.id} onClick={() => toggle(part.id)} className="cursor-pointer">
              <circle
                cx={part.x}
                cy={part.y}
                r="3.5"
                className={`transition-colors ${selected.includes(part.id) ? "fill-primary stroke-primary" : "fill-white stroke-primary/40"}`}
                strokeWidth="1.2"
              />
              {selected.includes(part.id) && (
                <circle cx={part.x} cy={part.y} r="5.5" fill="none" className="stroke-primary animate-ping" strokeWidth="1" />
              )}
            </g>
          ))}
        </svg>
      </div>
      <p className="text-xs text-muted-foreground text-center">Click on the body diagram to mark areas of pain or discomfort</p>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(id => {
            const part = BODY_PARTS.find(p => p.id === id);
            return part ? (
              <Badge key={id} variant="outline" className="text-xs cursor-pointer bg-primary/5 border-primary/20 text-primary" onClick={() => toggle(id)}>
                {part.label} ×
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

function WebcamView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setActive(true);
    } catch {
      setError("Unable to access camera. Please allow camera permissions and try again.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="space-y-4">
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Live Webcam — Postural Analysis</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Enable your webcam so your physiotherapist can observe your posture and movement patterns during the session.
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div className="relative bg-muted rounded-xl overflow-hidden aspect-video flex items-center justify-center">
            <video ref={videoRef} className={`w-full h-full object-cover ${active ? "block" : "hidden"}`} playsInline muted />
            {!active && (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <CameraOff className="w-12 h-12 opacity-30" />
                <p className="text-sm">Camera not active</p>
              </div>
            )}
            {active && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
                LIVE
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}
          <div className="flex gap-3">
            {!active ? (
              <Button onClick={startCamera} className="gap-2">
                <Camera className="w-4 h-4" /> Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <CameraOff className="w-4 h-4" /> Stop Camera
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-3">Postural Analysis Guidance</h3>
        <ul className="space-y-2">
          {[
            "Position yourself so your full body is visible in the frame",
            "Stand in a neutral posture — feet shoulder-width apart",
            "Side-on and front-on views are both useful for assessment",
            "Perform any movements your physiotherapist requests",
            "Good lighting behind or beside the camera works best"
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [patientId, setPatientId] = useState<number | null>(null);
  const [patientName, setPatientName] = useState<string>("");

  useEffect(() => {
    const storedId = localStorage.getItem("patientId");
    const storedName = localStorage.getItem("patientName");
    if (!storedId) { setLocation("/register"); return; }
    setPatientId(parseInt(storedId, 10));
    setPatientName(storedName ?? "");
  }, [setLocation]);

  const { data: patient } = useGetPatient(patientId ?? 0, { query: { enabled: !!patientId } });
  const { data: appointments, isLoading: apptLoading } = useListAppointments(
    { patientId: patientId ?? undefined },
    { query: { enabled: !!patientId, queryKey: getListAppointmentsQueryKey({ patientId: patientId ?? undefined }) } }
  );
  const { data: assessments, isLoading: assessLoading } = useGetPatientAssessments(
    patientId ?? 0,
    { query: { enabled: !!patientId, queryKey: getGetPatientAssessmentsQueryKey(patientId ?? 0) } }
  );
  const { data: exercises, isLoading: exLoading } = useGetPatientExercises(patientId ?? 0, { query: { enabled: !!patientId } });
  const { data: progress, isLoading: progLoading } = useGetPatientProgress(
    patientId ?? 0,
    { query: { enabled: !!patientId, queryKey: getGetPatientProgressQueryKey(patientId ?? 0) } }
  );
  const { data: summary } = useGetAppointmentSummary({ query: { queryKey: getGetAppointmentSummaryQueryKey() } });

  const createAssessment = useCreateAssessment();
  const createProgress = useCreateProgressEntry();
  const createAppointment = useCreateAppointment();

  // Assessment form — all fields including body chart + outcome measures
  const [assessForm, setAssessForm] = useState({
    chiefComplaint: "",
    history: "",
    painIntensity: 5,
    bodyParts: [] as string[],
    outcomeMeasures: "",
    consentAssessment: false,
  });

  const [progForm, setProgForm] = useState({
    date: new Date().toISOString().split("T")[0],
    painIntensity: 5,
    notes: "",
    exercisesCompleted: false
  });

  const [apptForm, setApptForm] = useState({
    serviceType: "Online Consultation",
    sessionMode: "online",
    preferredDate: "",
    duration: 60,
    physiotherapist: "Dr. Supreet Bindra",
    reason: ""
  });

  const handleAssessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !assessForm.consentAssessment) return;
    const bodyChartStr = assessForm.bodyParts.length > 0
      ? assessForm.bodyParts.map(id => BODY_PARTS.find(p => p.id === id)?.label || id).join(", ")
      : undefined;

    createAssessment.mutate(
      {
        id: patientId,
        data: {
          chiefComplaint: assessForm.chiefComplaint,
          history: assessForm.history || undefined,
          painIntensity: assessForm.painIntensity,
          bodyChart: bodyChartStr,
          outcomeMeasures: assessForm.outcomeMeasures || undefined,
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Assessment submitted successfully" });
          setAssessForm({ chiefComplaint: "", history: "", painIntensity: 5, bodyParts: [], outcomeMeasures: "", consentAssessment: false });
          queryClient.invalidateQueries({ queryKey: getGetPatientAssessmentsQueryKey(patientId) });
        },
        onError: () => toast({ title: "Error submitting assessment", variant: "destructive" })
      }
    );
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    createProgress.mutate(
      { id: patientId, data: { date: progForm.date, painIntensity: progForm.painIntensity, notes: progForm.notes || undefined, exercisesCompleted: progForm.exercisesCompleted } },
      {
        onSuccess: () => {
          toast({ title: "Progress logged" });
          setProgForm({ date: new Date().toISOString().split("T")[0], painIntensity: 5, notes: "", exercisesCompleted: false });
          queryClient.invalidateQueries({ queryKey: getGetPatientProgressQueryKey(patientId) });
        },
        onError: () => toast({ title: "Error", variant: "destructive" })
      }
    );
  };

  const handleApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !patientName) return;
    createAppointment.mutate(
      {
        data: {
          patientId,
          patientName,
          serviceType: apptForm.serviceType,
          duration: apptForm.duration,
          physiotherapist: apptForm.physiotherapist || null,
          preferredDate: apptForm.preferredDate || null,
          sessionMode: apptForm.sessionMode || null,
          reason: apptForm.reason.trim() || null,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Appointment requested",
            description: "Our team will confirm a slot and notify you by email and SMS.",
          });
          setApptForm({
            serviceType: "Online Consultation",
            sessionMode: "online",
            preferredDate: "",
            duration: 60,
            physiotherapist: "Dr. Supreet Bindra",
            reason: "",
          });
          queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey({ patientId }) });
          queryClient.invalidateQueries({ queryKey: getGetAppointmentSummaryQueryKey() });
        },
        onError: () => toast({ title: "Error sending request", variant: "destructive" })
      }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("patientId");
    localStorage.removeItem("patientName");
    setLocation("/");
  };

  if (!patientId) return null;

  const patientIdStr = `PT-${String(patientId).padStart(5, "0")}`;

  return (
    <div className="min-h-screen bg-muted">
      {/* Dashboard Header */}
      <div className="bg-card border-b border-card-border py-5 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">My Dashboard</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-mono text-primary font-bold">{patientIdStr}</span>
                </span>
                {patient?.name && (
                  <span className="text-xs sm:text-sm text-muted-foreground">{patient.name}</span>
                )}
                {patient?.fees && (
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Consultation fee: <span className="font-semibold text-foreground ml-0.5">{patient.fees} / session</span>
                  </span>
                )}
                {(patient?.gender || patient?.age) && (
                  <span className="text-xs text-muted-foreground">
                    {[patient.gender, patient.age ? `${patient.age} yrs` : null].filter(Boolean).join(", ")}
                  </span>
                )}
                {patient?.occupation && (
                  <span className="text-xs text-muted-foreground">{patient.occupation}</span>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="shrink-0 gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Total Appointments", value: summary?.total ?? 0, icon: <Calendar className="w-4 h-4 text-primary" /> },
            { label: "Approved", value: summary?.confirmed ?? 0, icon: <CheckCircle2 className="w-4 h-4 text-green-600" /> },
            { label: "Pending", value: summary?.pending ?? 0, icon: <Clock className="w-4 h-4 text-yellow-600" /> },
            { label: "Assessments", value: assessments?.length ?? 0, icon: <ClipboardList className="w-4 h-4 text-primary" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="w-full mb-6 h-auto flex flex-wrap gap-1 bg-muted p-1.5 rounded-xl">
            <TabsTrigger value="appointments" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <Calendar className="w-3.5 h-3.5" /><span className="hidden sm:inline">Appointments</span><span className="sm:hidden">Appts</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" /><span className="hidden sm:inline">Assessment</span><span className="sm:hidden">Assess</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <Activity className="w-3.5 h-3.5" />Progress
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" /><span className="hidden sm:inline">Exercises</span><span className="sm:hidden">Ex</span>
            </TabsTrigger>
            <TabsTrigger value="posture" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <Camera className="w-3.5 h-3.5" />Posture
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <User className="w-3.5 h-3.5" />Profile
            </TabsTrigger>
          </TabsList>

          {/* ── APPOINTMENTS ── */}
          <TabsContent value="appointments">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">My Consultations</h2>
                {apptLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                        <Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((appt) => (
                      <div key={appt.id} className="bg-card border border-card-border rounded-xl p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm sm:text-base">{appt.serviceType}</p>
                            {appt.physiotherapist && (
                              <p className="text-xs text-primary font-medium mt-0.5 flex items-center gap-1">
                                <Stethoscope className="w-3 h-3" /> {appt.physiotherapist}
                              </p>
                            )}
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 border ${statusColors[appt.status] ?? "bg-muted text-muted-foreground border-border"}`}>
                            {statusLabels[appt.status] ?? appt.status}
                          </span>
                        </div>
                        {appt.sessionDate && appt.sessionTime ? (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appt.sessionDate}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.sessionTime}</span>

                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {appt.preferredDate && (
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Preferred: {appt.preferredDate}</span>
                            )}
                            {appt.sessionMode && (
                              <span className="flex items-center gap-1 capitalize">
                                {appt.sessionMode === "in-person" ? "In-person" : "Online"}
                              </span>
                            )}

                          </div>
                        )}
                        {appt.reason && (
                          <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">"{appt.reason}"</p>
                        )}
                        {appt.status === "rejected" && appt.rejectionReason && (
                          <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2.5">
                            <p className="font-semibold mb-0.5">Reason</p>
                            <p>{appt.rejectionReason}</p>
                          </div>
                        )}
                        {appt.notes && appt.status === "confirmed" && (
                          <div className="mt-3 text-xs text-foreground bg-muted border border-border rounded-lg p-2.5">
                            <p className="font-semibold mb-0.5 text-muted-foreground">Notes from team</p>
                            <p>{appt.notes}</p>
                          </div>
                        )}
                        {appt.sessionLink && (
                          <a
                            href={appt.sessionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" /> Join Video Session
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-card-border rounded-xl p-8 text-center">
                    <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No appointments yet. Book your first session →</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Request New Appointment</h2>
                <div className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                  <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg p-3 mb-4 leading-relaxed">
                    Tell us what you need. Our team will confirm a date, time, and video link within 24 hours.
                  </div>
                  <form onSubmit={handleApptSubmit} className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Service Type</Label>
                      <Select value={apptForm.serviceType} onValueChange={(v) => setApptForm(f => ({ ...f, serviceType: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Online Consultation">Online Consultation</SelectItem>
                          <SelectItem value="Initial Assessment">Initial Assessment</SelectItem>
                          <SelectItem value="Follow-up Session">Follow-up Session</SelectItem>
                          <SelectItem value="Postural Analysis">Postural Analysis</SelectItem>
                          <SelectItem value="Exercise Prescription">Exercise Prescription</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Session Mode</Label>
                      <Select value={apptForm.sessionMode} onValueChange={(v) => setApptForm(f => ({ ...f, sessionMode: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online (Video Consultation)</SelectItem>
                          <SelectItem value="in-person">In-Person (Clinic Visit)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Preferred Physiotherapist</Label>
                      <Select value={apptForm.physiotherapist} onValueChange={(v) => setApptForm(f => ({ ...f, physiotherapist: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. Supreet Bindra">Dr. Supreet Bindra — Musculoskeletal & Back Pain</SelectItem>
                          <SelectItem value="Dr. Pankajpreet Singh">Dr. Pankajpreet Singh — Neurological Physiotherapy</SelectItem>
                          <SelectItem value="No preference">No preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Preferred Date</Label>
                      <Input
                        type="date"
                        value={apptForm.preferredDate}
                        onChange={(e) => setApptForm(f => ({ ...f, preferredDate: e.target.value }))}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        Our care team will pick the best time within clinic hours and confirm with you.
                      </p>
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">What would you like help with?</Label>
                      <Textarea
                        rows={3}
                        placeholder="Briefly describe your symptoms or what you'd like to discuss..."
                        value={apptForm.reason}
                        onChange={(e) => setApptForm(f => ({ ...f, reason: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
                      {createAppointment.isPending ? "Sending..." : "Submit Request"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── ASSESSMENT ── */}
          <TabsContent value="assessment">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Assessment Form</h2>
                <div className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                  <form onSubmit={handleAssessSubmit} className="space-y-5">

                    {/* Demographics notice */}
                    {patient && (
                      <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-sm">
                        <p className="font-medium text-foreground mb-0.5">Patient Demographics</p>
                        <p className="text-muted-foreground text-xs">
                          {[patient.name, patient.age ? `${patient.age} yrs` : null, patient.gender, patient.occupation].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    )}

                    {/* Chief Complaint */}
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Chief Complaint *</Label>
                      <Textarea
                        placeholder="Describe your main symptom or reason for seeking physiotherapy..."
                        rows={3}
                        value={assessForm.chiefComplaint}
                        onChange={(e) => setAssessForm(f => ({ ...f, chiefComplaint: e.target.value }))}
                        required
                      />
                    </div>

                    {/* History */}
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Medical History</Label>
                      <Textarea
                        placeholder="Previous injuries, surgeries, relevant medical conditions, medications..."
                        rows={3}
                        value={assessForm.history}
                        onChange={(e) => setAssessForm(f => ({ ...f, history: e.target.value }))}
                      />
                    </div>

                    {/* Pain Intensity */}
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Pain Intensity: <span className="text-primary font-bold text-base">{assessForm.painIntensity}</span><span className="text-muted-foreground">/10</span>
                      </Label>
                      <Slider min={0} max={10} step={1} value={[assessForm.painIntensity]} onValueChange={([v]) => setAssessForm(f => ({ ...f, painIntensity: v }))} className="mt-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                        <span>0 — No pain</span>
                        <span className="text-center">5 — Moderate</span>
                        <span>10 — Worst pain</span>
                      </div>
                    </div>

                    {/* Body Chart */}
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Body Chart — Mark Pain Areas</Label>
                      <BodyChart selected={assessForm.bodyParts} onChange={(ids) => setAssessForm(f => ({ ...f, bodyParts: ids }))} />
                    </div>

                    {/* Outcome Measures */}
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Outcome Measures / Goals</Label>
                      <Textarea
                        placeholder="e.g. Reduce pain to 3/10 within 4 weeks, return to walking 30 min daily, improve shoulder range of motion..."
                        rows={3}
                        value={assessForm.outcomeMeasures}
                        onChange={(e) => setAssessForm(f => ({ ...f, outcomeMeasures: e.target.value }))}
                      />
                    </div>

                    {/* Assessment Consent */}
                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Checkbox
                        id="assess-consent"
                        checked={assessForm.consentAssessment}
                        onCheckedChange={(c) => setAssessForm(f => ({ ...f, consentAssessment: !!c }))}
                        className="mt-0.5"
                      />
                      <Label htmlFor="assess-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        I confirm the information provided is accurate and I consent to this assessment data being used to inform my physiotherapy treatment plan.
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={createAssessment.isPending || !assessForm.consentAssessment}>
                      {createAssessment.isPending ? "Submitting..." : "Submit Assessment"}
                    </Button>
                  </form>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Previous Assessments</h2>
                {assessLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="bg-card border border-card-border rounded-xl p-5">
                        <Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : assessments && assessments.length > 0 ? (
                  <div className="space-y-3">
                    {assessments.map((a) => (
                      <div key={a.id} className="bg-card border border-card-border rounded-xl p-4 sm:p-5">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <p className="font-semibold text-foreground text-sm">{a.chiefComplaint}</p>
                          <Badge variant="outline" className="text-xs shrink-0 bg-primary/5 border-primary/20 text-primary">Pain: {a.painIntensity}/10</Badge>
                        </div>
                        {a.bodyChart && (
                          <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary shrink-0" /> {a.bodyChart}
                          </p>
                        )}
                        {a.history && <p className="text-xs text-muted-foreground mb-1.5">{a.history}</p>}
                        {a.outcomeMeasures && (
                          <p className="text-xs text-muted-foreground italic">{a.outcomeMeasures}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                          {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-card-border rounded-xl p-8 text-center">
                    <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No assessments yet. Complete your first assessment.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── PROGRESS ── */}
          <TabsContent value="progress">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Log Progress</h2>
                <div className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                  <form onSubmit={handleProgressSubmit} className="space-y-5">
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Date</Label>
                      <Input type="date" value={progForm.date} onChange={(e) => setProgForm(f => ({ ...f, date: e.target.value }))} required />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Pain Intensity: <span className="text-primary font-bold text-base">{progForm.painIntensity}</span><span className="text-muted-foreground">/10</span>
                      </Label>
                      <Slider min={0} max={10} step={1} value={[progForm.painIntensity]} onValueChange={([v]) => setProgForm(f => ({ ...f, painIntensity: v }))} className="mt-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                        <span>0 — No pain</span><span>10 — Worst</span>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium">Notes</Label>
                      <Textarea placeholder="How are you feeling today? Any changes in symptoms?" rows={3} value={progForm.notes} onChange={(e) => setProgForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                      <Checkbox id="exercises-done" checked={progForm.exercisesCompleted} onCheckedChange={(c) => setProgForm(f => ({ ...f, exercisesCompleted: !!c }))} />
                      <Label htmlFor="exercises-done" className="text-sm cursor-pointer">I completed my home exercises today</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={createProgress.isPending}>
                      {createProgress.isPending ? "Saving..." : "Log Progress"}
                    </Button>
                  </form>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Progress Diary</h2>
                {progLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                        <Skeleton className="h-5 w-1/3 mb-2" /><Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : progress && progress.length > 0 ? (
                  <div className="space-y-3">
                    {[...progress].reverse().map((entry) => (
                      <div key={entry.id} className="bg-card border border-card-border rounded-xl p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="font-semibold text-foreground text-sm">{entry.date}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">Pain: {entry.painIntensity}/10</Badge>
                            {entry.exercisesCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                          </div>
                        </div>
                        {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-card-border rounded-xl p-8 text-center">
                    <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No progress entries yet.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── EXERCISES ── */}
          <TabsContent value="exercises">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Home Exercise Regime</h2>
            {exLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-xl p-5">
                    <Skeleton className="h-6 w-3/4 mb-3" /><Skeleton className="h-4 w-full mb-2" />
                  </div>
                ))}
              </div>
            ) : exercises && exercises.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {exercises.map((ex) => (
                  <div key={ex.id} className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{ex.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">{ex.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ex.sets && <Badge variant="outline" className="text-xs">{ex.sets} sets</Badge>}
                      {ex.reps && <Badge variant="outline" className="text-xs">{ex.reps} reps</Badge>}
                      {ex.frequency && <Badge variant="outline" className="text-xs">{ex.frequency}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-card-border rounded-xl p-12 text-center">
                <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No exercises assigned yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Your physiotherapist will assign your personalised home exercise programme after your initial assessment.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ── POSTURAL ANALYSIS ── */}
          <TabsContent value="posture">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Postural Analysis</h2>
            <WebcamView />
          </TabsContent>

          {/* ── PROFILE ── */}
          <TabsContent value="profile">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">My Profile</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              {patient ? (
                <>
                  {[
                    { label: "Patient ID", value: patientIdStr, highlight: true },
                    { label: "Full Name", value: patient.name },
                    { label: "Email", value: patient.email },
                    { label: "Phone", value: patient.phone },
                    { label: "Age", value: patient.age ? `${patient.age} years` : "—" },
                    { label: "Gender", value: patient.gender ?? "—" },
                    { label: "Occupation", value: (patient as any).occupation ?? "—" },
                    { label: "Consultation Fee", value: patient.fees ?? "—" },
                    { label: "Consent Given", value: patient.consentGiven ? "Yes" : "No" },
                    { label: "Registered", value: new Date(patient.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="bg-card border border-card-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <p className={`font-semibold text-sm ${highlight ? "text-primary font-mono" : "text-foreground"}`}>{value}</p>
                    </div>
                  ))}
                </>
              ) : (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                    <Skeleton className="h-3 w-1/3 mb-2" /><Skeleton className="h-4 w-2/3" />
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={handleLogout} className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
