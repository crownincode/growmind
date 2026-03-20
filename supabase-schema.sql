-- Run this in your Supabase SQL Editor

-- Plants table
create table if not exists plants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  species text,
  location text,
  photo_url text,
  health_status text default 'green',
  last_diagnosis jsonb,
  care_plan jsonb,
  next_water_date date,
  next_check_date date,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table plants enable row level security;

-- Policy: Users can only manage their own plants
drop policy if exists "Users manage own plants" on plants;
create policy "Users manage own plants" on plants
  for all using (auth.uid() = user_id);

-- Reminders table
create table if not exists reminders (
  id uuid default gen_random_uuid() primary key,
  plant_id uuid references plants on delete cascade not null,
  user_id uuid references auth.users not null,
  due_date date not null,
  action text not null,
  sent boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table reminders enable row level security;

-- Policy: Users can only manage their own reminders
drop policy if exists "Users manage own reminders" on reminders;
create policy "Users manage own reminders" on reminders
  for all using (auth.uid() = user_id);

-- Create index for faster lookups
create index if not exists idx_reminders_due_date on reminders(due_date);
create index if not exists idx_reminders_user_id on reminders(user_id);
create index if not exists idx_plants_user_id on plants(user_id);
