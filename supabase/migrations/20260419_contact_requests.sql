create extension if not exists pgcrypto;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  inquiry_type text,
  response_window text,
  source_path text,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_requests_created_at on public.contact_requests(created_at desc);
create index if not exists idx_contact_requests_status_created_at on public.contact_requests(status, created_at desc);

alter table public.contact_requests enable row level security;

-- Contact requests are written through the backend service role only.