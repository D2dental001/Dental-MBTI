-- =====================================================================
-- 회사 데이터(직원/통장/비용결산/면접결과 등)를 "입력한 그 관리자 계정"에만
-- 보이게 하던 규칙을 캘린더처럼 "활성 admin 계정이면 전부 공유"로 바꿉니다.
--
-- 지금까지는 각 테이블이 owner_id = auth.uid() 로 잠겨 있어서, admin 계정을
-- 새로 하나 더 만들면(예: lee@d2.com) 그 계정에서는 기존 admin이 입력해 둔
-- 직원/통장/비용결산/면접결과 데이터가 전혀 보이지 않았습니다 — 버그가 아니라
-- "계정별로 데이터를 분리"하는 원래 DENTAL MBTI(치과 SaaS)용 규칙이 그대로
-- 적용되어 있었기 때문입니다.
--
-- 이 스크립트를 한 번 실행하면:
--  - hr_company, hr_employees, hr_interview_submissions,
--    hr_expense_payee_map, hr_expense_records, hr_expense_accounts,
--    hr_expense_uploads 전부 "활성 admin 계정"이면 누구나 보고/입력/수정/삭제 가능
--  - 중복 방지(학습된 거래처 분류, 거래 중복 업로드 방지, 통장 이름 중복 방지)도
--    "내 계정 안에서만" 이 아니라 "회사 전체에서" 기준으로 바뀝니다.
--
-- 실행 전 준비: 반드시 이 스크립트 실행 "후"에, 아래에서 함께 드리는
-- 새 supabase-init-hr.js 파일로 교체해 주세요(upsert 중복 체크 기준이
-- owner_id 포함 조합 → 단일 컬럼으로 바뀌는 부분과 맞물려 있습니다).
-- =====================================================================

-- ---------------------- 회사 정보 ----------------------
drop policy if exists "owner all company" on public.hr_company;
create policy "admin share company" on public.hr_company
  for all using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  )
  with check (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );

-- ---------------------- 직원 ----------------------
drop policy if exists "owner all employees" on public.hr_employees;
create policy "admin share employees" on public.hr_employees
  for all using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  )
  with check (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );

-- ---------------------- 면접 결과 (지원자 제출은 그대로 익명 insert 허용) ----------------------
drop policy if exists "owner select submissions" on public.hr_interview_submissions;
drop policy if exists "owner update submissions" on public.hr_interview_submissions;
drop policy if exists "owner delete submissions" on public.hr_interview_submissions;

create policy "admin share select submissions" on public.hr_interview_submissions
  for select using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );
create policy "admin share update submissions" on public.hr_interview_submissions
  for update using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );
create policy "admin share delete submissions" on public.hr_interview_submissions
  for delete using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );

-- ---------------------- 비용결산: 거래처 학습 매핑 ----------------------
drop policy if exists "owner all payee map" on public.hr_expense_payee_map;
create policy "admin share payee map" on public.hr_expense_payee_map
  for all using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  )
  with check (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );
-- 분류 학습도 "회사 전체"에서 한 번만 쌓이도록, 중복 방지 기준을 owner_id+payee_key → payee_key 단독으로 변경
alter table public.hr_expense_payee_map drop constraint if exists hr_expense_payee_map_owner_id_payee_key_key;
alter table public.hr_expense_payee_map add constraint hr_expense_payee_map_payee_key_key unique (payee_key);

-- ---------------------- 비용결산: 거래 원장 ----------------------
drop policy if exists "owner all expense records" on public.hr_expense_records;
create policy "admin share expense records" on public.hr_expense_records
  for all using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  )
  with check (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );
-- 중복 업로드 방지 기준을 owner_id+row_hash → row_hash 단독으로 변경 (회사 전체 기준 중복 방지)
alter table public.hr_expense_records drop constraint if exists hr_expense_records_owner_id_row_hash_key;
alter table public.hr_expense_records add constraint hr_expense_records_row_hash_key unique (row_hash);

-- ---------------------- 비용결산: 통장(계좌) 목록 ----------------------
drop policy if exists "owner all expense accounts" on public.hr_expense_accounts;
create policy "admin share expense accounts" on public.hr_expense_accounts
  for all using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  )
  with check (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );
-- 통장 이름 중복 방지 기준을 owner_id+label → label 단독으로 변경
alter table public.hr_expense_accounts drop constraint if exists hr_expense_accounts_owner_id_label_key;
alter table public.hr_expense_accounts add constraint hr_expense_accounts_label_key unique (label);

-- ---------------------- 비용결산: 업로드 파일 현황 ----------------------
drop policy if exists "owner all expense uploads" on public.hr_expense_uploads;
create policy "admin share expense uploads" on public.hr_expense_uploads
  for all using (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  )
  with check (
    exists (select 1 from public.accounts a where a.id = auth.uid() and a.role = 'admin' and a.is_active)
  );

notify pgrst, 'reload schema';

-- =====================================================================
-- 주의: 만약 그동안 서로 다른 admin 계정으로 "같은 거래처"나 "같은 통장 이름"을
-- 각각 따로 입력해 두셨다면(흔치 않지만), 위 unique 제약을 payee_key/label
-- 단독으로 바꾸는 과정에서 "duplicate key" 오류가 날 수 있습니다.
-- 그 경우 이 스크립트를 보내주시면 중복 정리 쿼리를 추가로 만들어 드립니다.
-- =====================================================================
