-- init schema
create extension if not exists pgcrypto;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  photos text[] default '{}',
  status text not null default 'pending' check (status in ('pending','approved','expired')),
  vip_until timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
