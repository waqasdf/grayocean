-- Fix first-admin bootstrap + promote yourself
-- Run this entire script in Supabase → SQL Editor

create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
as $$
begin
  -- SQL Editor / service role / migrations have no JWT — allow bootstrap
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

-- >>> CHANGE THIS EMAIL to your signup email <<<
update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL@example.com';

-- Confirm
select id, email, full_name, role, credit_balance_cents
from public.profiles
order by created_at;
