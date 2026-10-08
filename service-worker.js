// 사내 임직원 관리 OS — 최소 서비스 워커
// 역할은 딱 두 가지입니다:
//  1) 모바일 브라우저가 "홈 화면에 추가(앱 설치)"를 제안할 수 있도록(PWA 설치 요건 충족)
//  2) 앱 껍데기(HTML/아이콘)를 가볍게 캐싱해 오프라인에서도 화면이 완전히 깨지지 않도록
// Supabase API 요청 등 데이터 통신은 캐싱하지 않고 항상 네트워크로 보냅니다.

const CACHE_NAME = 'hr-os-shell-v10';
const SHELL_FILES = [
  'hr-dashboard.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'calendar.html',
  'calendar-manifest.webmanifest',
  'calendar-icon-192.png',
  'calendar-icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // 같은 출처(배포된 사이트)의 파일 요청만 처리하고, Supabase 등 외부 API 호출은 그대로 둡니다.
  if(url.origin !== self.location.origin) return;
  if(event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(()=>{});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
