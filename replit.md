# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run build` — rebuild backend (then restart `Backend API` workflow)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts & Workflows

- `artifacts/telephysiotherapy` — React + Vite + Tailwind + shadcn (wouter routing). Served by the **Start application** workflow on port 5000. Vite proxies `/api` → `http://localhost:8080`.
- `artifacts/api-server` — Express 5 API. Served by the **Backend API** workflow on port 8080. After backend code changes, run the build command above and restart the workflow.
- `artifacts/mockup-sandbox` — UI mockup sandbox (not in active use).

## Authentication

Patient login/signup uses an HMAC-signed bearer token (custom, no JWT lib).

- Endpoints: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` (defined in `lib/api-spec/openapi.yaml` and implemented in `artifacts/api-server/src/routes/auth.ts`).
- Token signing helpers live in `artifacts/api-server/src/lib/session.ts`. The signing secret is read from `SESSION_SECRET`, falling back to `DATABASE_URL` if unset.
- Passwords are hashed with `bcryptjs` and stored on `patients.password_hash` (see `lib/db/src/schema/patients.ts`).
- Frontend state lives in `artifacts/telephysiotherapy/src/hooks/use-auth.tsx` (`AuthProvider` + `useAuth`). The token is kept in `localStorage` under `auth_token`; the provider also mirrors `patientId` and `patientName` for legacy pages.
- Pages: `/login`, `/register`, `/dashboard`, `/book`. Booking is gated behind login.

## Appointment request flow

Patients **request** appointments — they don't pick a fixed date/time themselves. The admin reviews each request and either approves it (with a confirmed date, time, and video link) or rejects it (with an optional reason).

- DB columns on `appointments` (see `lib/db/src/schema/appointments.ts`): `session_date` and `session_time` are nullable until approved. `preferred_date`, `preferred_time_of_day`, `reason`, and `rejection_reason` are new optional fields.
- Status enum: `pending` → `confirmed` (approved) | `rejected` → optionally `completed`/`cancelled`. The dashboard displays "confirmed" as **Approved**.
- `POST /api/appointments` always creates a `pending` request — it ignores any client-supplied date/time.
- `PATCH /api/appointments/{id}` requires an admin bearer token if it touches any of: `status`, `sessionLink`, `physiotherapist`, `sessionDate`, `sessionTime`, `rejectionReason`, `notes`.
- Patient pages `/book` (multi-step) and `/dashboard` (sidebar form) submit a request with optional `preferredDate`, `preferredTimeOfDay`, `reason`. The dashboard shows the approved schedule + video link or a rejection reason once the admin acts.

## Admin panel

- Endpoints: `POST /api/admin/login`, `GET /api/admin/me` (in `artifacts/api-server/src/routes/admin.ts`).
- Auth uses an HMAC-signed admin token (separate from patient sessions). Helpers `signAdminSession` / `verifyAdminSession` live in `artifacts/api-server/src/lib/session.ts`.
- Admin credentials come from env: `ADMIN_EMAIL` (default `admin@telephysio.com`), `ADMIN_PASSWORD` (default `admin123`), `ADMIN_NAME` (default `TelePhysio Admin`). Override via secrets in production.
- Frontend: `/admin/login` and `/admin` pages. Token is stored in `localStorage` under `admin_token` and managed by `AdminAuthProvider` / `useAdminAuth` (`src/hooks/use-admin-auth.tsx`). A small **Staff Login** link sits in the site footer.
- The admin dashboard tabs Pending / Approved / Rejected / Completed appointment requests, plus a Patients tab. Approve and Reject open dialogs that PATCH the appointment with the admin token.
