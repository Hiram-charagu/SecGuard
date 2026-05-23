-- Secguard production-ready Supabase schema draft.
-- Run this in Supabase SQL Editor after reviewing policies for your final role model.

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text default 'Business',
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  manager text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists staff_profiles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  full_name text not null,
  role text not null,
  status text default 'active',
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
  evidence jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists theft_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  device_id uuid references devices(id) on delete set null,
  priority text default 'medium',
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists recovery_cases (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  theft_report_id uuid references theft_reports(id) on delete cascade,
  assigned_officer uuid references staff_profiles(id) on delete set null,
  progress int default 0,
  status text default 'monitoring',
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

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  actor text,
  action text not null,
  target text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table companies enable row level security;
alter table branches enable row level security;
alter table staff_profiles enable row level security;
alter table devices enable row level security;
alter table customers enable row level security;
alter table fraud_alerts enable row level security;
alter table theft_reports enable row level security;
alter table recovery_cases enable row level security;
alter table tracking_logs enable row level security;
alter table audit_logs enable row level security;

