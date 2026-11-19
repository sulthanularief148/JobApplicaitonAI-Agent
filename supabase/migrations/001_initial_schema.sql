-- ApplyWise AI: Initial Database Schema
-- This migration creates all tables needed for the application.
-- Every table has Row Level Security (RLS) so users can only access their own data.

-- ============================================================
-- 1. PROFILES — stores user info, auto-created on signup
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Users can only read and update their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. CVS — one active CV per user (extracted PDF text)
-- ============================================================
create table public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  raw_text text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_cvs_user_id on public.cvs(user_id);

alter table public.cvs enable row level security;

create policy "Users can read own CVs"
  on public.cvs for select
  using (auth.uid() = user_id);

create policy "Users can insert own CVs"
  on public.cvs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own CVs"
  on public.cvs for update
  using (auth.uid() = user_id);

create policy "Users can delete own CVs"
  on public.cvs for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 3. JOBS — stored job postings the user pastes in
-- ============================================================
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text not null,
  location text,
  description text not null,
  url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_jobs_user_id on public.jobs(user_id);

alter table public.jobs enable row level security;

create policy "Users can read own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 4. ANALYSES — AI analysis results for a CV + job pair
-- ============================================================
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  match_score integer not null check (match_score between 0 and 100),
  score_breakdown jsonb not null default '{}',
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  keywords_to_add text[] not null default '{}',
  tailored_summary text not null,
  tailored_bullets text[] not null default '{}',
  cover_note text not null,
  linkedin_message text not null,
  honesty_notes text[] not null default '{}',
  created_at timestamptz default now() not null
);

create index idx_analyses_user_id on public.analyses(user_id);
create index idx_analyses_job_id on public.analyses(job_id);

alter table public.analyses enable row level security;

create policy "Users can read own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 5. APPLICATIONS — the job application tracker
-- ============================================================
create type public.application_status as enum (
  'saved', 'applied', 'interview', 'offer', 'rejected'
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete set null,
  company text not null,
  role text not null,
  location text,
  status public.application_status not null default 'saved',
  applied_date date,
  follow_up_date date,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_applications_user_id on public.applications(user_id);
create index idx_applications_status on public.applications(user_id, status);

alter table public.applications enable row level security;

create policy "Users can read own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 6. ANALYSIS_COUNTS — rate limiting (20 analyses per day)
-- ============================================================
create table public.analysis_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  count integer not null default 1,
  -- One row per user per day
  unique (user_id, date)
);

create index idx_analysis_counts_user_date on public.analysis_counts(user_id, date);

alter table public.analysis_counts enable row level security;

create policy "Users can read own counts"
  on public.analysis_counts for select
  using (auth.uid() = user_id);

create policy "Users can insert own counts"
  on public.analysis_counts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own counts"
  on public.analysis_counts for update
  using (auth.uid() = user_id);

-- ============================================================
-- Helper: auto-update updated_at timestamp
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger set_cvs_updated_at
  before update on public.cvs
  for each row execute function public.update_updated_at();

create trigger set_jobs_updated_at
  before update on public.jobs
  for each row execute function public.update_updated_at();

create trigger set_applications_updated_at
  before update on public.applications
  for each row execute function public.update_updated_at();
