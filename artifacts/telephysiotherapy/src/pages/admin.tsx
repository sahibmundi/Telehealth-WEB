import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  LogOut,
  User,
  Stethoscope,
  Inbox,
  Video,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

interface AdminAppointment {
  id: number;
  patientId: number;
  patientName: string;
  serviceType: string;
  duration: number;
  status: string;
  sessionDate: string | null;
  sessionTime: string | null;
  sessionLink: string | null;
  physiotherapist: string | null;
  notes: string | null;
  preferredDate: string | null;
  preferredTimeOfDay: string | null;
  reason: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

interface AdminPatient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  gender: string | null;
  occupation: string | null;
  fees: string | null;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "Approved",
    cls: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-100 text-red-700 border-red-200",
  },
  completed: {
    label: "Completed",
    cls: "bg-primary/10 text-primary border-primary/20",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-muted text-muted-foreground border-border",
  },
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { admin, token, isLoading: authLoading, logout } = useAdminAuth();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<AdminAppointment[] | null>(null);
  const [patients, setPatients] = useState<Map<number, AdminPatient>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [approveDialog, setApproveDialog] = useState<AdminAppointment | null>(null);
  const [approveForm, setApproveForm] = useState({
    sessionDate: "",
    sessionTime: "10:00",
    sessionLink: "",
    physiotherapist: "",
    notes: "",
  });
  const [rejectDialog, setRejectDialog] = useState<AdminAppointment | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !admin) setLocation("/admin/login");
  }, [admin, authLoading, setLocation]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [apptRes, patRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/patients"),
      ]);
      if (!apptRes.ok) throw new Error("Failed to load appointments");
      if (!patRes.ok) throw new Error("Failed to load patients");
      const appts = (await apptRes.json()) as AdminAppointment[];
      const pats = (await patRes.json()) as AdminPatient[];
      setAppointments(appts);
      const map = new Map<number, AdminPatient>();
      for (const p of pats) map.set(p.id, p);
      setPatients(map);
    } catch {
      setError("Could not load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const grouped = useMemo(() => {
    const buckets = {
      pending: [] as AdminAppointment[],
      confirmed: [] as AdminAppointment[],
      rejected: [] as AdminAppointment[],
      completed: [] as AdminAppointment[],
      cancelled: [] as AdminAppointment[],
    };
    for (const a of appointments ?? []) {
      const key = (a.status as keyof typeof buckets) ?? "pending";
      if (buckets[key]) buckets[key].push(a);
    }
    return buckets;
  }, [appointments]);

  const openApprove = (appt: AdminAppointment) => {
    setApproveForm({
      sessionDate: appt.sessionDate ?? appt.preferredDate ?? "",
      sessionTime: appt.sessionTime ?? "10:00",
      sessionLink: appt.sessionLink ?? "",
      physiotherapist: appt.physiotherapist ?? "",
      notes: appt.notes ?? "",
    });
    setApproveDialog(appt);
  };

  const submitApprove = async () => {
    if (!approveDialog || !token) return;
    if (!approveForm.sessionDate || !approveForm.sessionTime) {
      toast({
        title: "Date and time required",
        description: "Please pick when this session will happen.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/appointments/${approveDialog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "confirmed",
          sessionDate: approveForm.sessionDate,
          sessionTime: approveForm.sessionTime,
          sessionLink: approveForm.sessionLink || null,
          physiotherapist: approveForm.physiotherapist || null,
          notes: approveForm.notes || null,
          rejectionReason: null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Could not approve.");
      }
      toast({ title: "Appointment approved" });
      setApproveDialog(null);
      await loadData();
    } catch (err) {
      toast({
        title: "Could not approve",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitReject = async () => {
    if (!rejectDialog || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/appointments/${rejectDialog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "rejected",
          rejectionReason: rejectReason.trim() || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Could not reject.");
      }
      toast({ title: "Appointment rejected" });
      setRejectDialog(null);
      setRejectReason("");
      await loadData();
    } catch (err) {
      toast({
        title: "Could not reject",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const markCompleted = async (appt: AdminAppointment) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/appointments/${appt.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Marked completed" });
      await loadData();
    } catch {
      toast({ title: "Could not update", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  if (authLoading || !admin) return null;

  const Card = ({ appt }: { appt: AdminAppointment }) => {
    const patient = patients.get(appt.patientId);
    const status = STATUS_LABELS[appt.status] ?? STATUS_LABELS.pending!;
    return (
      <div className="bg-card border border-card-border rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm sm:text-base truncate">
              {appt.patientName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" /> {appt.serviceType} · {appt.duration} min
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 border ${status.cls}`}
          >
            {status.label}
          </span>
        </div>

        {patient && (
          <div className="text-xs text-muted-foreground mb-3 grid sm:grid-cols-2 gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 min-w-0 truncate">
              <Mail className="w-3 h-3 shrink-0" /> {patient.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0" /> {patient.phone}
            </span>
          </div>
        )}

        {(appt.preferredDate || appt.preferredTimeOfDay) && appt.status === "pending" && (
          <div className="text-xs text-muted-foreground mb-3 flex flex-wrap gap-x-4 gap-y-1">
            {appt.preferredDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Prefers {appt.preferredDate}
              </span>
            )}
            {appt.preferredTimeOfDay && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> {appt.preferredTimeOfDay}
              </span>
            )}
          </div>
        )}

        {appt.reason && (
          <div className="text-xs text-foreground mb-3 bg-muted rounded-lg p-2.5 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Patient note
            </p>
            <p className="text-xs leading-relaxed">{appt.reason}</p>
          </div>
        )}

        {appt.sessionDate && (
          <div className="text-xs text-foreground mb-3 flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3 h-3 text-primary" />
              Scheduled: {appt.sessionDate} at {appt.sessionTime}
            </span>
            {appt.physiotherapist && (
              <span className="flex items-center gap-1.5">
                <User className="w-3 h-3" /> {appt.physiotherapist}
              </span>
            )}
          </div>
        )}

        {appt.sessionLink && (
          <a
            href={appt.sessionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline mb-3 inline-flex items-center gap-1.5"
          >
            <Video className="w-3 h-3" /> Session link
          </a>
        )}

        {appt.rejectionReason && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2.5 mb-3">
            <p className="font-semibold mb-0.5">Rejected reason</p>
            <p>{appt.rejectionReason}</p>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground mb-3">
          Requested {formatDateTime(appt.createdAt)}
        </p>

        <div className="flex flex-wrap gap-2">
          {appt.status === "pending" && (
            <>
              <Button size="sm" onClick={() => openApprove(appt)} className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRejectDialog(appt)}
                className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </Button>
            </>
          )}
          {appt.status === "confirmed" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openApprove(appt)}
                className="gap-1.5"
              >
                Edit details
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => markCompleted(appt)}
                className="gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark completed
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-card border-b border-card-border py-5 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                Admin Panel
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Signed in as {admin.name} ({admin.email})
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="shrink-0 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Pending", value: grouped.pending.length, color: "text-yellow-600" },
            { label: "Approved", value: grouped.confirmed.length, color: "text-green-600" },
            { label: "Rejected", value: grouped.rejected.length, color: "text-red-600" },
            { label: "Completed", value: grouped.completed.length, color: "text-primary" },
            { label: "Total Patients", value: patients.size, color: "text-foreground" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-5"
            >
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full mb-6 h-auto flex flex-wrap gap-1 bg-muted p-1.5 rounded-xl">
            <TabsTrigger value="pending" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <Inbox className="w-3.5 h-3.5" /> Pending
              {grouped.pending.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {grouped.pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Rejected
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              Completed
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex-1 text-xs sm:text-sm py-2 gap-1.5">
              <User className="w-3.5 h-3.5" /> Patients
            </TabsTrigger>
          </TabsList>

          {(["pending", "confirmed", "rejected", "completed"] as const).map((key) => (
            <TabsContent key={key} value={key}>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : grouped[key].length === 0 ? (
                <div className="bg-card border border-card-border rounded-xl p-10 text-center">
                  <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No {STATUS_LABELS[key]?.label.toLowerCase()} appointments.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
                  {grouped[key].map((a) => (
                    <Card key={a.id} appt={a} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}

          <TabsContent value="patients">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : patients.size === 0 ? (
              <div className="bg-card border border-card-border rounded-xl p-10 text-center">
                <User className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No patients registered yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {[...patients.values()].map((p) => (
                  <div
                    key={p.id}
                    className="bg-card border border-card-border rounded-xl p-4"
                  >
                    <p className="font-semibold text-foreground text-sm">
                      {p.name}{" "}
                      <span className="text-muted-foreground font-mono text-xs">
                        PT-{String(p.id).padStart(5, "0")}
                      </span>
                    </p>
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> {p.email}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {p.phone}
                      </p>
                      {(p.age || p.gender || p.occupation) && (
                        <p>
                          {[
                            p.gender,
                            p.age ? `${p.age} yrs` : null,
                            p.occupation,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {p.fees && <p>Fee: {p.fees}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Approve dialog */}
      <Dialog open={!!approveDialog} onOpenChange={(o) => !o && setApproveDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve appointment</DialogTitle>
            <DialogDescription>
              Set the confirmed date, time, and any session details.
            </DialogDescription>
          </DialogHeader>
          {approveDialog && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p className="font-semibold text-foreground">{approveDialog.patientName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {approveDialog.serviceType} · {approveDialog.duration} min
                </p>
                {(approveDialog.preferredDate || approveDialog.preferredTimeOfDay) && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Patient prefers:{" "}
                    {[approveDialog.preferredDate, approveDialog.preferredTimeOfDay]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Session date *</Label>
                  <Input
                    type="date"
                    value={approveForm.sessionDate}
                    onChange={(e) =>
                      setApproveForm((f) => ({ ...f, sessionDate: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Session time *</Label>
                  <Input
                    type="time"
                    value={approveForm.sessionTime}
                    onChange={(e) =>
                      setApproveForm((f) => ({ ...f, sessionTime: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">Physiotherapist</Label>
                <Input
                  placeholder="e.g. Dr. Supreet Bindra"
                  value={approveForm.physiotherapist}
                  onChange={(e) =>
                    setApproveForm((f) => ({ ...f, physiotherapist: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Video session link (optional)
                </Label>
                <Input
                  type="url"
                  placeholder="https://meet.example.com/..."
                  value={approveForm.sessionLink}
                  onChange={(e) =>
                    setApproveForm((f) => ({ ...f, sessionLink: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Notes for patient (optional)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="Anything the patient should know before the session..."
                  value={approveForm.notes}
                  onChange={(e) =>
                    setApproveForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialog(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={submitApprove} disabled={submitting}>
              {submitting ? "Approving..." : "Approve & schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={(o) => !o && setRejectDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject appointment</DialogTitle>
            <DialogDescription>
              Optionally tell the patient why their request can&apos;t be accommodated.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Reason (optional)</Label>
            <Textarea
              rows={4}
              placeholder="e.g. The requested time slot is unavailable. Please request another date."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialog(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitReject}
              disabled={submitting}
            >
              {submitting ? "Rejecting..." : "Reject request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
