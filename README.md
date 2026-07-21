# Gray Ocean

Identity-intelligence workspace (SSN, address, batch, skiptrace) on **Supabase** + Vite/React.

## Setup

1. `npm install`
2. Copy `.env.example` → `.env.local` and add your Supabase URL + anon key
3. Apply SQL migrations under `supabase/migrations/` (see `SUPABASE_SETUP.md`)
4. `npm run dev`

## Scripts

- `npm run dev` — local app
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint

## Docs

- `SUPABASE_SETUP.md` — Supabase, credits, Hostinger, admin
- `supabase/MAKE_FIRST_ADMIN.sql` — promote first admin
