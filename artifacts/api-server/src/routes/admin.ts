import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import { signAdminSession, verifyAdminSession, readBearer } from "../lib/session";

const ADMIN_EMAIL = (process.env["ADMIN_EMAIL"] || "admin@telephysio.com")
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "admin123";
const ADMIN_NAME = process.env["ADMIN_NAME"] || "TelePhysio Admin";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  if (email !== ADMIN_EMAIL || parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid admin credentials." });
    return;
  }

  const token = signAdminSession(email);
  res.status(200).json({
    token,
    admin: { email: ADMIN_EMAIL, name: ADMIN_NAME },
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const token = readBearer(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const session = verifyAdminSession(token);
  if (!session) {
    res.status(401).json({ error: "Invalid admin session." });
    return;
  }

  res.json({ email: session.email, name: ADMIN_NAME });
});

export function requireAdmin(req: import("express").Request): boolean {
  const token = readBearer(req.headers.authorization);
  if (!token) return false;
  return !!verifyAdminSession(token);
}

export default router;
