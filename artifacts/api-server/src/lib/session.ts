import { createHmac, randomBytes } from "node:crypto";

const SECRET =
  process.env["SESSION_SECRET"] ||
  process.env["DATABASE_URL"] ||
  randomBytes(32).toString("hex");

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString();
}

function sign(payload: string): string {
  return base64url(createHmac("sha256", SECRET).update(payload).digest());
}

export interface SessionPayload {
  patientId: number;
  iat: number;
}

export interface AdminSessionPayload {
  admin: true;
  email: string;
  iat: number;
}

export function signSession(patientId: number): string {
  const payload: SessionPayload = {
    patientId,
    iat: Math.floor(Date.now() / 1000),
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifySession(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;
  if (sign(encoded) !== signature) return null;
  try {
    const decoded = JSON.parse(fromBase64url(encoded));
    if (typeof decoded?.patientId !== "number") return null;
    return decoded as SessionPayload;
  } catch {
    return null;
  }
}

export function signAdminSession(email: string): string {
  const payload: AdminSessionPayload = {
    admin: true,
    email,
    iat: Math.floor(Date.now() / 1000),
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAdminSession(token: string): AdminSessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  if (!encoded || !signature) return null;
  if (sign(encoded) !== signature) return null;
  try {
    const decoded = JSON.parse(fromBase64url(encoded));
    if (decoded?.admin !== true || typeof decoded?.email !== "string") return null;
    return decoded as AdminSessionPayload;
  } catch {
    return null;
  }
}

export function readBearer(header: string | undefined): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1]!.trim() : null;
}
