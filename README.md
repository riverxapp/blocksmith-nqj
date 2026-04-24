# Dynamic Boilerplate Source

Production-oriented **Next.js App Router** starter focused on building and iterating a modern landing page from a minimal baseline.

This README is the primary operational reference for current repository behavior.

## Main Focus

This template is intentionally an **absolute starter app** with one homepage.

Primary focus:

- Build a real, modern, high-quality landing page
- Keep the structure simple so teams can iterate quickly
- Grow features over time from this clean foundation

Optional growth path:

- If users want to evolve it into a SaaS app, they can extend it using the existing frontend/tooling foundation and additional libraries
- Planned database direction is **PostgreSQL**

## Current Reality (Do Not Assume Missing Systems)

The repository currently contains:

- Next.js App Router frontend (`app/`)
- Typed content source (`content/content.ts`)
- Shared UI and theme components (`components/`)
- Utility helpers (`lib/`)
- Runtime/infrastructure scripts (`scripts/`)
- Docker + Railway deployment helpers (`Dockerfile`, `railway.json`, `railpack.json`)
- pnpm as primary package manager (`pnpm-lock.yaml`, `packageManager` pin)

The repository currently does **not** contain an active app-level DB/auth backend implementation (no `prisma/`, no app route handlers for auth, no dashboard module tree).

Future-facing DB utilities are intentionally present:

- `scripts/db-init.js`
- `.github/workflows/init-db.yml`

Treat these as placeholders for future PostgreSQL onboarding, not active runtime requirements for the current UI app.

## Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict mode)
- Runtime: Node.js (ESM package mode)
- Package manager: pnpm (`pnpm@10.26.2`)
- UI: React 19 + Tailwind CSS + Radix primitives + shadcn CLI/component workflow
- Theme: `next-themes`
- Build tooling: PostCSS + Tailwind + Next.js compiler
- Container runtime: Docker (`node:22-slim`)

## Quick Start

## 1) Install dependencies

```bash
pnpm install
```

## 2) Run development server

```bash
pnpm run dev
```

## 3) Build for production

```bash
pnpm run build
pnpm run start
```

## 4) Lint

```bash
pnpm run lint
```

Note: first-time lint may prompt for ESLint setup if no ESLint config is committed.

## 5) Manage shadcn components

```bash
# One-time setup (safe to rerun)
pnpm run shadcn:init

# Add a new component primitive
pnpm run shadcn:add button

# Full CLI access for advanced options
pnpm run shadcn -- --help
```

## Directory Guide

```text
.
├── app/
│   ├── layout.tsx                # Root layout + ThemeProvider wiring + metadata
│   ├── page.tsx                  # Home route composition (Navbar + HeroSection + footer)
│   └── globals.css               # Global CSS variables + Tailwind base layers
├── components/
│   ├── Navbar.tsx                # Brand header (content-driven)
│   ├── HeroSection.tsx           # Main hero block (content-driven)
│   ├── theme/
│   │   ├── theme-provider.tsx    # next-themes provider wrapper
│   │   └── theme-toggle.tsx      # Theme toggle client component
│   └── ui/                       # Shared Radix/shadcn-style primitives
├── content/
│   └── content.ts                # Typed content schema + default copy + getContent()
├── lib/
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── scripts/
│   ├── commandRunner.js          # Serialized command execution helper with timeout/lock
│   ├── db-init.js                # Future DB migration bootstrap utility
│   ├── dev-supervisor.js         # Runtime supervisor (next + warmup + git bootstrap/poll)
│   ├── error-reporter.ts         # Browser error reporter helper
│   ├── generate-section.mjs      # Section scaffolding script
│   ├── git-poll.js               # Poll-based git sync helper
│   └── setup-env.mjs             # Creates .env.local scaffold
├── .github/workflows/
│   └── init-db.yml               # Manual DB init workflow (future DB use)
├── Dockerfile                    # Container build/runtime definition
├── railway.json                  # Railway start command
├── railpack.json                 # Railpack cache/install config
├── package.json                  # Scripts + deps + package manager pin
├── pnpm-lock.yaml                # Primary lockfile
└── README.md
```

## Content-First Editing Contract

User-visible text should be edited in `content/content.ts` first.

Current content model:

- `SiteContent`
  - `hero: HeroContent`
  - `navbar: NavbarContent`

Consumption pattern:

- Components call `getContent()` and render typed fields.

When adding a new home section:

1. Extend content types/defaults in `content/content.ts`
2. Add `components/<Name>Section.tsx`
3. Compose it in `app/page.tsx`

## Server/Client Boundary Rules

- `app/*` files are Server Components by default.
- Add `"use client"` only for browser APIs, hooks, or event-driven interactivity.
- Keep secret/env-dependent logic server-side.
- Do not mix server-only logic into client components.

## Scripts Contract

## package scripts for shadcn

- `pnpm run shadcn`: runs the shadcn CLI through pnpm dlx.
- `pnpm run shadcn:init`: runs non-interactive shadcn initialization (`init -y`) against `components.json`.
- `pnpm run shadcn:add <component>`: scaffolds shadcn UI primitives into `components/ui`.

## `scripts/dev-supervisor.js`

Main runtime process in Docker/Railway setup.

Behavior summary:

- Starts Next.js (`dev --turbo` by default; `start` when `NEXT_DEV=false`)
- Optional repo bootstrap when `.git` is missing and `REPO_URL` is provided
- Optional git polling process (`GIT_POLL=true` default)
- Warmup probe against configurable `HEALTHCHECK_PATH` (default `/`)

Environment knobs:

- `PORT` (default `3000`)
- `NEXT_DEV` (default `true`)
- `GIT_BOOTSTRAP` (default `Boolean(REPO_URL)`)
- `GIT_POLL` (default `true`)
- `PREVIEW_BRANCH` (default `main`)
- `REPO_URL` (optional)
- `HEALTHCHECK_PATH` (default `/`)

## `scripts/git-poll.js`

- Polls `origin/<branch>` and pulls updates when SHA changes
- Disables itself on auth failures
- Stops if `.git` is absent

## `scripts/commandRunner.js`

- Executes one command at a time (lock)
- Adds timeout + SIGTERM/SIGKILL escalation
- Normalizes plain `npm <script>` calls into `npm run <script>` where needed

## `scripts/db-init.js` (Future DB use)

- Expects `DATABASE_URL`
- Validates Drizzle migration journal consistency
- Runs drizzle migrations with retries
- Intended for future DB-enabled deployments and manual workflow execution

## `scripts/setup-env.mjs`

- Creates `.env.local` if missing
- Adds starter placeholder keys only

## `scripts/generate-section.mjs`

- Scaffolds `components/<SectionName>Section.tsx`
- Prints required follow-up steps for content + page composition

## Deployment

## Docker

Build and run locally:

```bash
docker build -t dynamic-boilerplate-source .
docker run --rm -p 3000:3000 dynamic-boilerplate-source
```

Dockerfile behavior:

- Base image: `node:22-slim`
- Installs `git` and certificates
- Enables `pnpm@10.26.2` via corepack
- Installs with `pnpm-lock.yaml`
- Launches `node scripts/dev-supervisor.js`

## Railway

- `railway.json` start command: `node scripts/dev-supervisor.js`
- `railpack.json` provides cache/install metadata

## Vercel

- App Router build/start paths are Vercel-compatible
- Ensure runtime env vars are set in platform config

## Environment Variables

Current app runtime requires no mandatory DB/auth env var to render the home route.

Known optional/future variables:

- `DATABASE_URL` (future PostgreSQL connection URL used by `scripts/db-init.js`)
- `DB_MIGRATE_ATTEMPTS`, `DB_MIGRATE_RETRY_MS`, `DB_MIGRATE_CONNECT_TIMEOUT_SEC` (future DB migration controls)
- `PGCONNECT_TIMEOUT`, `DATABASE_SSL` (future DB connectivity controls)
- `REPO_URL`, `PREVIEW_BRANCH`, `GIT_POLL_INTERVAL`, `GIT_BOOTSTRAP`, `GIT_POLL`, `NEXT_DEV`, `HEALTHCHECK_PATH`, `PORT` (supervisor/git-poll behavior)

## Safety Notes

- Never commit real secrets.
- `.env` is currently present in the repository root; treat this as sensitive and rotate/remove secrets if it contains production credentials.
- `.gitignore` ignores `.env*.local` but does not ignore `.env`.

## Quality Gates

Recommended validation sequence:

```bash
pnpm install
pnpm run build
pnpm run dev
```

Use lint after ESLint configuration is fully set up in this repo.

## Operational Caveat

`postcss.config.mjs` should be treated as sensitive and reviewed before making automated transforms, because this file has previously contained unexpected appended content in this project history.

## License

Template/reuse rights depend on owner policy. Confirm usage rights before redistribution.
