create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  points_ratio numeric(12, 4) not null check (points_ratio > 0),
  api_key_hash text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  external_customer_id text not null,
  points_balance bigint not null default 0 check (points_balance >= 0),
  total_spent_eur numeric(14, 2) not null default 0 check (total_spent_eur >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, external_customer_id)
);

create table if not exists public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.customer_profiles(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('earn', 'redeem')),
  eur_amount numeric(14, 2) not null default 0 check (eur_amount >= 0),
  points integer not null check (points > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_customer_profiles_org on public.customer_profiles(organization_id);
create index if not exists idx_customer_profiles_external on public.customer_profiles(external_customer_id);
create index if not exists idx_points_transactions_org_created on public.points_transactions(organization_id, created_at desc);
create index if not exists idx_points_transactions_profile on public.points_transactions(profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_organizations_updated_at on public.organizations;
create trigger trg_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

drop trigger if exists trg_customer_profiles_updated_at on public.customer_profiles;
create trigger trg_customer_profiles_updated_at
before update on public.customer_profiles
for each row execute function public.set_updated_at();

create or replace function public.loyalty_earn_points(
  p_organization_id uuid,
  p_external_customer_id text,
  p_eur_amount numeric,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  profile_id uuid,
  points_earned integer,
  new_points_balance bigint,
  total_spent_eur numeric
)
language plpgsql
as $$
declare
  v_ratio numeric;
  v_points integer;
  v_profile_id uuid;
  v_new_balance bigint;
  v_total_spent numeric;
begin
  if p_eur_amount <= 0 then
    raise exception 'EUR amount must be greater than 0';
  end if;

  select points_ratio
  into v_ratio
  from public.organizations
  where id = p_organization_id;

  if v_ratio is null then
    raise exception 'Organization not found';
  end if;

  v_points := floor(p_eur_amount * v_ratio)::integer;

  if v_points <= 0 then
    raise exception 'Calculated points is 0. Increase amount or ratio.';
  end if;

  insert into public.customer_profiles (organization_id, external_customer_id)
  values (p_organization_id, p_external_customer_id)
  on conflict (organization_id, external_customer_id) do nothing;

  update public.customer_profiles
  set
    points_balance = points_balance + v_points,
    total_spent_eur = total_spent_eur + p_eur_amount
  where organization_id = p_organization_id
    and external_customer_id = p_external_customer_id
  returning id, points_balance, total_spent_eur
  into v_profile_id, v_new_balance, v_total_spent;

  insert into public.points_transactions (
    organization_id,
    profile_id,
    transaction_type,
    eur_amount,
    points,
    metadata
  )
  values (
    p_organization_id,
    v_profile_id,
    'earn',
    p_eur_amount,
    v_points,
    coalesce(p_metadata, '{}'::jsonb)
  );

  return query
  select v_profile_id, v_points, v_new_balance, v_total_spent;
end;
$$;

create or replace function public.loyalty_redeem_points(
  p_organization_id uuid,
  p_external_customer_id text,
  p_points_to_redeem integer,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  profile_id uuid,
  redeemed_points integer,
  new_points_balance bigint,
  status text,
  message text
)
language plpgsql
as $$
declare
  v_profile_id uuid;
  v_current_balance bigint;
  v_new_balance bigint;
begin
  if p_points_to_redeem <= 0 then
    return query
    select null::uuid, 0, 0::bigint, 'rejected'::text, 'Points to redeem must be greater than 0'::text;
    return;
  end if;

  insert into public.customer_profiles (organization_id, external_customer_id)
  values (p_organization_id, p_external_customer_id)
  on conflict (organization_id, external_customer_id) do nothing;

  select id, points_balance
  into v_profile_id, v_current_balance
  from public.customer_profiles
  where organization_id = p_organization_id
    and external_customer_id = p_external_customer_id
  for update;

  if v_profile_id is null then
    return query
    select null::uuid, 0, 0::bigint, 'rejected'::text, 'Profile could not be created'::text;
    return;
  end if;

  if v_current_balance < p_points_to_redeem then
    return query
    select v_profile_id, 0, v_current_balance, 'rejected'::text, 'Insufficient points balance'::text;
    return;
  end if;

  update public.customer_profiles
  set points_balance = points_balance - p_points_to_redeem
  where id = v_profile_id
  returning points_balance into v_new_balance;

  insert into public.points_transactions (
    organization_id,
    profile_id,
    transaction_type,
    eur_amount,
    points,
    metadata
  )
  values (
    p_organization_id,
    v_profile_id,
    'redeem',
    0,
    p_points_to_redeem,
    coalesce(p_metadata, '{}'::jsonb)
  );

  return query
  select v_profile_id, p_points_to_redeem, v_new_balance, 'applied'::text, 'Points redeemed successfully'::text;
end;
$$;

alter table public.organizations enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.points_transactions enable row level security;

-- Keep RLS strict by default. Use service role key in backend route handlers.
