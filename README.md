# CollegeFind — College Discovery Platform

Full-stack MVP for a college discovery and comparison platform (Track A, Full Stack Engineer).

## Features

- **College Listing + Search** — filterable, sortable, paginated (infinite scroll) list backed by the database
- **College Detail Page** — overview, courses, placement history (multi-year), reviews
- **Compare Colleges** — side-by-side comparison of 2–3 colleges on fees, placements, rating, location; save comparisons
- **Authentication + Saved Items** — email/password auth (NextAuth, JWT sessions), save colleges and comparisons

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma 7 · PostgreSQL · NextAuth v5 (Credentials) · Zod

## Architecture notes

- All data is DB-backed — no hardcoded frontend data. `lib/colleges.ts` holds the shared query logic used by both the `/api/colleges` REST endpoint and the server-rendered `/colleges` page, so search/filter/sort/pagination behavior is identical whether hit via API or SSR.
- Auth uses NextAuth Credentials provider with JWT sessions (no OAuth, so no Prisma adapter needed — passwords are hashed with bcrypt and checked directly against the `User` table).
- Route protection for `/account/*` is handled in `proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`).
- Prisma 7 requires a driver adapter (`@prisma/adapter-pg`) instead of a bare connection string in `PrismaClient` — see `lib/db.ts`.
- All API input is validated with Zod (`lib/validation.ts`) — invalid queries/bodies return 400 with field-level errors; unauthenticated writes return 401.

## Local setup

```bash
npm install
npx prisma dev -d          # starts a local Postgres instance and prints a DATABASE_URL
# put that DATABASE_URL, plus NEXTAUTH_SECRET and NEXTAUTH_URL, into .env (see .env.example)
npx prisma migrate dev
npm run db:seed            # seeds ~180 colleges with courses, placements, reviews
npm run dev
```

Demo login after seeding: `demo@example.com` / `password123`

## Deployment

- **App**: Vercel
- **Database**: Neon (Postgres)

Set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` (your production URL) as environment variables on Vercel, then run `npx prisma migrate deploy` and `npm run db:seed` against the Neon database before/at first deploy.
