create table if not exists public.profiles (
  id uuid primary key,
  name text,
  city text,
  zodiac text,
  age int,
  interests jsonb default '[]'::jsonb,
  bio text,
  photos jsonb default '[]'::jsonb
);
alter table public.profiles enable row level security;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_self" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);
