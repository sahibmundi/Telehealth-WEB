import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, patientsTable, assessmentsTable, exercisesTable, progressTable } from "@workspace/db";
import {
  CreatePatientBody,
  GetPatientParams,
  UpdatePatientParams,
  UpdatePatientBody,
  GetPatientAssessmentsParams,
  CreateAssessmentParams,
  CreateAssessmentBody,
  GetPatientExercisesParams,
  GetPatientProgressParams,
  CreateProgressEntryParams,
  CreateProgressEntryBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/patients", async (_req, res): Promise<void> => {
  const patients = await db.select().from(patientsTable);
  res.json(patients.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  })));
});

router.post("/patients", async (req, res): Promise<void> => {
  const parsed = CreatePatientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [patient] = await db
    .insert(patientsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      age: parsed.data.age ?? null,
      gender: parsed.data.gender ?? null,
      chiefComplaint: parsed.data.chiefComplaint ?? null,
      medicalHistory: parsed.data.medicalHistory ?? null,
      painIntensity: parsed.data.painIntensity ?? null,
      consentGiven: parsed.data.consentGiven,
    })
    .returning();

  res.status(201).json({ ...patient, createdAt: patient.createdAt.toISOString() });
});

router.get("/patients/:id", async (req, res): Promise<void> => {
  const params = GetPatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [patient] = await db
    .select()
    .from(patientsTable)
    .where(eq(patientsTable.id, params.data.id));

  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  res.json({ ...patient, createdAt: patient.createdAt.toISOString() });
});

router.patch("/patients/:id", async (req, res): Promise<void> => {
  const params = UpdatePatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePatientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name != null) updateData.name = parsed.data.name;
  if (parsed.data.phone != null) updateData.phone = parsed.data.phone;
  if (parsed.data.age !== undefined) updateData.age = parsed.data.age;
  if (parsed.data.gender !== undefined) updateData.gender = parsed.data.gender;
  if (parsed.data.chiefComplaint !== undefined) updateData.chiefComplaint = parsed.data.chiefComplaint;
  if (parsed.data.medicalHistory !== undefined) updateData.medicalHistory = parsed.data.medicalHistory;
  if (parsed.data.painIntensity !== undefined) updateData.painIntensity = parsed.data.painIntensity;

  const [patient] = await db
    .update(patientsTable)
    .set(updateData)
    .where(eq(patientsTable.id, params.data.id))
    .returning();

  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  res.json({ ...patient, createdAt: patient.createdAt.toISOString() });
});

router.get("/patients/:id/assessments", async (req, res): Promise<void> => {
  const params = GetPatientAssessmentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const assessments = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.patientId, params.data.id));

  res.json(assessments.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  })));
});

router.post("/patients/:id/assessments", async (req, res): Promise<void> => {
  const params = CreateAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [assessment] = await db
    .insert(assessmentsTable)
    .values({
      patientId: params.data.id,
      chiefComplaint: parsed.data.chiefComplaint,
      history: parsed.data.history ?? null,
      bodyChart: parsed.data.bodyChart ?? null,
      painIntensity: parsed.data.painIntensity,
      outcomeMeasures: parsed.data.outcomeMeasures ?? null,
      posturalNotes: parsed.data.posturalNotes ?? null,
    })
    .returning();

  res.status(201).json({ ...assessment, createdAt: assessment.createdAt.toISOString() });
});

router.get("/patients/:id/exercises", async (req, res): Promise<void> => {
  const params = GetPatientExercisesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.patientId, params.data.id));

  res.json(exercises.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  })));
});

router.get("/patients/:id/progress", async (req, res): Promise<void> => {
  const params = GetPatientProgressParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const entries = await db
    .select()
    .from(progressTable)
    .where(eq(progressTable.patientId, params.data.id));

  res.json(entries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  })));
});

router.post("/patients/:id/progress", async (req, res): Promise<void> => {
  const params = CreateProgressEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateProgressEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db
    .insert(progressTable)
    .values({
      patientId: params.data.id,
      date: parsed.data.date,
      painIntensity: parsed.data.painIntensity,
      notes: parsed.data.notes ?? null,
      exercisesCompleted: parsed.data.exercisesCompleted,
    })
    .returning();

  res.status(201).json({ ...entry, createdAt: entry.createdAt.toISOString() });
});

export default router;
