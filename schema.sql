-- ============================================
-- LIFE APP DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- ---------- CALORIE TRACKING ----------

-- Custom foods/recipes the user creates
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  calories numeric not null,
  protein numeric default 0,
  carbs numeric default 0,
  fat numeric default 0,
  serving_size text default '1 serving',
  is_recipe boolean default false,
  created_at timestamptz default now()
);

-- Daily food log entries
create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  food_name text not null,
  calories numeric not null,
  protein numeric default 0,
  carbs numeric default 0,
  fat numeric default 0,
  quantity numeric default 1,
  meal_type text default 'snack', -- breakfast, lunch, dinner, snack
  logged_date date not null default current_date,
  created_at timestamptz default now()
);

-- ---------- WORKOUT TRACKING ----------

-- Workout sessions (one per day, can have many exercises)
create table if not exists workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  session_date date not null default current_date,
  name text default 'Workout',
  notes text,
  created_at timestamptz default now()
);

-- Individual exercises logged within a session
create table if not exists workout_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references workout_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_name text not null,
  sets integer,
  reps integer,
  weight numeric,
  weight_unit text default 'kg',
  order_index integer default 0,
  created_at timestamptz default now()
);

-- ---------- CALENDAR / TASKS & NOTES ----------

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  notes text,
  due_date date not null default current_date,
  completed boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table foods enable row level security;
alter table food_logs enable row level security;
alter table workout_sessions enable row level security;
alter table workout_exercises enable row level security;
alter table tasks enable row level security;

-- Foods policies
create policy "Users manage their own foods" on foods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Food logs policies
create policy "Users manage their own food logs" on food_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Workout sessions policies
create policy "Users manage their own workout sessions" on workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Workout exercises policies
create policy "Users manage their own workout exercises" on workout_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Tasks policies
create policy "Users manage their own tasks" on tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================
-- INDEXES for performance
-- ============================================

create index if not exists idx_food_logs_user_date on food_logs(user_id, logged_date);
create index if not exists idx_workout_sessions_user_date on workout_sessions(user_id, session_date);
create index if not exists idx_workout_exercises_session on workout_exercises(session_id);
create index if not exists idx_tasks_user_date on tasks(user_id, due_date);
create index if not exists idx_foods_user on foods(user_id);
