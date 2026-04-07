import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
  Calendar,
  Activity,
  Dumbbell,
  ClipboardList,
  User,
  LogOut,
  CheckCircle2,
  Clock,
  Video
} from "lucide-react";
import { Link } from "wouter";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-red-100 text-red-700"
};

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

  const [assessForm, setAssessForm] = useState({ chiefComplaint: "", history: "", painIntensity: 5 });
  const [progForm, setProgForm] = useState({
    date: new Date().toISOString().split("T")[0],
    painIntensity: 5,
    notes: "",
    exercisesCompleted: false
  });
  const [apptForm, setApptForm] = useState({ serviceType: "Online Consultation", sessionDate: "", sessionTime: "09:00" });

  const handleAssessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    createAssessment.mutate(
      { id: patientId, data: { chiefComplaint: assessForm.chiefComplaint, history: assessForm.history || undefined, painIntensity: assessForm.painIntensity } },
      {
        onSuccess: () => {
          toast({ title: "Assessment submitted" });
          setAssessForm({ chiefComplaint: "", history: "", painIntensity: 5 });
          queryClient.invalidateQueries({ queryKey: getGetPatientAssessmentsQueryKey(patientId) });
        },
        onError: () => toast({ title: "Error", variant: "destructive" })
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
      { data: { patientId, patientName, serviceType: apptForm.serviceType, sessionDate: apptForm.sessionDate, sessionTime: apptForm.sessionTime, duration: 60 } },
      {
        onSuccess: () => {
          toast({ title: "Appointment booked", description: "We will confirm your slot shortly." });
          setApptForm({ serviceType: "Online Consultation", sessionDate: "", sessionTime: "09:00" });
          queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey({ patientId }) });
          queryClient.invalidateQueries({ queryKey: getGetAppointmentSummaryQueryKey() });
        },
        onError: () => toast({ title: "Error", variant: "destructive" })
      }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("patientId");
    localStorage.removeItem("patientName");
    setLocation("/");
  };

  if (!patientId) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-card border-b border-card-border py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 truncate">
              <span className="font-mono text-primary font-semibold">PT-{String(patientId).padStart(5, "0")}</span>
              {patient && <span className="ml-2">· {patient.name}</span>}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="shrink-0">
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Appointments", value: summary?.total ?? 0, icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> },
            { label: "Confirmed", value: summary?.confirmed ?? 0, icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> },
            { label: "Completed", value: summary?.completed ?? 0, icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> },
            { label: "Assessments", value: assessments?.length ?? 0, icon: <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="w-full mb-6 sm:mb-8 h-auto flex-wrap">
            <TabsTrigger value="appointments" className="flex-1 text-xs sm:text-sm py-2">
              <Calendar className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Appointments</span>
              <span className="xs:hidden">Appts</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex-1 text-xs sm:text-sm py-2">
              <ClipboardList className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Assessment</span>
              <span className="xs:hidden">Assess</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex-1 text-xs sm:text-sm py-2">
              <Activity className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex-1 text-xs sm:text-sm py-2">
              <Dumbbell className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Exercises</span>
              <span className="xs:hidden">Ex</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 text-xs sm:text-sm py-2">
              <User className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Appointments */}
          <TabsContent value="appointments">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">My Consultations</h2>
                {apptLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-card border border-card-border rounded-xl p-4 sm:p-5">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((appt) => (
                      <div key={appt.id} className="bg-card border border-card-border rounded-xl p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm sm:text-base truncate">{appt.serviceType}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              {appt.sessionDate} at {appt.sessionTime} ({appt.duration} min)
                            </p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusColors[appt.status] ?? "bg-muted text-muted-foreground"}`}>
                            {appt.status}
                          </span>
                        </div>
                        {appt.sessionLink && (
                          <a href={appt.sessionLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs sm:text-sm text-primary hover:underline">
                            <Video className="w-3 h-3" /> Join Session
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-card-border rounded-xl p-8 text-center">
                    <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No appointments yet. Book your first session.</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Book New Appointment</h2>
                <div className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                  <form onSubmit={handleApptSubmit} className="space-y-4">
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Service Type</Label>
                      <Input placeholder="e.g. Online Consultation" value={apptForm.serviceType} onChange={(e) => setApptForm(f => ({ ...f, serviceType: e.target.value }))} required />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Preferred Date</Label>
                      <Input type="date" value={apptForm.sessionDate} onChange={(e) => setApptForm(f => ({ ...f, sessionDate: e.target.value }))} required />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Preferred Time</Label>
                      <Input type="time" value={apptForm.sessionTime} onChange={(e) => setApptForm(f => ({ ...f, sessionTime: e.target.value }))} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
                      {createAppointment.isPending ? "Booking..." : "Book Appointment"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Assessment */}
          <TabsContent value="assessment">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Assessment Form</h2>
                <div className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                  <form onSubmit={handleAssessSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Chief Complaint</Label>
                      <Textarea
                        placeholder="Describe your main symptom or reason for seeking physiotherapy..."
                        rows={4}
                        value={assessForm.chiefComplaint}
                        onChange={(e) => setAssessForm(f => ({ ...f, chiefComplaint: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Relevant History</Label>
                      <Textarea
                        placeholder="Any relevant medical history, previous injuries, surgeries..."
                        rows={3}
                        value={assessForm.history}
                        onChange={(e) => setAssessForm(f => ({ ...f, history: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Pain Intensity: <span className="text-primary font-semibold">{assessForm.painIntensity}/10</span>
                      </Label>
                      <Slider min={0} max={10} step={1} value={[assessForm.painIntensity]} onValueChange={([v]) => setAssessForm(f => ({ ...f, painIntensity: v }))} className="mt-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>No pain</span><span>Worst pain</span>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={createAssessment.isPending}>
                      {createAssessment.isPending ? "Submitting..." : "Submit Assessment"}
                    </Button>
                  </form>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Previous Assessments</h2>
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
                          <Badge variant="outline" className="text-xs shrink-0">Pain: {a.painIntensity}/10</Badge>
                        </div>
                        {a.history && <p className="text-sm text-muted-foreground">{a.history}</p>}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-card-border rounded-xl p-8 text-center">
                    <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No assessments yet.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Progress */}
          <TabsContent value="progress">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Log Progress</h2>
                <div className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                  <form onSubmit={handleProgressSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Date</Label>
                      <Input type="date" value={progForm.date} onChange={(e) => setProgForm(f => ({ ...f, date: e.target.value }))} required />
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        Pain Intensity: <span className="text-primary font-semibold">{progForm.painIntensity}/10</span>
                      </Label>
                      <Slider min={0} max={10} step={1} value={[progForm.painIntensity]} onValueChange={([v]) => setProgForm(f => ({ ...f, painIntensity: v }))} className="mt-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>No pain</span><span>Worst pain</span>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-sm font-medium">Notes</Label>
                      <Textarea placeholder="How are you feeling today?" rows={3} value={progForm.notes} onChange={(e) => setProgForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="exercises-done" checked={progForm.exercisesCompleted} onCheckedChange={(c) => setProgForm(f => ({ ...f, exercisesCompleted: !!c }))} />
                      <Label htmlFor="exercises-done" className="text-sm cursor-pointer">I completed my exercises today</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={createProgress.isPending}>
                      {createProgress.isPending ? "Saving..." : "Log Progress"}
                    </Button>
                  </form>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Progress Diary</h2>
                {progLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-card border border-card-border rounded-xl p-5">
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
                            <Badge variant="outline" className="text-xs">Pain: {entry.painIntensity}/10</Badge>
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

          {/* Exercises */}
          <TabsContent value="exercises">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Home Exercise Regime</h2>
            {exLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card border border-card-border rounded-xl p-5">
                    <Skeleton className="h-6 w-3/4 mb-3" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            ) : exercises && exercises.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {exercises.map((ex) => (
                  <div key={ex.id} className="bg-card border border-card-border rounded-xl p-5 sm:p-6">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                      <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{ex.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{ex.description}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {ex.sets && <Badge variant="outline" className="text-xs">{ex.sets} sets</Badge>}
                      {ex.reps && <Badge variant="outline" className="text-xs">{ex.reps} reps</Badge>}
                      {ex.duration && <Badge variant="outline" className="text-xs">{ex.duration}</Badge>}
                      {ex.frequency && <Badge variant="outline" className="text-xs">{ex.frequency}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-card-border rounded-xl p-10 sm:p-12 text-center">
                <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No exercises yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">Your physiotherapist will add your personalised home exercise program after your first assessment.</p>
                <Link href="/dashboard">
                  <Button className="mt-6" onClick={() => {}}>Book Your First Session</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <div className="max-w-xl">
              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-5">Patient Profile</h2>
              {patient ? (
                <div className="bg-card border border-card-border rounded-xl p-6 sm:p-8">
                  <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xl sm:text-2xl font-bold text-primary">{patient.name[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">{patient.name}</h3>
                      <p className="text-muted-foreground text-sm truncate">{patient.email}</p>
                      <p className="text-xs text-primary font-mono mt-0.5">PT-{String(patient.id).padStart(5, "0")}</p>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: "Phone", value: patient.phone },
                      { label: "Age", value: patient.age ? `${patient.age} years` : "Not set" },
                      { label: "Gender", value: patient.gender ?? "Not set" },
                      { label: "Chief Complaint", value: patient.chiefComplaint ?? "Not set" },
                      { label: "Consent Given", value: patient.consentGiven ? "Yes" : "No" },
                      { label: "Member Since", value: new Date(patient.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-start gap-4 py-3 border-b border-border last:border-0">
                        <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{item.label}</span>
                        <span className="text-xs sm:text-sm font-medium text-foreground text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-card-border rounded-xl p-8">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-1/3" />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
