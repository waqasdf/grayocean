# GrayOcean — Supabase setup (step by step)

This app **no longer uses Base44**. Backend is **Supabase** (Auth + Postgres + Edge Functions). Frontend is Vite/React. Deploy the static build on a **Hostinger VPS** (USA). Prepaid credits use **USDC on Base only** (see handoff PDF).

---

## 0. What was built in this repo

| Piece | Location |
|-------|----------|
| Full SQL schema + RLS + ledger | `supabase/migrations/20260721120000_grayocean_init.sql` |
| Browser client | `src/lib/supabase.js` |
| Entity layer (replaces `@/entities`) | `src/entities/*`, `src/lib/entityClient.js` |
| Auth | `src/lib/AuthContext.jsx`, `src/pages/Login.jsx` |
| LLM edge function | `supabase/functions/invoke-llm` |
| Env template | `.env.example` |

**Credit model (from Developer Handoff PDF):**

- Call it **credit balance / prepaid usage balance** — not a “crypto wallet”
- Packages: Starter $100, Team $500, Operations $1000
- Network: **USDC on Base only**
- Append-only `ledger_entries`; `charge_lookup()` / `apply_credit_purchase()`
- Lookup prices seeded in `lookup_prices`

---

## 1. Create a Supabase project (USA)

Your org hit the **free project limit**. Do one of:

1. Supabase Dashboard → pause or delete an unused free project, **or**
2. Upgrade the org to Pro.

Then:

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project**
3. Name: `grayocean`
4. Region: **East US (N. Virginia)** / `us-east-1` (or closest USA region)
5. Set a strong database password → save it in a password manager
6. Wait until status is **Healthy**

Copy from **Project Settings → API**:

- Project URL → `VITE_SUPABASE_URL`
- `anon` `public` key → `VITE_SUPABASE_ANON_KEY`  
  (Never put the `service_role` key in the frontend.)

---

## 2. Apply the database migration

### Option A — Dashboard SQL (fastest)

1. Supabase → **SQL Editor** → New query  
2. Paste the full contents of:

   `supabase/migrations/20260721120000_grayocean_init.sql`

3. Run  
4. Confirm tables exist under **Table Editor**:  
   `profiles`, `ssn_lookups`, `addresses`, `batch_analyses`, `forum_posts`, `saved_ssns`, `saved_addresses`, `skiptrace_searches`, `credit_packages`, `credit_orders`, `ledger_entries`, `lookup_charges`, `lookup_prices`, …

### Option B — Supabase CLI

```bash
# From repo root
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

---

## 3. Configure Auth

1. **Authentication → Providers → Email** → enabled  
2. Enable **Confirm email** (handoff: user creates and verifies account)  
3. **URL configuration**  
   - Site URL: `http://localhost:5173` (local)  
   - Redirect URLs:  
     - `http://localhost:5173/Login`  
     - `https://YOUR_PRODUCTION_DOMAIN/Login`  
4. After Hostinger domain is ready, set Site URL to production.

---

## 4. Frontend env + run locally

```bash
cd D:\Personal\grayocean\grayocean
copy .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

```bash
npm install
npm run dev
```

Open `http://localhost:5173/Login` → Sign up → confirm email → Sign in.

---

## 5. Deploy the LLM edge function (Address / Skiptrace / SSN insights)

```bash
npx supabase functions deploy invoke-llm --project-ref YOUR_PROJECT_REF
npx supabase secrets set OPENAI_API_KEY=sk-... --project-ref YOUR_PROJECT_REF
# optional
npx supabase secrets set OPENAI_MODEL=gpt-4o-mini --project-ref YOUR_PROJECT_REF
```

Without `OPENAI_API_KEY`, the function returns an empty/safe stub so the UI does not crash.

Optional storage for uploads:

1. **Storage** → create bucket `uploads`  
2. Policies: authenticated users can upload under `{user_id}/...`

---

## 6. USDC prepaid credits (Base only)

Terminology: **credit balance / prepaid usage balance** — never “crypto wallet.”

### 6.1 Treasury address (required before live purchases)

After applying `20260721150000_credit_order_rpcs.sql`, set the Base USDC address:

```sql
update public.app_settings
set value = '0xYourBaseTreasuryAddress'
where key = 'usdc_receiving_address';
```

Packages: Starter $100, Team $500, Operations $1000, Reload $50 (after first credited purchase).  
Minimum **initial purchase** $100 — not a permanent $100 minimum balance.

### 6.2 Frontend flow (built)

1. User opens **Pricing** (sidebar) → selects package  
2. RPC `create_credit_order(package_id)` creates order (`awaiting_payment`, network=`base`)  
3. UI shows order id, exact USDC amount, receiving address, expiry  
4. User sends **USDC on Base only**, pastes `tx_hash` → `submit_credit_order_tx` → `manual_review`  
5. Admin confirms with `admin_confirm_credit_order(order_id)` (or automated watcher later)  
6. `apply_credit_purchase` updates balance + append-only ledger  

`tx_hash` is **unique** so one transfer cannot fund two accounts.

### 6.3 Charging lookups

```sql
-- Uses auth.uid() internally (do not pass user id from the client)
select public.charge_lookup('ssn_validation', '***-**-1234', 'internal', null);
```

Show price **before** Run search. Seeded retail prices match the handoff PDF.

---

## 7. Hostinger VPS deployment (USA)

Handoff recommendation: **VPS with Docker**, not shared hosting.

### 7.1 Build

```bash
npm run build
```

Output: `dist/`

### 7.2 Simple Node static serve (example)

On the VPS:

```bash
# Install Node 20+, nginx, certbot
sudo mkdir -p /var/www/grayocean
# upload dist/* to /var/www/grayocean
```

Nginx example:

```nginx
server {
  listen 80;
  server_name app.yourdomain.com;
  root /var/www/grayocean;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Then HTTPS with Certbot.

### 7.3 Env for production

Rebuild with production env:

```bash
# .env.production
VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=...
npm run build
```

Vite **bakes** `VITE_*` into the bundle at build time.

### 7.4 Supabase Auth URLs

Add production redirect URLs in Supabase Auth settings (step 3).

### 7.5 Hostinger crypto payment

Hostinger may accept crypto for **VPS invoices** — that is billing Hostinger, separate from GrayOcean’s **USDC credit deposits** for end users.

---

## 8. Cutover checklist

- [ ] Free project slot available / Pro plan  
- [ ] Project in USA region  
- [ ] Migration applied; RLS policies present  
- [ ] `.env.local` filled; `npm run dev` works  
- [ ] Email signup + verification works  
- [ ] Login → SSN Lookup loads  
- [ ] Forum create/list works when authenticated  
- [ ] `invoke-llm` deployed + OpenAI secret (for Address/Skiptrace AI)  
- [ ] USDC receiving address + order watcher planned  
- [ ] Hostinger VPS + domain + HTTPS  
- [ ] Supabase Auth redirect URLs include production  

---

## 9. What was removed

- `@base44/sdk`, `@base44/vite-plugin`  
- Vite Base44 plugin from `vite.config.js`  
- Reliance on `globalThis.__B44_DB__`  

`base44/entities/*.jsonc` remains as historical schema reference only; **Postgres is source of truth**.

---

## 10. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Missing env warning in console | Create `.env.local` from `.env.example` |
| `Unauthorized` on entities | Sign in; confirm RLS + profile trigger ran |
| No profile row after signup | Re-run migration (`handle_new_user` trigger) |
| LLM empty | Set `OPENAI_API_KEY` secret; redeploy function |
| Free project create fails | Pause/delete another free project or upgrade |
| Build can’t resolve `@/` | `vite.config.js` alias `@` → `./src` (already set) |

---

## 12. Admin dashboard (roles + user management)

### 12.1 Apply admin migration

In Supabase **SQL Editor**, run the full contents of:

`supabase/migrations/20260721140000_admin_roles.sql`

This adds:

- `is_admin()` helper
- Protection so users cannot self-promote or edit their own credit balance
- Admin can list all users and read ledgers/orders/charges
- RPCs: `admin_set_user_role`, `admin_adjust_credits`, `admin_get_user_detail`, `admin_dashboard_stats`

### 12.2 Make yourself the first admin

Sign up in the app first, then in SQL Editor run `supabase/MAKE_FIRST_ADMIN.sql`
(replace `YOUR_EMAIL@example.com`), **or**:

```sql
-- Fix bootstrap (required once if you hit "Cannot change role")
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  if public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role then
    raise exception 'Cannot change role';
  end if;
  if new.credit_balance_cents is distinct from old.credit_balance_cents then
    raise exception 'Cannot change credit balance directly';
  end if;
  return new;
end;
$$;

update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL@example.com';
```

Sign out and sign back in so your profile reloads with `role = admin`.

### 12.3 Use the Admin UI

1. Open **Administration → Admin** in the sidebar (admins only)
2. Search users, click a row
3. View profile, credit balance, ledger, credit orders, lookup charges
4. **Make admin** / **Remove admin**
5. **Add / deduct credits** (writes a ledger entry)

You cannot demote yourself from the UI, and the database blocks demoting the last admin.

---

## 11. Next product work (after setup)

1. Credits purchase UI (packages + Base QR/address)  
2. Payment confirmation edge function + unique `tx_hash` enforcement  
3. Call `charge_lookup` before each paid search; show balance  
4. Admin manual adjustment + OFAC review queue  
5. API keys table for developer access (Enterprise)

When your Supabase project is created, tell me the **project ref** and I can push the migration and deploy `invoke-llm` via the Supabase MCP tools.
