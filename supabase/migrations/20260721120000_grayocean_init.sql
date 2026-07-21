-- GrayOcean initial schema
-- Profiles, investigation records, prepaid USDC credits, append-only ledger
-- RLS enabled on all public tables

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',
  is_verified boolean not null default false,
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'expired', 'cancelled')),
  subscription_expires timestamptz,
  plan_type text default 'credits',
  last_payment_date timestamptz,
  trial_ends timestamptz,
  credit_balance_cents bigint not null default 0 check (credit_balance_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- Investigation / product tables (mapped from Base44 entities)
-- ---------------------------------------------------------------------------
create table public.ssn_lookups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  ssn text,
  area_number text,
  group_number text,
  serial_number text,
  state text,
  year_range text,
  is_valid boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  street_address text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  is_valid boolean,
  latitude double precision,
  longitude double precision,
  county text,
  median_household_income double precision,
  income_bracket text,
  population_density double precision,
  area_type text,
  median_home_value double precision,
  poverty_rate double precision,
  education_bachelor_plus double precision,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.batch_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  batch_name text not null,
  ssn_list jsonb not null default '[]'::jsonb,
  total_count integer,
  valid_count integer,
  invalid_count integer,
  high_risk_count integer,
  average_risk_score double precision,
  states_represented jsonb default '[]'::jsonb,
  analysis_summary text,
  results jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  message text not null,
  author_name text not null,
  topic text not null default 'general'
    check (topic in ('general', 'ssn_analysis', 'address_intel', 'skiptrace', 'support', 'feedback')),
  parent_id uuid references public.forum_posts (id) on delete cascade,
  upvotes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_ssns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  ssn text not null,
  area_number text,
  group_number text,
  serial_number text,
  state text,
  year_range text,
  risk_score double precision,
  validation_issues jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  street_address text not null,
  city text not null,
  state text not null,
  zip_code text,
  latitude double precision,
  longitude double precision,
  neighborhood_score double precision,
  median_household_income double precision,
  median_home_value double precision,
  collection_name text,
  notes text,
  is_favorite boolean not null default false,
  full_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skiptrace_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  search_name text not null,
  full_name text not null,
  city text,
  state text,
  age double precision,
  results jsonb,
  confidence_score double precision,
  sources_found integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ssn_patterns (
  id uuid primary key default gen_random_uuid(),
  area_number text not null,
  state text not null,
  years_active text,
  estimated_issued double precision,
  exhaustion_percentage double precision,
  issuance_rate text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.address_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  comparison_name text not null,
  addresses jsonb not null default '[]'::jsonb,
  winner text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Prepaid USDC credits (per GrayOcean_Developer_Handoff.pdf)
-- Network at launch: USDC on Base only
-- ---------------------------------------------------------------------------
create table public.credit_packages (
  id text primary key,
  name text not null,
  credit_amount_cents bigint not null check (credit_amount_cents > 0),
  usdc_amount numeric(18, 6) not null check (usdc_amount > 0),
  bonus_percent numeric(5, 2) not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.credit_packages (id, name, credit_amount_cents, usdc_amount, bonus_percent, sort_order) values
  ('starter', 'Starter', 10000, 100.000000, 0, 1),
  ('team', 'Team', 50000, 500.000000, 0, 2),
  ('operations', 'Operations', 100000, 1000.000000, 0, 3);

create table public.credit_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  package_id text references public.credit_packages (id),
  usd_credit_amount_cents bigint not null check (usd_credit_amount_cents > 0),
  usdc_amount numeric(18, 6) not null,
  network text not null default 'base' check (network = 'base'),
  asset text not null default 'USDC',
  receiving_address text not null,
  status text not null default 'awaiting_payment'
    check (status in (
      'awaiting_payment', 'payment_detected', 'confirming', 'credited',
      'underpaid', 'overpaid', 'expired', 'wrong_asset', 'wrong_network',
      'manual_review', 'rejected'
    )),
  tx_hash text unique,
  block_confirmations integer default 0,
  credited_amount_cents bigint,
  credited_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index credit_orders_user_idx on public.credit_orders (user_id, created_at desc);
create index credit_orders_status_idx on public.credit_orders (status);

-- Append-only ledger — never update balance without a ledger row
create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_type text not null check (entry_type in (
    'credit_purchase', 'lookup_charge', 'lookup_reversal',
    'promotional_credit', 'manual_adjustment', 'refund_adjustment', 'expired_credit'
  )),
  amount_cents bigint not null,
  balance_after_cents bigint not null check (balance_after_cents >= 0),
  reference_type text,
  reference_id uuid,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index ledger_entries_user_idx on public.ledger_entries (user_id, created_at desc);

create table public.lookup_charges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  organization_id uuid,
  search_type text not null,
  input_reference_masked text,
  vendor text,
  vendor_request_id text,
  search_status text not null default 'completed',
  retail_charge_cents bigint not null default 0,
  vendor_cost_cents bigint not null default 0,
  margin_cents bigint generated always as (retail_charge_cents - vendor_cost_cents) stored,
  analyst_user_id uuid references public.profiles (id),
  api_key_id text,
  permissible_purpose_code text,
  result_audit_ref text,
  ledger_entry_id uuid references public.ledger_entries (id),
  created_at timestamptz not null default now()
);

create index lookup_charges_user_idx on public.lookup_charges (user_id, created_at desc);

create table public.lookup_prices (
  search_type text primary key,
  retail_cents bigint not null check (retail_cents >= 0),
  description text,
  updated_at timestamptz not null default now()
);

insert into public.lookup_prices (search_type, retail_cents, description) values
  ('ssn_validation', 10, 'SSN validation'),
  ('address_verification', 10, 'Address verification'),
  ('address_enrichment', 15, 'Address history/enrichment'),
  ('skiptrace_basic', 25, 'Basic skiptrace'),
  ('skiptrace_enhanced', 50, 'Enhanced skiptrace'),
  ('identity_report', 50, 'Combined identity report'),
  ('batch_unit', 10, 'Batch lookup unit price');

create table public.app_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  page_name text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger ssn_lookups_updated_at before update on public.ssn_lookups
  for each row execute function public.set_updated_at();
create trigger addresses_updated_at before update on public.addresses
  for each row execute function public.set_updated_at();
create trigger batch_analyses_updated_at before update on public.batch_analyses
  for each row execute function public.set_updated_at();
create trigger forum_posts_updated_at before update on public.forum_posts
  for each row execute function public.set_updated_at();
create trigger saved_ssns_updated_at before update on public.saved_ssns
  for each row execute function public.set_updated_at();
create trigger saved_addresses_updated_at before update on public.saved_addresses
  for each row execute function public.set_updated_at();
create trigger skiptrace_searches_updated_at before update on public.skiptrace_searches
  for each row execute function public.set_updated_at();
create trigger address_comparisons_updated_at before update on public.address_comparisons
  for each row execute function public.set_updated_at();
create trigger credit_orders_updated_at before update on public.credit_orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth: create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, trial_ends)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    now() + interval '14 days'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Ledger: apply credit purchase (security definer — called from service role / edge)
-- ---------------------------------------------------------------------------
create or replace function public.apply_credit_purchase(
  p_user_id uuid,
  p_order_id uuid,
  p_amount_cents bigint,
  p_description text default null
)
returns public.ledger_entries
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance bigint;
  v_entry public.ledger_entries;
begin
  if p_amount_cents <= 0 then
    raise exception 'amount must be positive';
  end if;

  select credit_balance_cents into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    raise exception 'profile not found';
  end if;

  v_balance := v_balance + p_amount_cents;

  update public.profiles
  set credit_balance_cents = v_balance,
      last_payment_date = now(),
      subscription_status = 'active'
  where id = p_user_id;

  insert into public.ledger_entries (
    user_id, entry_type, amount_cents, balance_after_cents,
    reference_type, reference_id, description
  ) values (
    p_user_id, 'credit_purchase', p_amount_cents, v_balance,
    'credit_order', p_order_id, coalesce(p_description, 'USDC credit purchase')
  )
  returning * into v_entry;

  update public.credit_orders
  set status = 'credited',
      credited_amount_cents = p_amount_cents,
      credited_at = now()
  where id = p_order_id;

  return v_entry;
end;
$$;

-- Charge for a lookup (returns null if insufficient balance)
create or replace function public.charge_lookup(
  p_user_id uuid,
  p_search_type text,
  p_input_masked text default null,
  p_vendor text default null,
  p_vendor_request_id text default null
)
returns public.lookup_charges
language plpgsql
security definer
set search_path = public
as $$
declare
  v_price bigint;
  v_balance bigint;
  v_entry public.ledger_entries;
  v_charge public.lookup_charges;
begin
  select retail_cents into v_price
  from public.lookup_prices
  where search_type = p_search_type;

  if not found then
    raise exception 'unknown search type: %', p_search_type;
  end if;

  select credit_balance_cents into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if v_balance < v_price then
    raise exception 'insufficient credit balance' using errcode = 'P0001';
  end if;

  v_balance := v_balance - v_price;

  update public.profiles
  set credit_balance_cents = v_balance
  where id = p_user_id;

  insert into public.ledger_entries (
    user_id, entry_type, amount_cents, balance_after_cents,
    reference_type, description, metadata
  ) values (
    p_user_id, 'lookup_charge', -v_price, v_balance,
    'lookup', p_search_type, jsonb_build_object('search_type', p_search_type)
  )
  returning * into v_entry;

  insert into public.lookup_charges (
    user_id, search_type, input_reference_masked, vendor, vendor_request_id,
    search_status, retail_charge_cents, vendor_cost_cents, ledger_entry_id
  ) values (
    p_user_id, p_search_type, p_input_masked, p_vendor, p_vendor_request_id,
    'completed', v_price, 0, v_entry.id
  )
  returning * into v_charge;

  return v_charge;
end;
$$;

revoke all on function public.apply_credit_purchase from public, anon, authenticated;
revoke all on function public.charge_lookup from public, anon;
grant execute on function public.charge_lookup to authenticated;
grant execute on function public.apply_credit_purchase to service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.ssn_lookups enable row level security;
alter table public.addresses enable row level security;
alter table public.batch_analyses enable row level security;
alter table public.forum_posts enable row level security;
alter table public.saved_ssns enable row level security;
alter table public.saved_addresses enable row level security;
alter table public.skiptrace_searches enable row level security;
alter table public.ssn_patterns enable row level security;
alter table public.address_comparisons enable row level security;
alter table public.credit_packages enable row level security;
alter table public.credit_orders enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.lookup_charges enable row level security;
alter table public.lookup_prices enable row level security;
alter table public.app_activity_logs enable row level security;

-- Profiles
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid());
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Own-row tables
create policy "Own ssn_lookups" on public.ssn_lookups for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Own addresses" on public.addresses for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Own batch_analyses" on public.batch_analyses for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Own saved_ssns" on public.saved_ssns for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Own saved_addresses" on public.saved_addresses for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Own skiptrace_searches" on public.skiptrace_searches for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Own address_comparisons" on public.address_comparisons for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Forum: authenticated read all; write own
create policy "Forum read" on public.forum_posts for select to authenticated using (true);
create policy "Forum insert" on public.forum_posts for insert to authenticated
  with check (user_id = auth.uid());
create policy "Forum update own" on public.forum_posts for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Forum upvote" on public.forum_posts for update to authenticated
  using (true)
  with check (true);

-- Reference / catalog
create policy "SSN patterns read" on public.ssn_patterns for select to authenticated using (true);
create policy "Packages read" on public.credit_packages for select to authenticated using (is_active);
create policy "Prices read" on public.lookup_prices for select to authenticated using (true);

-- Credits / ledger (read own; writes via functions / service role)
create policy "Own credit orders" on public.credit_orders for select to authenticated
  using (user_id = auth.uid());
create policy "Insert own credit orders" on public.credit_orders for insert to authenticated
  with check (user_id = auth.uid());
create policy "Own ledger" on public.ledger_entries for select to authenticated
  using (user_id = auth.uid());
create policy "Own lookup charges" on public.lookup_charges for select to authenticated
  using (user_id = auth.uid());

create policy "Insert own activity" on public.app_activity_logs for insert to authenticated
  with check (user_id = auth.uid());
create policy "Read own activity" on public.app_activity_logs for select to authenticated
  using (user_id = auth.uid());
