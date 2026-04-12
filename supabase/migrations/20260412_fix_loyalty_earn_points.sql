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
    total_spent_eur = public.customer_profiles.total_spent_eur + p_eur_amount
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