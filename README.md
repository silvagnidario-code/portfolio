# Portfolio — creative agency

Next.js 15 (App Router) + Payload 3 in a single codebase. PostgreSQL for data,
S3-compatible object storage for media, three content locales (`it`, `en`, `zh`).

The full specification lives in [`docs/portfolio-agenzia-specifica-e-prompt.md`](docs/portfolio-agenzia-specifica-e-prompt.md).

## Requirements

- Node 20+ (the repo is developed on 24, see `.nvmrc`)
- Docker with Compose (PostgreSQL + MinIO for local development)

## Local setup

```bash
cp .env.example .env
# fill PAYLOAD_SECRET, e.g. openssl rand -hex 32

npm install
npm run services:up      # postgres on :5433, minio on :9000 (console :9001)
npm run dev              # http://localhost:3000
```

Open `http://localhost:3000/admin` and create the first user. In development the
database schema is pushed automatically; everywhere else it is applied through
the migrations in `src/migrations`.

Uploads go to the MinIO bucket, never to the app filesystem — the same code path
production uses against Cloudflare R2.

## Scripts

| Script                                  | Purpose                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                           | development server                                                           |
| `npm run build` / `npm run start`       | production build and server                                                  |
| `npm run typecheck`                     | `tsc --noEmit`                                                               |
| `npm run lint` / `npm run format`       | ESLint / Prettier                                                            |
| `npm run generate:types`                | regenerate `src/payload-types.ts` after schema changes                       |
| `npm run generate:importmap`            | regenerate the admin import map after adding custom components               |
| `npm run migrate:create -- <name>`      | create a migration (run with `NODE_ENV=production` so schema push stays off) |
| `npm run migrate`                       | apply pending migrations                                                     |
| `npm run services:up` / `services:down` | start/stop Postgres and MinIO                                                |

## Docker

```bash
docker compose --profile full up --build   # app + postgres + minio
```

The `Dockerfile` produces a standalone Next server and is deployable to any VPS;
the project also runs on Vercel unchanged.

## Structure

```
messages/            UI translations (it, en, zh)
src/
  access/            reusable Payload access-control functions
  app/(frontend)/    public site, all routes under /[locale]
  app/(payload)/     admin panel and Payload REST/GraphQL API (generated)
  collections/       Payload collections
  i18n/              locale routing, navigation helpers, request config
  lib/env.ts         environment validation, parsed once at boot
  migrations/        versioned database migrations
  payload.config.ts
  middleware.ts      locale detection and prefixing
```

## Conventions

- TypeScript strict, no `any` (enforced by ESLint).
- No hardcoded user-facing strings: everything comes from `messages/` or the CMS.
- Navigation imports come from `@/i18n/navigation`, never from `next/link`.
- `/admin` and `/api` are excluded from the i18n middleware on purpose.
