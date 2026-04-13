create or replace function public.customer_dashboard_table(
  p_organization_id uuid,
  p_search text default null,
  p_limit integer default 4,
  p_offset integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_search text := nullif(trim(coalesce(p_search, '')), '');
  v_pattern text := null;
  v_total_count bigint := 0;
  v_rows jsonb := '[]'::jsonb;
begin
  if p_limit < 1 then
    p_limit := 4;
  end if;

  if p_offset < 0 then
    p_offset := 0;
  end if;

  if v_search is not null then
    v_pattern := '%' || v_search || '%';
  end if;

  with filtered as (
    select
      cp.id,
      cp.external_customer_id,
      cp.points_balance,
      cp.total_spent_eur,
      cp.created_at,
      nullif(trim(to_jsonb(cp)->>'name'), '') as name,
      nullif(trim(to_jsonb(cp)->>'email'), '') as email,
      nullif(trim(to_jsonb(cp)->>'phone'), '') as phone,
      nullif(trim(to_jsonb(cp)->>'billing_address'), '') as billing_address
    from public.customer_profiles cp
    where cp.organization_id = p_organization_id
      and (
        v_search is null
        or coalesce(nullif(trim(to_jsonb(cp)->>'name'), ''), cp.external_customer_id) ilike v_pattern
        or nullif(trim(to_jsonb(cp)->>'email'), '') ilike v_pattern
        or nullif(trim(to_jsonb(cp)->>'phone'), '') ilike v_pattern
        or nullif(trim(to_jsonb(cp)->>'billing_address'), '') ilike v_pattern
        or cp.external_customer_id ilike v_pattern
      )
  )
  select count(*) into v_total_count from filtered;

  with filtered as (
    select
      cp.id,
      cp.external_customer_id,
      cp.points_balance,
      cp.total_spent_eur,
      cp.created_at,
      nullif(trim(to_jsonb(cp)->>'name'), '') as name,
      nullif(trim(to_jsonb(cp)->>'email'), '') as email,
      nullif(trim(to_jsonb(cp)->>'phone'), '') as phone,
      nullif(trim(to_jsonb(cp)->>'billing_address'), '') as billing_address
    from public.customer_profiles cp
    where cp.organization_id = p_organization_id
      and (
        v_search is null
        or coalesce(nullif(trim(to_jsonb(cp)->>'name'), ''), cp.external_customer_id) ilike v_pattern
        or nullif(trim(to_jsonb(cp)->>'email'), '') ilike v_pattern
        or nullif(trim(to_jsonb(cp)->>'phone'), '') ilike v_pattern
        or nullif(trim(to_jsonb(cp)->>'billing_address'), '') ilike v_pattern
        or cp.external_customer_id ilike v_pattern
      )
    order by cp.created_at desc, cp.external_customer_id asc
    limit p_limit
    offset p_offset
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', filtered.id,
        'name', coalesce(filtered.name, filtered.external_customer_id),
        'email', filtered.email,
        'phone', filtered.phone,
        'billingAddress', filtered.billing_address,
        'pointsBalance', filtered.points_balance,
        'totalSpentEur', filtered.total_spent_eur,
        'createdAt', filtered.created_at
      )
      order by filtered.created_at desc, filtered.external_customer_id asc
    ),
    '[]'::jsonb
  )
  into v_rows
  from filtered;

  return jsonb_build_object(
    'totalCount', v_total_count,
    'rows', v_rows
  );
end;
$$;
