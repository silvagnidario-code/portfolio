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

| Script                                  | Purpose                                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`                           | development server                                                                |
| `npm run build` / `npm run start`       | production build and server                                                       |
| `npm run typecheck`                     | `tsc --noEmit`                                                                    |
| `npm run lint` / `npm run format`       | ESLint / Prettier                                                                 |
| `npm run generate:types`                | regenerate `src/payload-types.ts` after schema changes                            |
| `npm run generate:importmap`            | regenerate the admin import map after adding custom components                    |
| `npm run migrate:create -- <name>`      | create a migration (run with `NODE_ENV=production` so schema push stays off)      |
| `npm run migrate`                       | apply pending migrations                                                          |
| `npm run services:up` / `services:down` | start/stop Postgres and MinIO                                                     |
| `npm run tokens`                        | regenerate the design-system CSS from `src/tokens/*` (runs before dev/build)      |
| `npm run fonts`                         | self-host the Google faces and write the preload manifest (runs before dev/build) |

## Docker

```bash
docker compose --profile full up --build   # app + postgres + minio
```

The `Dockerfile` produces a standalone Next server and is deployable to any VPS;
the project also runs on Vercel unchanged.

## Design system

Three levels, one direction. Nothing skips a level.

1. **Primitives** — `src/tokens/brand.ts`. The only file to touch when the brand
   identity changes: hex values, spacing scale, type scale, motion, radii.
2. **Semantic** — `src/tokens/semantic.ts`. Role names (`--bg-primary`,
   `--fg-muted`, `--accent`…) with one value per theme.
3. **Component** — Tailwind utilities (`bg-surface`, `text-ink-muted`,
   `border-line`), mapped from the semantic roles.

`npm run tokens` compiles levels 1 and 2 into `src/styles/*.generated.css`,
including the Tailwind `@theme` block, so the utilities can never drift from the
tokens. Both generated files are committed; never edit them by hand.

**`/[locale]/styleguide` is the control surface for all of it**: every token,
every typographic grade in all three languages, and a WCAG contrast table
computed on both themes from the same values the CSS is generated from.

### Fonts

Zen Kaku Gothic New and Noto Sans SC are self-hosted by `scripts/fetch-fonts.ts`
rather than loaded through `next/font`. `next/font` downloads a family's entire
stylesheet and uses `subsets` only to pick what to preload — for these two
japanese and chinese faces that meant 274 KB of unicode-range rules (90 KB
gzipped) blocking render on every page. The script keeps only the ranges each
family is actually used for, and the chinese face is linked on the `zh` locale
only. Geist Mono stays on `next/font`: it is latin-only and already small.

The slices land in `public/fonts` (gitignored, fetched at build time), so a
build needs network access the first time.

## Structure

```
src/
  access/            reusable Payload access-control functions
  app/(frontend)/    public site, all routes under /[locale]
  app/(payload)/     admin panel and Payload REST/GraphQL API (generated)
  collections/       Payload collections
  components/        theme switching, typography, styleguide sections
  i18n/              locale routing, navigation helpers, request config
  lib/env.ts         environment validation, parsed once at boot
  messages/          UI translations (it, en, zh)
  migrations/        versioned database migrations
  styles/            globals.css + the generated token layers
  tokens/            level 1 and 2 of the design system, plus contrast maths
  payload.config.ts
  middleware.ts      locale detection and prefixing
```

## Conventions

- TypeScript strict, no `any` (enforced by ESLint).
- No hardcoded user-facing strings: everything comes from `messages/` or the CMS.
- Navigation imports come from `@/i18n/navigation`, never from `next/link`.
- No literal colour, space, duration or radius in a component: only tokens.
- Theme has three states — `system` (default), `light`, `dark` — persisted in
  `localStorage` and applied before first paint by an inline script.
- `/admin` and `/api` are excluded from the i18n middleware on purpose.
