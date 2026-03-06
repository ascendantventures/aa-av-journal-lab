# aa-av-journal-lab

Journaling App MVP (Next.js + Supabase).

## Features
- Email/password auth (sign up / login / logout)
- Create, edit, delete journal entries
- Markdown-lite content textarea
- Tags + keyword search
- Mood field + mood filter
- Date-range filter
- Responsive mobile/desktop layout

## Setup
1. Create a Supabase project.
2. Run SQL in `supabase/schema.sql`.
3. Set env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `npm install && npm run dev`

## Deployment
Deploy from `main` on Vercel.
