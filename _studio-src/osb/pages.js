/* =====================================================================
   다중 페이지 구조 (v3) — 실제 치과 홈페이지처럼 메뉴별 개별 페이지
   content = { v:3, site:{..., nav:[...]}, pages:[{id, slug, title, blocks:[...]}] }
   pages[0] 은 항상 홈(id:'home', slug:'index')
   연결 대상(target): 'p:<페이지ID>'  ·  'p:<페이지ID>#b-<블록ID>'  ·  '#b-<블록ID>'  ·  'https://…'  ·  'tel:…'
===================================================================== */

/* ---------- 서브페이지용 공통 블록 ---------- */
const PAGE_BLOCK_CSS = `
.cb-sub{position:relative;min-height:400px;display:flex;align-items:flex-end;color:#fff;overflow:hidden;background:#222}
.cb-sub>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cb-sub:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.35) 45%,rgba(0,0,0,.7))}
.cb-sub .wrap{position:relative;z-index:2;padding:150px 0 64px}
.cb-sub small{display:block;letter-spacing:.3em;font-size:13px;font-weight:700;opacity:.85;margin-bottom:12px}
.cb-sub h1{font-size:clamp(34px,4.6vw,58px);letter-spacing:-.03em;line-height:1.2}
.cb-sub p{margin-top:14px;font-size:17px;opacity:.88;max-width:640px}
.cb-sub .crumb{margin-top:28px;font-size:13px;opacity:.75;display:flex;gap:8px;flex-wrap:wrap}.cb-sub .crumb x-t{display:inline}
.cb-pts .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
.cb-pts .it{border:1px solid var(--line);border-radius:calc(var(--r) + 8px);padding:34px 30px;background:rgba(127,127,127,.04)}
.cb-pts .ic{width:46px;height:46px;padding:11px;border-radius:14px;background:var(--pc);color:#fff;margin-bottom:20px}
.cb-pts b{display:block;font-size:19px;margin-bottom:8px}.cb-pts .it p{opacity:.72;font-size:15px;line-height:1.8}
.cb-steps ol{list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px;counter-reset:st}
.cb-steps li{counter-increment:st;position:relative;padding:30px 24px 26px;border-top:3px solid var(--pc);background:rgba(127,127,127,.05);border-radius:0 0 var(--r) var(--r)}
.cb-steps li:before{content:'STEP 0' counter(st);display:block;font-size:12px;font-weight:800;letter-spacing:.15em;color:var(--pc);margin-bottom:10px}
.cb-steps b{display:block;font-size:18px;margin-bottom:6px}.cb-steps li p{opacity:.72;font-size:14px;line-height:1.8}
.cb-docs .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px}
.cb-docs img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--r)}
.cb-docs .po{color:var(--pc);font-weight:700;font-size:14px;margin-top:18px}.cb-docs .grid>.rv:only-child{display:grid;grid-template-columns:minmax(220px,380px) 1fr;column-gap:56px;align-content:center;max-width:1000px;margin:0 auto;width:100%}.cb-docs .grid>.rv:only-child>img{grid-row:1/span 4;align-self:center}.cb-docs .grid>.rv:only-child .po{margin-top:0;align-self:end}.cb-docs .grid>.rv:only-child b{font-size:30px}.cb-docs .grid>.rv:only-child .cr{font-size:15px;align-self:start}@media(max-width:760px){.cb-docs .grid>.rv:only-child{grid-template-columns:1fr}.cb-docs .grid>.rv:only-child>img{grid-row:auto;max-width:360px}.cb-docs .grid>.rv:only-child .po{margin-top:18px}}.cb-docs b{display:block;font-size:22px;margin:2px 0 12px}.cb-docs .cr{opacity:.72;font-size:14px;line-height:1.9}
.cb-gal .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.cb-gal figure img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--r)}.cb-gal figcaption{font-size:14px;opacity:.7;margin-top:8px}
.cb-loc .grid{display:grid;grid-template-columns:1fr 1.2fr;gap:50px;align-items:start}
.cb-loc .row{display:flex;gap:14px;padding:20px 0;border-bottom:1px solid var(--line)}.cb-loc .row .ic{width:24px;height:24px;color:var(--pc);margin-top:2px}
.cb-loc .row b{display:block;margin-bottom:4px}.cb-loc .tel{font-size:28px;font-weight:800}.cb-loc .mapbox{border-radius:var(--r)}
.cb-greet .grid{display:grid;grid-template-columns:380px 1fr;gap:64px;align-items:center}
.cb-greet img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--r)}
.cb-greet small{color:var(--pc);font-weight:800;letter-spacing:.2em;font-size:13px}.cb-greet h2{font-size:clamp(26px,3vw,38px);letter-spacing:-.03em;line-height:1.4;margin:12px 0 22px}
.cb-greet .msg{line-height:2;opacity:.82}.cb-greet .sign{margin-top:28px;font-weight:800;font-size:18px}.cb-greet .cr{margin-top:18px;font-size:14px;line-height:1.9;opacity:.65}
.cb-quick .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px}
.cb-quick a{display:grid;justify-items:center;text-align:center;gap:10px;padding:30px 16px;border:1px solid var(--line);border-radius:calc(var(--r) + 10px);transition:.25s;background:rgba(127,127,127,.03)}
.cb-quick a:hover{border-color:var(--pc);transform:translateY(-3px)}.cb-quick .ic{width:48px;height:48px;padding:11px;border-radius:50%;background:var(--pc);color:#fff}
.cb-quick b{font-size:17px}.cb-quick span{font-size:13px;opacity:.65}
.sec.svc .grid>a,.s5 .grid>a{display:block;color:inherit}.svc .grid>a.it{display:flex}.sec.svc .more{display:inline-block;margin-top:14px;font-style:normal;font-size:13px;color:var(--pc);font-weight:700}
.hd nav>a.on,.hd nav .mi.on>.mi-a{color:var(--pc)}
.t-premium.sub .hd{background:rgba(246,242,236,.96)}.t-premium.sub .cb-sub .wrap{padding-top:170px}
.t-grand.sub .hd:not(.scrolled){background:linear-gradient(180deg,rgba(0,0,0,.45),transparent)}
.t-network .cb-sub .wrap,.t-local .cb-sub .wrap{padding-top:90px}

.cb-foot{background:#1e1814;color:#b9ad9f;padding:46px 0;font-size:13px}.cb-foot .wrap{display:grid;gap:8px}.cb-foot b{color:#fff;font-size:17px}
@media(max-width:900px){.cb-loc .grid,.cb-greet .grid{grid-template-columns:1fr;gap:30px}.cb-sub{min-height:300px}.cb-sub .wrap{padding:120px 0 44px}}`;

Object.assign(COMMON_BLOCKS, {
  c_subhero: { label:'페이지 상단 배너', desc:'서브 페이지 맨 위 큰 사진과 페이지 제목', fields:[F.img('img','배경 사진'), F.text('en','작은 영문 제목'), F.text('t','페이지 제목'), F.area('d','설명',{rows:2}), F.text('crumb','위치 표시 (예: HOME > 임플란트)')],
    defaults: () => ({ img:'asset:floor', en:'TREATMENT', t:'페이지 제목', d:'페이지 설명을 입력하세요.', crumb:'HOME > 메뉴' }),
    render: R => `<section class="cb-sub">${R.i('img','',String(R.raw('t')||'').replace(/\s+/g,' '))}<div class="wrap"><small>${R.t('en')}</small><h1>${R.t('t')}</h1><p>${R.t('d')}</p><div class="crumb">${R.t('crumb')}</div></div></section>` },
  c_points: { label:'특징 카드', desc:'아이콘과 함께 보여주는 장점·특징 카드', fields:[F.text('lab','작은 제목'), F.text('t','제목'), F.text('s','설명'), F.list('items','특징','특징',3,[F.icon('icon','아이콘'),F.text('t','제목'),F.area('d','설명')],{max:8})],
    defaults: () => ({ lab:'POINT', t:'디투치과만의 특별함', s:'', items:[['shield','안전한 진료','철저한 멸균과 정밀 진단으로 안전하게 치료합니다.'],['sparkle','자연스러운 결과','개인의 얼굴과 치아에 맞춘 맞춤 설계를 합니다.'],['clock','체계적인 관리','치료 후에도 정기 검진으로 오래 관리합니다.']].map(([icon,t,d])=>({icon,t,d})) }),
    render: (R,d) => `<section class="cb cb-pts"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2>${d.s?`<p>${R.t('s')}</p>`:''}</div><div class="grid">${(d.items||[]).map((it,n)=>`<div class="it rv">${ic(it.icon||'tooth')}<b>${R.t(`items/${n}/t`)}</b><p>${R.t(`items/${n}/d`)}</p></div>`).join('')}</div></div></section>` },
  c_steps: { label:'치료 과정', desc:'STEP 01, 02… 순서로 보여주는 치료 단계', fields:[F.text('lab','작은 제목'), F.text('t','제목'), F.list('items','단계','단계',4,[F.text('t','단계 이름'),F.area('d','설명')],{max:8})],
    defaults: () => ({ lab:'PROCESS', t:'치료 과정', items:[['상담·검진','구강 상태를 정밀하게 확인합니다.'],['치료 계획','맞춤 치료 계획을 설명드립니다.'],['치료','계획에 따라 꼼꼼히 진행합니다.'],['사후관리','정기 검진으로 결과를 지킵니다.']].map(([t,d])=>({t,d})) }),
    render: (R,d) => `<section class="cb cb-steps"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div><ol>${(d.items||[]).map((_,n)=>`<li class="rv"><b>${R.t(`items/${n}/t`)}</b><p>${R.t(`items/${n}/d`)}</p></li>`).join('')}</ol></div></section>` },
  c_doctors: { label:'의료진 소개', desc:'의료진 사진·전문분야·약력 카드', fields:[F.text('lab','작은 제목'), F.text('t','제목'), F.list('items','의료진','의료진',3,[F.img('img','사진'),F.text('p','전문 분야'),F.text('n','이름'),F.area('c','약력',{rows:4})],{max:12})],
    defaults: () => ({ lab:'DOCTORS', t:'분야별 전문의가 함께 진료합니다', items:[
      {img:'asset:doc2',p:'치과보철과 전문의',n:'대표원장 홍길동',c:'00대학교 치의학대학원 졸업\n00대학교 치과병원 보철과 수련\n대한치과보철학회 정회원'},
      {img:'asset:doc1',p:'치과교정과 전문의',n:'원장 김철수',c:'00대학교 치과병원 교정과 수련\n대한치과교정학회 정회원\n인비절라인 인증의'},
      {img:'asset:doc3',p:'통합치의학과 전문의',n:'원장 이영희',c:'00대학교 치의학대학원 졸업\n대한구강악안면임플란트학회 정회원\n대한심미치과학회 정회원'}] }),
    render: (R,d) => `<section class="cb cb-docs"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div><div class="grid">${(d.items||[]).map((_,n)=>`<div class="rv">${R.i(`items/${n}/img`)}<div class="po">${R.t(`items/${n}/p`)}</div><b>${R.t(`items/${n}/n`)}</b><div class="cr">${R.t(`items/${n}/c`)}</div></div>`).join('')}</div></div></section>` },
  c_gallery: { label:'사진 갤러리', desc:'병원 내부 등 사진 여러 장과 설명', fields:[F.text('lab','작은 제목'), F.text('t','제목'), F.list('items','사진','사진',6,[F.img('img','사진'),F.text('c','설명')],{max:24})],
    defaults: () => ({ lab:'CLINIC TOUR', t:'병원 둘러보기', items:[['lobby','로비 · 접수'],['lounge','라운지'],['desk','안내 데스크'],['floor','진료실'],['xray','디지털 진단실'],['implant','멸균 · 수술 준비실']].map(([a,c])=>({img:'asset:'+a,c})) }),
    render: (R,d) => `<section class="cb cb-gal"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div><div class="grid">${(d.items||[]).map((_,n)=>`<figure class="rv">${R.i(`items/${n}/img`)}<figcaption>${R.t(`items/${n}/c`)}</figcaption></figure>`).join('')}</div></div></section>` },
  c_location: { label:'진료시간 · 오시는 길', desc:'전화·진료시간·주소·지도 (내용은 [기본 정보]에서 수정)', fields:[F.text('lab','작은 제목'), F.text('t','제목')],
    defaults: () => ({ lab:'LOCATION', t:'진료안내 · 오시는 길' }),
    render: (R,d,S,ctx) => `<section class="cb cb-loc"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div><div class="grid"><div>
<div class="row">${ic('phone')}<div><b>대표 전화</b><a class="tel" href="tel:${S.v('phone')}">${S.t('phone')}</a></div></div>
<div class="row">${ic('clock')}<div><b>진료시간</b>${S.t('hours')}</div></div>
<div class="row">${ic('pin')}<div><b>주소</b>${S.t('address')}<br><small>${S.t('traffic')}</small></div></div></div><div>${mapBox(ctx.site)}</div></div></div></section>` },
  c_greet: { label:'대표원장 인사말', desc:'원장 사진과 인사말, 약력', fields:[F.img('img','사진'), F.text('lab','작은 제목'), F.area('t','제목',{rows:2}), F.area('msg','인사말',{rows:6}), F.text('sign','서명'), F.area('cr','약력',{rows:4})],
    defaults: () => ({ img:'asset:doc2', lab:'GREETING', t:'내 가족을 치료한다는 마음으로\n진료하겠습니다', msg:'안녕하세요, 디투치과 대표원장입니다.\n\n치과는 누구에게나 조금은 두려운 곳입니다. 저희는 그 마음을 먼저 이해하고, 꼭 필요한 치료만 정직하게 권해드리겠습니다.\n\n정밀한 진단과 꼼꼼한 사후관리로 오래도록 건강한 미소를 지켜드리겠습니다.', sign:'디투치과 대표원장 홍길동', cr:'00대학교 치의학대학원 졸업\n00대학교 치과병원 보철과 수련\n대한치과보철학회 정회원' }),
    render: R => `<section class="cb cb-greet"><div class="wrap grid"><div class="rv">${R.i('img','',String(R.raw('t')||'').replace(/\s+/g,' '))}</div><div class="rv"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2><p class="msg">${R.t('msg')}</p><p class="sign">${R.t('sign')}</p><p class="cr">${R.t('cr')}</p></div></div></section>` },
  c_quick: { label:'진료 바로가기', desc:'진료 페이지로 이동하는 아이콘 카드', fields:[F.text('lab','작은 제목'), F.text('t','제목'), F.list('items','바로가기','바로가기',6,[F.icon('icon','아이콘'),F.text('t','진료명'),F.text('d','짧은 설명'),F.link('href')],{max:12})],
    defaults: () => ({ lab:'TREATMENT', t:'진료 과목 바로가기', items:[] }),
    render: (R,d,S,ctx) => `<section class="cb cb-quick"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div><div class="grid">${(d.items||[]).map((it,n)=>`<a class="rv" href="${ctx.link(it.href)}">${ic(it.icon||'tooth')}<b>${R.t(`items/${n}/t`)}</b><span>${R.t(`items/${n}/d`)}</span></a>`).join('')}</div></div></section>` }
});
Object.values(BLOCKDEFS).forEach(T => Object.assign(T.blocks, COMMON_BLOCKS));

/* ---------- 표준 치과 사이트맵 (실제 치과 홈페이지 메뉴 구성 기준) ---------- */
const TX = {
  implant: { title:'임플란트', en:'IMPLANT', img:'implant', heroImg:'floorDoc', icon:'implant', desc:'빠진 치아를 자연치아처럼 단단하게 되살리는 정밀 임플란트',
    lead:'정확한 진단에서 시작되는\n오래 쓰는 임플란트', d:'3D CT로 잇몸뼈의 높이·폭·신경 위치를 정밀하게 분석한 뒤, 환자 한 분 한 분에게 맞는 식립 위치와 임플란트를 선택합니다. 수술보다 중요한 것은 계획이라는 원칙으로 진료합니다.',
    pts:'3D CT 정밀 진단\n분야별 전문의 협진\n정품 임플란트 · 보증서 발급\n평생 정기 검진 관리',
    points:[['shield','정밀 진단','CT와 구강스캐너로 뼈 상태를 입체적으로 확인합니다.'],['implant','맞춤 식립','잇몸뼈와 교합에 맞춰 위치와 각도를 설계합니다.'],['clock','체계적인 사후관리','정기 검진으로 임플란트 수명을 지켜드립니다.']],
    steps:[['정밀 검진','3D CT 촬영과 구강 검사로 상태를 확인합니다.'],['치료 계획','식립 위치·기간·비용을 자세히 설명드립니다.'],['임플란트 식립','계획에 따라 정확하게 식립합니다.'],['보철 완성','잇몸과 뼈가 단단해지면 맞춤 보철을 연결합니다.']],
    faq:[['임플란트 수술은 많이 아픈가요?','국소 마취 후 진행하므로 수술 중 통증은 거의 없으며, 수술 후 불편감은 처방약으로 충분히 조절됩니다.'],['치료 기간은 얼마나 걸리나요?','뼈 상태에 따라 다르지만 보통 2~4개월이 소요되며, 상담 시 정확한 일정을 안내해 드립니다.'],['임플란트는 평생 쓸 수 있나요?','올바른 관리와 정기 검진을 받으시면 오랫동안 사용할 수 있습니다.']] },
  'nav-implant': { title:'네비게이션 임플란트', en:'NAVIGATION IMPLANT', img:'xray', heroImg:'xray', icon:'implant', desc:'컴퓨터 모의 수술로 미리 설계하고 그대로 식립합니다',
    lead:'오차를 줄이는\n가이드 임플란트', d:'3D CT 데이터로 컴퓨터에서 모의 수술을 먼저 진행하고, 그 설계대로 제작한 수술 가이드를 이용해 식립합니다. 절개를 최소화해 붓기와 통증이 적고 회복이 빠릅니다.',
    pts:'컴퓨터 모의 수술\n최소 절개 · 빠른 회복\n신경·혈관 손상 위험 감소\n당뇨·고혈압 환자도 상담 가능',
    points:[['cal','미리 보는 수술','수술 전 결과를 예측하고 계획합니다.'],['shield','최소 절개','잇몸 절개를 줄여 출혈과 붓기가 적습니다.'],['sparkle','빠른 일상 복귀','수술 다음 날부터 일상생활이 가능합니다.']],
    steps:[['3D CT 촬영','잇몸뼈와 신경 위치를 입체적으로 확인합니다.'],['모의 수술','컴퓨터로 최적의 식립 위치를 설계합니다.'],['가이드 제작','설계대로 수술용 가이드를 제작합니다.'],['가이드 식립','가이드에 맞춰 정확하고 빠르게 식립합니다.']],
    faq:[['일반 임플란트와 무엇이 다른가요?','수술 전에 컴퓨터로 위치를 정해 두고 가이드대로 식립하기 때문에 정확도가 높고 절개가 작습니다.'],['누구나 받을 수 있나요?','대부분 가능하며, 뼈가 많이 부족한 경우 뼈이식을 함께 진행할 수 있습니다.']] },
  'bone-graft': { title:'뼈이식 임플란트', en:'BONE GRAFT', img:'xray', heroImg:'treatDoc', icon:'shield', desc:'잇몸뼈가 부족해도 포기하지 마세요',
    lead:'뼈가 부족해도\n임플란트는 가능합니다', d:'오랫동안 치아가 없었거나 잇몸병으로 뼈가 녹은 경우에도 뼈이식과 상악동 거상술로 임플란트를 심을 수 있는 기반을 만들어 드립니다.',
    pts:'부분 뼈이식 · 상악동 거상술\n임플란트와 동시 진행 가능\n안전한 이식재 사용\n치유 기간 맞춤 관리',
    points:[['shield','안전한 이식재','검증된 뼈이식재를 사용합니다.'],['implant','동시 식립','상태에 따라 이식과 식립을 한 번에 진행합니다.'],['clock','치유 관리','회복 과정을 단계별로 확인합니다.']],
    steps:[['뼈 상태 진단','CT로 부족한 뼈의 양과 위치를 확인합니다.'],['뼈이식','필요한 부위에 이식재를 채웁니다.'],['치유 기간','뼈가 단단해질 때까지 기다리며 관리합니다.'],['임플란트 식립','튼튼해진 뼈에 임플란트를 식립합니다.']],
    faq:[['뼈이식은 꼭 해야 하나요?','뼈가 부족한 상태로 식립하면 임플란트가 흔들릴 수 있어, 필요한 경우에만 권해드립니다.'],['치료 기간이 길어지나요?','이식 범위에 따라 3~6개월 정도 더 소요될 수 있습니다.']] },
  'clear-aligner': { title:'투명교정', en:'CLEAR ALIGNER', img:'treat', heroImg:'treat', icon:'ortho', desc:'티 나지 않게, 일상은 그대로 치아는 가지런하게', ba:true,
    lead:'보이지 않는 교정,\n투명교정', d:'투명한 교정 장치를 단계별로 바꿔 끼우며 치아를 이동시킵니다. 장치가 거의 보이지 않고 탈착이 가능해 식사와 양치가 편리합니다.',
    pts:'눈에 띄지 않는 투명 장치\n탈부착 가능 · 위생 관리 쉬움\n3D 시뮬레이션으로 결과 예측\n내원 횟수 감소',
    points:[['sparkle','보이지 않는 교정','대화할 때도 장치가 거의 보이지 않습니다.'],['tooth','편안한 착용감','철사가 없어 입 안이 덜 불편합니다.'],['cal','결과 미리 보기','3D로 교정 후 모습을 먼저 확인합니다.']],
    steps:[['교정 진단','사진·스캔·엑스레이로 치아 배열을 분석합니다.'],['3D 시뮬레이션','치아 이동 계획과 결과를 미리 보여드립니다.'],['장치 착용','1~2주마다 새 장치로 교체합니다.'],['유지 관리','교정 후 유지장치로 결과를 지킵니다.']],
    faq:[['하루에 몇 시간 착용해야 하나요?','식사와 양치 시간을 제외한 하루 20~22시간 착용을 권장합니다.'],['모든 경우에 가능한가요?','대부분 가능하지만 심한 부정교합은 일반 교정이 더 적합할 수 있어 진단 후 안내해 드립니다.']] },
  braces: { title:'일반 · 세라믹 교정', en:'BRACES', img:'treatDoc', heroImg:'floorDoc', icon:'ortho', desc:'복잡한 부정교합까지 정확하게 바로잡는 교정',
    lead:'정확하게 움직이는\n브라켓 교정', d:'치아에 브라켓을 붙이고 와이어로 치아를 이동시키는 교정입니다. 치아색 세라믹 브라켓을 선택하면 눈에 덜 띄게 교정할 수 있습니다.',
    pts:'심한 덧니·돌출입도 교정 가능\n치아색 세라믹 브라켓 선택 가능\n교정 전문의 직접 진료\n정기적인 진행 상황 점검',
    points:[['ortho','정확한 이동','복잡한 치아 이동도 세밀하게 조절합니다.'],['sparkle','세라믹 브라켓','치아색 장치로 심미성을 높였습니다.'],['shield','전문의 진료','교정과 전문의가 처음부터 끝까지 담당합니다.']],
    steps:[['정밀 진단','교정 분석 자료를 바탕으로 진단합니다.'],['장치 부착','브라켓과 와이어를 부착합니다.'],['정기 조정','4~6주마다 내원해 와이어를 조정합니다.'],['유지 관리','장치 제거 후 유지장치를 착용합니다.']],
    faq:[['교정 기간은 얼마나 걸리나요?','일반적으로 1년 6개월~2년 정도이며 상태에 따라 달라집니다.'],['성인도 교정할 수 있나요?','잇몸과 뼈가 건강하다면 나이와 관계없이 가능합니다.']] },
  'partial-ortho': { title:'부분교정', en:'PARTIAL ORTHODONTICS', img:'treat', heroImg:'lounge', icon:'ortho', desc:'앞니 몇 개만, 짧고 간단하게', ba:true,
    lead:'필요한 부분만\n짧게 교정합니다', d:'앞니 벌어짐, 약간의 덧니처럼 일부 치아만 문제가 있을 때 해당 부위만 교정해 기간과 비용 부담을 줄입니다.',
    pts:'앞니 벌어짐 · 가벼운 덧니\n3~6개월의 짧은 기간\n투명·세라믹 장치 선택\n비용 부담 감소',
    points:[['clock','짧은 기간','평균 3~6개월이면 마무리됩니다.'],['won','부담 없는 비용','필요한 부위만 치료해 비용을 줄였습니다.'],['sparkle','자연스러운 결과','앞니 라인을 고르게 정리합니다.']],
    steps:[['상담·진단','부분교정이 가능한지 먼저 확인합니다.'],['장치 선택','투명 또는 세라믹 장치를 고릅니다.'],['교정 진행','짧은 기간 동안 치아를 이동합니다.'],['유지 관리','유지장치로 결과를 지킵니다.']],
    faq:[['부분교정으로 충분한지 어떻게 아나요?','교합 전체를 함께 진단한 뒤 부분교정이 적합한 경우에만 권해드립니다.'],['교정 후 다시 틀어지지 않나요?','유지장치를 꾸준히 사용하시면 결과를 오래 유지할 수 있습니다.']] },
  laminate: { title:'라미네이트', en:'LAMINATE', img:'prosth', heroImg:'lobby', icon:'sparkle', desc:'최소 삭제로 완성하는 자연스러운 스마일 라인', ba:true,
    lead:'치아는 지키고\n미소는 새롭게', d:'얇은 세라믹 판을 치아 앞면에 붙여 색·모양·크기·벌어짐을 한 번에 개선합니다. 치아 삭제를 최소화하고, 얼굴형과 스마일 라인에 맞춘 맞춤 디자인으로 자연스러운 결과를 만듭니다.',
    pts:'최소 삭제 · 무삭제 상담\n얼굴형 맞춤 스마일 디자인\n변색에 강한 고강도 소재\n2~3회 내원으로 완성',
    points:[['sparkle','스마일 디자인','얼굴과 입술 라인에 맞춰 치아 모양을 설계합니다.'],['shield','최소 삭제','자연치아를 최대한 보존합니다.'],['tooth','자연스러운 색감','주변 치아와 어울리는 투명도와 색을 구현합니다.']],
    steps:[['스마일 상담','원하는 미소와 고민을 함께 이야기합니다.'],['디자인','사진과 스캔으로 맞춤 디자인을 합니다.'],['치아 준비','필요한 만큼만 최소로 다듬습니다.'],['부착 · 완성','맞춤 제작한 라미네이트를 부착합니다.']],
    faq:[['라미네이트는 몇 개를 해야 하나요?','자연스러운 스마일 라인을 위해 보통 상악 8~10개를 권하지만, 상태에 따라 맞춤으로 안내해 드립니다.'],['떨어지거나 변색되지 않나요?','고강도 소재를 사용하며, 정기 관리 시 오랫동안 처음 색을 유지합니다.'],['시린 증상이 있나요?','삭제를 최소화하기 때문에 시림이 적으며, 대부분 일시적입니다.']] },
  whitening: { title:'치아미백', en:'WHITENING', img:'treat', heroImg:'desk', icon:'sparkle', desc:'깎지 않고 밝아지는 전문가 미백', ba:true,
    lead:'한층 밝아진\n나의 미소', d:'전문가용 미백제와 광조사기를 이용해 치아 표면을 손상 없이 밝게 만듭니다. 원내 미백과 자가 미백을 함께하면 효과가 더 오래 유지됩니다.',
    pts:'치아 삭제 없는 미백\n원내 · 자가 미백 병행\n시림을 줄이는 맞춤 농도\n짧은 시술 시간',
    points:[['sparkle','빠른 효과','1회 시술만으로도 밝아진 변화를 느낄 수 있습니다.'],['shield','안전한 시술','치아를 깎지 않아 손상이 없습니다.'],['clock','짧은 시간','1회 약 1시간이면 충분합니다.']],
    steps:[['치아 색 측정','현재 치아 색을 기록합니다.'],['잇몸 보호','미백제가 닿지 않도록 잇몸을 보호합니다.'],['미백 시술','미백제 도포 후 빛을 쬐어 줍니다.'],['홈케어 안내','효과를 유지하는 방법을 알려드립니다.']],
    faq:[['미백 효과는 얼마나 가나요?','생활 습관에 따라 다르지만 보통 1~2년 유지되며, 주기적인 관리로 오래 유지할 수 있습니다.'],['시리지는 않나요?','일시적으로 시릴 수 있지만 1~2일 내에 사라집니다.']] },
  'gum-contour': { title:'잇몸성형', en:'GUM CONTOURING', img:'treatDoc', heroImg:'lounge', icon:'sparkle', desc:'웃을 때 보이는 잇몸까지 아름답게',
    lead:'잇몸 라인까지\n완성하는 미소', d:'웃을 때 잇몸이 많이 보이거나 잇몸 높이가 고르지 않은 경우, 잇몸 라인을 다듬어 치아가 더 길고 가지런해 보이게 합니다.',
    pts:'거미 스마일 개선\n짝짝이 잇몸 라인 정리\n라미네이트와 병행 가능\n간단한 시술 · 빠른 회복',
    points:[['sparkle','균형 잡힌 라인','좌우 잇몸 높이를 고르게 맞춥니다.'],['tooth','길어 보이는 치아','짧아 보이던 앞니가 자연스럽게 길어 보입니다.'],['clock','빠른 회복','1~2주면 일상에 불편이 없습니다.']],
    steps:[['스마일 분석','웃을 때 잇몸 노출 정도를 확인합니다.'],['라인 디자인','이상적인 잇몸 라인을 설계합니다.'],['잇몸 성형','디자인에 맞춰 잇몸을 다듬습니다.'],['회복 관리','회복 상태를 확인합니다.']],
    faq:[['통증이 있나요?','국소 마취 후 진행하며, 시술 후 불편감은 크지 않습니다.'],['라미네이트와 같이 해야 하나요?','함께 하면 효과가 더 좋지만, 잇몸성형만 단독으로도 가능합니다.']] },
  cavity: { title:'충치치료', en:'CAVITY TREATMENT', img:'treatDoc', heroImg:'floor', icon:'tooth', desc:'초기에 치료할수록 간단하고 오래갑니다',
    lead:'작을 때 치료하면\n치아를 지킬 수 있습니다', d:'충치 범위에 따라 레진, 인레이, 크라운 중 가장 적합한 방법을 선택합니다. 자연치아를 최대한 남기는 보존 치료를 원칙으로 합니다.',
    pts:'레진 · 인레이 · 크라운\n자연치아 최대 보존\n치아색 재료 사용\n당일 치료 가능 (레진)',
    points:[['tooth','보존 우선','건강한 부분은 최대한 남깁니다.'],['sparkle','치아색 재료','티 나지 않는 재료로 자연스럽게 치료합니다.'],['clock','빠른 치료','작은 충치는 당일 치료가 가능합니다.']],
    steps:[['검진','충치의 크기와 깊이를 확인합니다.'],['충치 제거','썩은 부분만 정확히 제거합니다.'],['수복','레진·인레이 등으로 채웁니다.'],['교합 조정','씹는 느낌까지 편안하게 맞춥니다.']],
    faq:[['레진과 인레이는 어떻게 다른가요?','작은 충치는 레진으로 바로 메우고, 범위가 넓으면 본을 떠서 만드는 인레이가 더 튼튼합니다.'],['아프지 않은데 치료해야 하나요?','통증이 없을 때 치료해야 간단하고 비용도 적게 듭니다.']] },
  'root-canal': { title:'신경치료', en:'ROOT CANAL', img:'xray', heroImg:'xray', icon:'shield', desc:'뽑지 않고 내 치아를 살리는 마지막 방법',
    lead:'내 치아를 살리는\n정밀 신경치료', d:'충치나 외상으로 신경에 염증이 생긴 경우, 감염된 신경을 깨끗이 제거하고 소독한 뒤 채워 치아를 보존합니다. 미세한 신경관까지 꼼꼼하게 치료합니다.',
    pts:'자연치아 보존 치료\n정밀 장비로 미세 신경관 치료\n통증을 줄이는 마취\n크라운으로 치아 보호',
    points:[['shield','자연치아 보존','발치 대신 내 치아를 지킵니다.'],['tooth','정밀 치료','엑스레이로 신경관을 확인하며 치료합니다.'],['clock','통증 관리','치료 중 통증을 최소화합니다.']],
    steps:[['진단','엑스레이로 염증 범위를 확인합니다.'],['신경 제거','감염된 신경을 제거합니다.'],['소독 · 충전','신경관을 소독하고 채웁니다.'],['크라운','약해진 치아를 크라운으로 보호합니다.']],
    faq:[['신경치료는 몇 번 받아야 하나요?','염증 정도에 따라 보통 2~4회 내원합니다.'],['크라운을 꼭 씌워야 하나요?','신경치료한 치아는 약해지기 쉬워 크라운으로 보호하는 것을 권장합니다.']] },
  gum: { title:'잇몸치료 · 스케일링', en:'PERIODONTAL CARE', img:'implant', heroImg:'floorWait', icon:'shield', desc:'건강한 잇몸이 모든 치아의 기초입니다',
    lead:'잇몸이 건강해야\n치아가 오래갑니다', d:'정기 스케일링으로 치석을 제거하고, 잇몸 속 깊은 염증은 잇몸치료로 관리합니다. 잇몸병은 통증 없이 진행되므로 정기 검진이 중요합니다.',
    pts:'연 1회 건강보험 스케일링\n잇몸 속 치석 제거\n잇몸병 정기 관리\n올바른 칫솔질 교육',
    points:[['shield','잇몸병 예방','정기 관리로 잇몸병을 미리 막습니다.'],['tooth','깊은 치석 제거','잇몸 속 숨은 치석까지 제거합니다.'],['cal','정기 검진','3~6개월 주기로 상태를 확인합니다.']],
    steps:[['잇몸 검사','잇몸 깊이와 염증 정도를 측정합니다.'],['스케일링','눈에 보이는 치석을 제거합니다.'],['잇몸 치료','잇몸 속 치석과 염증을 치료합니다.'],['정기 관리','주기적으로 상태를 점검합니다.']],
    faq:[['스케일링하면 치아가 깎이나요?','치석만 제거하며 치아는 손상되지 않습니다.'],['스케일링은 얼마나 자주 받아야 하나요?','6개월~1년에 한 번을 권장하며, 잇몸이 약하면 더 자주 받는 것이 좋습니다.']] },
  kids: { title:'소아치과', en:'KIDS DENTISTRY', img:'treat', heroImg:'lounge', icon:'child', desc:'아이가 웃으며 오는 첫 치과',
    lead:'아이의 첫 치과,\n좋은 기억으로', d:'아이의 눈높이에서 천천히 설명하고, 무서움 없이 치료받을 수 있도록 진료합니다. 불소 도포와 실란트로 충치를 미리 예방합니다.',
    pts:'불소 도포 · 실란트\n유치 충치 치료\n성장기 교정 상담\n아이 눈높이 진료',
    points:[['child','눈높이 진료','아이가 이해할 수 있도록 천천히 설명합니다.'],['shield','충치 예방','불소와 실란트로 충치를 막습니다.'],['cal','성장 관리','영구치가 날 때까지 꾸준히 확인합니다.']],
    steps:[['친해지기','치과 기구를 먼저 보여주며 긴장을 풉니다.'],['검진','충치와 치아 배열을 확인합니다.'],['예방 · 치료','불소·실란트·충치 치료를 진행합니다.'],['정기 검진','3~6개월마다 성장을 확인합니다.']],
    faq:[['첫 치과 검진은 언제가 좋나요?','첫 유치가 나고 돌 무렵 첫 검진을 권장합니다.'],['유치는 빠질 텐데 치료해야 하나요?','유치 충치를 방치하면 영구치에도 영향을 줄 수 있어 치료가 필요합니다.']] }
};
const SITEMAP = [
  { label:'병원소개', children:[['greeting','인사말'],['doctors','의료진 소개'],['tour','병원 둘러보기'],['location','진료안내 · 오시는 길']] },
  { label:'임플란트', children:[['implant','임플란트'],['nav-implant','네비게이션 임플란트'],['bone-graft','뼈이식 임플란트']] },
  { label:'치아교정', children:[['clear-aligner','투명교정'],['braces','일반 · 세라믹 교정'],['partial-ortho','부분교정']] },
  { label:'심미치료', children:[['laminate','라미네이트'],['whitening','치아미백'],['gum-contour','잇몸성형']] },
  { label:'일반진료', children:[['cavity','충치치료'],['root-canal','신경치료'],['gum','잇몸치료 · 스케일링'],['kids','소아치과']] },
  { label:'커뮤니티', children:[['cases','치료 전후사진'],['faq','자주 묻는 질문']] }
];
const blk = (type, data) => ({ id: bid(), type, hidden: false, data: { ...COMMON_BLOCKS[type].defaults(), ...data } });
function txPage(slug, group){
  const x = TX[slug];
  const blocks = [
    blk('c_subhero', { img:'asset:'+x.heroImg, en:x.en, t:x.title, d:x.desc, crumb:`HOME  >  ${group}  >  ${x.title}` }),
    blk('c_treat', { img:'asset:'+x.img, lab:x.en, t:x.lead.replace('\n',' '), d:x.d, pts:x.pts, btn:'상담 예약하기', side:'left' }),
    blk('c_points', { lab:'POINT', t:`${x.title}, 이런 점이 다릅니다`, s:'', items:x.points.map(([icon,t,d])=>({icon,t,d})) }),
    blk('c_steps', { lab:'PROCESS', t:`${x.title} 치료 과정`, items:x.steps.map(([t,d])=>({t,d})) })
  ];
  if (x.ba) blocks.push(blk('c_ba', { lab:'BEFORE & AFTER', t:`${x.title} 치료 사례`, s:'디투치과에서 달라진 미소를 확인하세요' }));
  blocks.push(blk('c_faq', { lab:'FAQ', t:`${x.title} 자주 묻는 질문`, items:x.faq.map(([q,a])=>({q,a})) }));
  blocks.push(blk('c_cta', { t:`${x.title} 상담이 필요하신가요?`, s:'전화 한 통으로 진료 예약과 비용 상담이 가능합니다', btn:'전화 상담하기' }));
  return { id: 'pg-' + slug, slug, title: x.title, blocks };
}
function infoPage(slug, title, group){
  const hero = (img, en, d) => blk('c_subhero', { img:'asset:'+img, en, t:title, d, crumb:`HOME  >  ${group || (['cases','faq','reviews','notice'].includes(slug)?'커뮤니티':'병원소개')}  >  ${title}` });
  const P = {
    greeting: [hero('lobby','GREETING','디투치과를 찾아주셔서 감사합니다'), blk('c_greet',{}), blk('c_points',{ lab:'PRINCIPLE', t:'디투치과의 진료 원칙', items:[['shield','정직한 진료','꼭 필요한 치료만 권해드립니다.'],['tooth','자연치아 보존','내 치아를 최대한 지키는 치료를 먼저 고민합니다.'],['cal','끝까지 책임','치료 후에도 정기 검진으로 관리합니다.']].map(([icon,t,d])=>({icon,t,d})) })],
    doctors: [hero('team','DOCTORS','분야별 전문의가 함께 진료합니다'), blk('c_doctors',{})],
    tour: [hero('lounge','CLINIC TOUR','편안하고 깨끗한 진료 공간'), blk('c_gallery',{})],
    location: [hero('desk','LOCATION','진료시간과 찾아오시는 길을 안내해 드립니다'), blk('c_location',{}), blk('c_cta',{ t:'방문 전 예약하시면 대기 없이 진료받으실 수 있습니다', s:'전화 또는 카카오톡으로 편하게 예약하세요', btn:'전화 예약하기' })],
    cases: [hero('prosth','BEFORE & AFTER','디투치과에서 달라진 미소를 확인하세요'), blk('c_ba',{ lab:'CASES', t:'치료 전후 사례', s:'변색·벌어짐·오래된 보철을 개선한 사례입니다', items:[['변색치 · 치간 벌어짐 개선','지르코니아 라미네이트 · 상악 10치'],['스마일라인 재설계','상악 10치 · 하악 8치 심미 보철'],['오래된 보철 재치료','최소 삭제 · 자연스러운 투명도'],['앞니 형태 개선','라미네이트 · 상악 8치']].map(([t,d])=>({b:'asset:baBefore',a:'asset:baAfter',t,d})) }), blk('c_cta',{ t:'나도 이렇게 바뀔 수 있을까요?', s:'사진 한 장으로도 상담이 가능합니다', btn:'전화 상담하기' })],
    faq: [hero('lounge','FAQ','자주 묻는 질문을 모았습니다'), blk('c_faq',{ lab:'FAQ', t:'자주 묻는 질문', items:[
      ['첫 방문 시 무엇을 준비해야 하나요?','신분증만 지참하시면 됩니다. 정밀 검진 후 맞춤 치료 계획을 안내해 드립니다.'],
      ['예약 없이 방문해도 되나요?','가능하지만 대기 시간이 생길 수 있어 전화 예약을 권해드립니다.'],
      ['진료비는 어떻게 결제하나요?','카드·현금 결제가 가능하며, 큰 치료는 분할 결제 상담이 가능합니다.'],
      ['주차가 가능한가요?','건물 내 주차장을 이용하실 수 있으며, 진료 시 주차 지원이 됩니다.'],
      ['야간 진료를 하나요?','월·금요일은 저녁 9시까지 야간 진료를 합니다.'],
      ['치료 중 아프면 어떻게 하나요?','언제든 손을 들어 알려주세요. 충분히 쉬었다가 진행합니다.']].map(([q,a])=>({q,a})) }), blk('c_cta',{})]
  };
  const extra = (typeof EXTRA_INFO !== 'undefined' && EXTRA_INFO[slug]) ? EXTRA_INFO[slug](hero, title) : null;
  return { id:'pg-' + slug, slug, title, blocks: P[slug] || extra || [hero('lobby','PAGE','')] };
}
function buildStdSite(theme){
  const MAP = (typeof SITEMAPS !== 'undefined' && SITEMAPS[theme]) || SITEMAP;
  const pages = [], nav = [];
  MAP.forEach(g => {
    const kids = g.children.map(([slug, title]) => {
      const pg = TX[slug] ? txPage(slug, g.label) : infoPage(slug, title, g.label);
      pg.title = title; pages.push(pg);
      return { label:title, href:'p:' + pg.id, children:[] };
    });
    nav.push({ label:g.label, href:kids[0].href, children:kids });
  });
  return { pages, nav };
}
/* 홈 화면 카드 → 진료 페이지 자동 연결 */
const LINK_RULES = [[/네비/,'nav-implant'],[/뼈/,'bone-graft'],[/임플란트/,'implant'],[/투명/,'clear-aligner'],[/부분/,'partial-ortho'],[/교정/,'braces'],[/라미네이트|심미/,'laminate'],[/미백/,'whitening'],[/잇몸/,'gum'],[/충치|보존/,'cavity'],[/신경/,'root-canal'],[/어린이|소아/,'kids'],[/통합|일반/,'cavity']];
function guessLink(text){ const t = String(text||''); const r = LINK_RULES.find(([re]) => re.test(t)); return r ? 'p:pg-' + r[1] : ''; }
function autoLinkHome(home){
  home.blocks.forEach(b => {
    if (!['services','clinics','signature'].includes(b.type)) return;
    (b.data.items||[]).forEach(it => { if (!it.href) it.href = guessLink((it.t||'') + ' ' + (it.k||'')); });
  });
}

/* ---------- 버전 변환 ---------- */
const _migrateV2 = migrateContent;
const QUICK_ITEMS = [['implant','임플란트','정밀 식립','implant'],['ortho','치아교정','투명 · 세라믹','clear-aligner'],['sparkle','라미네이트','최소 삭제 심미','laminate'],['sparkle','치아미백','전문가 미백','whitening'],['shield','잇몸치료','스케일링 · 잇몸','gum'],['child','소아치과','눈높이 진료','kids']];
function upgradeV3(theme, c2){
  const home = { id:'home', slug:'index', title:'홈', blocks:c2.blocks || [] };
  const std = buildStdSite(theme);
  if (theme === 'grand' && !home.blocks.some(b => b.type === 'c_quick')){
    const q = blk('c_quick', { lab:'TREATMENT', t:'진료 과목 바로가기', items:QUICK_ITEMS.map(([icon,t,d,s])=>({icon,t,d,href:'p:pg-'+s})) });
    home.blocks.splice(Math.min(1, home.blocks.length), 0, q);
  }
  const site = { ...c2.site, nav: std.nav };
  const c3 = { v:3, site, pages:[home, ...std.pages] };
  autoLinkHome(home);
  return c3;
}
migrateContent = function(theme, c){
  if (c && c.v === 3) return c;
  const v2 = _migrateV2(theme, c);
  return upgradeV3(theme, v2);
};
newBlockData = function(theme, type){
  const def = BLOCKDEFS[theme].blocks[type];
  if (def.defaults) return def.defaults();
  const b = defaultContent(theme).pages[0].blocks.find(x => x.type === type);
  return b ? b.data : blockFromFlat(theme, type, DEFAULTS[theme]());
};
const allBlocks = c => c.pages ? c.pages.flatMap(p => p.blocks) : (c.blocks || []);
const pageOfBlock = (c, id) => (c.pages || []).find(p => p.blocks.some(b => b.id === id));
resolvePath = function(content, path){
  const [root, ...rest] = String(path).split('/');
  if (root === 's') return { obj: content.site, key: rest.join('/') };
  if (root === 'b'){ const b = allBlocks(content).find(x => x.id === rest[0]); return b ? { obj: b.data, key: rest.slice(1).join('/') } : null; }
  return null;
};
firstImage = function(content){
  let found = '';
  const walk = o => { if (found || o == null) return; if (typeof o === 'string'){ if (/^(asset:|https?:|data:image)/.test(o)) found = o; return; } if (typeof o === 'object') Object.values(o).forEach(walk); };
  const bl = content.pages ? content.pages[0].blocks : (content.blocks || []);
  bl.filter(b => !b.hidden).forEach(b => walk(b.data));
  return found;
};

/* ---------- 링크 만들기 (편집기 / 내려받기 / 공유 페이지마다 다르게) ---------- */
function makeLinker(content, mode, pageId, opt = {}){
  const pages = content.pages || [];
  const fileOf = p => (p.id === 'home' ? 'index' : p.slug) + '.html';
  return target => {
    target = String(target || '').trim();
    if (!target) return '#top';
    if (/^(https?:|tel:|mailto:|sms:)/i.test(target)) return target;
    let pid = pageId, h = '';
    if (target.startsWith('p:')){ const i = target.indexOf('#'); pid = i < 0 ? target.slice(2) : target.slice(2, i); h = i < 0 ? '' : target.slice(i + 1); }
    else if (target.startsWith('#b-')){ h = target.slice(1); const pg = pageOfBlock(content, h.slice(2)); pid = pg ? pg.id : pageId; }
    else if (target === '#top' || target === '#') return '#top';
    else return target;
    const page = pages.find(p => p.id === pid); if (!page) return '#top';
    if (h){ const b = page.blocks.find(x => 'b-' + x.id === h); if (!b || (b.hidden && mode !== 'edit')) h = ''; }
    if (pid === pageId) return h ? '#' + h : '#top';
    if (mode === 'export') return fileOf(page) + (h ? '#' + h : '');
    if (mode === 'view') return (opt.viewBase || '?') + (page.id === 'home' ? '' : '&pg=' + encodeURIComponent(page.slug)) + (h ? '#' + h : '');
    return '#pg=' + encodeURIComponent(pid) + (h ? '&h=' + encodeURIComponent(h) : '');
  };
}
function navTargetPage(target){ if (String(target||'').startsWith('p:')) return target.slice(2).split('#')[0]; return null; }

siteCtx = function(content, theme, mode, pageId = 'home', opt = {}){
  const page = (content.pages || []).find(p => p.id === pageId) || content.pages[0];
  const link = makeLinker(content, mode, page.id, opt);
  const vis = page.blocks.filter(b => !b.hidden);
  const T = BLOCKDEFS[theme];
  const ext = h => /^https?:/i.test(h || '');
  const nav = (content.site.nav || []).map(n => {
    const kids = (n.children || []).filter(c => c.label).map(c => ({ label:c.label, href:link(c.href), ext:ext(c.href), on: navTargetPage(c.href) === page.id }));
    return { label:n.label || '', href: link(n.href || (n.children && n.children[0] && n.children[0].href) || ''), ext:ext(n.href), children:kids, on: navTargetPage(n.href) === page.id || kids.some(k => k.on) };
  }).filter(n => n.label);
  return {
    site: content.site, page, link, nav, home: link('p:home'), mode,
    all: vis.map(b => ({ href: '#b-' + b.id, label: (T.blocks[b.type] || {}).label || '' })),
    go: type => { const here = vis.find(x => x.type === type); if (here) return '#b-' + here.id;
      for (const p of content.pages){ const b = p.blocks.find(x => x.type === type && !x.hidden); if (b) return link('p:' + p.id + '#b-' + b.id); }
      return '#top'; }
  };
};
navHTML = function(ctx){
  const a = (n, cls) => { const c = [cls, n.on ? 'on' : ''].filter(Boolean).join(' '); return `<a href="${esc(n.href)}"${c ? ` class="${c}"` : ''}${n.ext ? ' target="_blank" rel="noopener"' : ''}>${esc(n.label)}</a>`; };
  return ctx.nav.map(n => n.children.length
    ? `<div class="mi has-sub${n.on ? ' on' : ''}">${a({ ...n, on:false }, 'mi-a')}<div class="sub"><div class="sub-in">${n.children.map(c => a(c)).join('')}</div></div></div>`
    : a(n)).join('');
};
renderBlockHTML = function(content, theme, block, mode, files, opt = {}){
  const T = BLOCKDEFS[theme], def = T.blocks[block.type];
  if (!def) return '';
  const pg = opt.page || (pageOfBlock(content, block.id) || content.pages[0]).id;
  const S = makeR2(content.site, 's/', mode, files);
  const R = makeR2(block.data, 'b/' + block.id + '/', mode, files);
  const ctx = siteCtx(content, theme, mode, pg, opt);
  return `<div class="blk${block.hidden ? ' is-hidden' : ''}" data-block="${esc(block.id)}" data-type="${esc(block.type)}" id="b-${esc(block.id)}">${def.render(R, block.data, S, ctx)}</div>`;
};
renderSite = function(content, theme, mode, files, opt = {}){
  files = files || {};
  const T = BLOCKDEFS[theme], th = THEMES[theme], site = content.site;
  const page = (content.pages || []).find(p => p.id === (opt.page || 'home')) || content.pages[0];
  const rmode = mode;
  const S = makeR2(site, 's/', rmode, files);
  const showHidden = mode === 'edit' && opt.editUI;
  const body = page.blocks.filter(b => showHidden || !b.hidden).map(b => renderBlockHTML(content, theme, b, mode, files, { ...opt, page: page.id })).join('');
  const ctx = siteCtx(content, theme, mode, page.id, opt);
  let html = T.chrome(S, body, ctx);
  if (mode === 'export') html = html.replace(/src="https:\/\/dentalmbti\.co\.kr\/(assets\/[^"]+\.mp4)"/g, (m, p) => { const nm = 'video/' + p.split('/').pop(); files[nm] = { url: 'https://dentalmbti.co.kr/' + p }; return `src="${nm}"`; });
  if (site.logo){
    const h = Math.max(16, Math.min(160, parseInt(site.logoH, 10) || 44));
    const tone = site.logoTone === 'white' ? 'filter:brightness(0) invert(1);' : site.logoTone === 'black' ? 'filter:brightness(0);' : '';
    const img = S.i('logo', 'logo-img', site.name || 'logo').replace(' loading="lazy"', '').replace('<img', `<img style="height:${h}px;${tone}"`);
    html = html.replace(/(<a [^>]*class="logo"[^>]*>)[\s\S]*?(<\/a>)/, (m, a, b) => a + img + b);
  }
  if (site.mapImg){
    const mimg = S.i('mapImg', 'map-img', (site.name || '') + ' 오시는 길 약도');
    const murl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(site.address || site.name || '');
    html = html.replace(/<div class="mapbox"><iframe[^>]*><\/iframe><\/div>/g, `<div class="mapbox ill">${mimg}<a class="mapgo" href="${murl}" target="_blank" rel="noopener">지도 앱에서 열기</a></div>`);
  }
  const og = firstImage(content);
  const ogSrc = og ? makeR2({ og }, 'og/', rmode, files).src('og') : '';
  const sub = page.id !== 'home';
  const title = page.seoTitle || (sub ? `${page.title} | ${site.name}` : `${site.name}${site.metaTitle ? ' | ' + site.metaTitle : ''}`);
  const desc = page.seoDesc || site.metaDesc || '';
  const base = String(site.siteUrl || '').trim().replace(/\/+$/, '');
  const pageUrl = base ? base + '/' + (sub ? page.slug + '.html' : '') : '';
  let ogAbs = ogSrc; if (ogAbs && !/^(https?:|data:)/.test(ogAbs)) ogAbs = base ? base + '/' + ogAbs.replace(/^\.?\//, '') : '';
  const exp = mode === 'export';
  const headExtra = (exp && pageUrl ? `<link rel="canonical" href="${esc(pageUrl)}"><meta property="og:url" content="${esc(pageUrl)}">` : '')
    + `<meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="ko_KR">`
    + `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">${ogAbs ? `<meta name="twitter:image" content="${esc(ogAbs)}">` : ''}`
    + (exp ? '<meta name="robots" content="index,follow">' : '')
    + (site.naverVerify ? `<meta name="naver-site-verification" content="${esc(site.naverVerify)}">` : '')
    + (site.googleVerify ? `<meta name="google-site-verification" content="${esc(site.googleVerify)}">` : '')
    + (exp ? seoJsonLd(content, page, { base, pageUrl, title, desc, og: ogAbs }) : '');
  return `<!DOCTYPE html>
<html lang="ko"${sub ? ' class="sub"' : ''}><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<script>window.__PAGE=${JSON.stringify(page.id)}<\/script>
${opt.head || ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">${ogAbs ? `<meta property="og:image" content="${esc(ogAbs)}">` : ''}
${headExtra}
<meta name="theme-color" content="${esc(site.color)}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
${th.fonts || ''}
<style>:root{--pc:${esc(site.color)};--pc2:${esc(site.color2 || site.color)}}${COMMON_CSS}${th.css}${COMMON_BLOCK_CSS}${NAV_CSS}${TREAT_CSS}${PAGE_BLOCK_CSS}.logo-img{display:block;width:auto;max-width:min(300px,52vw);object-fit:contain}.logo:has(.logo-img){gap:0}.blk{scroll-margin-top:72px}.t-d2 .blk{scroll-margin-top:0}.blk.is-hidden{display:none}</style>
</head><body class="t-${theme}${sub ? ' sub' : ''}">
${html}
${privacyHTML(site)}
<script>${COMMON_JS2}${th.js || ''}<\/script>
${opt.tail || ''}
</body></html>`;
};

/* ---------- 검색엔진 · AI용 구조화 데이터 (JSON-LD) ---------- */
function seoPlain(v){ return String(v == null ? '' : v).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
function seoJsonLd(content, page, o){
  const site = content.site, base = o.base, home = base ? base + '/' : '';
  const id = k => base ? base + '/#' + k : undefined;
  const list = v => String(v || '').split(/[,\n]/).map(x => x.trim()).filter(Boolean);
  const biz = { '@type':'Dentist', '@id':id('dentist'), name:site.name, alternateName:list(site.altNames), url:home || undefined, telephone:site.phone || undefined,
    image:o.og || undefined, description:site.metaDesc || undefined, medicalSpecialty:'Dentistry', isAcceptingNewPatients:true };
  const a = site.ldAddr || null;
  biz.address = a ? { '@type':'PostalAddress', addressCountry:'KR', ...a } : (site.address ? { '@type':'PostalAddress', addressCountry:'KR', streetAddress:site.address } : undefined);
  if (site.address) biz.hasMap = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(site.address);
  if (Array.isArray(site.ldHours) && site.ldHours.length) biz.openingHoursSpecification = site.ldHours.map(h => ({ '@type':'OpeningHoursSpecification', dayOfWeek:h.days, opens:h.opens, closes:h.closes }));
  const areas = list(site.areaServed); if (areas.length) biz.areaServed = areas.map(n => ({ '@type':'Place', name:n }));
  if (site.ldDoctor) biz.employee = { '@type':'Person', name:site.ldDoctor.name, jobTitle:site.ldDoctor.job, description:site.ldDoctor.desc || undefined };
  const same = list(site.sameAs || site.bal_blog); if (same.length) biz.sameAs = same;
  const g = [biz,
    { '@type':'WebSite', '@id':id('website'), url:home || undefined, name:site.name, inLanguage:'ko-KR', publisher: base ? { '@id':id('dentist') } : undefined },
    { '@type':'WebPage', '@id':o.pageUrl ? o.pageUrl + '#webpage' : undefined, url:o.pageUrl || undefined, name:o.title, description:o.desc, inLanguage:'ko-KR',
      isPartOf: base ? { '@id':id('website') } : undefined, about: base ? { '@id':id('dentist') } : undefined }];
  if (page.id !== 'home' && base) g.push({ '@type':'BreadcrumbList', itemListElement:[
    { '@type':'ListItem', position:1, name:'홈', item:home }, { '@type':'ListItem', position:2, name:page.title, item:o.pageUrl } ] });
  const vis = (page.blocks || []).filter(b => !b.hidden);
  const faqs = []; vis.filter(b => b.type === 'c_faq' || b.type === 'c_consult').forEach(b => (b.data.items || []).forEach(it => { const q = seoPlain(it.q), an = seoPlain(it.a); if (q && an) faqs.push({ '@type':'Question', name:q, acceptedAnswer:{ '@type':'Answer', text:an } }); }));
  if (faqs.length) g.push({ '@type':'FAQPage', '@id':o.pageUrl ? o.pageUrl + '#faq' : undefined, mainEntity:faqs });
  if (page.id !== 'home' && vis.some(b => b.type === 'c_steps')) g.push({ '@type':'Service', name:page.title, serviceType:page.title, description:o.desc,
    provider: base ? { '@id':id('dentist') } : { '@type':'Dentist', name:site.name }, areaServed: areas.length ? areas.map(n => ({ '@type':'Place', name:n })) : undefined, url:o.pageUrl || undefined });
  const json = JSON.stringify({ '@context':'https://schema.org', '@graph':g }, (k, v) => (v === undefined || (Array.isArray(v) && !v.length)) ? undefined : v);
  return `<script type="application/ld+json">${json.replace(/</g, '\\u003c')}<\/script>`;
}
/* ---------- 내보내기용 robots.txt · sitemap.xml · llms.txt ---------- */
function seoFiles(content){
  const site = content.site, base = String(site.siteUrl || '').trim().replace(/\/+$/, ''), out = {};
  const url = pg => base + '/' + (pg.id === 'home' ? '' : pg.slug + '.html');
  out['robots.txt'] = 'User-agent: *\nAllow: /\n' + (base ? `\nSitemap: ${base}/sitemap.xml\n` : '');
  if (base){
    const d = new Date().toISOString().slice(0, 10);
    out['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + content.pages.map(pg => `  <url><loc>${url(pg)}</loc><lastmod>${d}</lastmod><priority>${pg.id === 'home' ? '1.0' : '0.7'}</priority></url>`).join('\n') + '\n</urlset>\n';
  }
  const L = [`# ${site.name}`, '', `> ${site.metaDesc || ''}`, ''];
  L.push('## 기본 정보');
  if (site.address) L.push(`- 주소: ${site.address}`);
  if (site.phone) L.push(`- 전화: ${site.phone}`);
  if (site.hours) L.push('- 진료시간: ' + String(site.hours).split('\n').map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' / '));
  if (site.ldDoctor) L.push(`- 대표원장: ${site.ldDoctor.name} (${site.ldDoctor.job}${site.ldDoctor.desc ? ', ' + site.ldDoctor.desc : ''})`);
  if (site.areaServed) L.push(`- 가까운 지역: ${String(site.areaServed).replace(/\n/g, ', ')}`);
  if (site.bal_blog) L.push(`- 블로그: ${site.bal_blog}`);
  L.push('', '## 페이지');
  content.pages.forEach(pg => L.push(`- [${pg.title}](${base ? url(pg) : (pg.id === 'home' ? 'index.html' : pg.slug + '.html')}): ${pg.seoDesc || ''}`.trim()));
  const fq = []; content.pages.forEach(pg => (pg.blocks || []).filter(b => b.type === 'c_faq' && !b.hidden).forEach(b => (b.data.items || []).forEach(it => { const q = seoPlain(it.q), a = seoPlain(it.a); if (q && a && fq.length < 12 && !fq.some(x => x[0] === q)) fq.push([q, a]); })));
  if (fq.length){ L.push('', '## 자주 묻는 질문'); fq.forEach(([q, a]) => L.push(`- Q. ${q}`, `  A. ${a}`)); }
  out['llms.txt'] = L.join('\n') + '\n';
  return out;
}
