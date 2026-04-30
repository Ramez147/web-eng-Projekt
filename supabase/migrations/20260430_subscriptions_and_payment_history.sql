-- Subscriptions: tracks which plan (free/premium) each user is on per organization
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, organization_id)
);

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_org on public.subscriptions(organization_id);

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

create policy subscriptions_select_own
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy subscriptions_insert_own
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy subscriptions_update_own
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Payment history: one row per completed payment
create table if not exists public.payment_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  stripe_payment_intent_id text unique,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  status text not null check (status in ('succeeded', 'failed', 'pending', 'refunded')),
  description text,
  receipt_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_history_user on public.payment_history(user_id);
create index if not exists idx_payment_history_org_created on public.payment_history(organization_id, created_at desc);

alter table public.payment_history enable row level security;

create policy payment_history_select_own
  on public.payment_history for select
  using (auth.uid() = user_id);

create policy payment_history_insert_own
  on public.payment_history for insert
  with check (auth.uid() = user_id);
