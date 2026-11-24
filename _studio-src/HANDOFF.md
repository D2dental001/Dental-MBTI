# 홈페이지 템플릿 스튜디오 — 작업 인수인계 (2026-11-24)

새 대화에서 이 파일을 먼저 읽고 이어서 작업한다. 답변은 항상 한국어.

## 사용자 / 사업 맥락
- 사용자: 디투덴탈(D2dental) 대표. Claude와 의료(치과) 홈페이지 제작 사업을 시작함.
- DENTAL MBTI 관리자 OS(https://dentalmbti.co.kr) 안의 **홈페이지 템플릿 스튜디오**(`hp-studio.html`)와 공개 뷰어(`hp-view.html`)를 만들고 있음.
- 포트폴리오 07 = **신촌 e-스타치과** (사용자의 마케팅 고객). 테마 `luxe`(프리미엄 심미형), 심미(라미네이트·미백) 강조.
- 규칙: 의료법상 **가격·이벤트 문구 금지**, 롤링배너에 원장 사진 금지, 파란색 대신 따뜻한 에스프레소·금색 팔레트, 로고는 **원본 e-스타치과 로고를 고화질로 재현**(eLogoW / eLogoC)만 사용.
- 작업에 필요한 도메인 접근은 묻지 말고 진행. 배포는 GitHub main에 바로 푸시하고 라이브 확인.
- 커밋 작성자 D2dental001, 커밋 메시지 끝에 사용자가 지정한 Co-Authored-By / Claude-Session 줄 유지.

## 저장소 / 배포
- 저장소: `D2dental001/Dental-MBTI` (Vercel 자동 배포 → dentalmbti.co.kr)
- 빌드 결과물: 저장소 루트 `hp-studio.html`, `hp-view.html`, 자산 `assets/hp-studio/` (e-스타 자산은 `assets/hp-studio/estar/`)
- 이 폴더(`_studio-src/`)는 소스와 테스트. `.vercelignore`로 배포 제외됨.

## 작업 환경 복원 (새 세션)
```bash
git clone https://github.com/D2dental001/Dental-MBTI.git /home/claude/dental-mbti
W=/home/claude/hpwork; mkdir -p $W/os $W/shots
cp -r /home/claude/dental-mbti/_studio-src/osb $W/osb
cp /home/claude/dental-mbti/_studio-src/tests/* $W/
ln -s /home/claude/dental-mbti/assets $W/os/assets
cd $W/osb && python3 assemble2.py          # → $W/os/hp-studio.html, hp-view.html
# 테스트: npm i playwright jszip (jszip은 $W/npm/node_modules/jszip 경로를 t2.js가 참조) 후
cd $W && node t8.js   # 회귀 테스트, 'errors []'면 정상
```
배포: `cp $W/os/hp-studio.html $W/os/hp-view.html /home/claude/dental-mbti/` → 커밋 → `git push origin main` → `curl https://dentalmbti.co.kr/hp-studio.html?nc=$RANDOM | grep -c <새 코드 표식>`으로 라이브 확인. Vercel이 배포를 놓치면 빈 커밋으로 재트리거.

## 소스 구조 (osb/)
- `themes.js` 테마 기본·`mapBox()`·`baBlock()`(전후비교) / `blocks.js` 공통 블록·공통 JS(슬라이드, 상담목록 롤링, 커스텀 드롭다운 `select.dd`, 전후비교 드래그 안내) / `pages.js` 페이지 렌더·로고/약도 이미지 치환 / `balance.js` 06 밸런스 테마 / `luxe.js` 07 프리미엄 테마(헤더·서브메뉴·빠른상담바·lvideo 영상블록) / `estar.js` 07 e-스타 시드 콘텐츠 / `app2.js` 에디터 앱 + 기존 저장본 자동 마이그레이션 플래그(_fixPrice, _video, _qs8, _v1080b, _map1 등)
- 콘텐츠 모델 v3: `{v:3, site:{...}, pages:[{id,slug,title,blocks:[{id,type,hidden,data}]}]}`, 이미지 `asset:이름` → `assets/hp-studio/이름.webp`
- 기본 정보에 `mapImg`(약도 이미지) 필드 추가됨 — 있으면 구글지도 대신 약도 + "지도 앱에서 열기" 버튼.

## 오늘 완료한 것 (모두 라이브 배포)
- 메인 영상 1080p 와이드컷 `estar_hero3.mp4` (미소 장면은 사용자가 준 사진으로 교체), 포스터 `heroPoster2.webp`
- 하단 온라인 상담 목록 실시간처럼 롤링(8개 예시 문의 — 실제 문의로 교체 권장)
- 빠른상담 '상담 분야' 반투명 커스텀 드롭다운
- 프리미엄 테마 서브메뉴: 반투명 에스프레소 패널, 현재 메뉴 금색
- 전후비교: 원형 손잡이 + "좌우로 밀어서 전후 비교" 안내 + 처음 보일 때 좌우 흔들기
- 오시는 길 약도: **2026-11-24 13:2x `mapIllust4.webp`로 교체·라이브 배포 완료** (소스 `map/nv8.py`, 거리뷰 기준 현대백화점·이스타 건물 모델링, 1번 출구 서쪽 입구, '신촌역 1번 출구 도보 1분' 배너)

## (완료) 오시는 길 약도 — 아래는 작업 기록
- 정확한 위치(네이버 지도 `map/ref/naver_map.png` 기준, 사용자 확인 사항):
  - 목적지 = **KFC 건물 3층 e-스타치과** (서울 서대문구 신촌로 79). 1층 KFC.
  - **연세로가 KFC 건물과 현대백화점 신촌점 사이**에 있음. 현대백화점 지도상 오른쪽(동쪽)은 **작은 보행로**.
  - 신촌로는 왼쪽 위에서 내려와 신촌역 부근에서 완만히 휘어 오른쪽으로 올라감. 신촌역(2호선)은 그 아래.
  - 출구: 1·2·4번 북쪽, 5·8번 남쪽. 1번 출구에서 현대백화점 앞을 지나 연세로를 건너 KFC 건물로.
- 현재 최신 시안: `map/nvm.png` (생성 스크립트 `map/nv.py`, 렌더 `tests/nvshot.js`). 출구는 지하철 출입구 일러스트, 주변 건물 파스텔.
- 사용자가 원하는 스타일: `map/ref/gpt_style_reference.png` 같은 **GPT 이미지식 자연스러운 일러스트**. (참고: 그 GPT 그림은 위치·주소 '신촌로 179'가 틀림 — 위치는 반드시 네이버 기준)
- 코드 드로잉으로는 질감 한계 → 사용자가 이미지 생성 플러그인 설치함. **다음 단계: Hyper Marketing 플러그인의 `image-generation` 스킬(images_generate, gpt-image / nano-banana 모델)로 `nvm.png`를 위치 참고(image-to-image) + GPT 스타일 참고로 넣어 일러스트 생성 → 사용자 승인 → `assets/hp-studio/estar/mapIllust4.webp`로 저장, `estar.js`의 mapImg와 `app2.js` 약도 마이그레이션을 mapIllust4로 올려 배포.**
- 상표: KFC 할아버지 얼굴 등 로고 그림은 넣지 말고 'KFC' 글자 간판만.

## 설치된 플러그인 (2026-11-24)
Skilldb(find-skills), claude-code-setup, frontend-design, Superpowers, playwright, ralph-loop, Hyper Marketing.
이전 대화에서는 Skilldb 검색 서버·Hyper 서버 도구가 대화 도중 설치라 연결되지 않았음 → 새 대화에서 도구 연결 여부부터 확인.

## 2026-11-24 오후 확인 (다음 대화 필독)
- 플러그인 설치만으로는 Hyper **서버 도구(images_generate)가 연결되지 않음** — 스킬 문서만 있고 `hyperai` CLI도 없음. 커넥터 목록·레지스트리에도 Hyper 없음.
- 사용자 결정: claude.ai 커넥터에 맞춤 커넥터 `https://backend.hyperfx.ai/mcp/` 추가·로그인 후 새 대화에서 진행. (SkillDB도 같은 이유로 미연결 → 맞춤 커넥터 `https://skilldb.dev/api/mcp/catalog`)
- 원인: 클라우드 대화에서는 플러그인의 스킬만 동기화되고, 플러그인에 선언된 원격(HTTP) MCP 서버(hyperfx, skilldb-catalog)는 로드되지 않음. 로컬 실행형(playwright)은 데스크톱 앱을 통해 정상 연결됨.
- 새 대화 첫 단계: ToolSearch로 `images_generate` 확인 → 있으면 `hyper-marketing:image-generation` 스킬 읽고 생성. 없으면 사용자에게 연결 상태 재확인 요청(대안: Chrome의 ChatGPT로 생성).
- 생성 프롬프트(위치 참고 `map/nvm.png` + 스타일 참고 `map/ref/gpt_style_reference.png`):
  > 첨부 1(위치 지도)의 도로·건물 배치를 그대로 유지하고, 첨부 2의 부드러운 아이소메트릭 일러스트 스타일(파스텔 건물, 둥근 나무, 따뜻한 햇살 톤)로 다시 그려줘.
  > - 목적지: 신촌로 북쪽 모서리의 4~5층 건물. 1층에 빨간 'KFC' 글자 간판만(인물 얼굴 로고 금지). 건물 위에 핀과 "e-스타치과 3층" 말풍선(에스프레소 브라운 + 금색 톤)
  > - KFC 건물과 현대백화점 신촌점 사이에 '연세로' 도로. 현대백화점은 그 오른쪽 큰 건물, 백화점 오른쪽은 좁은 보행로
  > - 신촌로는 왼쪽 위에서 내려와 신촌역 부근에서 완만히 휘어 오른쪽으로 올라감
  > - 신촌역(2호선, 초록 표지)은 신촌로 아래쪽. 출구 1·2·4번 도로 북쪽, 5·8번 남쪽, 지하철 출입구 모양
  > - 1번 출구 → 현대백화점 앞 → 연세로 횡단보도 → KFC 건물 점선 화살표
  > - 주소·번지수 글자 금지, 가격·이벤트 문구 금지. 16:10 가로, 고해상도
- 생성 결과는 네이버 지도(`map/ref/naver_map.png`) 기준으로 위치 대조 후 사용자 승인 → mapIllust4.webp 적용·배포.

## 줄바꿈 검사 (2026-11-24 추가 — 제작 시 필수)
- 사용자 지시: 줄바꿈이 어색하거나 열 간격 때문에 불필요하게 줄이 바뀌는 부분은 Claude가 스스로 판단해 처리할 것.
- 검사: `node twrap.js <임의번호> 1280,1180` / `node twrap.js <임의번호> 390,360` → `wrap_<번호>.json` (편집용 `x-t` 태그 안 글자까지 검사, 미리보기 iframe 폭을 직접 바꿔서 검사). `lm b`(숫자+단위 글자크기 차이)·공지 목록 날짜 줄·`단어중간`만 있는 강제줄바꿈 경계는 오탐.
- 규칙(luxe.js 끝): 제목 `text-wrap:balance`, 문단 `pretty`, `word-break:keep-all`, 숫자·전화·버튼 nowrap, 강제 `<br>`이 있는 제목·문단은 공개 화면에서 `.seg` 단위로 나눠 균형 적용(blocks.js init, 편집 화면 제외). 대표원장 이력은 위→아래 채움(`--rows`), 왼쪽 학력·자격 / 오른쪽 학회·연수.

## SEO·AEO·GEO (2026-11-24, 승인 1~9 테스트 환경 적용)
- 페이지별 `seoTitle`/`seoDesc`(페이지 관리 → 검색 노출 설정), 기본 정보에 `siteUrl`·`altNames`·`areaServed`·네이버/구글 확인 코드.
- 내보내기: canonical·og:url·절대 og:image·twitter·robots, JSON-LD(@graph: Dentist·WebSite·WebPage·BreadcrumbList·FAQPage·Service) = pages.js `seoJsonLd`, ZIP에 robots.txt·sitemap.xml·llms.txt = `seoFiles`.
- e-스타 데이터: estar.js `ES_SEO`·`ES_SITE_SEO`(siteUrl은 가정값 https://star-dental.kr — 도메인 확정 시 수정)·`esApplySeo`(저장본 플래그 `_seo1`). 진료시간 JSON-LD는 사이트 표기 기준 — 실제 시간 확정 필요(외부 플랫폼과 불일치).
- 미적용(사용자 작업): 10 도메인·https·301, 11 진료시간·건물명 통일, 12 문의 이메일, 13 서치콘솔·서치어드바이저, 14 네이버 플레이스.
- 검증: `node texport.js`(내보내기 파일 → export/), `tseomig.js`(저장본 적용).

## 그 외 참고
- 영상 제작 스크립트: `vid/make2.py`(사진→Ken Burns 1080p), `vid/up.py`(EDSR 2배 업스케일). 원본 사진은 이 저장소에 없음(필요시 사용자에게 재요청 또는 `assets/hp-studio/estar/` 자산 사용).
- 로고 재현 소스: `logo/globe.svg`, `logo/final.html`.
