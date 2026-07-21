-- Credit order RPCs + app settings for USDC treasury (Base only)
-- Aligns with GrayOcean_Developer_Handoff.pdf (no Hostinger/Docker changes)

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

drop policy if exists "Admins read app settings" on public.app_settings;
create policy "Admins read app settings"
  on public.app_settings for select to authenticated
  using (public.is_admin());

-- Seed treasury placeholder — replace via SQL before accepting live payments
insert into public.app_settings (key, value) values
  ('usdc_receiving_address', 'REPLACE_WITH_BASE_USDC_TREASURY_ADDRESS'),
  ('usdc_network', 'base'),
  ('usdc_asset', 'USDC'),
  ('order_expiry_hours', '24'),
  ('minimum_initial_purchase_cents', '10000'),
  ('minimum_reload_cents', '5000')
on conflict (key) do nothing;

-- Optional $50 reload package (active for returning customers)
insert into public.credit_packages (id, name, credit_amount_cents, usdc_amount, bonus_percent, sort_order, is_active)
values ('reload_50', 'Reload', 5000, 50.000000, 0, 0, true)
on conflict (id) do nothing;

create or replace function public.get_app_setting(p_key text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select value from public.app_settings where key = p_key;
$$;

revoke all on function public.get_app_setting from public, anon;
grant execute on function public.get_app_setting to authenticated, service_role;

-- Create a USDC-on-Base payment request for a package
create or replace function public.create_credit_order(p_package_id text)
returns public.credit_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_pkg public.credit_packages;
  v_addr text;
  v_hours int;
  v_prior_credited int;
  v_min_initial bigint;
  v_min_reload bigint;
  v_order public.credit_orders;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  select * into v_pkg
  from public.credit_packages
  where id = p_package_id and is_active = true;

  if not found then
    raise exception 'unknown or inactive package: %', p_package_id;
  end if;

  select count(*)::int into v_prior_credited
  from public.credit_orders
  where user_id = v_user and status = 'credited';

  v_min_initial := coalesce((select value::bigint from public.app_settings where key = 'minimum_initial_purchase_cents'), 10000);
  v_min_reload := coalesce((select value::bigint from public.app_settings where key = 'minimum_reload_cents'), 5000);

  if v_prior_credited = 0 and v_pkg.credit_amount_cents < v_min_initial then
    raise exception 'minimum initial credit purchase is $%.2f', v_min_initial / 100.0;
  end if;

  if v_prior_credited > 0 and v_pkg.credit_amount_cents < v_min_reload then
    raise exception 'minimum reload is $%.2f', v_min_reload / 100.0;
  end if;

  v_addr := public.get_app_setting('usdc_receiving_address');
  if v_addr is null or v_addr = '' or v_addr like 'REPLACE_%' then
    raise exception 'USDC receiving address is not configured';
  end if;

  v_hours := coalesce((select value::int from public.app_settings where key = 'order_expiry_hours'), 24);

  insert into public.credit_orders (
    user_id, package_id, usd_credit_amount_cents, usdc_amount,
    network, asset, receiving_address, status, expires_at
  ) values (
    v_user, v_pkg.id, v_pkg.credit_amount_cents, v_pkg.usdc_amount,
    'base', 'USDC', v_addr, 'awaiting_payment', now() + make_interval(hours => v_hours)
  )
  returning * into v_order;

  return v_order;
end;
$$;

revoke all on function public.create_credit_order from public, anon;
grant execute on function public.create_credit_order to authenticated;

-- User submits a Base USDC tx hash for review (unique constraint prevents double-credit)
create or replace function public.submit_credit_order_tx(
  p_order_id uuid,
  p_tx_hash text
)
returns public.credit_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_order public.credit_orders;
  v_hash text;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  v_hash := lower(trim(p_tx_hash));
  if v_hash is null or length(v_hash) < 10 then
    raise exception 'invalid transaction hash';
  end if;

  select * into v_order
  from public.credit_orders
  where id = p_order_id and user_id = v_user
  for update;

  if not found then
    raise exception 'order not found';
  end if;

  if v_order.status not in ('awaiting_payment', 'payment_detected', 'underpaid', 'overpaid', 'manual_review') then
    raise exception 'order cannot accept a transaction hash in status %', v_order.status;
  end if;

  if v_order.expires_at < now() and v_order.status = 'awaiting_payment' then
    update public.credit_orders set status = 'expired' where id = p_order_id;
    raise exception 'order expired';
  end if;

  update public.credit_orders
  set tx_hash = v_hash,
      status = 'manual_review',
      updated_at = now()
  where id = p_order_id
  returning * into v_order;

  return v_order;
exception
  when unique_violation then
    raise exception 'this transaction hash was already used';
end;
$$;

revoke all on function public.submit_credit_order_tx from public, anon;
grant execute on function public.submit_credit_order_tx to authenticated;

-- Harden charge_lookup: always charge auth.uid(), never a client-supplied user id
create or replace function public.charge_lookup(
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
  v_user uuid := auth.uid();
  v_price bigint;
  v_balance bigint;
  v_entry public.ledger_entries;
  v_charge public.lookup_charges;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  select retail_cents into v_price
  from public.lookup_prices
  where search_type = p_search_type;

  if not found then
    raise exception 'unknown search type: %', p_search_type;
  end if;

  select credit_balance_cents into v_balance
  from public.profiles
  where id = v_user
  for update;

  if v_balance < v_price then
    raise exception 'insufficient credit balance' using errcode = 'P0001';
  end if;

  v_balance := v_balance - v_price;

  update public.profiles
  set credit_balance_cents = v_balance
  where id = v_user;

  insert into public.ledger_entries (
    user_id, entry_type, amount_cents, balance_after_cents,
    reference_type, description, metadata
  ) values (
    v_user, 'lookup_charge', -v_price, v_balance,
    'lookup', p_search_type, jsonb_build_object('search_type', p_search_type)
  )
  returning * into v_entry;

  insert into public.lookup_charges (
    user_id, search_type, input_reference_masked, vendor, vendor_request_id,
    search_status, retail_charge_cents, vendor_cost_cents, ledger_entry_id, analyst_user_id
  ) values (
    v_user, p_search_type, p_input_masked, p_vendor, p_vendor_request_id,
    'completed', v_price, 0, v_entry.id, v_user
  )
  returning * into v_charge;

  return v_charge;
end;
$$;

revoke all on function public.charge_lookup from public, anon;
grant execute on function public.charge_lookup to authenticated;

-- Admin confirms a reviewed USDC order and credits the prepaid balance
create or replace function public.admin_confirm_credit_order(
  p_order_id uuid,
  p_credited_cents bigint default null
)
returns public.ledger_entries
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.credit_orders;
  v_cents bigint;
  v_entry public.ledger_entries;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  select * into v_order
  from public.credit_orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'order not found';
  end if;

  if v_order.status in ('credited', 'rejected', 'expired') then
    raise exception 'order already finalized as %', v_order.status;
  end if;

  v_cents := coalesce(p_credited_cents, v_order.usd_credit_amount_cents);

  v_entry := public.apply_credit_purchase(
    v_order.user_id,
    v_order.id,
    v_cents,
    format('USDC credit purchase (%s)', coalesce(v_order.package_id, 'custom'))
  );

  return v_entry;
end;
$$;

revoke all on function public.admin_confirm_credit_order from public, anon;
grant execute on function public.admin_confirm_credit_order to authenticated;
