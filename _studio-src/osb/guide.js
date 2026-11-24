/* ===== 배포 가이드 (스튜디오 탭 + ZIP 동봉용) ===== */
function guideInner(c){
  const nm = c ? esc(c.name) : '병원';
  return `
<section class="g-hero"><h1>홈페이지 배포 가이드</h1><p>스튜디오에서 만든 홈페이지를 인터넷에 올리고, 병원 도메인을 연결하는 전체 과정입니다.<br>한 번만 익혀두면 사이트 하나당 <b>약 15~20분</b>이면 끝납니다.</p></section>

<section class="g-box"><h2>전체 흐름 한눈에 보기</h2>
<ol class="flow"><li><b>스튜디오</b><span>포트폴리오 편집 → [홈페이지 파일 다운로드]</span></li><li><b>압축 풀기</b><span>PC에 zip 파일 압축 해제</span></li><li><b>Cloudflare Pages</b><span>폴더를 끌어다 놓기 → 배포</span></li><li><b>도메인 연결</b><span>가비아 도메인 → Cloudflare</span></li><li><b>마무리</b><span>문의폼 활성화 · 검색 등록</span></li></ol>
<div class="tipbox"><b>왜 Cloudflare Pages인가요?</b> 무료이고, 상업용(병원 홈페이지) 사용이 허용되며, 트래픽 제한이 사실상 없고, GitHub 없이 폴더만 끌어다 놓으면 배포됩니다. 대표님이 d2dental.co.kr을 옮길 때 이미 쓰신 계정을 그대로 쓰면 됩니다.</div>
</section>

<section class="g-box"><h2><i>1</i> 홈페이지 파일 받기</h2>
<ul class="steps">
<li>스튜디오에서 해당 포트폴리오를 열고 왼쪽 <b>[기본 정보]</b>에 병원명·전화·주소·진료시간·<b>문의 수신 이메일</b>을 입력합니다.</li>
<li>미리보기에서 글자를 클릭해 문구를 고치고, 사진을 클릭해 실제 사진으로 바꿉니다.</li>
<li>상단 <b>[포트폴리오에 저장]</b> → <b>[홈페이지 파일 다운로드]</b>를 누르면 <code>영문병원명_homepage_날짜.zip</code>이 다운로드됩니다. (예: D2_DENTAL_CLINIC_homepage_20261028.zip)</li>
<li>zip 파일을 마우스 오른쪽 클릭 → <b>[압축 풀기]</b>. <b>homepage</b> 폴더 안에 <code>index.html</code>과 <code>images</code> 폴더가 보이면 정상입니다.</li>
</ul>
<div class="warn">폴더 안의 <code>index.html</code>을 더블클릭하면 PC에서 미리 볼 수 있습니다. 지도·폰트는 인터넷에 올린 뒤에 정상 표시됩니다.</div>
</section>

<section class="g-box"><h2><i>2</i> Cloudflare Pages에 올리기 (첫 배포)</h2>
<ul class="steps">
<li><a href="https://dash.cloudflare.com" target="_blank" rel="noopener">dash.cloudflare.com</a> 에 로그인합니다.</li>
<li>왼쪽 메뉴 <b>[Workers & Pages]</b> (한국어 화면: <b>Workers 및 Pages</b>) → 오른쪽 위 <b>[만들기 / Create]</b>를 누릅니다.</li>
<li><b>[Pages]</b> 탭을 선택 → <b>[에셋 업로드 / Upload assets]</b> (또는 "Drag and drop your files")를 선택합니다.<br><small>화면 문구는 Cloudflare 업데이트에 따라 조금씩 다를 수 있습니다. "Pages" + "업로드(Direct Upload)"가 들어간 메뉴를 찾으면 됩니다.</small></li>
<li><b>프로젝트 이름</b>을 영문 소문자로 입력합니다. 예) <code>d2-dental-gangnam</code> → 이 이름이 임시 주소가 됩니다.</li>
<li>압축을 푼 <b>homepage 폴더</b>(index.html이 들어있는 폴더)를 업로드 칸에 끌어다 놓습니다. zip 파일을 그대로 올려도 됩니다.</li>
<li><b>[배포 / Deploy site]</b>를 누르면 1분 안에 <code>https://프로젝트이름.pages.dev</code> 주소가 생깁니다. 이 주소로 원장님께 시안을 먼저 보여줄 수 있습니다.</li>
</ul>
<div class="tipbox"><b>관리 팁</b> 프로젝트 이름은 <code>병원약칭-지역</code> 규칙으로 통일하세요. 계정 하나에 Pages 프로젝트는 <b>최대 100개</b>입니다. 100개가 넘으면 Cloudflare 계정을 하나 더 만들어 나누어 관리합니다.</div>
</section>

<section class="g-box"><h2><i>3</i> 병원 도메인 연결하기</h2>
<p>병원 도메인(예: <code>d2dental-clinic.co.kr</code>)은 병원 명의로 가비아 등에서 구매하는 것을 권장합니다. 연결 방법은 두 가지입니다.</p>
<div class="two">
<div><h3>방법 A · 네임서버를 Cloudflare로 (권장)</h3><ol>
<li>Cloudflare 첫 화면 → <b>[도메인 추가 / Add a domain]</b> → 도메인 입력 → <b>Free</b> 요금제 선택</li>
<li>Cloudflare가 알려주는 <b>네임서버 2개</b>(예: <code>xxx.ns.cloudflare.com</code>)를 복사</li>
<li>가비아 → My가비아 → 도메인 관리 → 해당 도메인 → <b>네임서버 설정</b> → 기존 값을 지우고 Cloudflare 네임서버 2개 입력 → 저장</li>
<li>보통 10분~수 시간 후 Cloudflare에서 "활성(Active)" 메일이 옵니다</li>
<li>Workers & Pages → 해당 프로젝트 → <b>[사용자 설정 도메인 / Custom domains]</b> → <b>[도메인 설정]</b> → <code>도메인.co.kr</code> 입력 → 활성화. <code>www.도메인.co.kr</code>도 같은 방법으로 하나 더 추가</li>
</ol><small>d2dental.co.kr을 옮길 때와 같은 방식입니다. SSL(https)도 자동으로 적용됩니다.</small></div>
<div><h3>방법 B · 가비아 DNS 그대로 사용</h3><ol>
<li>Pages 프로젝트 → <b>[Custom domains]</b> → <code>www.도메인.co.kr</code> 입력</li>
<li>Cloudflare가 보여주는 <b>CNAME 값</b>(<code>프로젝트이름.pages.dev</code>)을 확인</li>
<li>가비아 → 도메인 관리 → <b>DNS 정보 → DNS 설정</b> → 레코드 추가: 타입 <b>CNAME</b> / 호스트 <b>www</b> / 값 <code>프로젝트이름.pages.dev.</code></li>
<li>Cloudflare 화면에서 확인 완료될 때까지 기다립니다</li>
</ol><small>병원이 메일 등 다른 서비스를 이미 가비아 DNS로 쓰고 있어 네임서버를 바꾸기 곤란할 때 사용합니다. 이 방법은 www 주소만 연결됩니다.</small></div>
</div>
<div class="warn"><b>메일 주의:</b> 병원이 하이웍스·네이버웍스 등 도메인 메일을 쓰고 있다면, 네임서버를 옮기기 전에 가비아 DNS의 <b>MX·TXT 레코드</b>를 캡처해 두고, Cloudflare DNS에 똑같이 입력해야 메일이 끊기지 않습니다.</div>
</section>

<section class="g-box"><h2><i>4</i> 상담 신청서(문의폼) 활성화</h2>
<ul class="steps">
<li>홈페이지 상담 신청서는 무료 서비스 <b>FormSubmit</b>을 통해 [기본 정보]의 <b>문의 수신 이메일</b>로 전달됩니다. 서버가 필요 없습니다.</li>
<li>배포 후 사이트에서 <b>테스트 문의를 1회</b> 보냅니다.</li>
<li>수신 이메일함에 FormSubmit의 확인 메일이 옵니다 → <b>[Activate Form]</b> 클릭. 이후부터 모든 문의가 메일로 들어옵니다.</li>
<li>스팸함도 꼭 확인하세요. 수신 이메일을 바꾸면 이 과정을 다시 한 번 해야 합니다.</li>
</ul></section>

<section class="g-box"><h2><i>5</i> 수정 요청이 왔을 때 (재배포)</h2>
<ul class="steps">
<li>스튜디오에서 해당 포트폴리오 수정 → <b>[포트폴리오에 저장]</b> → <b>[홈페이지 파일 다운로드]</b></li>
<li>Cloudflare → Workers & Pages → 해당 프로젝트 → <b>[새 배포 만들기 / Create deployment]</b> → 새 폴더를 끌어다 놓기 → 배포</li>
<li>1분 안에 실제 도메인에 반영됩니다. 이전 버전은 [배포] 목록에서 언제든 <b>롤백</b>할 수 있습니다.</li>
</ul>
<div class="tipbox"><b>고객별 포트폴리오 관리</b> 시안용 포트폴리오를 [복제]해서 "강남○○치과" 같은 고객 전용 포트폴리오로 만들어 두면, 다음 수정 때 그대로 불러올 수 있습니다. ZIP 안의 <code>portfolio-backup.json</code>을 스튜디오 [백업 불러오기]로 다시 넣을 수도 있습니다.</div>
</section>

<section class="g-box"><h2><i>6</i> 검색 노출 등록</h2>
<ul class="steps">
<li><b>네이버 서치어드바이저</b> (searchadvisor.naver.com) → 사이트 등록 → 소유확인 HTML 태그를 받아, 대표님께 전달하면 index.html <code>&lt;head&gt;</code>에 넣어 재배포합니다. → [요청] 메뉴에서 웹페이지 수집 요청</li>
<li><b>구글 서치 콘솔</b> (search.google.com/search-console) → 도메인 속성 추가 → Cloudflare DNS에 TXT 레코드 추가로 소유 확인</li>
<li><b>네이버 플레이스</b>(스마트플레이스)의 홈페이지 주소도 새 도메인으로 바꾸면 노출이 빨라집니다.</li>
</ul></section>

<section class="g-box"><h2><i>✓</i> 납품 전 체크리스트</h2>
<ul class="check">
<li>병원명·전화·주소·진료시간·사업자정보가 실제 정보로 바뀌었나요?</li>
<li>샘플 사진(AI 생성 이미지, 전후사진 자리표시)이 모두 <b>병원 실제 사진</b>으로 교체되었나요? <small>가상 인물을 실제 의료진처럼 보이게 하면 안 됩니다.</small></li>
<li>치료 전후사진·치료효과 문구·후기는 <b>의료광고 사전심의</b> 대상인지 원장님과 확인했나요? (대한치과의사협회 의료광고심의위원회)</li>
<li>전후사진 아래 "개인차가 있을 수 있음" 안내 문구가 있나요?</li>
<li>비급여 진료비용 고지가 필요한 경우 링크/페이지를 추가했나요?</li>
<li>문의 수신 이메일 입력 후 테스트 문의 → FormSubmit 활성화까지 마쳤나요?</li>
<li>휴대폰으로 사이트를 열어 메뉴·전화 버튼·지도가 정상인지 확인했나요?</li>
<li>고객 관리표에 <b>병원명 / 도메인 / Cloudflare 프로젝트명 / 배포일 / 월 관리비</b>를 기록했나요?</li>
</ul></section>

<section class="g-box"><h2>자주 묻는 질문</h2>
<details><summary>사진을 바꿨는데 홈페이지에 반영이 안 돼요</summary><p>스튜디오에서 [포트폴리오에 저장] → [홈페이지 파일 다운로드]를 다시 하고, Cloudflare에 <b>새 배포</b>를 올려야 반영됩니다. 반영 후에도 예전 화면이면 브라우저에서 Ctrl+F5(강력 새로고침)를 해보세요.</p></details>
<details><summary>스튜디오에 저장한 포트폴리오는 어디에 저장되나요?</summary><p>DENTAL MBTI와 같은 Supabase 서버에 저장됩니다(문구는 <code>hp_portfolios</code> 테이블, 교체한 사진은 <code>hp-images</code> 스토리지). 관리자 계정으로 로그인하면 어느 PC에서든 같은 포트폴리오가 보입니다. 관리자 계정만 수정할 수 있습니다.</p></details>
<details><summary>비용이 드나요?</summary><p>Cloudflare Pages(호스팅)·FormSubmit(문의폼)은 무료입니다. 도메인 비용(연 2~3만 원)만 들며, 보통 병원 명의로 병원이 부담합니다.</p></details>
<details><summary>사이트에 동영상을 넣고 싶어요</summary><p>현재 템플릿은 사진 중심입니다. 동영상이 필요하면 유튜브에 올리고 [유튜브 채널 링크]를 연결하거나, Claude에게 해당 포트폴리오에 영상 섹션 추가를 요청하세요.</p></details>
</section>
<p class="g-foot">${nm} 홈페이지 · 디투 홈페이지 스튜디오에서 제작</p>`;
}

const GUIDE_CSS = `
.g-hero{background:linear-gradient(135deg,#2f2621,#5a4636);color:#f3ece3;padding:46px 40px;border-radius:16px;margin-bottom:24px}
.g-hero h1{font-size:30px;margin-bottom:10px}.g-hero p{opacity:.85;line-height:1.8}
.g-box{background:#fff;border:1px solid #e7e2dc;border-radius:16px;padding:32px 36px;margin-bottom:20px}
.g-box h2{font-size:21px;margin-bottom:18px;display:flex;align-items:center;gap:10px}
.g-box h2 i{font-style:normal;width:32px;height:32px;border-radius:50%;background:#b08d57;color:#fff;display:grid;place-items:center;font-size:15px}
.g-box h3{font-size:16px;margin-bottom:10px}
.g-box p,.g-box li{line-height:1.85;font-size:15px}.g-box small{color:#8a8178;font-size:13px}
.g-box code{background:#f4efe9;padding:2px 7px;border-radius:5px;font-size:13px;color:#7a4e1d}
.g-box a{color:#9a6a2e;text-decoration:underline}
.steps{list-style:none;counter-reset:s;display:grid;gap:12px}
.steps li{counter-increment:s;position:relative;padding-left:40px}
.steps li:before{content:counter(s);position:absolute;left:0;top:2px;width:26px;height:26px;border-radius:7px;background:#f4efe9;color:#7a4e1d;font-weight:800;display:grid;place-items:center;font-size:13px}
.flow{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px}
.flow li{background:#f8f5f1;border-radius:12px;padding:16px 14px;position:relative}.flow b{display:block;color:#7a4e1d;margin-bottom:4px}.flow span{font-size:13px;color:#6d655d;line-height:1.6}
.tipbox,.warn{border-radius:12px;padding:16px 20px;margin-top:18px;font-size:14px;line-height:1.8}
.tipbox{background:#eef6f2;border:1px solid #cfe6db}.warn{background:#fff6ea;border:1px solid #f4dbb5}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:14px}.two>div{background:#f8f5f1;border-radius:12px;padding:22px}.two ol{padding-left:20px;display:grid;gap:8px;margin-bottom:10px}
.check{list-style:none;display:grid;gap:10px}.check li{padding-left:32px;position:relative}.check li:before{content:'☐';position:absolute;left:4px;top:0;font-size:18px;color:#b08d57}
details{border-top:1px solid #eee;padding:14px 0}details summary{cursor:pointer;font-weight:700}details p{margin-top:10px;color:#555}
.g-foot{text-align:center;color:#a39a91;font-size:13px;margin:30px 0}
@media(max-width:800px){.flow,.two{grid-template-columns:1fr}.g-box{padding:24px 20px}.g-hero{padding:32px 22px}}`;

function guidePage(c){
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.name)} 홈페이지 배포 가이드</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Pretendard,'Malgun Gothic',sans-serif;background:#f6f3ef;color:#2b2622;word-break:keep-all}main{max-width:980px;margin:0 auto;padding:30px 18px}${GUIDE_CSS}</style>
</head><body><main>${guideInner(c)}</main></body></html>`;
}
