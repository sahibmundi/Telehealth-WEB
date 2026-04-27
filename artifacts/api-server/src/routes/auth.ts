import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, patientsTable } from "@workspace/db";
import { AuthSignupBody, AuthLoginBody } from "@workspace/api-zod";
import { signSession, verifySession, readBearer } from "../lib/session";

const router: IRouter = Router();

function serializePatient(p: typeof patientsTable.$inferSelect) {
  const { passwordHash: _ignored, ...rest } = p;
  return { ...rest, createdAt: p.createdAt.toISOString() };
}

router.post("/auth/signup", async (req, res): Promise<void> => {
  const parsed = AuthSignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();

  const [existing] = await db
    .select({ id: patientsTable.id })
    .from(patientsTable)
    .where(eq(patientsTable.email, email));

  if (existing) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const [patient] = await db
    .insert(patientsTable)
    .values({
      name: parsed.data.name.trim(),
      email,
      phone: parsed.data.phone.trim(),
      age: parsed.data.age ?? null,
      gender: parsed.data.gender ?? null,
      occupation: parsed.data.occupation ?? null,
      fees: parsed.data.fees ?? null,
      consentGiven: parsed.data.consentGiven,
      passwordHash,
    })
    .returning();

  if (!patient) {
    res.status(500).json({ error: "Could not create account." });
    return;
  }

  const token = signSession(patient.id);
  res.status(201).json({ token, patient: serializePatient(patient) });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AuthLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();

  const [patient] = await db
    .select()
    .from(patientsTable)
    .where(eq(patientsTable.email, email));

  if (!patient || !patient.passwordHash) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const ok = await bcrypt.compare(parsed.data.password, patient.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = signSession(patient.id);
  res.status(200).json({ token, patient: serializePatient(patient) });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const token = readBearer(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const session = verifySession(token);
  if (!session) {
    res.status(401).json({ error: "Invalid session." });
    return;
  }

  const [patient] = await db
    .select()
    .from(patientsTable)
    .where(eq(patientsTable.id, session.patientId));

  if (!patient) {
    res.status(401).json({ error: "Account not found." });
    return;
  }

  res.json(serializePatient(patient));
});

export default router;
