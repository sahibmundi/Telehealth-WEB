import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, appointmentsTable } from "@workspace/db";
import {
  ListAppointmentsQueryParams,
  CreateAppointmentBody,
  GetAppointmentParams,
  UpdateAppointmentParams,
  UpdateAppointmentBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/appointments/summary", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      status: appointmentsTable.status,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(appointmentsTable)
    .groupBy(appointmentsTable.status);

  const summary = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  for (const row of rows) {
    summary.total += row.count;
    if (row.status === "pending") summary.pending = row.count;
    else if (row.status === "confirmed") summary.confirmed = row.count;
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
      .where(eq(appointmentsTable.patientId, query.data.patientId));
  } else {
    rows = await db.select().from(appointmentsTable);
  }

  res.json(rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  })));
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
      sessionDate: parsed.data.sessionDate,
      sessionTime: parsed.data.sessionTime,
      duration: parsed.data.duration,
      physiotherapist: parsed.data.physiotherapist ?? null,
      notes: parsed.data.notes ?? null,
      status: "pending",
    })
    .returning();

  res.status(201).json({ ...appointment, createdAt: appointment.createdAt.toISOString() });
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

  res.json({ ...appointment, createdAt: appointment.createdAt.toISOString() });
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

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status != null) updateData.status = parsed.data.status;
  if (parsed.data.sessionLink !== undefined) updateData.sessionLink = parsed.data.sessionLink;
  if (parsed.data.physiotherapist !== undefined) updateData.physiotherapist = parsed.data.physiotherapist;
  if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;

  const [appointment] = await db
    .update(appointmentsTable)
    .set(updateData)
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();

  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json({ ...appointment, createdAt: appointment.createdAt.toISOString() });
});

export default router;
