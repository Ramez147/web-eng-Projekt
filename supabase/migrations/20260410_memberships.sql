create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role text not null check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  unique (user_id, organization_id)
);

create index if not exists idx_memberships_user on public.memberships(user_id);
create index if not exists idx_memberships_org on public.memberships(organization_id);

alter table public.memberships enable row level security;

-- Memberships are visible and manageable only by the owning auth user.
drop policy if exists memberships_select_own on public.memberships;
create policy memberships_select_own
on public.memberships
for select
using (auth.uid() = user_id);

drop policy if exists memberships_insert_own on public.memberships;
create policy memberships_insert_own
on public.memberships
for insert
with check (auth.uid() = user_id);

drop policy if exists memberships_update_own on public.memberships;
create policy memberships_update_own
on public.memberships
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Organization rows are readable for members of that organization.
drop policy if exists organizations_select_via_membership on public.organizations;
create policy organizations_select_via_membership
on public.organizations
for select
using (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = organizations.id
      and m.user_id = auth.uid()
  )
);

-- Customer profiles are visible only to members of the same organization.
drop policy if exists customer_profiles_select_via_membership on public.customer_profiles;
create policy customer_profiles_select_via_membership
on public.customer_profiles
for select
using (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = customer_profiles.organization_id
      and m.user_id = auth.uid()
  )
);

-- Transactions are visible only to members of the same organization.
drop policy if exists points_transactions_select_via_membership on public.points_transactions;
create policy points_transactions_select_via_membership
on public.points_transactions
for select
using (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = points_transactions.organization_id
      and m.user_id = auth.uid()
  )
);
