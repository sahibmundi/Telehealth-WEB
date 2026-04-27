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
