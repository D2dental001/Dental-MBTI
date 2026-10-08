-- =====================================================================
-- 캘린더 "반복 일정(매월 / 매년)" 지원
-- Supabase SQL Editor에서 한 번만 실행하세요. (기존 일정 데이터는 그대로 유지됩니다)
--
--  repeat_type  : 'none'(반복 없음, 기본값) / 'monthly'(매월 같은 날짜) / 'yearly'(매년 같은 날짜)
--  repeat_until : 반복 종료일 (비어 있으면 계속 반복)
--  exdates      : "이 날짜만 삭제"한 날짜 목록 (반복 일정에서 특정 날짜만 빼기 위함)
--
-- 반복 일정은 첫 일정(schedule_date) 1건만 저장하고, 화면에서 매월/매년 날짜마다
-- 펼쳐서 보여줍니다. 그래서 수정하면 모든 반복 날짜에 한꺼번에 반영됩니다.
-- =====================================================================

alter table public.hr_schedule
  add column if not exists repeat_type text not null default 'none';

alter table public.hr_schedule
  drop constraint if exists hr_schedule_repeat_type_check;
alter table public.hr_schedule
  add constraint hr_schedule_repeat_type_check check (repeat_type in ('none','monthly','yearly'));

alter table public.hr_schedule
  add column if not exists repeat_until date;

alter table public.hr_schedule
  add column if not exists exdates text[] not null default '{}';

notify pgrst, 'reload schema';
