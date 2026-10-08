// =====================================================================
// 사내 임직원 관리 OS — Supabase 연동 공통 스크립트
//
// DENTAL MBTI(dentalmbti.co.kr)와 같은 Supabase 프로젝트를 그대로 사용합니다.
// (기존 supabase-init.js 에 이미 공개되어 있던 프로젝트 URL / anon key와 동일한 값입니다.
//  anon key는 클라이언트에 노출되어도 되는 공개용 키이며, 실제 접근 제어는
//  Supabase의 행 단위 보안 규칙(RLS)이 담당합니다. 다른 프로젝트를 쓰고 싶다면
//  이 두 값만 바꾸면 됩니다.)
// =====================================================================
const HR_SUPABASE_URL = "https://fpkncnlslyojvbscsatl.supabase.co";
const HR_SUPABASE_ANON_KEY = "sb_publishable_esByF7c4c3dR2VU9cKS8fg_xu1ROIZo";
// =====================================================================

const hrsb = supabase.createClient(HR_SUPABASE_URL, HR_SUPABASE_ANON_KEY);

/* ---------------------- 인증(로그인) ---------------------- */
// 로그인 자체는 기존 DENTAL MBTI 관리자 로그인 화면(index.html)에서 이루어집니다.
// 같은 Supabase 프로젝트 + 같은 도메인이므로, index.html에서 로그인한 세션이
// 이 페이지들에서도 그대로 유지됩니다. (별도 로그인 불필요)
async function hrLogout(){
  await hrsb.auth.signOut();
}
async function hrGetSession(){
  const { data } = await hrsb.auth.getSession();
  return data.session;
}
// 관리자(admin) 전용 화면 진입 시 호출: 로그인이 안 되어 있거나, 로그인은 되어 있어도
// accounts 테이블의 role이 'admin'이 아니면(=치과 계정이면) 메인 로그인 화면으로 돌려보냅니다.
async function hrRequireAdmin(mainSiteUrl){
  const session = await hrGetSession();
  if(!session){ location.href = mainSiteUrl; return null; }
  const { data: profile, error } = await hrsb.from('accounts').select('*').eq('id', session.user.id).single();
  if(error || !profile || profile.role !== 'admin'){
    alert('관리자 전용 화면입니다.');
    location.href = mainSiteUrl;
    return null;
  }
  if(!profile.is_active){
    alert('관리자에 의해 계정 사용이 정지되었습니다.');
    await hrsb.auth.signOut();
    location.href = mainSiteUrl;
    return null;
  }
  return session.user;
}

/* ---------------------- 회사 정보 ---------------------- */
// 디투덴탈 내부용 OS는 회사가 하나뿐이므로, "내가 만든 회사"가 아니라
// 활성 admin 계정이면 누구나 보이는 회사 정보 1건을 그대로 가져옵니다
// (어느 admin이 먼저 등록했는지는 상관없이 전체 admin이 공유합니다).
async function hrGetMyCompany(){
  const { data, error } = await hrsb.from('hr_company').select('*').limit(1).maybeSingle();
  if(error){ console.error('[hrGetMyCompany]', error); return null; }
  return data;
}
async function hrUpsertCompany(fields){
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) throw new Error('로그인이 필요합니다.');
  const existing = await hrGetMyCompany();
  if(existing){
    const { data, error } = await hrsb.from('hr_company').update(fields).eq('id', existing.id).select().single();
    if(error) throw error;
    return data;
  } else {
    const { data, error } = await hrsb.from('hr_company').insert({ ...fields, owner_id: user.id }).select().single();
    if(error) throw error;
    return data;
  }
}

/* ---------------------- 직원 CRUD ---------------------- */
async function hrListEmployees(){
  const { data, error } = await hrsb.from('hr_employees').select('*').order('hire_date', { ascending: true });
  if(error){ console.error('[hrListEmployees]', error); return []; }
  return data;
}
async function hrSaveEmployee(emp){
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) throw new Error('로그인이 필요합니다.');
  if(emp.id){
    const { id, ...rest } = emp;
    const { data, error } = await hrsb.from('hr_employees').update(rest).eq('id', id).select().single();
    if(error) throw error;
    return data;
  } else {
    const { data, error } = await hrsb.from('hr_employees').insert({ ...emp, owner_id: user.id }).select().single();
    if(error) throw error;
    return data;
  }
}
async function hrDeleteEmployee(id){
  const { error } = await hrsb.from('hr_employees').delete().eq('id', id);
  if(error) throw error;
}

/* ---------------------- 면접 설문 (지원자 공개 페이지용) ---------------------- */
// 토큰으로 회사 이름 조회 (지원자 화면에서 "OO회사 입사지원 설문"으로 표시하기 위함)
async function hrGetCompanyByToken(token){
  const { data, error } = await hrsb.from('hr_company_public').select('*').eq('share_token', token).maybeSingle();
  if(error){ console.error('[hrGetCompanyByToken]', error); return null; }
  return data;
}
// 지원자가 설문 제출
async function hrSubmitInterview(payload){
  const { error } = await hrsb.from('hr_interview_submissions').insert(payload);
  if(error) throw error;
}

/* ---------------------- 면접 결과 (관리자 화면용) ---------------------- */
async function hrListSubmissions(){
  const { data, error } = await hrsb.from('hr_interview_submissions').select('*').order('submitted_at', { ascending: false });
  if(error){ console.error('[hrListSubmissions]', error); return []; }
  return data;
}
async function hrMarkReviewed(id, reviewed){
  const { error } = await hrsb.from('hr_interview_submissions').update({ reviewed }).eq('id', id);
  if(error) throw error;
}
async function hrDeleteSubmission(id){
  const { error } = await hrsb.from('hr_interview_submissions').delete().eq('id', id);
  if(error) throw error;
}

/* ---------------------- 지출 분석 (거래처 학습 매핑) ---------------------- */
// 이 관리자가 지금까지 학습시킨 "거래처 -> 대분류/항목" 매핑 전체를 가져옵니다.
async function hrListPayeeMap(){
  const { data, error } = await hrsb.from('hr_expense_payee_map').select('*');
  if(error){ console.error('[hrListPayeeMap]', error); return []; }
  return data;
}
// 신규로 분류를 입력했거나(또는 엑셀에 이미 적혀 있던 값을 그대로 학습한) 거래처들을
// payee_key 기준으로 upsert합니다 (같은 거래처가 다시 오면 최신 분류로 갱신됩니다).
async function hrUpsertPayeeMap(rows){
  if(!rows || rows.length===0) return [];
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) throw new Error('로그인이 필요합니다.');
  const withOwner = rows.map(r=>({ ...r, owner_id: user.id, updated_at: new Date().toISOString() }));
  const { data, error } = await hrsb.from('hr_expense_payee_map')
    .upsert(withOwner, { onConflict: 'payee_key' }).select();
  if(error) throw error;
  return data || [];
}

/* ---------------------- 지출 분석 (거래 원장) ---------------------- */
// row_hash가 이미 존재하는 거래는 조용히 건너뛰고(중복 방지), 새 거래만 저장합니다.
async function hrInsertExpenseRecords(rows){
  if(!rows || rows.length===0) return [];
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) throw new Error('로그인이 필요합니다.');
  const withOwner = rows.map(r=>({ ...r, owner_id: user.id }));
  const { data, error } = await hrsb.from('hr_expense_records')
    .upsert(withOwner, { onConflict: 'row_hash', ignoreDuplicates: true }).select();
  if(error) throw error;
  return data || [];
}
// 저장되어 있는 년-월(YYYY-MM) 목록을 최신순으로 가져옵니다.
async function hrListExpenseYearMonths(){
  const { data, error } = await hrsb.from('hr_expense_records')
    .select('year_month').order('year_month', { ascending:false });
  if(error){ console.error('[hrListExpenseYearMonths]', error); return []; }
  return [...new Set((data||[]).map(d=>d.year_month))];
}
// 특정 년-월들(예: ['2026-08','2026-07'])의 거래 내역 전체를 가져옵니다.
async function hrListExpenseRecordsByMonths(months){
  if(!months || months.length===0) return [];
  const { data, error } = await hrsb.from('hr_expense_records')
    .select('*').in('year_month', months).order('txn_date', { ascending:false });
  if(error){ console.error('[hrListExpenseRecordsByMonths]', error); return []; }
  return data;
}
// 이미 저장된 거래 1건을 자유롭게 수정합니다 (날짜/통장/분류/거래내용/금액 등).
async function hrUpdateExpenseRecord(id, fields){
  const { error } = await hrsb.from('hr_expense_records').update(fields).eq('id', id);
  if(error) throw error;
}
// 거래 1건 삭제.
async function hrDeleteExpenseRecord(id){
  const { error } = await hrsb.from('hr_expense_records').delete().eq('id', id);
  if(error) throw error;
}
// 거래 여러 건을 한 번에 삭제 (결산확인리스트의 체크박스 다중 선택 삭제용).
async function hrDeleteExpenseRecords(ids){
  if(!ids || ids.length===0) return;
  const { error } = await hrsb.from('hr_expense_records').delete().in('id', ids);
  if(error) throw error;
}

/* ---------------------- 지출 분석 (통장/계좌 목록) ---------------------- */
// 통장이 여러 개인 경우를 위해, 통장 이름 목록을 관리합니다.
async function hrListExpenseAccounts(){
  const { data, error } = await hrsb.from('hr_expense_accounts').select('*').order('label', { ascending:true });
  if(error){ console.error('[hrListExpenseAccounts]', error); return []; }
  return data;
}
async function hrUpsertExpenseAccount(fields){
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) throw new Error('로그인이 필요합니다.');
  const { data, error } = await hrsb.from('hr_expense_accounts')
    .upsert({ ...fields, owner_id: user.id }, { onConflict: 'label' }).select().single();
  if(error) throw error;
  return data;
}
async function hrDeleteExpenseAccount(id){
  const { error } = await hrsb.from('hr_expense_accounts').delete().eq('id', id);
  if(error) throw error;
}

/* ---------------------- 지출 분석 (업로드 파일 현황/삭제) ---------------------- */
// 엑셀 1건을 저장할 때마다 "업로드 기록"을 하나 만듭니다. 이 기록을 삭제하면
// (hr_expense_records.upload_batch_id의 on delete cascade 덕분에) 그 파일에서
// 저장된 거래내역 전체가 함께 삭제됩니다 — 파일 자체에 오류가 있었을 때 사용합니다.
async function hrCreateExpenseUpload(fields){
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) throw new Error('로그인이 필요합니다.');
  const { data, error } = await hrsb.from('hr_expense_uploads')
    .insert({ ...fields, owner_id: user.id }).select().single();
  if(error) throw error;
  return data;
}
async function hrUpdateExpenseUploadRowCount(id, row_count){
  const { error } = await hrsb.from('hr_expense_uploads').update({ row_count }).eq('id', id);
  if(error) throw error;
}
async function hrListExpenseUploads(){
  const { data, error } = await hrsb.from('hr_expense_uploads').select('*').order('uploaded_at', { ascending:false });
  if(error){ console.error('[hrListExpenseUploads]', error); return []; }
  return data;
}
async function hrDeleteExpenseUpload(id){
  const { error } = await hrsb.from('hr_expense_uploads').delete().eq('id', id);
  if(error) throw error;
}

/* ---------------------- 홈 캘린더 — 모든 관리자 공유 일정 ---------------------- */
// year: 숫자(예: 2026), month: 1~12. 해당 달에 속하는 일정 전체를 가져옵니다.
// owner_id가 아니라 RLS 규칙(활성 admin 계정이면 모두 접근 가능)으로 공유되므로
// 다른 관리자가 입력한 일정도 함께 보입니다.
//
// 반복 일정(매월/매년)은 첫 일정 1건만 저장되어 있으므로, 여기서 그 달의 해당 날짜로 펼쳐서
// 돌려줍니다. 돌려주는 각 항목의 schedule_date는 "그 달에 표시될 날짜"이고,
//   master_date  = 원래(첫) 일정 날짜
//   is_recurring = 반복 일정 여부
// 가 추가됩니다. 31일 같은 날짜가 없는 달에는 그 달의 말일에 표시합니다.
async function hrListSchedulesByMonth(year, month){
  const mm = String(month).padStart(2,'0');
  const startStr = `${year}-${mm}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endStr = `${year}-${mm}-${String(lastDay).padStart(2,'0')}`;

  // 이 달에 있는 일반 일정 + 이 달 이전에 시작한 반복 일정을 한 번에 가져옵니다.
  let { data, error } = await hrsb.from('hr_schedule').select('*')
    .or(`and(schedule_date.gte.${startStr},schedule_date.lte.${endStr}),and(repeat_type.neq.none,schedule_date.lte.${endStr})`);
  if(error){
    // 반복 일정용 SQL(hr_schedule_repeat.sql)을 아직 실행하지 않은 경우를 대비한 예전 방식 조회
    console.warn('[hrListSchedulesByMonth] 반복 컬럼 없음 — 일반 조회로 대체', error);
    const fb = await hrsb.from('hr_schedule').select('*')
      .gte('schedule_date', startStr).lte('schedule_date', endStr);
    if(fb.error){ console.error('[hrListSchedulesByMonth]', fb.error); return []; }
    data = fb.data;
  }

  const out = [];
  (data || []).forEach(r=>{
    const rt = r.repeat_type || 'none';
    if(rt === 'none'){
      if(r.schedule_date >= startStr && r.schedule_date <= endStr){
        out.push({ ...r, master_date: r.schedule_date, is_recurring: false });
      }
      return;
    }
    const [ay, am, ad] = r.schedule_date.split('-').map(Number);
    const inRange = (rt === 'monthly')
      ? (year > ay || (year === ay && month >= am))
      : (month === am && year >= ay);
    if(!inRange) return;
    const dateStr = `${year}-${mm}-${String(Math.min(ad, lastDay)).padStart(2,'0')}`;
    if(dateStr < r.schedule_date) return;
    if(r.repeat_until && dateStr > r.repeat_until) return;
    if((r.exdates || []).includes(dateStr)) return;
    out.push({ ...r, schedule_date: dateStr, master_date: r.schedule_date, is_recurring: true });
  });
  out.sort((a,b)=> a.schedule_date.localeCompare(b.schedule_date) || (a.start_time||'99:99').localeCompare(b.start_time||'99:99'));
  return out;
}
async function hrCreateSchedule(fields){
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) throw new Error('로그인이 필요합니다.');
  const { data, error } = await hrsb.from('hr_schedule')
    .insert({ ...fields, created_by: user.id, created_by_email: user.email }).select().single();
  if(error) throw error;
  return data;
}
async function hrUpdateSchedule(id, fields){
  const { error } = await hrsb.from('hr_schedule')
    .update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id);
  if(error) throw error;
}
async function hrDeleteSchedule(id){
  const { error } = await hrsb.from('hr_schedule').delete().eq('id', id);
  if(error) throw error;
}
