# StreakOS

A tracker for a 100-day discipline challenge. Every day you check off four tasks (fitness, deep work, learning, journal) and four rules (no fast food, no late-night scrolling, sleeping on time, grooming). StreakOS keeps your streaks, splits the 100 days into cycles with their own goals, and lets a small group follow each other's progress.

I built it for my own 100-day run (Apr 27 to Aug 4, 2026), so the dates, tasks and cycle goals are hardcoded in `src/lib/constants.ts`. Change them there if you want to run your own challenge.

## What's in it

- **Today**: the daily checklist, deep-work hours, the topic you studied and a journal entry
- **Dashboard**: day counter, current streaks, progress through the current cycle and a countdown to the Friday check-in call
- **Calendar**: a 100-day grid that shows which days were complete
- **Journal**: past entries as cards, with export to PDF
- **Analytics**: completion charts over time
- **Cycles**: the 100 days split into themed blocks, each with goals, deliverables and a reward
- **Team**: everyone's progress side by side
- Confetti when you finish a full day, plus light and dark themes

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase (auth and Postgres with RLS), Zustand, Framer Motion, Recharts, and `@react-pdf/renderer` for the journal export.

## Running it locally

1. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql` in the SQL editor. This creates the profiles, daily entries, cycles, streaks, achievements and weekly meetings tables along with their RLS policies.
2. Copy the env file and fill in your project URL and anon key:

   ```bash
   cp .env.local.example .env.local
   ```

3. Install and start:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000 and sign in with an email and password user from your Supabase project.

## Project layout

```
src/
  app/(app)/      dashboard, today, journal, calendar, analytics, cycles, team, settings
  app/(auth)/     login and auth callback
  components/     UI grouped by feature (dashboard, calendar, journal, checklist, layout)
  hooks/          data hooks for auth, daily entries, journal and analytics
  lib/            Supabase clients, constants (tasks, rules, cycles), helpers
supabase/         SQL migration
```
