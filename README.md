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

## Layout

The sticky navbar is one `GlassSurface` floating over the content, with the menu
read from the `navigation` global and the language and theme switchers sitting
_on_ that surface rather than carrying their own — nesting glass inside glass
doubles the most expensive property in the stylesheet and reads as a smudge.
The footer is content, so it is opaque, flat and square-cornered.

Every page starts with a skip link, and the page transition wrapper carries the
`#main` target so the link moves focus, not just the scroll position.
Transitions are a slow dissolve with a short translation, flattened site-wide by
the `prefers-reduced-motion` rule. Only the incoming half is animated; the
outgoing half needs the router hook that arrives with the animation system in
phase 8.

**The frontend renders per request.** The layout reads its menu, footer and
settings from the CMS, so prerendering at build time would require a database
inside the build — the container image has none, and a menu that is editable
should not need a redeploy to change. Phase 9 adds cached reads with tag-based
revalidation on publish, which makes the pages static again, refreshed by an
edit rather than by a build.

## Motion

Everything that moves is mounted once by `MotionRuntime` and reads the same two
preferences from one place: `prefers-reduced-motion` and `pointer: coarse`.

**The switch is the load, not a flag.** GSAP, Lenis and OGL are imported
dynamically inside the effects that need them, so a reader who asked for reduced
motion downloads none of the three — verified, not assumed. They stay out of the
shared bundle entirely.

- **Smooth scroll** — Lenis on GSAP's ticker, with `ScrollTrigger.update` on
  every Lenis frame. Not `scrollerProxy`: that exists to teach ScrollTrigger
  about a _different_ scroller, and Lenis here drives the window, which
  ScrollTrigger already measures. What matters is one clock, which is what is
  wired.
- **Scroll reveal** — one pattern, driven by the `data-animate` attribute
  `BlockSection` already emits. Nothing is hidden in the markup: the hidden
  state is set from JavaScript, so a page without scripting is a page that
  reads.
- **Magnetic cursor** — a glass disc following by interpolation, snapping to
  `data-magnetic` elements inside 80px and leaning them back by at most 8px. It
  hides the system cursor only once it is running, and disables itself entirely
  on touch and under reduced motion.
- **WebGL** — a distortion canvas laid over the real `next/image`, mounted on
  first intersection and only where a pointer, a WebGL context and a motion
  preference all allow it. The picture underneath is the fallback.
- **Counters, marquee, drag** — the behaviours the blocks were already marked
  for. The first two stop under reduced motion; dragging does not, because it is
  an input rather than an animation.

The easing token is parsed into a GSAP `CustomEase` rather than approximated
with a named ease, so the CSS transitions and the scripted animations move
identically.

## Pages

| Route                                                            | Source                                             |
| ---------------------------------------------------------------- | -------------------------------------------------- |
| `/[locale]` · `/services` · `/about` · `/legal/{privacy,cookie}` | `pages` documents, composed from the block library |
| `/[locale]/work`                                                 | project index with filters                         |
| `/[locale]/work/[slug]`                                          | case study, built from the project's own fields    |
| `/[locale]/contact`                                              | brief form                                         |

**Work filters** are links, not buttons: filtering runs on the server through
the query string, so the index works without JavaScript, every state has a URL,
and Back leaves a filter. The specification calls the pills glass — they sit in
_one_ glass tray rather than one surface each, because eight surfaces would blow
the budget of four on their own.

**The case study** is deliberately not composed from blocks: the narrative order
(context, challenge, approach, execution, results) is the argument the page
makes and should not be re-orderable per document. It may tint itself with the
project's `accentColor`, but only where that colour holds 4.5:1 against the
background — `resolveProjectAccent` checks each theme separately and substitutes
the brand accent where it fails, so an editorial choice can never produce
unreadable link text.

Case-study slugs are localized, so those pages declare their translations as
`hreflang` links; the language switcher reads that same declaration back from
the document rather than duplicating the map through a second channel.

**The brief form** (§11) validates with Zod on the server, keeps a honeypot and
a per-IP rate limit, persists nothing, and confirms inline instead of
redirecting. The honeypot is checked _before_ validation and answers with the
same success a person gets: a bot told which field it tripped simply stops
filling it. Without `RESEND_API_KEY` the action reports the failure in
production and logs the brief in development, rather than pretending it was
sent.

## Block engine

`RenderBlocks` maps a `layout` array to components and resolves the three common
properties in one place: `BlockSection` sets the background, the vertical rhythm
and the `data-animate` flag every block exposes. A block type without a renderer
leaves a hole rather than crashing the page.

A section on the `sumi` background adopts the **opposite palette wholesale** —
every role inside it, not just the background and the main foreground — so muted
text, borders and the accent keep the contrast they were verified with. An
`accent` section collapses every foreground role onto `--accent-fg`, the one
colour checked against it.

**`/[locale]/blocks` is the catalogue**: all eleven blocks in all twenty-nine
variants, filled with real CMS content. It cycles the `variant` field on the
_same_ block object rather than building a fixture per variant, so it is a proof
that switching variant costs neither copy nor translations, not a mock-up.

Blocks that need scroll interaction (`draggableRow`, the testimonial slider, the
client marquee, the animated counters) render as scroll-snap tracks and final
values: they work with a finger, a trackpad and a keyboard before any script
runs, and that is also what a reader with `prefers-reduced-motion` keeps. Phase
8 enhances them.

## Content model

Nine collections and four globals, all editorial text localized field by field
(`it`, `en`, `zh`) with the default locale as fallback.

| Collection                                  | What it holds                                                              |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| `projects`                                  | Case studies — the central model: identity, media, narrative, credits, SEO |
| `pages`                                     | Free pages composed from the block library (`home`, `services`, `about`)   |
| `services` · `industries`                   | Taxonomy behind the work-index filters                                     |
| `team-members` · `testimonials` · `clients` | Supporting content                                                         |
| `media`                                     | Uploads on S3/R2, localized `alt`, focal point, four generated sizes       |
| `users`                                     | Auth, `admin` / `editor`                                                   |

Globals: `settings`, `navigation`, `footer`, `seo-defaults`.

**Blocks.** `src/blocks` holds the eleven-block library of the specification.
Every block carries the same `settings` group (background, spacing, animate) and
a `variant` select — the variant is a _field_, never a separate block type, so
changing how a section looks can never cost its content or its translations.
The renderer arrives in phase 6.

**Drafts and preview.** `projects` and `pages` keep versions with autosave. The
public API only ever returns published documents, enforced by an access query
rather than a filter. The admin panel previews through `/next/preview`, which
checks the shared secret _and_ the editor's session before enabling Next draft
mode; it refuses absolute URLs so a signed link cannot become an open redirect.

**Arrays and blocks are not localized**, only the fields inside them: the
structure is shared across languages and each field carries one value per
locale. Writing a translation therefore has to send existing row ids — see
`withRowIds` in the seed — otherwise Payload treats the rows as new and silently
drops the language written first.

## Seed

```bash
npm run seed
```

Three case studies, five services, four people, eight clients, three composed
pages and every global, in all three languages. Destructive: it clears the
content collections first, and never touches users.

The copy has realistic lengths on purpose — italian runs long, english ~8%
shorter, chinese ~65% shorter in this dataset. That gap is what breaks a layout
built on vertical rhythm, and lorem ipsum would hide it. Imagery is generated
from the palette with sharp rather than downloaded, so the uploads are real
files with real dimensions.

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

### Glass

`GlassSurface` is the only implementation of the translucent interface layer,
and the only component allowed to use the `.glass` classes. It carries the four
layers of the material — backdrop blur, adaptive fill, specular edge,
refraction — with variants for navbar, pill, chrome and cursor. Content blocks
stay opaque and flat: content is paper, the interface is shoji.

Two constraints are enforced rather than documented:

- **Fill opacity.** Text on glass sits on the fill composited over whatever
  scrolls underneath, so `src/tokens/glass.ts` computes the minimum opacity at
  which `fg-primary` still holds 4.5:1 over pure white and pure black, and the
  token generator throws rather than emit anything more transparent. The dark
  theme needs 0.63 by that measure, above the 45–55% the specification suggests;
  the accessibility rule wins.
- **Cost.** `GlassBudgetProvider` counts live surfaces and logs an error past
  four, the cap the specification sets for `backdrop-filter`.

The refraction filter is applied to the cursor only, and drops out under
`pointer: coarse` and `prefers-reduced-motion`. The blur radius is never
animated: only `opacity` and `transform` are declared transitionable on glass.

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
