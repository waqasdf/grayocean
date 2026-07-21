-- Admin roles, secure profile updates, admin RPCs for user/credit management

-- Ensure role is constrained
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('user', 'admin'));

create index if not exists profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Block users from changing role / credit_balance via direct UPDATE
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
as $$
begin
  -- SQL Editor / service role / migrations have no JWT — allow bootstrap
  if auth.uid() is null then
    return new;
  end if;

  -- Existing admins may change protected columns (via UI or RPC)
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

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ---------------------------------------------------------------------------
-- RLS: admins can read/manage all profiles
-- ---------------------------------------------------------------------------
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Admins read all profiles" on public.profiles;
drop policy if exists "Admins update all profiles" on public.profiles;

create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Admins can read all ledger / orders / charges
drop policy if exists "Admins read all ledger" on public.ledger_entries;
create policy "Admins read all ledger"
  on public.ledger_entries for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins read all credit orders" on public.credit_orders;
create policy "Admins read all credit orders"
  on public.credit_orders for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins read all lookup charges" on public.lookup_charges;
create policy "Admins read all lookup charges"
  on public.lookup_charges for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Admin: set role (promote / demote)
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_user_role(
  p_user_id uuid,
  p_role text
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.profiles;
  v_admin_count integer;
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  if p_role not in ('user', 'admin') then
    raise exception 'Invalid role';
  end if;

  -- Prevent removing the last admin
  if p_role = 'user' then
    select count(*) into v_admin_count
    from public.profiles
    where role = 'admin' and id <> p_user_id;

    if v_admin_count < 1 then
      -- If target is currently admin and would be last one
      if exists (select 1 from public.profiles where id = p_user_id and role = 'admin') then
        raise exception 'Cannot demote the last admin';
      end if;
    end if;
  end if;

  update public.profiles
  set role = p_role
  where id = p_user_id
  returning * into v_row;

  if not found then
    raise exception 'User not found';
  end if;

  return v_row;
end;
$$;

revoke all on function public.admin_set_user_role from public;
grant execute on function public.admin_set_user_role to authenticated;

-- ---------------------------------------------------------------------------
-- Admin: adjust credits (ledger + balance)
-- ---------------------------------------------------------------------------
create or replace function public.admin_adjust_credits(
  p_user_id uuid,
  p_amount_cents bigint,
  p_description text default 'Manual adjustment',
  p_entry_type text default 'manual_adjustment'
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
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  if p_entry_type not in (
    'promotional_credit', 'manual_adjustment', 'refund_adjustment', 'expired_credit'
  ) then
    raise exception 'Invalid entry type for admin adjustment';
  end if;

  select credit_balance_cents into v_balance
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    raise exception 'User not found';
  end if;

  v_balance := v_balance + p_amount_cents;
  if v_balance < 0 then
    raise exception 'Resulting balance cannot be negative';
  end if;

  update public.profiles
  set credit_balance_cents = v_balance
  where id = p_user_id;

  insert into public.ledger_entries (
    user_id, entry_type, amount_cents, balance_after_cents,
    reference_type, description, metadata
  ) values (
    p_user_id, p_entry_type, p_amount_cents, v_balance,
    'admin', coalesce(p_description, 'Manual adjustment'),
    jsonb_build_object('admin_id', auth.uid())
  )
  returning * into v_entry;

  return v_entry;
end;
$$;

revoke all on function public.admin_adjust_credits from public;
grant execute on function public.admin_adjust_credits to authenticated;

-- ---------------------------------------------------------------------------
-- Admin: user detail bundle
-- ---------------------------------------------------------------------------
create or replace function public.admin_get_user_detail(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile jsonb;
  v_ledger jsonb;
  v_orders jsonb;
  v_charges jsonb;
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  select to_jsonb(p) into v_profile
  from public.profiles p
  where p.id = p_user_id;

  if v_profile is null then
    raise exception 'User not found';
  end if;

  select coalesce(jsonb_agg(to_jsonb(e) order by e.created_at desc), '[]'::jsonb)
  into v_ledger
  from (
    select * from public.ledger_entries
    where user_id = p_user_id
    order by created_at desc
    limit 50
  ) e;

  select coalesce(jsonb_agg(to_jsonb(o) order by o.created_at desc), '[]'::jsonb)
  into v_orders
  from (
    select * from public.credit_orders
    where user_id = p_user_id
    order by created_at desc
    limit 50
  ) o;

  select coalesce(jsonb_agg(to_jsonb(c) order by c.created_at desc), '[]'::jsonb)
  into v_charges
  from (
    select * from public.lookup_charges
    where user_id = p_user_id
    order by created_at desc
    limit 50
  ) c;

  return jsonb_build_object(
    'profile', v_profile,
    'ledger', v_ledger,
    'credit_orders', v_orders,
    'lookup_charges', v_charges
  );
end;
$$;

revoke all on function public.admin_get_user_detail from public;
grant execute on function public.admin_get_user_detail to authenticated;

-- Stats for admin dashboard header
create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_users bigint;
  v_admins bigint;
  v_credits bigint;
  v_orders_pending bigint;
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  select count(*) into v_users from public.profiles;
  select count(*) into v_admins from public.profiles where role = 'admin';
  select coalesce(sum(credit_balance_cents), 0) into v_credits from public.profiles;
  select count(*) into v_orders_pending
  from public.credit_orders
  where status in ('awaiting_payment', 'payment_detected', 'confirming', 'manual_review');

  return jsonb_build_object(
    'user_count', v_users,
    'admin_count', v_admins,
    'total_credit_balance_cents', v_credits,
    'pending_orders', v_orders_pending
  );
end;
$$;

revoke all on function public.admin_dashboard_stats from public;
grant execute on function public.admin_dashboard_stats to authenticated;
