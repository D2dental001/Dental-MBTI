// =====================================================================
// 이 파일 상단 두 줄만 본인 Supabase 프로젝트 값으로 바꾸면 됩니다.
// Supabase 대시보드 → Project Settings → API 에서 확인할 수 있습니다.
// =====================================================================
const SUPABASE_URL = "https://fpkncnlslyojvbscsatl.supabase.co";
   const SUPABASE_ANON_KEY = "sb_publishable_esByF7c4c3dR2VU9cKS8fg_xu1ROIZo";
// =====================================================================

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 현재 로그인한 사람의 accounts 테이블 정보(역할, 활성여부, 치과명, 로고 등)를 가져옵니다.
async function sbGetMyProfile() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data, error } = await sb.from('accounts').select('*').eq('id', user.id).single();
  if (error) { console.error('[sbGetMyProfile]', error); return null; }
  return data;
}

// 로그인한 사람의 공인 IP를 무료 조회 서비스로 확인해서 login_logs 테이블에 기록합니다.
async function sbLogLoginIp(accountId) {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const { ip } = await res.json();
    await sb.from('login_logs').insert({ account_id: accountId, ip, user_agent: navigator.userAgent });
  } catch (e) {
    console.warn('[sbLogLoginIp] IP 기록 실패', e);
  }
}

function sbNewSessionId() {
  return (crypto.randomUUID ? crypto.randomUUID() : 'sess-' + Date.now() + '-' + Math.random().toString(16).slice(2));
}

// 로그인 성공 직후 호출합니다: 새 세션ID를 만들어 DB에 기록하고, 이 브라우저 탭에도 저장합니다.
// 다른 PC/브라우저에서 같은 계정으로 로그인하면 이 값이 새로 덮어써지므로,
// 기존에 로그인해 있던 곳은 sbStartGuard()가 주기적으로 확인하다가 자동 로그아웃됩니다.
async function sbClaimSession(accountId) {
  const sessionId = sbNewSessionId();
  await sb.from('accounts').update({ current_session_id: sessionId }).eq('id', accountId);
  sessionStorage.setItem('sb_session_id', sessionId);
  return sessionId;
}

// 로그인이 필요한 화면(문진표, 분석 화면 등)에서 페이지가 열릴 때 호출합니다.
// 로그인이 안 되어 있으면 즉시 로그인 페이지로 보냅니다.
async function sbRequireLogin(loginPageUrl) {
  const profile = await sbGetMyProfile();
  if (!profile) { location.href = loginPageUrl; return null; }
  if (!profile.is_active) {
    alert('관리자에 의해 계정 사용이 정지되었습니다.');
    await sb.auth.signOut();
    location.href = loginPageUrl;
    return null;
  }
  return profile;
}

// 보호된 화면에서 계속 실행하며, 활성 상태/중복 로그인 여부를 주기적으로(기본 20초) 검사합니다.
// 다른 곳에서 로그인되었거나 관리자가 계정을 정지시키면 자동으로 로그아웃되고 로그인 페이지로 이동합니다.
function sbStartGuard(loginPageUrl, intervalMs) {
  async function check() {
    const profile = await sbGetMyProfile();
    if (!profile) { location.href = loginPageUrl; return; }
    if (!profile.is_active) {
      alert('관리자에 의해 계정 사용이 정지되었습니다.');
      await sb.auth.signOut();
      sessionStorage.removeItem('sb_session_id');
      location.href = loginPageUrl;
      return;
    }
    const mySession = sessionStorage.getItem('sb_session_id');
    if (profile.current_session_id && mySession && profile.current_session_id !== mySession) {
      alert('다른 PC(또는 브라우저)에서 같은 계정으로 로그인되어 자동으로 로그아웃되었습니다.');
      await sb.auth.signOut();
      sessionStorage.removeItem('sb_session_id');
      location.href = loginPageUrl;
    }
  }
  check();
  return setInterval(check, intervalMs || 20000);
}
