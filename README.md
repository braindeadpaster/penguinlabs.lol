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

## Accounts & data (real backend)

Accounts and profiles are stored in **Postgres via Prisma**. Auth is username +
passcode (passcode hashed with bcrypt) with a signed httpOnly session cookie (JWT).

| Env var        | What it's for                                       |
| -------------- | --------------------------------------------------- |
| `DATABASE_URL` | Postgres connection (Vercel Postgres / Neon / Supabase); use the pooled URL on serverless |
| `AUTH_SECRET`  | Secret used to sign the session cookie (`openssl rand -base64 32`) |

### First-time database setup

```bash
cp .env.example .env        # fill in DATABASE_URL + AUTH_SECRET
npm run db:push             # create the tables
```

On Vercel, set both env vars in Project → Settings → Environment Variables, then
redeploy. `prisma generate` runs automatically on install (postinstall).

Data model lives in `prisma/schema.prisma`; server data access is in
`lib/profile-service.ts`, auth in `lib/auth.ts`, and the API routes in
`app/api/**`. Discord OAuth login is not wired yet — it can be added later as an
extra provider.

## Deploy notes

This is a **Next.js** app. In the Vercel project, make sure **Framework Preset =
Next.js** (the repo used to be a plain static `index.html`; a stale "Other" preset
will not build it).
