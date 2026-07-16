# penguinlabs.lol

A minimal bio-link platform (Next.js App Router + TypeScript + Tailwind).

- `/` — landing page
- `/[username]` — a public bio page (e.g. `/penguin`)
- `/bio` — sign up / log in
- `/dashboard` — customize your page, with a live preview

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Current state

Accounts and profiles are stored **client-side in the browser** (`lib/store.ts`) so
the whole flow works on a static deploy with no secrets. This is a preview backend —
not real multi-user auth, and not secure.

## Phase 2 — real accounts (planned)

Swap the functions in `lib/store.ts` for API calls and wire:

| Env var                 | What it's for                          |
| ----------------------- | -------------------------------------- |
| `AUTH_SECRET`           | Auth.js session encryption             |
| `AUTH_DISCORD_ID`       | Discord OAuth client id                |
| `AUTH_DISCORD_SECRET`   | Discord OAuth client secret            |
| `DATABASE_URL`          | Postgres connection (Vercel Postgres / Neon) |

Set these in the Vercel project settings; nothing else in the app reads env today.

## Deploy notes

This is a **Next.js** app. In the Vercel project, make sure **Framework Preset =
Next.js** (the repo used to be a plain static `index.html`; a stale "Other" preset
will not build it).
