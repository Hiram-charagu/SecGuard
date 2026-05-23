-- Secguard production-ready Supabase schema draft.
-- Run this in Supabase SQL Editor after reviewing policies for your final role model.

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text default 'Business',
  status text default 'active',
  branches int default 0,
  created_at timestamptz default now()
);

create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  role text not null default 'company_admin',
  full_name text,
  created_at timestamptz default now()
);

create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  manager text,
  devices int default 0,
  alerts int default 0,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists staff_profiles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  name text not null,
  role text not null,
  branch text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists erp_sync_modules (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  mode text,
  status text default 'connected',
  "lastSync" text,
  created_at timestamptz default now()
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  imei1 text unique not null,
  imei2 text unique,
  serial_number text,
  brand text,
  model text not null,
  current_status text default 'in_stock',
  erp_status text default 'unsold',
  activation_status text default 'inactive',
  risk_score int default 20,
  created_at timestamptz default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists fraud_alerts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  device_id uuid references devices(id) on delete set null,
  alert_type text not null,
  severity text not null,
  status text default 'open',
  assigned_to uuid references auth.users(id) on delete set null,
  notes text,
  evidence jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists theft_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  device_id uuid references devices(id) on delete set null,
  customer text,
  imei text,
  priority text default 'medium',
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists recovery_cases (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  theft_report_id uuid references theft_reports(id) on delete cascade,
  assigned_officer uuid references staff_profiles(id) on delete set null,
  "caseNo" text,
  device text,
  officer text,
  progress int default 0,
  status text default 'monitoring',
  created_at timestamptz default now()
);

create table if not exists security_policies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  value text,
  status text default 'enabled',
  created_at timestamptz default now()
);

create table if not exists tracking_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  device_id uuid references devices(id) on delete cascade,
  latitude numeric,
  longitude numeric,
  accuracy numeric,
  network_type text,
  sim_serial_hash text,
  carrier text,
  battery int,
  event_time timestamptz default now()
);

create table if not exists company_settings (
  company_id uuid primary key references companies(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz default now()
);

create or replace function public.secguard_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'company_admin'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict (user_id) do update
  set role = excluded.role,
      full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists secguard_on_auth_user_created on auth.users;
create trigger secguard_on_auth_user_created
after insert on auth.users
for each row execute procedure public.secguard_handle_new_user();

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  actor text,
  action text not null,
  target text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table fraud_alerts add column if not exists assigned_to uuid references auth.users(id) on delete set null;
alter table fraud_alerts add column if not exists notes text;
alter table devices add column if not exists erp_status text default 'unsold';
alter table devices add column if not exists activation_status text default 'inactive';
alter table devices add column if not exists risk_score int default 20;
alter table tracking_logs add column if not exists carrier text;
alter table tracking_logs add column if not exists battery int;

alter table companies enable row level security;
alter table branches enable row level security;
alter table staff_profiles enable row level security;
alter table devices enable row level security;
alter table customers enable row level security;
alter table fraud_alerts enable row level security;
alter table theft_reports enable row level security;
alter table recovery_cases enable row level security;
alter table erp_sync_modules enable row level security;
alter table security_policies enable row level security;
alter table tracking_logs enable row level security;
alter table audit_logs enable row level security;
alter table user_profiles enable row level security;
alter table company_settings enable row level security;
alter table notifications enable row level security;

create or replace function public.secguard_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.user_profiles where user_id = auth.uid()),
    auth.jwt() -> 'user_metadata' ->> 'role',
    'customer'
  );
$$;

create or replace function public.secguard_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.user_profiles where user_id = auth.uid();
$$;

drop policy if exists "Authenticated users can manage companies" on companies;
drop policy if exists "Authenticated users can manage branches" on branches;
drop policy if exists "Authenticated users can manage staff" on staff_profiles;
drop policy if exists "Authenticated users can manage devices" on devices;
drop policy if exists "Authenticated users can manage customers" on customers;
drop policy if exists "Authenticated users can manage fraud alerts" on fraud_alerts;
drop policy if exists "Authenticated users can manage theft reports" on theft_reports;
drop policy if exists "Authenticated users can manage recovery cases" on recovery_cases;
drop policy if exists "Authenticated users can manage tracking logs" on tracking_logs;
drop policy if exists "Authenticated users can manage audit logs" on audit_logs;
drop policy if exists "Authenticated users can manage ERP sync modules" on erp_sync_modules;
drop policy if exists "Authenticated users can manage security policies" on security_policies;
drop policy if exists "Users can read their profile" on user_profiles;
drop policy if exists "Admins can manage profiles" on user_profiles;
drop policy if exists "Company members can read own company" on companies;
drop policy if exists "Admins can manage own company" on companies;
drop policy if exists "Company members can use branches" on branches;
drop policy if exists "Admins can use staff" on staff_profiles;
drop policy if exists "Company members can use devices" on devices;
drop policy if exists "Company members can use customers" on customers;
drop policy if exists "Officers can use fraud alerts" on fraud_alerts;
drop policy if exists "Recovery users can use theft reports" on theft_reports;
drop policy if exists "Recovery users can use recovery cases" on recovery_cases;
drop policy if exists "Company members can use tracking logs" on tracking_logs;
drop policy if exists "Admins can read audit logs" on audit_logs;
drop policy if exists "System can insert audit logs" on audit_logs;
drop policy if exists "Admins can manage ERP sync modules" on erp_sync_modules;
drop policy if exists "Admins can manage security policies" on security_policies;
drop policy if exists "Admins can manage company settings" on company_settings;
drop policy if exists "Users can manage own notifications" on notifications;

create policy "Users can read their profile"
on user_profiles for select to authenticated using (user_id = auth.uid() or public.secguard_role() = 'super_admin');

create policy "Admins can manage profiles"
on user_profiles for all to authenticated
using (public.secguard_role() in ('super_admin', 'company_admin'))
with check (public.secguard_role() in ('super_admin', 'company_admin'));

create policy "Company members can read own company"
on companies for select to authenticated
using (id = public.secguard_company_id() or public.secguard_role() = 'super_admin');

create policy "Admins can manage own company"
on companies for all to authenticated
using (id = public.secguard_company_id() or public.secguard_role() = 'super_admin')
with check (id = public.secguard_company_id() or public.secguard_role() = 'super_admin');

create policy "Company members can use branches"
on branches for all to authenticated
using (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin')
with check (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin');

create policy "Admins can use staff"
on staff_profiles for all to authenticated
using ((company_id = public.secguard_company_id() and public.secguard_role() = 'company_admin') or public.secguard_role() = 'super_admin')
with check ((company_id = public.secguard_company_id() and public.secguard_role() = 'company_admin') or public.secguard_role() = 'super_admin');

create policy "Company members can use devices"
on devices for all to authenticated
using (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null)
with check (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null);

create policy "Company members can use customers"
on customers for all to authenticated
using (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null)
with check (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null);

create policy "Officers can use fraud alerts"
on fraud_alerts for all to authenticated
using (public.secguard_role() in ('super_admin', 'company_admin', 'security_officer', 'investigator') and (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null))
with check (public.secguard_role() in ('super_admin', 'company_admin', 'security_officer', 'investigator') and (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null));

create policy "Recovery users can use theft reports"
on theft_reports for all to authenticated
using (public.secguard_role() in ('super_admin', 'company_admin', 'security_officer', 'investigator', 'customer') and (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null))
with check (public.secguard_role() in ('super_admin', 'company_admin', 'security_officer', 'investigator', 'customer') and (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null));

create policy "Recovery users can use recovery cases"
on recovery_cases for all to authenticated
using (public.secguard_role() in ('super_admin', 'company_admin', 'security_officer', 'investigator') and (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null))
with check (public.secguard_role() in ('super_admin', 'company_admin', 'security_officer', 'investigator') and (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null));

create policy "Company members can use tracking logs"
on tracking_logs for all to authenticated
using (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null)
with check (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null);

create policy "Admins can read audit logs"
on audit_logs for select to authenticated
using (public.secguard_role() in ('super_admin', 'company_admin') and (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null));

create policy "System can insert audit logs"
on audit_logs for insert to authenticated
with check (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin' or company_id is null);

create policy "Admins can manage ERP sync modules"
on erp_sync_modules for all to authenticated
using (public.secguard_role() in ('super_admin', 'company_admin'))
with check (public.secguard_role() in ('super_admin', 'company_admin'));

create policy "Admins can manage security policies"
on security_policies for all to authenticated
using (public.secguard_role() in ('super_admin', 'company_admin'))
with check (public.secguard_role() in ('super_admin', 'company_admin'));

create policy "Admins can manage company settings"
on company_settings for all to authenticated
using (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin')
with check (company_id = public.secguard_company_id() or public.secguard_role() = 'super_admin');

create policy "Users can manage own notifications"
on notifications for all to authenticated
using (user_id = auth.uid() or public.secguard_role() in ('super_admin', 'company_admin'))
with check (user_id = auth.uid() or public.secguard_role() in ('super_admin', 'company_admin'));
