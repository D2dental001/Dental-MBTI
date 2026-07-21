-- =====================================================================
-- DENTAL MBTI 포털 초기 설정 스크립트
-- Supabase 프로젝트의 SQL Editor에 이 파일 내용을 전부 붙여넣고 "Run"을 누르세요.
-- 한 번만 실행하면 됩니다.
-- =====================================================================

-- 1) 계정 정보를 담는 테이블
create table if not exists public.accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'clinic' check (role in ('admin', 'clinic')),
  clinic_name text,
  logo_url text,
  is_active boolean not null default true,
  current_session_id text,
  created_at timestamptz not null default now()
);

-- 2) 로그인 IP 이력을 담는 테이블
create table if not exists public.login_logs (
  id bigint generated always as identity primary key,
  account_id uuid not null references public.accounts(id) on delete cascade,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- 3) 새 사용자가 (Authentication 화면에서) 추가되면 accounts 테이블에
--    자동으로 기본 정보(치과 계정, 활성 상태)를 만들어주는 자동화
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.accounts (id, email, role, clinic_name, is_active)
  values (new.id, new.email, 'clinic', new.email, true);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) 보안 규칙(RLS) 켜기
alter table public.accounts enable row level security;
alter table public.login_logs enable row level security;

-- 본인 계정 정보는 조회 가능
drop policy if exists "select own account" on public.accounts;
create policy "select own account" on public.accounts
  for select using (auth.uid() = id);

-- 관리자는 모든 계정 정보 조회 가능
drop policy if exists "admin select all accounts" on public.accounts;
create policy "admin select all accounts" on public.accounts
  for select using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin')
  );

-- 본인 계정 정보는 수정 가능 (치과명/로고/세션ID 갱신용)
drop policy if exists "update own account" on public.accounts;
create policy "update own account" on public.accounts
  for update using (auth.uid() = id);

-- 관리자는 모든 계정 정보 수정 가능 (활성/비활성 전환용)
drop policy if exists "admin update all accounts" on public.accounts;
create policy "admin update all accounts" on public.accounts
  for update using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin')
  );

-- 로그인 기록은 본인 것만 등록 가능
drop policy if exists "insert own login log" on public.login_logs;
create policy "insert own login log" on public.login_logs
  for insert with check (auth.uid() = account_id);

-- 본인 로그인 기록은 조회 가능
drop policy if exists "select own login log" on public.login_logs;
create policy "select own login log" on public.login_logs
  for select using (auth.uid() = account_id);

-- 관리자는 모든 로그인 기록 조회 가능
drop policy if exists "admin select all login logs" on public.login_logs;
create policy "admin select all login logs" on public.login_logs
  for select using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin')
  );

-- =====================================================================
-- 여기까지 실행하면 준비 완료입니다.
-- 다음 순서로 진행하세요:
--   1. Authentication → Users → Add user 에서 본인 이메일로 "첫 계정"을 만드세요.
--   2. Table Editor → accounts 테이블에서 방금 만들어진 행을 찾아
--      role 컬럼을 'clinic' 에서 'admin' 으로 바꿔주세요. (이 사람이 관리자입니다)
--   3. 이후 거래처(치과)를 추가할 때는 Authentication → Users → Add user 로
--      이메일/비밀번호만 추가하면 accounts 테이블에 role='clinic' 인 행이 자동 생성됩니다.
--      Table Editor에서 clinic_name 컬럼에 실제 치과명을 입력해 주세요.
-- =====================================================================
