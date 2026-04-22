# CanadaCitizenTest.ca

This project now runs as a Next.js App Router application backed by Supabase.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Main routes

- `/` - quiz UI
- `/api/practice-sets` - chapter-backed practice sets
- `/api/practice-sets/[setId]` - question data for one chapter
- `/api/attempts/grade` - grading endpoint
- `/api/supabase-test` - Supabase connection check

## Verify

```bash
npm run check
```
