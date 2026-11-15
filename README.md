# Gym Tracker

Plan which days you'll train next week, log what you actually did, and let friends see whether you showed up. Each week is drawn as a machine's weight stack, one slab per day.

## Running it

Requires [Bun](https://bun.sh) and a Supabase project.

```bash
bun install
bun dev          # http://localhost:3000
```

Create `.env.local` with:

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sign-in and session handling |
| `SUPABASE_SERVICE_ROLE_KEY` | Deleting an account (server only) |
| `DATABASE_URL` | Postgres via Supabase's transaction pooler (port 6543) |

Other scripts:

```bash
bun run lint
bun run build
bunx drizzle-kit generate   # write a migration after changing a schema
bunx drizzle-kit migrate    # apply pending migrations
```

## How the code is laid out

```
src/
  app/                  Routes (Next.js App Router)
    (app)/              Signed-in tabs: dashboard (Week), friends, stats, settings
      <tab>/frame.tsx     The tab's static text, with slots for data
      <tab>/sections.tsx  Data-backed parts, each with a matching skeleton
      <tab>/loading.tsx   Frame + skeletons, shown instantly on navigation
      <tab>/actions.ts    Server actions for that tab
    (auth)/             Login and signup
  components/
    stack/              The weight-stack picture of a week
    session/            Workout timer, logging dialog, logbook
    planner/ friends/ stats/ settings/ shell/
    ui/                 Generic pieces: button, field, dialog, section, skeleton
  lib/
    data/               Database queries, one file per area
    db/                 Drizzle schemas and migrations
    week.ts stats.ts    Pure logic: day statuses, streaks, consistency
    validation.ts       Everything coming from a form is checked here
    dates.ts            Calendar dates as yyyy-MM-dd strings
```

Two rules hold throughout:

- **Days are judged on the lifter's own clock.** A workout's day comes from the timezone saved in their settings, and friends see that same day wherever they are.
- **Server actions never trust ids from the browser.** They get the user from `requireProfile()` in `src/lib/auth.ts`.
