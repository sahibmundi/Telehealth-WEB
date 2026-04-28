import { Router, type IRouter } from "express";
import { eq, sql, desc } from "drizzle-orm";
import { db, appointmentsTable, patientsTable } from "@workspace/db";
import {
  ListAppointmentsQueryParams,
  CreateAppointmentBody,
  GetAppointmentParams,
  UpdateAppointmentParams,
  UpdateAppointmentBody,
} from "@workspace/api-zod";
import { requireAdmin } from "./admin";
import {
  notifyAppointmentApproved,
  notifyAppointmentRejected,
} from "../lib/notifications";

const router: IRouter = Router();

function serializeAppointment(r: typeof appointmentsTable.$inferSelect) {
  return { ...r, createdAt: r.createdAt.toISOString() };
}

router.get("/appointments/summary", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      status: appointmentsTable.status,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(appointmentsTable)
    .groupBy(appointmentsTable.status);

  const summary = {
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const row of rows) {
    summary.total += row.count;
    if (row.status === "pending") summary.pending = row.count;
    else if (row.status === "confirmed") summary.confirmed = row.count;
    else if (row.status === "rejected") summary.rejected = row.count;
    else if (row.status === "completed") summary.completed = row.count;
    else if (row.status === "cancelled") summary.cancelled = row.count;
  }
  res.json(summary);
});

router.get("/appointments", async (req, res): Promise<void> => {
  const query = ListAppointmentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows;
  if (query.data.patientId) {
    rows = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.patientId, query.data.patientId))
      .orderBy(desc(appointmentsTable.createdAt));
  } else {
    rows = await db
      .select()
      .from(appointmentsTable)
      .orderBy(desc(appointmentsTable.createdAt));
  }

  res.json(rows.map(serializeAppointment));
});

router.post("/appointments", async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [appointment] = await db
    .insert(appointmentsTable)
    .values({
      patientId: parsed.data.patientId,
      patientName: parsed.data.patientName,
      serviceType: parsed.data.serviceType,
      duration: parsed.data.duration,
      physiotherapist: parsed.data.physiotherapist ?? null,
      notes: parsed.data.notes ?? null,
      preferredDate: parsed.data.preferredDate ?? null,
      reason: parsed.data.reason ?? null,
      sessionMode: parsed.data.sessionMode ?? null,
      sessionDate: null,
      sessionTime: null,
      status: "pending",
    })
    .returning();

  if (!appointment) {
    res.status(500).json({ error: "Could not create appointment." });
    return;
  }

  res.status(201).json(serializeAppointment(appointment));
});

router.get("/appointments/:id", async (req, res): Promise<void> => {
  const params = GetAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [appointment] = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.id, params.data.id));

  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(serializeAppointment(appointment));
});

router.patch("/appointments/:id", async (req, res): Promise<void> => {
  const params = UpdateAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const adminScopedFields = [
    parsed.data.status,
    parsed.data.sessionLink,
    parsed.data.physiotherapist,
    parsed.data.sessionDate,
    parsed.data.sessionTime,
    parsed.data.rejectionReason,
    parsed.data.notes,
  ];
  const touchesAdminFields = adminScopedFields.some((v) => v !== undefined);
  if (touchesAdminFields && !requireAdmin(req)) {
    res.status(401).json({ error: "Admin authentication required." });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status != null) updateData.status = parsed.data.status;
  if (parsed.data.sessionLink !== undefined) updateData.sessionLink = parsed.data.sessionLink;
  if (parsed.data.physiotherapist !== undefined) updateData.physiotherapist = parsed.data.physiotherapist;
  if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;
  if (parsed.data.sessionDate !== undefined) updateData.sessionDate = parsed.data.sessionDate;
  if (parsed.data.sessionTime !== undefined) updateData.sessionTime = parsed.data.sessionTime;
  if (parsed.data.rejectionReason !== undefined) updateData.rejectionReason = parsed.data.rejectionReason;

  const [previous] = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.id, params.data.id));

  const [appointment] = await db
    .update(appointmentsTable)
    .set(updateData)
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();

  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  // Notify patient when admin transitions status to confirmed or rejected.
  const newStatus = appointment.status;
  const statusChanged = previous?.status !== newStatus;
  if (statusChanged && (newStatus === "confirmed" || newStatus === "rejected")) {
    const [patient] = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.id, appointment.patientId));
    if (patient) {
      const notice = {
        patientName: appointment.patientName,
        serviceType: appointment.serviceType,
        sessionMode: appointment.sessionMode,
        sessionDate: appointment.sessionDate,
        sessionTime: appointment.sessionTime,
        sessionLink: appointment.sessionLink,
        physiotherapist: appointment.physiotherapist,
        rejectionReason: appointment.rejectionReason,
        notes: appointment.notes,
      };
      const recipient = {
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
      };
      // Fire-and-forget so the API response isn't blocked by network IO.
      const sender =
        newStatus === "confirmed"
          ? notifyAppointmentApproved(recipient, notice)
          : notifyAppointmentRejected(recipient, notice);
      sender.catch((err) =>
        console.error("[appointments] notification failed:", err),
      );
    }
  }

  res.json(serializeAppointment(appointment));
});

export default router;
