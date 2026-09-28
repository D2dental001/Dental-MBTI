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
async function hrGetMyCompany(){
  const { data: { user } } = await hrsb.auth.getUser();
  if(!user) return null;
  const { data, error } = await hrsb.from('hr_company').select('*').eq('owner_id', user.id).maybeSingle();
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
