/* =====================================================================
   블록 구조 (v2) — 디투덴탈 편집모드 방식
   content = { v:2, site:{...공통정보}, blocks:[{id,type,hidden,data}] }
   경로(path): 's/name'  ·  'b/<블록ID>/title'  ·  'b/<블록ID>/items/0/img'
===================================================================== */
const bid = () => 'b' + Math.random().toString(36).slice(2, 9);
const clone = o => JSON.parse(JSON.stringify(o));
function getp(o, p){ return String(p).split('/').reduce((a, k) => (a == null ? undefined : a[k]), o); }
function setp(o, p, v){ const ks = String(p).split('/'); let a = o; ks.slice(0, -1).forEach(k => { if (a[k] == null) a[k] = {}; a = a[k]; }); a[ks[ks.length - 1]] = v; }
function resolvePath(content, path){
  const [root, ...rest] = String(path).split('/');
  if (root === 's') return { obj: content.site, key: rest.join('/') };
  if (root === 'b'){ const b = content.blocks.find(x => x.id === rest[0]); return b ? { obj: b.data, key: rest.slice(1).join('/') } : null; }
  return null;
}
function getPath(content, path){ const r = resolvePath(content, path); return r ? getp(r.obj, r.key) : undefined; }
function setPath(content, path, v){ const r = resolvePath(content, path); if (r) setp(r.obj, r.key, v); }

/* ---------- 렌더러: prefix 아래의 값을 읽고, 편집용 data-k / data-img 표시 ---------- */
function makeR2(base, prefix, mode, files){
  const val = k => getp(base, k);
  const src = k => {
    const v = val(k) || '';
    let data;
    if (v.startsWith('asset:')) data = HP_ASSET_BASE + v.slice(6) + '.webp';
    else if (v.startsWith('ph:')) data = phSvg(v.slice(3));
    else data = v;
    if (mode !== 'export' || !data) return data || '';
    let ext = 'jpg';
    const m = /^data:image\/([a-z+]+)/.exec(data);
    if (m) ext = m[1].replace('svg+xml', 'svg').replace('jpeg', 'jpg');
    else { const e = /\.([a-z0-9]{3,4})(?:\?|#|$)/i.exec(data); if (e) ext = e[1].toLowerCase(); }
    const name = 'images/' + (prefix + k).replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '') + '.' + ext;
    files[name] = data.startsWith('data:') ? data : { url: data };
    return name;
  };
  return {
    t: (k, tag = 'x-t', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-k="${prefix + k}">${fmt(val(k))}</${tag}>`,
    i: (k, cls = '', alt = '') => { if (!alt){ const m = /^(.*\/)[^/]+$/.exec(k); if (m){ const f = ['t','hl','c','cap','n','d'].map(x => val(m[1] + x)).find(x => x && String(x).trim()); if (f) alt = [val(m[1] + 't1'), f].filter(Boolean).join(' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(); } } return val(k) ? `<img${cls ? ` class="${cls}"` : ''} data-img="${prefix + k}" src="${src(k)}" alt="${esc(alt)}" loading="lazy">` : (mode === 'edit' ? `<img${cls ? ` class="${cls}"` : ''} data-img="${prefix + k}" src="${phSvg('PHOTO')}" alt="">` : ''); },
    v: k => esc(val(k)), raw: val, src
  };
}

/* ---------- 필드 도우미 ---------- */
const F = {
  menu: (d) => ({ key: 'menu', label: '상단 메뉴 이름', type: 'text', hint: '비워두면 상단 메뉴에 나오지 않습니다.', def: d || '' }),
  text: (key, label, extra) => ({ key, label, type: 'text', ...extra }),
  area: (key, label, extra) => ({ key, label, type: 'textarea', ...extra }),
  img: (key, label, extra) => ({ key, label, type: 'image', ...extra }),
  link: (key, label, extra) => ({ key, label: label || '연결할 페이지', type: 'target', ...extra }),
  icon: (key, label, extra) => ({ key, label, type: 'select', options: [['tooth','치아'],['implant','임플란트'],['ortho','교정'],['sparkle','미백/심미'],['shield','안심/잇몸'],['child','어린이'],['clock','시간'],['phone','전화'],['pin','위치'],['cal','예약'],['won','비용'],['chat','상담']], ...extra }),
  list: (key, label, itemLabel, count, item, extra) => ({ key, label, type: 'list', itemLabel, count, item, ...extra })
};

/* ---------- 공통 블록 (모든 디자인에서 추가 가능) ---------- */
const COMMON_BLOCK_CSS = `
.cb{padding:110px 0}.cb .wrap{position:relative}.cb-tit{text-align:center;margin-bottom:46px}.cb-tit small{display:block;color:var(--pc);font-weight:800;letter-spacing:.2em;font-size:13px;margin-bottom:10px}
.cb-tit h2{font-size:clamp(26px,3vw,40px);letter-spacing:-.03em;line-height:1.3}.cb-tit p{margin-top:12px;opacity:.7}
.cb-ba .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}.cb-ba .cap{padding:14px 2px 0}.cb-ba .cap b{display:block;font-size:17px}.cb-ba .cap x-t+x-t,.cb-ba .cap span{opacity:.65;font-size:14px}
.cb-text .wrap{max-width:860px;text-align:center}.cb-text h2{font-size:clamp(26px,3vw,40px);letter-spacing:-.03em;line-height:1.35;margin-bottom:22px}.cb-text p{font-size:17px;line-height:1.9;opacity:.8}
.cb-img figure img{width:100%;max-height:640px;object-fit:cover;border-radius:var(--r)}.cb-img figcaption{text-align:center;margin-top:14px;opacity:.7;font-size:14px}
.cb-cta{background:var(--pc);color:#fff;text-align:center;padding:90px 0}.cb-cta h2{font-size:clamp(26px,3vw,40px);letter-spacing:-.03em;line-height:1.35}.cb-cta p{margin-top:12px;opacity:.85}
.cb-cta a{display:inline-block;margin-top:28px;background:#fff;color:#111;font-weight:800;padding:15px 40px;border-radius:40px}
.cb-faq .wrap{max-width:880px}.cb-faq details{border-bottom:1px solid var(--line);padding:20px 4px}.cb-faq summary{font-weight:700;font-size:17px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:20px}
.cb-faq summary:after{content:'+';color:var(--pc);font-size:22px;line-height:1}.cb-faq details[open] summary:after{content:'–'}.cb-faq details p{margin-top:12px;opacity:.75;line-height:1.85}
@media(max-width:900px){.cb{padding:70px 0}}`;
const COMMON_BLOCKS = {
  c_ba: { label: '전후사진 비교', desc: '치료 전·후 사진을 좌우로 밀어 비교하는 카드 묶음', fields: [F.menu('전후사진'), F.text('lab','작은 제목'), F.text('t','제목'), F.text('s','설명'), F.list('items','전후사진 케이스','케이스',2,[F.img('b','치료 전 사진'),F.img('a','치료 후 사진'),F.text('t','케이스 제목'),F.text('d','설명')])],
    defaults: () => ({ menu:'전후사진', lab:'BEFORE & AFTER', t:'치료 사례', s:'디투치과에서 달라진 미소를 확인하세요', items:[0,1].map(()=>({b:'asset:baBefore',a:'asset:baAfter',t:'변색치 · 치간 벌어짐 개선',d:'지르코니아 라미네이트 · 상악 10치'}))}),
    render: (R, d) => `<section class="cb cb-ba"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2><p>${R.t('s')}</p></div><div class="grid">${(d.items||[]).map((_,n)=>`<div>${baBlock(R,`items/${n}/b`,`items/${n}/a`,'',R.raw(`items/${n}/t`))}<div class="cap"><b>${R.t(`items/${n}/t`)}</b><span>${R.t(`items/${n}/d`)}</span></div></div>`).join('')}</div></div></section>` },
  c_text: { label: '제목 + 글', desc: '가운데 정렬된 제목과 본문 글', fields: [F.menu(''), F.text('t','제목'), F.area('d','본문')],
    defaults: () => ({ menu:'', t:'새로운 소식을 전해드립니다', d:'이곳에 병원 소개, 공지, 진료 철학 등\n원하는 내용을 자유롭게 입력하세요.' }),
    render: R => `<section class="cb cb-text"><div class="wrap"><h2>${R.t('t')}</h2><p>${R.t('d')}</p></div></section>` },
  c_img: { label: '큰 사진', desc: '화면 폭에 맞춘 사진 한 장과 설명', fields: [F.menu(''), F.img('img','사진'), F.text('c','사진 설명')],
    defaults: () => ({ menu:'', img:'asset:lobby', c:'디투치과 라운지' }),
    render: R => `<section class="cb cb-img"><div class="wrap"><figure>${R.i('img','',String(R.raw('c')||'').replace(/\s+/g,' '))}<figcaption>${R.t('c')}</figcaption></figure></div></section>` },
  c_cta: { label: '상담 유도 배너', desc: '대표색 배경에 큰 문구와 전화 버튼', fields: [F.menu(''), F.text('t','큰 문구'), F.text('s','작은 문구'), F.text('btn','버튼 글자')],
    defaults: () => ({ menu:'', t:'지금 바로 무료 상담을 받아보세요', s:'전화 한 통으로 진료 예약과 비용 상담이 가능합니다', btn:'전화 상담하기' }),
    render: (R, d, S, ctx) => `<section class="cb-cta"><div class="wrap"><h2>${R.t('t')}</h2><p>${R.t('s')}</p><a href="tel:${S.v('phone')}">${R.t('btn')}</a></div></section>` },
  c_faq: { label: '자주 묻는 질문', desc: '질문을 누르면 답이 펼쳐지는 FAQ', fields: [F.menu('FAQ'), F.text('lab','작은 제목'), F.text('t','제목'), F.list('items','질문 목록','질문',3,[F.text('q','질문'),F.area('a','답변')])],
    defaults: () => ({ menu:'FAQ', lab:'FAQ', t:'자주 묻는 질문', items:[
      {q:'첫 방문 시 무엇을 준비해야 하나요?', a:'신분증만 지참하시면 됩니다. 정밀 검진 후 맞춤 치료 계획을 안내해 드립니다.'},
      {q:'치료 기간은 얼마나 걸리나요?', a:'치료 종류와 구강 상태에 따라 다르며, 상담 시 정확한 일정을 안내해 드립니다.'},
      {q:'주차가 가능한가요?', a:'건물 내 주차장을 이용하실 수 있으며, 진료 시 주차 지원이 됩니다.'}]}),
    render: (R, d) => `<section class="cb cb-faq"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div>${(d.items||[]).map((_,n)=>`<details><summary>${R.t(`items/${n}/q`)}</summary><p>${R.t(`items/${n}/a`)}</p></details>`).join('')}</div></section>` }
};

/* ---------- 디자인별 블록 정의 ----------
   from: 예전(v1) 내용의 키 — 자동 변환과 기본값에 사용 */
const BLOCKDEFS = {};

/* 1. GRAND */
BLOCKDEFS.grand = {
  siteFields: [F.text('g_cta','상단 상담 버튼 글자')],
  layout: ['hero','ba','why','reviews','contact'],
  blocks: {
    hero: { label:'메인 배너', desc:'첫 화면 큰 사진과 문구, 오른쪽 아래 공지 카드', menu:'',
      fields:[F.menu(''), F.img('img_hero','배경 사진'), F.text('g_kicker','작은 영문 문구'), F.area('g_h1','큰 제목',{rows:2}), F.area('g_sub','설명 문구',{rows:2}),
        F.list('notices','공지 카드','카드',2,[F.text('tag','라벨', {dflt:i=>['NOTICE','EVENT'][i]||'NEWS'}),F.text('t','내용',{from:i=>'g_n'+(i+1)})],{max:3})],
      render:(R,d)=>`<section class="hero">${R.i('img_hero')}<div class="wrap in"><div class="k">${R.t('g_kicker')}</div><h1>${R.t('g_h1')}</h1><p>${R.t('g_sub')}</p></div>
<div class="notice">${(d.notices||[]).map((_,n)=>`<a href="#"><b>${R.t(`notices/${n}/tag`)}</b>${R.t(`notices/${n}/t`)}</a>`).join('')}</div></section>` },
    ba: { label:'전후사진', desc:'치료 전·후 비교 카드 (좌우로 밀어서 비교)', menu:'전후사진',
      fields:[F.menu('전후사진'), F.text('g_ba_t','제목'), F.text('g_ba_s','설명'),
        F.list('items','전후사진 케이스','케이스',3,[F.img('b','치료 전 사진',{from:i=>`ba${i+1}_b`}),F.img('a','치료 후 사진',{from:i=>`ba${i+1}_a`}),F.text('t','케이스 제목',{from:i=>`ba${i+1}_t`}),F.text('d','설명',{from:i=>`ba${i+1}_d`})])],
      render:(R,d)=>`<section class="sec ba-sec"><div class="wrap"><div class="tit rv"><small>BEFORE &amp; AFTER</small><h2>${R.t('g_ba_t')}</h2><p>${R.t('g_ba_s')}</p></div>
<div class="ba-grid">${(d.items||[]).map((_,n)=>`<div class="ba-card rv">${baBlock(R,`items/${n}/b`,`items/${n}/a`,'',R.raw(`items/${n}/t`))}<div class="cap"><b>${R.t(`items/${n}/t`)}</b><span>${R.t(`items/${n}/d`)}</span></div></div>`).join('')}</div></div></section>` },
    why: { label:'병원 강점 (사진+글)', desc:'사진과 설명이 좌우로 번갈아 나오는 소개', menu:'병원소개',
      fields:[F.menu('병원소개'), F.text('g_why_lab','작은 제목',{def:'WHY D2 DENTAL CLINIC'}), F.area('g_why_t','제목',{rows:2}),
        F.list('items','강점 항목','항목',4,[F.img('img','사진',{from:i=>`img_w${i+1}`}),F.text('tag','라벨',{from:i=>`w${i+1}_tag`}),F.area('t','제목',{rows:2,from:i=>`w${i+1}_t`}),F.area('d','설명',{from:i=>`w${i+1}_d`})])],
      render:(R,d)=>`<section class="sec why"><div class="wrap"><div class="tit rv"><small>${R.t('g_why_lab')}</small><h2>${R.t('g_why_t')}</h2></div>
${(d.items||[]).map((_,n)=>`<div class="row rv"><div class="ph">${R.i(`items/${n}/img`)}</div><div class="tx"><span class="tag">${R.t(`items/${n}/tag`)}</span><h3>${R.t(`items/${n}/t`)}</h3><p>${R.t(`items/${n}/d`)}</p></div></div>`).join('')}</div></section>` },
    reviews: { label:'치료 후기', desc:'별점과 함께 보여주는 후기 카드', menu:'치료후기',
      fields:[F.menu('치료후기'), F.text('g_rev_t','제목'), F.text('g_rev_s','설명'),
        F.list('items','후기','후기',3,[F.area('t','후기 내용',{from:i=>`r${i+1}`}),F.text('n','작성자 · 치료',{from:i=>`r${i+1}_n`})])],
      render:(R,d)=>`<section class="sec rev"><div class="wrap"><div class="tit rv"><small>REAL REVIEW</small><h2>${R.t('g_rev_t')}</h2><p>${R.t('g_rev_s')}</p></div>
<div class="rev-grid">${(d.items||[]).map((_,n)=>`<div class="rev-card rv"><div class="st">★★★★★</div><p>${R.t(`items/${n}/t`)}</p><span>${R.t(`items/${n}/n`)}</span></div>`).join('')}</div></div></section>` },
    contact: { label:'연락처 · 오시는 길', desc:'전화·진료시간·주소·지도 (내용은 [기본 정보]에서 수정)', menu:'오시는길',
      fields:[F.menu('오시는길'), F.text('btn','상담 버튼 글자',{def:'상담 예약'})],
      render:(R,d,S,ctx)=>`<section class="ct"><div class="a"><h3>CONTACT</h3><a class="tel" href="tel:${S.v('phone')}">${S.t('phone')}</a><div class="hours">${S.t('hours')}</div><a href="#" class="btn" data-modal="mform">${R.t('btn')}</a></div>
<div class="b"><h3>LOCATION</h3><p class="addr">${S.t('address')}</p><p class="trf">${S.t('traffic')}</p>${mapBox(ctx.site)}</div></section>` }
  },
  chrome:(S,body,ctx)=>`
<header class="hd"><div class="wrap"><a href="${ctx.home}" class="logo">${S.t('name')}<small>${S.t('nameEn')}</small></a>
<nav>${navHTML(ctx)}</nav>
<a href="#" class="cta" data-modal="mform">${S.t('g_cta')}</a><button class="nav-tg" aria-label="메뉴">☰</button></div></header>
<main id="top">${body}</main>
<div class="modal" id="mform"><div><button class="x" type="button">×</button><h3>${S.t('g_cta')}</h3>${formHTML(ctx.site,S,{select:true})}</div></div>
<footer class="ft"><div class="wrap"><b>${S.t('name')}</b>${S.t('biz')}<br>© ${S.t('nameEn')}. All rights reserved.</div></footer>
<div class="mbar"><a href="tel:${S.v('phone')}">${ic('phone')}전화하기</a><a href="${S.v('kakao')||'#'}">${ic('chat')}카톡상담</a><a href="${ctx.go('ba')}">${ic('sparkle')}전후사진</a><a href="#" class="totop">${ic('up')}TOP</a></div>
<style>.modal{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:none;place-items:center;padding:20px}.modal.on{display:grid}.modal>div{background:#fff;padding:40px;max-width:460px;width:100%;position:relative}.modal h3{margin-bottom:20px;font-size:22px}.modal .x{position:absolute;top:10px;right:14px;background:none;border:0;font-size:28px}</style>`
};

/* 2. PREMIUM */
BLOCKDEFS.premium = {
  siteFields: [F.text('p_form_t','상담 신청 창 제목')],
  layout: ['hero','phil','diff','sig','space','staff','services','stories','location'],
  blocks: {
    hero: { label:'메인 배너', desc:'큰 영문 타이틀과 사진', menu:'',
      fields:[F.menu(''), F.area('p_en','큰 영문 타이틀',{rows:2}), F.area('p_quote','소개 문구',{rows:3}), F.img('img_hero','사진')],
      render:R=>`<section class="hero"><div class="l"><div class="en rv">${R.t('p_en')}</div><p class="q rv">${R.t('p_quote')}</p></div><div class="r">${R.i('img_hero')}</div></section>` },
    phil: { label:'철학 문구', desc:'가운데 정렬 큰 문구', menu:'About',
      fields:[F.menu('About'), F.text('lab','작은 제목',{def:'Our Philosophy'}), F.text('p_phil_t','큰 문구'), F.area('p_phil_d','설명')],
      render:R=>`<section class="sec phil"><div class="wrap rv"><span class="lab">${R.t('lab')}</span><h2>${R.t('p_phil_t')}</h2><p>${R.t('p_phil_d')}</p></div></section>` },
    diff: { label:'차별점 3가지', desc:'번호가 붙은 3단 설명', menu:'',
      fields:[F.menu(''), F.area('title','제목',{rows:2,def:'What Makes\n디투치과 Different'}),
        F.list('items','차별점','항목',3,[F.area('en','영문 제목',{rows:2,from:i=>`p${i+1}_en`}),F.area('d','설명',{from:i=>`p${i+1}_d`})])],
      render:(R,d)=>`<section class="sec diff"><div class="wrap"><div class="head rv"><h2>${R.t('title')}</h2></div>
<div class="cols3">${(d.items||[]).map((_,n)=>`<div class="rv"><span class="no">0${n+1}</span><h3>${R.t(`items/${n}/en`)}</h3><p>${R.t(`items/${n}/d`)}</p></div>`).join('')}</div></div></section>` },
    sig: { label:'시그니처 진료', desc:'어두운 배경의 대표 진료 소개', menu:'Signature',
      fields:[F.menu('Signature'), F.text('sig_name','브랜드명'), F.text('sig_t','부제'), F.area('sig_d','설명'), F.text('btn','버튼 글자',{def:'VIEW MORE'}), F.img('img_sig','사진')],
      render:R=>`<section class="sig"><div class="tx rv"><span class="lab">Signature</span><h2>${R.t('sig_name')}</h2><h3>${R.t('sig_t')}</h3><p>${R.t('sig_d')}</p><a href="#" class="btn" data-modal="mform">${R.t('btn')}</a></div><div class="ph">${R.i('img_sig')}</div></section>` },
    space: { label:'공간 소개', desc:'사진 3장 갤러리', menu:'',
      fields:[F.menu(''), F.text('sp_t','제목'), F.list('items','사진','사진',3,[F.img('img','사진',{from:i=>`img_sp${i+1}`}),F.text('c','설명',{from:i=>`sp${i+1}_c`})],{max:3})],
      render:(R,d)=>`<section class="sec space"><div class="wrap"><span class="lab rv">Space</span><div class="phil" style="text-align:left"><h2 class="rv">${R.t('sp_t')}</h2></div>
<div class="gal">${(d.items||[]).map((_,n)=>`<figure class="rv">${R.i(`items/${n}/img`)}<figcaption>${R.t(`items/${n}/c`)}</figcaption></figure>`).join('')}</div></div></section>` },
    staff: { label:'의료진', desc:'의료진 사진과 약력', menu:'Doctors',
      fields:[F.menu('Doctors'), F.text('st_t','제목'), F.list('items','의료진','의료진',3,[F.img('img','사진',{from:i=>`img_d${i+1}`}),F.text('n','이름',{from:i=>`d${i+1}_n`}),F.text('p','직책(영문)',{from:i=>`d${i+1}_p`}),F.area('c','약력',{from:i=>`d${i+1}_c`})])],
      render:(R,d)=>`<section class="sec staff"><div class="wrap"><span class="lab rv">Medical Staff</span><div class="phil" style="text-align:left"><h2 class="rv">${R.t('st_t')}</h2></div>
<div class="grid">${(d.items||[]).map((_,n)=>`<div class="rv">${R.i(`items/${n}/img`)}<div class="nm">${R.t(`items/${n}/n`)}</div><div class="po">${R.t(`items/${n}/p`)}</div><div class="cr">${R.t(`items/${n}/c`)}</div></div>`).join('')}</div></div></section>` },
    services: { label:'진료 과목', desc:'4단 진료 과목 설명', menu:'Services',
      fields:[F.menu('Services'), F.text('sv_t','제목'), F.list('items','진료 과목','과목',4,[F.text('t','과목명',{from:i=>`s${i+1}_t`}),F.area('d','설명',{from:i=>`s${i+1}_d`}),F.link('href')])],
      render:(R,d,S,ctx)=>`<section class="sec svc"><div class="wrap"><span class="lab rv">Dental Services</span><div class="phil" style="text-align:left"><h2 class="rv">${R.t('sv_t')}</h2></div>
<div class="grid">${(d.items||[]).map((it,n)=>`<a class="rv" href="${ctx.link(it.href)}"><h3>${R.t(`items/${n}/t`)}</h3><p>${R.t(`items/${n}/d`)}</p><em class="more">자세히 보기 →</em></a>`).join('')}</div></div></section>` },
    stories: { label:'스토리 · 블로그', desc:'사진 카드형 글 목록', menu:'',
      fields:[F.menu(''), F.list('items','글','글',3,[F.img('img','사진',{from:i=>`img_st${i+1}`}),F.text('ty','분류',{from:i=>`st${i+1}_ty`}),F.text('t','제목',{from:i=>`st${i+1}_t`})])],
      render:(R,d)=>`<section class="sec story" style="padding-top:0"><div class="wrap"><span class="lab rv">Stories</span>
<div class="grid">${(d.items||[]).map((_,n)=>`<article class="rv">${R.i(`items/${n}/img`)}<span class="ty">${R.t(`items/${n}/ty`)}</span><h4>${R.t(`items/${n}/t`)}</h4></article>`).join('')}</div></div></section>` },
    location: { label:'오시는 길', desc:'주소·진료시간·지도 (내용은 [기본 정보]에서 수정)', menu:'Location',
      fields:[F.menu('Location'), F.text('title','제목',{def:'Location'})],
      render:(R,d,S,ctx)=>`<section class="sec loc"><div class="wrap grid"><div class="rv"><h2>${R.t('title')}</h2><p class="addr">${S.t('address')}</p><p class="trf">${S.t('traffic')}</p><div class="hrs">${S.t('hours')}</div><a class="tel" href="tel:${S.v('phone')}">${S.t('phone')}</a></div><div class="rv">${mapBox(ctx.site)}</div></div></section>` }
  },
  chrome:(S,body,ctx)=>`
<header class="hd"><div class="wrap"><a href="${ctx.home}" class="logo">${S.t('nameEn')}</a>
<nav>${navHTML(ctx)}</nav><button class="nav-tg" aria-label="메뉴">☰</button></div></header>
<main id="top">${body}</main>
<footer class="ft"><div class="wrap">${S.t('name')} · ${S.t('biz')}</div></footer>
<button class="fab" data-modal="mform" type="button">상담<br>신청</button>
<div class="modal" id="mform"><div><button class="x" type="button">×</button><h3>${S.t('p_form_t')}</h3>${formHTML(ctx.site,S,{select:true})}</div></div>`
};

/* 3. D2 */
BLOCKDEFS.d2 = {
  siteFields: [F.text('d_mark','로고 문자 (예: D2)')],
  layout: ['hero','philosophy','ba','numbers','services','contact'],
  blocks: {
    hero: { label:'메인 배너 슬라이드', desc:'배경 사진이 바뀌는 첫 화면', menu:'',
      fields:[F.menu(''), F.text('d_kicker','작은 영문 문구'), F.area('d_h1','큰 제목',{rows:2}), F.area('d_sub','설명 문구',{rows:2}),
        F.list('slides','배경 사진','슬라이드',3,[F.img('img','사진',{from:i=>`img_s${i+1}`})],{max:6})],
      render:(R,d)=>`<section class="fp s1"><div class="slides" data-slides="5500">${(d.slides||[]).map((_,n)=>`<div class="slide">${R.i(`slides/${n}/img`)}</div>`).join('')}<div class="dots"></div></div>
<div class="wrap tx"><div class="k">${R.t('d_kicker')}</div><h1>${R.t('d_h1')}</h1><p>${R.t('d_sub')}</p></div></section>` },
    philosophy: { label:'진료 철학 (롤링 카드)', desc:'자동으로 넘어가는 사진 카드와 소개 글', menu:'철학',
      fields:[F.menu('철학'), F.text('lab','작은 제목',{def:'PHILOSOPHY'}), F.area('d_ph_t','제목',{rows:2}), F.area('d_ph_d','설명'),
        F.list('items','롤링 카드','카드',3,[F.img('img','사진',{from:i=>`img_r${i+1}`}),F.text('t','카드 제목',{from:i=>`r${i+1}_t`}),F.text('d','카드 설명',{from:i=>`r${i+1}_d`})])],
      render:(R,d)=>`<section class="fp s2"><div class="wrap grid"><div class="rv"><span class="lab">${R.t('lab')}</span><h2 class="h2">${R.t('d_ph_t')}</h2><p class="desc">${R.t('d_ph_d')}</p></div>
<div class="roll" data-slides="3800">${(d.items||[]).map((_,n)=>`<div class="slide">${R.i(`items/${n}/img`)}<div><b>${R.t(`items/${n}/t`)}</b><span>${R.t(`items/${n}/d`)}</span></div></div>`).join('')}<div class="dots"></div></div></div></section>` },
    ba: { label:'전후사진 비교', desc:'큰 전후 비교 슬라이더와 설명', menu:'전후사진',
      fields:[F.menu('전후사진'), F.img('b','치료 전 사진',{from:()=> 'ba1_b'}), F.img('a','치료 후 사진',{from:()=>'ba1_a'}), F.area('d_ba_t','제목',{rows:2}), F.area('d_ba_d','설명')],
      render:R=>`<section class="fp s3"><div class="wrap grid"><div class="rv">${baBlock(R,'b','a')}</div>
<div class="rv"><span class="lab">BEFORE &amp; AFTER</span><h2 class="h2">${R.t('d_ba_t')}</h2><p class="d">${R.t('d_ba_d')}</p></div></div></section>` },
    numbers: { label:'숫자로 보는 강점', desc:'대표색 배경의 숫자 4개', menu:'',
      fields:[F.menu(''), F.text('d_num_t','제목'), F.list('items','숫자','숫자',4,[F.text('n','숫자',{from:i=>`n${i+1}`}),F.text('l','설명',{from:i=>`n${i+1}_l`})],{max:4})],
      render:(R,d)=>`<section class="fp s4"><div class="wrap"><span class="lab" style="color:#fff;opacity:.8">STRENGTH IN NUMBERS</span><h2 class="h2 rv">${R.t('d_num_t')}</h2>
<div class="nums">${(d.items||[]).map((_,n)=>`<div class="rv"><b>${R.t(`items/${n}/n`)}</b><span>${R.t(`items/${n}/l`)}</span></div>`).join('')}</div></div></section>` },
    services: { label:'진료 과목', desc:'아이콘이 있는 진료 과목 카드', menu:'진료과목',
      fields:[F.menu('진료과목'), F.text('d_sv_t','제목'), F.list('items','진료 과목','과목',6,[F.icon('icon','아이콘',{dflt:i=>['tooth','implant','ortho','sparkle','shield','child'][i]||'tooth'}),F.text('t','과목명',{from:i=>`s${i+1}_t`}),F.text('d','설명',{from:i=>`s${i+1}_d`}),F.link('href')])],
      render:(R,d,S,ctx)=>`<section class="fp s5"><div class="wrap"><span class="lab">TREATMENT</span><h2 class="h2 rv">${R.t('d_sv_t')}</h2>
<div class="grid">${(d.items||[]).map((it,n)=>`<a class="it rv" href="${ctx.link(it.href)}">${ic(it.icon||'tooth')}<b>${R.t(`items/${n}/t`)}</b><span>${R.t(`items/${n}/d`)}</span></a>`).join('')}</div></div></section>` },
    contact: { label:'상담 · 오시는 길', desc:'상담 신청서와 연락처 (내용은 [기본 정보]에서 수정)', menu:'상담·오시는길',
      fields:[F.menu('상담·오시는길'), F.area('d_ct_t','제목',{rows:2})],
      render:(R,d,S,ctx)=>`<section class="fp s6"><div class="wrap grid"><div class="rv"><span class="lab" style="color:var(--pc)">CONTACT</span><h2 class="h2">${R.t('d_ct_t')}</h2>
<div class="info"><div>${ic('phone')}<a class="tel" href="tel:${S.v('phone')}">${S.t('phone')}</a></div><div>${ic('pin')}<div>${S.t('address')}<br><small>${S.t('traffic')}</small></div></div><div>${ic('clock')}<div>${S.t('hours')}</div></div></div>
<p class="ft">${S.t('biz')}</p></div><div class="rv">${formHTML(ctx.site,S,{select:true})}<div style="margin-top:18px">${mapBox(ctx.site)}</div></div></div></section>` }
  },
  chrome:(S,body,ctx)=>`
<header class="hd"><div class="wrap"><a href="${ctx.home}" class="logo"><span class="mk">${S.t('d_mark')}</span><span class="nm">${S.t('name')}</span></a>
<nav>${navHTML(ctx)}</nav><button class="nav-tg" aria-label="메뉴">☰</button></div></header>
<nav class="side">${ctx.all.map(n=>`<a href="${n.href}" aria-label="${esc(n.label)}"></a>`).join('')}</nav>
<main id="top">${body}</main>
${ctx.page && ctx.page.id!=='home' ? `<footer class="cb-foot"><div class="wrap"><b>${S.t('name')}</b><span><a href="tel:${S.v('phone')}">${S.t('phone')}</a> · ${S.t('address')}</span><small>${S.t('biz')}</small></div></footer>` : ''}`
};

/* 4. NETWORK */
BLOCKDEFS.network = {
  siteFields: [F.text('n_util','맨 위 안내 문구'), F.text('d_mark','로고 문자 (예: D2)')],
  layout: ['banner','clinics','signature','doctors','tv','quick'],
  blocks: {
    banner: { label:'메인 배너 슬라이드', desc:'화살표로 넘기는 큰 배너 (슬라이드마다 사진·문구)', menu:'',
      fields:[F.menu(''), F.list('slides','배너','배너',2,[F.img('img','배경 사진',{from:i=>`img_b${i+1}`}),F.text('k','라벨',{from:i=>`b${i+1}_k`}),F.area('t','큰 제목',{rows:2,from:i=>`b${i+1}_t`}),F.text('s','설명',{from:i=>`b${i+1}_s`})],{max:6})],
      render:(R,d)=>`<section class="vis slides" data-slides="5000">${(d.slides||[]).map((_,n)=>`<div class="slide">${R.i(`slides/${n}/img`)}<div class="cap"><div class="wrap"><span class="k">${R.t(`slides/${n}/k`)}</span>${n===0?'<h1>':'<h2>'}${R.t(`slides/${n}/t`)}${n===0?'</h1>':'</h2>'}<p>${R.t(`slides/${n}/s`)}</p></div></div></div>`).join('')}
<div class="ctl"><button class="prev" type="button" aria-label="이전">‹</button><div class="dots"></div><button class="next" type="button" aria-label="다음">›</button></div></section>` },
    clinics: { label:'집중 클리닉 바로가기', desc:'배너 아래 겹쳐 올라오는 클리닉 카드 3개', menu:'집중클리닉',
      fields:[F.menu('집중클리닉'), F.list('items','클리닉','클리닉',3,[F.img('img','사진',{from:i=>`img_c${i+1}`}),F.text('k','영문 라벨',{from:i=>`c${i+1}_k`}),F.text('t','클리닉명',{from:i=>`c${i+1}_t`}),F.text('s','설명',{from:i=>`c${i+1}_s`}),F.link('href')],{max:3})],
      render:(R,d,S,ctx)=>`<section class="clinic"><div class="wrap grid">${(d.items||[]).map((it,n)=>`<a href="${it.href?ctx.link(it.href):ctx.go('quick')}" class="rv"><div><small>${R.t(`items/${n}/k`)}</small><b>${R.t(`items/${n}/t`)}</b><span>${R.t(`items/${n}/s`)}</span></div>${R.i(`items/${n}/img`)}</a>`).join('')}</div></section>` },
    signature: { label:'시그니처 진료', desc:'사진 위에 글이 올라간 세로 카드 4개', menu:'시그니처',
      fields:[F.menu('시그니처'), F.text('n_sig_t','제목'), F.list('items','카드','카드',4,[F.img('img','사진',{from:i=>`img_g${i+1}`}),F.text('k','분류',{from:i=>`g${i+1}_k`}),F.area('t','제목',{rows:2,from:i=>`g${i+1}_t`}),F.link('href')])],
      render:(R,d,S,ctx)=>`<section class="sec sig"><div class="wrap"><div class="tit rv"><div><small>SIGNATURE</small><h2>${R.t('n_sig_t')}</h2></div></div>
<div class="grid">${(d.items||[]).map((it,n)=>`<a href="${it.href?ctx.link(it.href):ctx.go('quick')}" class="rv">${R.i(`items/${n}/img`)}<div><small>${R.t(`items/${n}/k`)}</small><b>${R.t(`items/${n}/t`)}</b><em>자세히 보기 →</em></div></a>`).join('')}</div></div></section>` },
    doctors: { label:'의료진', desc:'전문 분야와 약력이 있는 의료진 카드', menu:'의료진',
      fields:[F.menu('의료진'), F.text('n_doc_t','제목'), F.list('items','의료진','의료진',3,[F.img('img','사진',{from:i=>`img_d${i+1}`}),F.text('p','전문 분야',{from:i=>`d${i+1}_p`}),F.text('n','이름',{from:i=>`d${i+1}_n`}),F.area('c','약력',{from:i=>`d${i+1}_c`})])],
      render:(R,d)=>`<section class="sec doc"><div class="wrap"><div class="tit rv"><div><small>DOCTORS</small><h2>${R.t('n_doc_t')}</h2></div></div>
<div class="grid">${(d.items||[]).map((_,n)=>`<div class="card rv">${R.i(`items/${n}/img`)}<div><span class="sp">${R.t(`items/${n}/p`)}</span><b>${R.t(`items/${n}/n`)}</b><p>${R.t(`items/${n}/c`)}</p></div></div>`).join('')}</div></div></section>` },
    tv: { label:'유튜브 영상', desc:'유튜브 썸네일 카드 (링크는 [기본 정보]의 유튜브 채널)', menu:'디투 TV',
      fields:[F.menu('디투 TV'), F.text('n_tv_k','작은 제목'), F.text('n_tv_t','제목'), F.list('items','영상','영상',4,[F.img('img','썸네일',{from:i=>`img_v${i+1}`}),F.text('t','영상 제목',{from:i=>`v${i+1}_t`})])],
      render:(R,d,S)=>`<section class="sec tv"><div class="wrap"><div class="tit rv"><div><small>${R.t('n_tv_k')}</small><h2>${R.t('n_tv_t')}</h2></div><a href="${S.v('youtube')||'#'}" style="color:var(--pc);font-weight:700">채널 바로가기 →</a></div>
<div class="grid">${(d.items||[]).map((_,n)=>`<a href="${S.v('youtube')||'#'}" class="rv"><div class="th">${R.i(`items/${n}/img`)}${ic('play')}</div><p>${R.t(`items/${n}/t`)}</p></a>`).join('')}</div></div></section>` },
    quick: { label:'빠른 상담 · 진료시간 · 오시는 길', desc:'상담 신청서와 진료 안내 (내용은 [기본 정보]에서 수정)', menu:'상담·예약',
      fields:[F.menu('상담·예약'), F.text('n_form_t','상담 박스 제목')],
      render:(R,d,S,ctx)=>`<section class="sec qk"><div class="wrap grid"><div class="box rv"><h3>${ic('cal')}${R.t('n_form_t')}</h3>${formHTML(ctx.site,S,{select:true,msg:false})}</div>
<div class="box rv"><h3>${ic('clock')}진료시간</h3><a class="tel" href="tel:${S.v('phone')}">${S.t('phone')}</a><div class="hrs">${S.t('hours')}</div></div>
<div class="box rv"><h3>${ic('pin')}오시는 길</h3><p class="addr">${S.t('address')}</p><p class="trf">${S.t('traffic')}</p>${mapBox(ctx.site)}</div></div></section>` }
  },
  chrome:(S,body,ctx)=>`
<div class="util"><div class="wrap"><span>${S.t('n_util')}</span><div><a href="${ctx.go('quick')}">빠른예약</a><a href="${S.v('kakao')||'#'}">카톡상담</a><a href="${ctx.go('quick')}">비용상담</a><b style="margin-left:18px">${S.t('phone')}</b></div></div></div>
<header class="hd"><div class="wrap"><a href="${ctx.home}" class="logo"><i>${S.t('d_mark')}</i>${S.t('name')}</a>
<nav>${navHTML(ctx)}</nav>
<a class="call" href="tel:${S.v('phone')}">${ic('phone')}${S.t('phone')}</a><button class="nav-tg" aria-label="메뉴">☰</button></div></header>
<main id="top">${body}</main>
<footer class="ft"><div class="wrap"><b>${S.t('name')}</b>${S.t('biz')}</div></footer>
<div class="quick"><a href="${ctx.go('quick')}">${ic('cal')}빠른예약</a><a href="${S.v('kakao')||'#'}">${ic('chat')}카톡상담</a><a href="${ctx.go('quick')}">${ic('won')}비용상담</a><a href="${ctx.go('quick')}">${ic('pin')}오시는길</a><a href="#" class="totop">${ic('up')}TOP</a></div>`
};

/* 5. LOCAL */
BLOCKDEFS.local = {
  siteFields: [],
  layout: ['hero','easy','services','doctor','gallery','info'],
  blocks: {
    hero: { label:'메인 배너 슬라이드', desc:'사진과 인사말이 바뀌는 첫 화면', menu:'',
      fields:[F.menu(''), F.list('slides','슬라이드','슬라이드',3,[F.img('img','사진',{from:i=>`img_h${i+1}`}),F.area('t','큰 제목',{rows:2,from:i=>`h${i+1}_t`}),F.text('s','설명',{from:i=>`h${i+1}_s`})],{max:6})],
      render:(R,d,S)=>`<section class="vis slides" data-slides="5000">${(d.slides||[]).map((_,n)=>`<div class="slide">${R.i(`slides/${n}/img`)}<div class="cap"><div class="wrap"><div class="k">${S.t('name')}</div>${n===0?'<h1>':'<h2>'}${R.t(`slides/${n}/t`)}${n===0?'</h1>':'</h2>'}<p>${R.t(`slides/${n}/s`)}</p></div></div></div>`).join('')}<div class="dots"></div></section>` },
    easy: { label:'간편문의 띠', desc:'대표색 띠 안의 짧은 상담 신청서', menu:'',
      fields:[F.menu(''), F.text('l_easy_t','제목'), F.text('l_easy_s','설명')],
      render:(R,d,S,ctx)=>`<section class="easy"><div class="wrap"><h3>${R.t('l_easy_t')}<small>${R.t('l_easy_s')}</small></h3>${formHTML(ctx.site,S,{msg:true})}</div></section>` },
    services: { label:'진료 과목', desc:'아이콘이 있는 진료 과목 카드', menu:'진료과목',
      fields:[F.menu('진료과목'), F.text('l_sv_t','제목'), F.list('items','진료 과목','과목',6,[F.icon('icon','아이콘',{dflt:i=>['implant','ortho','sparkle','tooth','shield','child'][i]||'tooth'}),F.text('t','과목명',{from:i=>`s${i+1}_t`}),F.text('d','설명',{from:i=>`s${i+1}_d`}),F.link('href')])],
      render:(R,d,S,ctx)=>`<section class="sec svc"><div class="wrap"><div class="tit rv"><small>TREATMENT</small><h2>${R.t('l_sv_t')}</h2></div>
<div class="grid">${(d.items||[]).map((it,n)=>`<a class="it rv" href="${ctx.link(it.href)}">${ic(it.icon||'tooth')}<div><b>${R.t(`items/${n}/t`)}</b><span>${R.t(`items/${n}/d`)}</span></div></a>`).join('')}</div></div></section>` },
    doctor: { label:'대표원장 인사말', desc:'원장 사진, 인사말, 약력', menu:'의료진',
      fields:[F.menu('의료진'), F.img('img_doc','원장 사진'), F.text('l_doc_k','작은 제목'), F.text('l_doc_n','이름'), F.area('l_doc_msg','인사말',{rows:3}), F.area('l_doc_cr','약력',{rows:5})],
      render:R=>`<section class="sec doc"><div class="wrap grid"><div class="rv">${R.i('img_doc')}</div><div class="rv"><span class="k">${R.t('l_doc_k')}</span><h3>${R.t('l_doc_n')}</h3><p class="msg">${R.t('l_doc_msg')}</p><p class="cr">${R.t('l_doc_cr')}</p></div></div></section>` },
    gallery: { label:'병원 둘러보기', desc:'정사각형 사진 갤러리', menu:'둘러보기',
      fields:[F.menu('둘러보기'), F.text('l_gal_t','제목'), F.list('items','사진','사진',4,[F.img('img','사진',{from:i=>`img_t${i+1}`})],{max:12})],
      render:(R,d)=>`<section class="sec gal"><div class="wrap"><div class="tit rv"><small>CLINIC TOUR</small><h2>${R.t('l_gal_t')}</h2></div>
<div class="grid">${(d.items||[]).map((_,n)=>`<div class="rv">${R.i(`items/${n}/img`)}</div>`).join('')}</div></div></section>` },
    info: { label:'진료시간 · 오시는 길', desc:'진료시간과 지도 (내용은 [기본 정보]에서 수정)', menu:'진료시간·오시는길',
      fields:[F.menu('진료시간·오시는길')],
      render:(R,d,S,ctx)=>`<section class="sec info"><div class="wrap grid"><div class="box rv"><h3>${ic('clock')}진료시간 안내</h3><div class="hrs">${S.t('hours')}</div><a class="tel" href="tel:${S.v('phone')}">${S.t('phone')}</a></div>
<div class="box rv"><h3>${ic('pin')}찾아오시는 길</h3><p class="addr">${S.t('address')}</p><p class="trf">${S.t('traffic')}</p>${mapBox(ctx.site)}</div></div></section>` }
  },
  chrome:(S,body,ctx)=>`
<header class="hd"><div class="wrap"><a href="${ctx.home}" class="logo">${ic('tooth')}${S.t('name')}</a>
<nav>${navHTML(ctx)}</nav>
<a class="tel" href="tel:${S.v('phone')}">${ic('phone')}<span>${S.t('phone')}</span></a><button class="nav-tg" aria-label="메뉴">☰</button></div></header>
<main id="top">${body}</main>
<footer class="ft"><div class="wrap"><b>${S.t('name')}</b>${S.t('biz')}</div></footer>`
};

/* 모든 디자인에 공통 블록 추가 */
Object.values(BLOCKDEFS).forEach(T => { Object.assign(T.blocks, COMMON_BLOCKS); });

/* ---------- 블록 정의 → 기본값 / 예전 내용 변환 ---------- */
const SITE_KEYS = ['name','nameEn','color','color2','phone','address','traffic','hours','email','kakao','youtube','metaTitle','metaDesc','biz','form_btn'];
function blockFromFlat(theme, type, flat){
  const def = BLOCKDEFS[theme].blocks[type];
  if (def.defaults) return def.defaults();
  const data = {};
  def.fields.forEach(f => {
    if (f.key === 'menu'){ data.menu = def.menu || ''; return; }
    if (f.type === 'list'){
      data[f.key] = Array.from({length: f.count}, (_, i) => {
        const it = {};
        f.item.forEach(x => { const fk = x.from ? x.from(i) : null; it[x.key] = (fk && flat[fk] != null) ? flat[fk] : (x.dflt ? x.dflt(i) : (x.def ?? '')); });
        return it;
      });
      return;
    }
    const fk = f.from ? f.from() : f.key;
    data[f.key] = flat[fk] != null ? flat[fk] : (f.def ?? '');
  });
  return data;
}
function migrateContent(theme, flat){
  if (flat && flat.v === 2) return ensureNav(flat, theme);
  const base = DEFAULTS[theme]();                // 예전 샘플(기본값)
  const src = { ...base, ...(flat || {}) };      // 예전에 수정한 내용 우선
  const site = {};
  SITE_KEYS.forEach(k => site[k] = src[k] ?? '');
  (BLOCKDEFS[theme].siteFields || []).forEach(f => site[f.key] = src[f.key] ?? '');
  if (theme === 'network') site.d_mark = src.d_mark || 'D2';
  if (theme === 'grand') site.g_cta = src.g_cta || '상담 예약';
  if (theme === 'premium') site.p_form_t = src.p_form_t || '1:1 상담 신청';
  if (theme === 'd2') site.d_mark = src.d_mark || 'D2';
  const blocks = BLOCKDEFS[theme].layout.map(type => ({ id: bid(), type, hidden: false, data: blockFromFlat(theme, type, src) }));
  return ensureNav({ v: 2, site, blocks }, theme, true);
}
function defaultContent(theme){ return migrateContent(theme, {}); }
function newBlockData(theme, type){
  const def = BLOCKDEFS[theme].blocks[type];
  if (def.defaults) return def.defaults();
  const cur = defaultContent(theme).blocks.find(b => b.type === type);
  return cur ? cur.data : blockFromFlat(theme, type, DEFAULTS[theme]());
}
function firstImage(content){
  let found = '';
  const walk = o => { if (found || o == null) return; if (typeof o === 'string'){ if (/^(asset:|https?:|data:image)/.test(o)) found = o; return; } if (typeof o === 'object') Object.values(o).forEach(walk); };
  (content.blocks || []).filter(b => !b.hidden).forEach(b => walk(b.data));
  return found;
}

/* ---------- 상단 메뉴 (메인 메뉴 + 소메뉴) ----------
   site.nav = [{ label, href, children:[{label, href}] }]
   href: '#b-<블록ID>' (페이지 안 블록) · '#top' · 'https://...' 외부 링크 · 'tel:...' */
const SUBMENU_SAMPLES = { d2:'services', local:'services', premium:'services', network:'clinics' };
function ensureNav(content, theme, isNew){
  if (Array.isArray(content.site.nav)) return content;
  const vis = content.blocks.filter(b => !b.hidden && (b.data.menu || '').trim());
  content.site.nav = vis.map(b => {
    const item = { label: b.data.menu.trim(), href: '#b-' + b.id, children: [] };
    // 진료과목 메뉴에는 예시 소메뉴를 넣어 둡니다
    if (isNew && SUBMENU_SAMPLES[theme] === b.type){
      const its = (b.data.items || []).slice(0, 4);
      item.children = its.map(it => ({ label: String(it.t || it.k || '').split('\n')[0].trim() || '세부 메뉴', href: '#b-' + b.id }));
    }
    return item;
  });
  return content;
}
function resolveNav(content, mode){
  const ok = href => {
    if (!href) return '#top';
    if (href.startsWith('#b-')){ const b = content.blocks.find(x => '#b-' + x.id === href); if (!b || (b.hidden && mode === 'export')) return null; }
    return href;
  };
  const ext = h => /^https?:/i.test(h);
  return (content.site.nav || []).map(n => {
    const kids = (n.children || []).map(c => ({ label: c.label || '', href: ok(c.href), ext: ext(c.href || '') })).filter(c => c.label && c.href);
    let href = ok(n.href);
    if (!href && kids.length) href = kids[0].href;
    return { label: n.label || '', href, ext: ext(n.href || ''), children: kids };
  }).filter(n => n.label && n.href);
}
function navHTML(ctx){
  const a = (n, cls) => `<a href="${esc(n.href)}"${cls ? ` class="${cls}"` : ''}${n.ext ? ' target="_blank" rel="noopener"' : ''}>${esc(n.label)}</a>`;
  return ctx.nav.map(n => n.children.length
    ? `<div class="mi has-sub">${a(n, 'mi-a')}<div class="sub"><div class="sub-in">${n.children.map(c => a(c)).join('')}</div></div></div>`
    : a(n)).join('');
}
const NAV_CSS = `
.hd nav .mi{position:relative;display:flex;align-items:center}
.hd nav .mi.has-sub>.mi-a:after{content:'';display:inline-block;width:6px;height:6px;border-right:1.6px solid currentColor;border-bottom:1.6px solid currentColor;transform:rotate(45deg);margin:0 0 3px 7px;opacity:.7}
.hd nav .sub{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:14px;display:none;z-index:80}
.hd nav .mi:hover .sub,.hd nav .mi:focus-within .sub{display:block}
.hd nav .sub-in{background:#fff;border-radius:10px;box-shadow:0 14px 34px rgba(0,0,0,.16);padding:8px;min-width:180px;display:grid}
.hd nav .sub a{display:block;padding:10px 14px;border-radius:6px;color:#222!important;font-size:14px;font-weight:500;letter-spacing:0;text-transform:none;white-space:nowrap;opacity:1}
.hd nav .sub a:hover{background:#f4f1ec;color:var(--pc)!important}
@media(max-width:900px){body.nav-open .hd nav .mi{display:block}body.nav-open .hd nav .sub{position:static;display:block;transform:none;padding:6px 0 0 14px}
body.nav-open .hd nav .sub-in{box-shadow:none;background:none;padding:0;min-width:0}body.nav-open .hd nav .sub a{color:inherit!important;opacity:.75;padding:6px 0}
body.nav-open .hd nav .mi.has-sub>.mi-a:after{display:none}}`;

/* 공통 블록: 진료 과목 상세 (소메뉴 연결용) */
COMMON_BLOCKS.c_treat = { label:'진료 과목 상세', desc:'사진·설명·특징 목록으로 한 가지 진료를 자세히 소개 (진료과목 소메뉴 연결용)',
  fields:[F.menu(''), F.img('img','사진'), F.text('lab','작은 제목'), F.text('t','진료 이름'), F.area('d','설명',{rows:4}), F.area('pts','특징 (한 줄에 하나씩)',{rows:4}), F.text('btn','버튼 글자'), F.text('side','사진 위치 (left / right)')],
  defaults: () => ({ menu:'', img:'asset:implant', lab:'TREATMENT', t:'임플란트', d:'정밀한 3D 진단과 네비게이션 가이드로\n안전하고 오래 쓰는 임플란트를 식립합니다.', pts:'3D CT 정밀 진단\n가이드 수술로 최소 절개\n분야별 전문의 협진\n체계적인 사후관리', btn:'상담 예약하기', side:'left' }),
  render: (R, d, S) => `<section class="cb cb-treat${d.side === 'right' ? ' rt' : ''}"><div class="wrap"><div class="ph">${R.i('img','',String(R.raw('t')||'').replace(/\s+/g,' '))}</div><div class="tx"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2><p>${R.t('d')}</p><ul>${String(d.pts || '').split('\n').filter(x => x.trim()).map(x => `<li>${esc(x)}</li>`).join('')}</ul><a href="tel:${S.v('phone')}">${R.t('btn')}</a></div></div></section>` };
const TREAT_CSS = `
.cb-treat .wrap{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}.cb-treat.rt .ph{order:2}
.cb-treat .ph img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--r)}
.cb-treat small{display:block;color:var(--pc);font-weight:800;letter-spacing:.2em;font-size:13px;margin-bottom:10px}
.cb-treat h2{font-size:clamp(28px,3vw,42px);letter-spacing:-.03em;margin-bottom:18px}.cb-treat p{line-height:1.9;opacity:.8}
.cb-treat ul{list-style:none;margin:24px 0 30px;display:grid;gap:10px}.cb-treat li{padding-left:28px;position:relative}
.cb-treat li:before{content:'✓';position:absolute;left:0;top:0;width:20px;height:20px;border-radius:50%;background:var(--pc);color:#fff;font-size:11px;display:grid;place-items:center}
.cb-treat a{display:inline-block;background:var(--pc);color:#fff;font-weight:700;padding:14px 32px;border-radius:40px}
@media(max-width:900px){.cb-treat .wrap{grid-template-columns:1fr;gap:28px}.cb-treat.rt .ph{order:0}}`;
Object.values(BLOCKDEFS).forEach(T => { T.blocks.c_treat = COMMON_BLOCKS.c_treat; });

/* ---------- 공통 스크립트 (블록을 바꿔 끼워도 다시 실행 가능) ---------- */
const COMMON_JS2 = `
(function(){var E=window.__EDIT;
function init(root){
 /* 전후사진이 원본보다 너무 크게 늘어나 깨지지 않도록: 화면 폭이 원본의 1.4배를 넘으면 카드 폭을 줄여 가운데 정렬 */
 root.querySelectorAll('.ba').forEach(function(b){var im=b.querySelector('img');if(!im||b.getAttribute('data-cap'))return;b.setAttribute('data-cap','1');
  function fit(){var nw=im.naturalWidth;if(!nw)return;var card=b.parentElement&&b.parentElement.parentElement&&b.parentElement.parentElement.classList.contains('grid')?b.parentElement:b;
   card.style.maxWidth='';var max=Math.max(320,Math.round(nw*1.4));if(b.getBoundingClientRect().width>max+2){card.style.maxWidth=max+'px';card.style.width='100%';card.style.marginLeft='auto';card.style.marginRight='auto'}}
  if(im.complete)fit();else im.addEventListener('load',fit);});

 /* 강제 줄바꿈(<br>)이 있는 제목·문단은 줄 단위로 나눠 각 줄에 줄바꿈 균형을 적용 (공개 화면만, 편집 화면은 그대로) */
 if(!E&&document.body&&document.body.classList.contains('t-luxe'))root.querySelectorAll('h1,h2,h3,h4,p,.lead').forEach(function(el){
  if(el.getAttribute('data-seg'))return;var box=el;while(![].some.call(box.childNodes,function(n){return n.nodeName==='BR'})){var ch=[].filter.call(box.childNodes,function(n){return n.nodeType===1||(n.textContent||'').trim()});if(ch.length!==1||ch[0].nodeType!==1)break;box=ch[0]}el.setAttribute('data-seg','1');el=box;var kids=[].slice.call(el.childNodes);if(!kids.some(function(n){return n.nodeName==='BR'}))return;
  el.setAttribute('data-seg','1');var segs=[[]];kids.forEach(function(n){if(n.nodeName==='BR')segs.push([]);else segs[segs.length-1].push(n)});
  while(el.firstChild)el.removeChild(el.firstChild);
  segs.forEach(function(g){var sp=document.createElement('span');sp.className='seg';if(!g.length||!g.some(function(n){return (n.textContent||'').trim()}))sp.className='seg seg-gap';g.forEach(function(n){sp.appendChild(n)});el.appendChild(sp)})});

 root.querySelectorAll('.ba:not([data-i])').forEach(function(b){b.setAttribute('data-i','1');var r=b.querySelector('input');if(E){r.style.pointerEvents='none';return}var u=0;function set(v){b.style.setProperty('--p',v+'%')}r.addEventListener('input',function(){u=1;b.classList.add('used');set(r.value)});['pointerdown','mousedown','touchstart'].forEach(function(ev){r.addEventListener(ev,function(){u=1},{passive:true})});if(window.IntersectionObserver&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();setTimeout(function(){var t0=0;function f(ts){if(u)return;if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1800),v=50+16*Math.sin(k*Math.PI*2)*(1-k*.3);if(k>=1)v=50;set(v);r.value=v;if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)},500)},{threshold:.6});io.observe(b)}});
 root.querySelectorAll('[data-slides]:not([data-i])').forEach(function(w){w.setAttribute('data-i','1');var s=w.querySelectorAll('.slide'),d=w.querySelector('.dots'),i=0,t;if(!s.length)return;
  function go(n){s[i].classList.remove('on');d&&d.children[i]&&d.children[i].classList.remove('on');i=(n+s.length)%s.length;s[i].classList.add('on');d&&d.children[i]&&d.children[i].classList.add('on')}
  if(d){d.innerHTML='';s.forEach(function(_,n){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',(n+1)+'번 슬라이드');b.onclick=function(){go(n);rs()};d.appendChild(b)});d.children[0].classList.add('on')}
  s[0].classList.add('on');var p=w.querySelector('.prev'),nx=w.querySelector('.next');p&&(p.onclick=function(){go(i-1);rs()});nx&&(nx.onclick=function(){go(i+1);rs()});
  function rs(){clearInterval(t);if(!E&&s.length>1)t=setInterval(function(){go(i+1)},+w.dataset.slides||5000)}rs()});
 root.querySelectorAll('select.dd:not([data-i])').forEach(function(s){s.setAttribute('data-i','1');var w=document.createElement('div');w.className='dd-w';s.parentNode.insertBefore(w,s);w.appendChild(s);s.classList.add('dd-n');s.tabIndex=-1;s.setAttribute('aria-hidden','true');var b=document.createElement('button');b.type='button';b.className='dd-b';b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');var u=document.createElement('ul');u.className='dd-l';u.setAttribute('role','listbox');var its=[];function sync(){b.textContent=s.options[s.selectedIndex].text;b.classList.toggle('ph',s.selectedIndex===0);its.forEach(function(li,k){li.setAttribute('aria-selected',s.selectedIndex===k+1?'true':'false')})}function close(){w.classList.remove('on');b.setAttribute('aria-expanded','false')}function open(){w.classList.add('on');b.setAttribute('aria-expanded','true');(its[s.selectedIndex-1]||its[0]).focus()}[].forEach.call(s.options,function(o,k){if(!k)return;var li=document.createElement('li');li.setAttribute('role','option');li.tabIndex=-1;li.textContent=o.text;li.onclick=function(){s.selectedIndex=k;s.dispatchEvent(new Event('change',{bubbles:true}));sync();close();b.focus()};li.onkeydown=function(e){var n=its.indexOf(li);if(e.key==='ArrowDown'){e.preventDefault();(its[n+1]||li).focus()}else if(e.key==='ArrowUp'){e.preventDefault();(its[n-1]||li).focus()}else if(e.key==='Enter'||e.key===' '){e.preventDefault();li.click()}else if(e.key==='Escape'||e.key==='Tab'){close();b.focus()}};its.push(li);u.appendChild(li)});b.onclick=function(){w.classList.contains('on')?close():open()};b.onkeydown=function(e){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open()}};document.addEventListener('click',function(e){if(!w.contains(e.target))close()});w.appendChild(b);w.appendChild(u);sync()});
 root.querySelectorAll('[data-roll]:not([data-i])').forEach(function(u){u.setAttribute('data-i','1');if(E||u.children.length<3)return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  setInterval(function(){if(document.hidden||u.matches(':hover'))return;var l=u.lastElementChild;u.querySelectorAll('li.new').forEach(function(x){x.classList.remove('new')});u.insertBefore(l,u.firstElementChild);void l.offsetWidth;l.classList.add('new')},+u.dataset.roll||3400)});
 root.querySelectorAll('.rv').forEach(function(el){io?io.observe(el):el.classList.add('in')});
 root.querySelectorAll('.pv-open').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var pv=document.querySelector('.pv');pv&&pv.classList.add('on')})});
 root.querySelectorAll('.cform').forEach(function(f){f.addEventListener('submit',function(e){if(E){e.preventDefault();return}if(!f.dataset.mail){e.preventDefault();alert('문의 수신 이메일이 아직 설정되지 않았습니다.')}})});
 root.querySelectorAll('[data-modal]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();if(E&&e.target.closest('[data-k]'))return;var m=document.getElementById(b.dataset.modal);m&&m.classList.add('on')})});
}
var io='IntersectionObserver'in window&&!E?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
window.__init=init;init(document);
var tg=document.querySelector('.nav-tg');tg&&tg.addEventListener('click',function(){document.body.classList.toggle('nav-open')});
document.querySelectorAll('.hd nav a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('nav-open')})});
var pv=document.querySelector('.pv');pv&&pv.querySelector('button').addEventListener('click',function(){pv.classList.remove('on')});
var hd=document.querySelector('.hd');if(hd){var fn=function(){hd.classList.toggle('scrolled',(window.scrollY||document.documentElement.scrollTop)>40)};addEventListener('scroll',fn,{passive:true});fn()}
document.querySelectorAll('.totop').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:'smooth'})})});
document.querySelectorAll('.modal .x').forEach(function(x){x.addEventListener('click',function(){x.closest('.modal').classList.remove('on')})});
})();`;

/* ---------- 페이지 조립 ---------- */
function renderBlockHTML(content, theme, block, mode, files){
  const T = BLOCKDEFS[theme], def = T.blocks[block.type];
  if (!def) return '';
  const S = makeR2(content.site, 's/', mode, files);
  const R = makeR2(block.data, 'b/' + block.id + '/', mode, files);
  const ctx = siteCtx(content, theme, mode);
  return `<div class="blk${block.hidden ? ' is-hidden' : ''}" data-block="${esc(block.id)}" data-type="${esc(block.type)}" id="b-${esc(block.id)}">${def.render(R, block.data, S, ctx)}</div>`;
}
function siteCtx(content, theme, mode){
  const vis = content.blocks.filter(b => !b.hidden);
  const T = BLOCKDEFS[theme];
  return {
    site: content.site,
    nav: resolveNav(content, mode),
    all: vis.map(b => ({ href: '#b-' + b.id, label: (b.data.menu || (T.blocks[b.type] || {}).label || '') })),
    go: type => { const b = vis.find(x => x.type === type); return b ? '#b-' + b.id : '#top'; }
  };
}
function renderSite(content, theme, mode, files, opt = {}){
  files = files || {};
  const T = BLOCKDEFS[theme], th = THEMES[theme];
  const site = content.site;
  const S = makeR2(site, 's/', mode, files);
  const showHidden = mode === 'edit' && opt.editUI;
  const body = content.blocks.filter(b => showHidden || !b.hidden).map(b => renderBlockHTML(content, theme, b, mode, files)).join('');
  const html = T.chrome(S, body, siteCtx(content, theme, mode));
  const og = firstImage(content);
  const ogSrc = og ? makeR2({ og }, 'og/', mode, files).src('og') : '';
  return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${opt.head || ''}
<title>${esc(site.name)} | ${esc(site.metaTitle || '')}</title>
<meta name="description" content="${esc(site.metaDesc)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(site.name)}">
<meta property="og:description" content="${esc(site.metaDesc)}">${ogSrc ? `<meta property="og:image" content="${ogSrc}">` : ''}
<meta name="theme-color" content="${esc(site.color)}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
${th.fonts || ''}
<style>:root{--pc:${esc(site.color)};--pc2:${esc(site.color2 || site.color)}}${COMMON_CSS}${th.css}${COMMON_BLOCK_CSS}${NAV_CSS}${TREAT_CSS}.blk{scroll-margin-top:72px}.t-d2 .blk{scroll-margin-top:0}.blk.is-hidden{display:none}</style>
</head><body class="t-${theme}">
${html}
${privacyHTML(site)}
<script>${COMMON_JS2}${th.js || ''}<\/script>
${opt.tail || ''}
</body></html>`;
}
