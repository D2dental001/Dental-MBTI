/* =====================================================================
   6. BALANCE — 분과협진 종합형 (참고: 판교밸런스치과병원 스타일)
   차콜 헤더 + 골드 포인트 + 딥퍼플 강조, 오른쪽 고정 퀵바, 진료 타일 그리드
===================================================================== */
const balLogo = (m) => `<svg class="bmk" viewBox="0 0 44 44" aria-hidden="true"><path d="M22 2 42 22 22 42 2 22Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M22 9 35 22 22 35 9 22Z" fill="none" stroke="currentColor" stroke-width=".8" opacity=".6"/><text x="22" y="26.5" text-anchor="middle" font-family="Arial,sans-serif" font-size="${String(m||'D2').length>2?8:11}" font-weight="700" fill="currentColor">${esc(m||'D2')}</text></svg>`;

const T_BALANCE = {
  label:'분과협진 종합형', ref:'판교밸런스치과 스타일', ogKey:'img_hero',
  css:`
:root{--ink:#222;--bg:#fff;--line:#e3e1de;--field:#fff;--r:0;--gold:#b8975a;--dk:#2a2826}
.t-balance .wrap{width:min(1240px,100% - 200px)}
@media(max-width:1300px){.t-balance .wrap{width:min(1240px,100% - 40px)}}
.hd{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(38,36,34,.95);color:#eee}
.hd .wrap{display:flex;align-items:center;justify-content:space-between;height:80px;width:min(1400px,100% - 40px)}
.logo{display:flex;align-items:center;gap:10px;color:var(--gold)}.logo .bmk{width:38px;height:38px}
.logo b{display:block;font-size:19px;font-weight:800;letter-spacing:-.02em;color:#e6cf9c}.logo small{display:block;font-size:9px;letter-spacing:.28em;color:#a99a80;margin-top:2px}
.hd nav{display:flex;height:80px;align-items:stretch}
.hd nav>a,.hd nav .mi-a{display:flex;align-items:center;height:80px;padding:0 24px;font-size:15px;font-weight:600;color:#eee;transition:.2s}
.hd nav>a:hover,.hd nav .mi:hover>.mi-a,.hd nav>a.on,.hd nav .mi.on>.mi-a{background:#fff;color:#222!important}
.hd nav .mi.has-sub>.mi-a:after{display:none}.hd nav .sub{padding-top:0}.hd nav .sub-in{border-radius:0;border-top:3px solid var(--pc)}
.hd .rb{display:flex;gap:6px}.hd .rb a{background:var(--gold);color:#fff;font-size:12px;font-weight:700;padding:7px 12px;border-radius:2px}
.qbar{position:fixed;right:0;top:80px;width:80px;z-index:45;background:#fff;box-shadow:-2px 0 14px rgba(0,0,0,.12);text-align:center}
.qbar .home{display:block;background:var(--gold);color:#fff;font-weight:800;font-size:13px;padding:8px 0;letter-spacing:.05em}
.qbar a.q{display:grid;justify-items:center;gap:4px;padding:11px 4px;font-size:11px;color:#555;border-bottom:1px solid #eee;line-height:1.3}.qbar a.q .ic{width:24px;height:24px;color:#444}
.qbar .blog{font:800 11px/24px Arial;width:30px;height:24px;border-radius:5px;background:#444;color:#fff}
.qbar .tel{display:block;background:#1d1c1b;color:#fff;padding:12px 4px;border-top:1px solid #333}.qbar .tel small{display:block;font-size:11px;color:#aaa;margin-bottom:4px}.qbar .tel{padding-left:2px;padding-right:2px}.qbar .tel b{display:block;font-size:11px;line-height:1.2;letter-spacing:-.02em;white-space:nowrap}
.bh{position:relative;height:100vh;min-height:640px;background:#f3f1ee;overflow:hidden}.bh .slide img{width:100%;height:100%;object-fit:cover}
.bh .slide:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.72) 0%,rgba(255,255,255,.45) 34%,rgba(255,255,255,0) 58%)}.bh .l1,.bh .l2,.bh .s{text-shadow:0 0 18px rgba(255,255,255,.75)}.bh .cap .wrap>*{max-width:570px}
.bh .cap{position:absolute;inset:0;z-index:2;display:flex;align-items:center}
.bh .tag{display:inline-block;background:var(--pc);color:#fff;font-size:clamp(17px,1.7vw,24px);padding:6px 22px;margin-bottom:26px;font-weight:500}
.bh .l1{font-size:clamp(28px,3.3vw,46px);font-weight:300;letter-spacing:-.03em;color:#333;line-height:1.3}
.bh .l2{font-size:clamp(30px,3.6vw,52px);font-weight:800;letter-spacing:-.04em;color:#1b1b1b;line-height:1.3;margin-top:6px}
.bh .s{margin-top:28px;color:#666;font-size:16px}
.bh .ctl{position:absolute;z-index:3;bottom:46px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:14px;color:var(--pc)}
.bh .prev,.bh .next{width:42px;height:42px;border-radius:50%;border:1px solid rgba(0,0,0,.2);background:rgba(255,255,255,.7);font-size:20px;color:#333}
.bi{padding:110px 0 0;text-align:center}.bi h2{font-size:clamp(26px,2.6vw,34px);font-weight:700;letter-spacing:-.02em}
.bi .en{display:block;letter-spacing:.5em;font-size:13px;color:#555;margin:10px 0 24px}.bi p{color:var(--gold);font-size:15px}.bi .ln{display:block;width:1px;height:110px;background:#bbb;margin:46px auto 0}
.br{position:relative;min-height:540px;display:grid;place-items:center;text-align:center;overflow:hidden}
.br>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.br:before{content:'';position:absolute;inset:0;background:rgba(255,255,255,.66);z-index:1}
.br .in{position:relative;z-index:2;padding:80px 20px}.br .sm{font-size:clamp(17px,1.6vw,22px);font-weight:300;line-height:1.7;color:#333}
.br .lb{display:inline-block;background:var(--pc);color:#fff;font-size:clamp(22px,2.3vw,32px);font-weight:800;padding:4px 26px;margin:22px 0 18px}
.br .big{font-size:clamp(24px,2.6vw,38px);line-height:1.5;letter-spacing:-.03em;color:#2b2b2b}.br .big x-t+br+x-t,.br .big b{font-weight:800;color:#2a1f3d}
.br .btn{display:inline-block;margin-top:28px;border:1px solid #333;border-radius:30px;padding:9px 28px;font-size:14px;font-weight:600;background:rgba(255,255,255,.6)}
.bt .grid{display:grid;grid-template-columns:repeat(3,1fr)}
.bt .tile{position:relative;height:330px;overflow:hidden;display:flex;align-items:center;color:#fff}
.bt .tile>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s}.bt .tile:hover>img{transform:scale(1.05)}
.bt .tile:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(15,18,40,.85),rgba(15,18,40,.35) 70%,rgba(15,18,40,.1))}
.bt .tile.light{color:#222}.bt .tile.light:after{background:linear-gradient(90deg,rgba(255,255,255,.95),rgba(255,255,255,.7) 60%,rgba(255,255,255,.05))}
.bt .tile.box:after{background:rgba(0,0,0,.25)}.bt .tile.box .tx{background:rgba(30,26,40,.78);padding:28px 30px;margin:0 30px}
.bt .tx{position:relative;z-index:2;padding:0 40px;max-width:420px}.bt .tx small{display:block;font-size:13px;opacity:.85;margin-bottom:8px}
.bt .tx h3{font-size:clamp(22px,2vw,30px);font-weight:800;letter-spacing:-.03em;line-height:1.25}.bt .tile:not(.light) .tx h3 .hl{color:#ecd08f}.bt .tile.light .tx h3 .hl{color:var(--pc)}
.bt .tx p{font-size:13px;opacity:.85;margin-top:12px;line-height:1.7}.bt .tx em{display:inline-block;margin-top:18px;font-style:normal;font-size:12px;border:1px solid currentColor;border-radius:20px;padding:6px 18px}
.bv .grid{display:grid;grid-template-columns:repeat(3,1fr)}.bv a{position:relative;display:block;aspect-ratio:16/9;overflow:hidden;background:#000}
.bv img{width:100%;height:100%;object-fit:cover;opacity:.75;transition:.4s}.bv a:hover img{opacity:.95}
.bv .ic{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:62px;height:62px;padding:16px;border-radius:14px;background:#e02020;color:#fff;fill:#fff}
.bv span{position:absolute;left:18px;right:18px;top:14px;color:#fff;font-weight:700;font-size:15px;text-shadow:0 1px 6px rgba(0,0,0,.6)}
.sec{padding:110px 0}.btit{text-align:center;margin-bottom:56px}.btit small{display:block;letter-spacing:.32em;font-size:13px;color:#666;margin-bottom:10px}.btit h2{font-size:clamp(28px,2.8vw,38px);font-weight:800;letter-spacing:-.03em}
.bb .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.bb .it{text-align:center}
.bb h3{color:var(--pc);font-size:20px;font-weight:800}.bb .sub2{color:#888;font-size:13px;margin:4px 0 14px;display:block}.bb .ba{aspect-ratio:4/3}
.bd{background:linear-gradient(160deg,#f6f6f6,#e9e9e9);text-align:center}.bd .emb{color:var(--gold);margin:0 auto 14px;display:block}.bd .emb .bmk,.bd svg.emb{width:64px;height:64px;display:block;margin:0 auto}.bd img.bmk-img{height:56px;width:auto;max-width:280px;object-fit:contain}.ft .fl img.bmk-img{height:40px;width:auto;max-width:160px;object-fit:contain;display:block;margin:0 auto 6px}.bmk-wrap{display:inline-block}
.bd .en{display:block;letter-spacing:.42em;font-size:13px;color:var(--gold);margin-bottom:12px}.bd h2{font-size:clamp(24px,2.4vw,32px);font-weight:700;margin-bottom:54px}
.bd .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,230px));gap:16px;justify-content:center}
.bd .card img{width:100%;aspect-ratio:3/4;object-fit:cover;background:#fff}.bd .sp{display:block;font-size:12px;color:#888;margin-top:16px}
.bd .nm{font-size:24px;font-weight:800;margin-top:2px}.bd .nm small{font-size:13px;font-weight:500;color:#666;margin-left:4px}
.ba2 .box{position:relative;overflow:hidden;min-height:460px;display:flex;align-items:center}.ba2 .box>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ba2 .in{position:relative;z-index:2;background:rgba(255,255,255,.94);padding:46px 44px;margin-left:44px;max-width:430px}
.ba2 .in small{color:var(--gold);letter-spacing:.2em;font-size:12px;font-weight:700}.ba2 h3{font-size:28px;font-weight:300;line-height:1.4;margin:12px 0 16px}.ba2 h3 b,.ba2 h3 x-t+br+x-t{font-weight:800}
.ba2 p{color:#666;font-size:14px;line-height:1.85}.ba2 .btn{display:inline-block;margin-top:22px;background:var(--pc);color:#fff;padding:11px 26px;font-size:13px;font-weight:700}
.bf .grid{display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid var(--line)}.bf .col{padding:34px 30px}.bf .col+.col{border-left:1px solid var(--line)}
.bf h3{font-size:22px;font-weight:800;margin-bottom:20px}.bf ul{list-style:none;display:grid;gap:12px;font-size:14px;margin-bottom:24px}
.bf li{display:flex;gap:10px;align-items:center}.bf li .st{background:var(--pc);color:#fff;font-size:11px;padding:2px 7px;flex:none}.bf li .q{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.bf li .dt{color:#999;font-size:12px}
.bf .nv,.bf .kk{display:flex;justify-content:center;align-items:center;gap:8px;font-weight:700;padding:15px;font-size:15px}.bf .nv{background:#03c75a;color:#fff}.bf .kk{background:#fee500;color:#3a1d1d;margin-top:8px}
.bf .mapbox{aspect-ratio:4/3}.bf .addr{font-size:13px;color:#555;margin-top:12px;line-height:1.7}
.bf .hrs{font-size:15px;line-height:2.1;color:#333}.bf .tel{display:block;font-size:26px;font-weight:800;color:var(--pc);margin-top:6px}.bf h4{font-size:18px;margin-top:24px}
.bs{position:relative;background:linear-gradient(100deg,#ececec,#f7f7f7 50%,#e7e7e7);overflow:hidden;--field:#fff;--line:#d9d6d2}
.bs .wrap{display:grid;grid-template-columns:200px 1fr;gap:30px;align-items:center;padding:56px 0}
.bs h3{font-size:30px;font-weight:300}.bs h3 b{font-weight:800}.bs .ic{position:absolute;right:-30px;bottom:-40px;width:260px;height:260px;color:rgba(0,0,0,.05)}
.bs .cform{grid-template-columns:1fr 1fr 2fr 170px;align-items:stretch;position:relative;z-index:2}
.bs .cform textarea{grid-row:span 1}.bs .cform .agree{grid-column:1/4}.bs .cform button{grid-column:4;grid-row:1/span 2;background:var(--pc);font-size:16px}
.ft{background:#fff;border-top:1px solid var(--line);padding:46px 0 56px;color:#888;font-size:13px}.ft .wrap{display:grid;grid-template-columns:120px 1fr;gap:30px;align-items:start}
.ft .fl{color:#bbb;text-align:center}.ft .fl .bmk{width:54px;height:54px;color:#c9c9c9}.ft .lk{margin-bottom:12px;color:#555;font-weight:600}.ft b{color:#444}
.mbar2{display:none}
.t-balance .cb-sub{background:#0c0c0c;min-height:480px}.t-balance .cb-sub>img{left:42%;width:58%;-webkit-mask-image:linear-gradient(90deg,transparent,#000 35%);mask-image:linear-gradient(90deg,transparent,#000 35%)}
.t-balance .cb-sub:after{background:linear-gradient(90deg,#0c0c0c 38%,rgba(12,12,12,.2))}.t-balance .cb-sub h1{font-weight:400;margin-top:12px}.t-balance .cb-sub h1:before{content:'／';display:block;font-size:24px;color:var(--gold);margin-bottom:8px}
.t-balance .cb-sub small{color:var(--gold)}.t-balance .cb-sub .wrap{padding-top:160px}
.t-balance .cb-pts{background:var(--pc);color:#fff}.t-balance .cb-pts .it{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.06)}.t-balance .cb-pts .ic{background:var(--gold)}.t-balance .cb-pts .cb-tit small{color:#e6cf9c}
.t-balance .cb-steps{background:#f3f2f0}.t-balance .cb-cta{background:var(--dk)}.t-balance .cb-cta a{background:var(--gold);color:#fff}
@media(max-width:1100px){.hd nav>a,.hd nav .mi-a{padding:0 14px;font-size:14px}.hd .rb{display:none}}
@media(max-width:900px){.qbar{display:none}.hd .wrap{height:64px}.bt .grid,.bv .grid,.bf .grid{grid-template-columns:1fr}.bb .grid{grid-template-columns:1fr 1fr}.bf .col+.col{border-left:0;border-top:1px solid var(--line)}
.bs .wrap{grid-template-columns:1fr}.bs .cform{grid-template-columns:1fr}.bs .cform .agree,.bs .cform button{grid-column:auto;grid-row:auto}.ft .wrap{grid-template-columns:1fr}.ba2 .in{margin:20px}.sec{padding:70px 0}
.bi .en{letter-spacing:.2em}.bh .slide img{object-position:80% center}.bh{height:76vh;min-height:520px}.bh .slide:after{background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,.35))}.bt .tile{height:260px}
.mbar2{display:grid;grid-template-columns:repeat(3,1fr);position:fixed;left:0;right:0;bottom:0;z-index:60;background:#1d1c1b;color:#fff;font-size:13px;text-align:center}.mbar2 a{padding:13px 0}.mbar2 a:first-child{background:var(--pc)}.ft{padding-bottom:90px}}
`
};
T_BALANCE.css += `
.bf ul.roll{position:relative;height:calc(4 * 2.55em);overflow:hidden;gap:0;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent);mask-image:linear-gradient(180deg,#000 80%,transparent)}
.bf ul.roll li{height:2.55em;padding:0 8px;margin:0 -8px;border-radius:8px;transition:background 1.2s}
.bf ul.roll li.new{animation:rollin .7s cubic-bezier(.2,.7,.2,1);background:rgba(201,168,118,.18)}
.bf ul.roll li.new .q{font-weight:700}
.bf ul.roll .dt{display:none}
@keyframes rollin{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.bf ul.roll li.new{animation:none}}`;
THEMES.balance = T_BALANCE;
/* 밝은 배경용 로고: [기본 정보]의 '밝은 배경용 로고' → 없으면 헤더 로고(흰색 보정 아닌 경우) → 없으면 마크 */
function balMark(S, cls){
  if (S.v('logoLight')) return S.i('logoLight', 'bmk-img ' + (cls||''), S.v('name') || 'logo').replace(' loading="lazy"', '');
  if (S.v('logo') && S.v('logoTone') !== 'white') return S.i('logo', 'bmk-img ' + (cls||''), S.v('name') || 'logo').replace(' loading="lazy"', '');
  return `<span class="bmk-wrap ${cls||''}" data-img="s/logoLight" title="클릭해서 로고 이미지 넣기">${balLogo(S.v('bal_mark'))}</span>`;
}
DEFAULTS.balance = () => ({ ...baseContent(), color:'#4a3460', color2:'#b8975a', phone:'00-0000-0000', bal_phone2:'00-000-0000',
  hours:'월 / 화 / 목   AM 10:00 - PM 08:00\n수 / 금   AM 10:00 - PM 07:00\n토 · 일요일   AM 10:00 - PM 02:00\n점심시간(토/일 없음)   PM 01:30 - PM 02:30',
  metaTitle:'임플란트 · 턱관절 · 치아교정 · 충치치료', biz:'사업자등록번호 000-00-00000 · 대표자 000 · 디투치과병원 서울시 00구 0000로 0000 · TEL 00-0000-0000 · FAX 00-0000-0000',
  bal_blog:'', bal_book:'', bal_mark:'D2', bal_cta:'온라인예약', bal_cta2:'상담신청' });

const BAL_SLIDES = [
  ['floor','구강악안면외과 + 보철과','어려운 케이스도 One-Stop 진료','분야별 전문의의 협진 진료','대학병원급 협진시스템으로 최상의 의료서비스를 제공합니다'],
  ['prosth','디투 1DAY 치료','원내 기공 시스템으로 하루 만에','빠르다, 정확하다, 안전하다','본뜨기부터 완성까지 한 번의 내원으로 끝냅니다'],
  ['treat','턱관절 · 안면비대칭','수술 없이 바로잡는','치아와 턱의 밸런스','턱관절과 교합을 함께 보는 통합 진료'],
  ['xray','네비게이션 임플란트','컴퓨터 시뮬레이션으로 설계하는','오차 없는 임플란트','모의 수술로 정확한 위치에 안전하게 식립합니다'],
  ['lobby','비발치 · 비수술 중심','뽑지 않고, 수술하지 않고','건강한 아름다움','자연치아를 지키는 것을 첫 번째 원칙으로 합니다']
];
const BAL_TILES = [
  ['implant','','임플란트 식립에서 임시치아까지 바로 완성되는','바로 씹는 ','임플란트','정확한 진단과 분석을 기본으로 한 편안한 임플란트','implant'],
  ['floorDoc','box','아름다운 밸런스를 위한','턱관절 ','치료','10명 중 7명은 잠재적 턱관절 질환,\n더 이상 우리와 먼 얘기가 아닙니다.','tmj'],
  ['treat','light','대칭, 비용, 밸런스를 맞춰 얼굴을 예쁘게','자연미인 ','치아교정','','braces'],
  ['prosth','','원내 장비로 하루 만에 끝내는','원데이 ','충치치료','본뜨기 없이 내원 당일 치료가 가능합니다.','oneday-cavity'],
  ['xray','box','자연치아와 유사한 색상과 특성을 가진 지르코니아','','심미보철','내 치아처럼 안전하고 튼튼하게','prosthesis'],
  ['treatDoc','light','디투치과의 자연치아를 살리기 위한 노력','','신경치료','','root-canal'],
  ['lounge','light','턱교정과 치아교정을 한 번에!','자연미인 ','프로젝트','턱교정과 치아교정을 통해 얼굴의 밸런스를 찾는 치료','asymmetry'],
  ['desk','light','얼굴이 먼저 예뻐지는','','돌출입 교정','6개월 안에 얼굴 변화를 먼저 확인하는 교정','protrusion'],
  ['team','','디투치과의 성장기 아동 치아교정','바른성장 ','바른교정','','kids-ortho']
];
BLOCKDEFS.balance = {
  siteFields: [F.text('bal_mark','로고 마크 글자 (2~3자)'), F.text('bal_phone2','두 번째 문의전화 (오른쪽 퀵바)'), F.text('bal_cta','상단 버튼 1'), F.text('bal_cta2','상단 버튼 2'), F.text('bal_blog','블로그 링크'), F.text('bal_book','네이버 예약 링크')],
  layout: ['hero','intro','reason','tiles','video','ba','doctors','about','info','sms'],
  blocks: {
    hero: { label:'메인 배너 슬라이드', desc:'라벨 박스 + 얇은 글씨/굵은 글씨의 풀스크린 슬라이드',
      fields:[F.list('slides','슬라이드','슬라이드',5,[F.img('img','배경 사진'),F.text('tag','라벨 박스'),F.text('l1','얇은 글씨'),F.text('l2','굵은 글씨'),F.text('s','작은 설명')],{max:8})],
      defaults: () => ({ slides: BAL_SLIDES.map(([a,tag,l1,l2,s])=>({img:'asset:'+a,tag,l1,l2,s})) }),
      render:(R,d)=>`<section class="bh slides" data-slides="5500">${(d.slides||[]).map((_,n)=>`<div class="slide">${R.i(`slides/${n}/img`)}<div class="cap"><div class="wrap"><span class="tag">${R.t(`slides/${n}/tag`)}</span><div class="l1">${R.t(`slides/${n}/l1`)}</div>${n===0?'<h1 class="l2">':'<div class="l2">'}${R.t(`slides/${n}/l2`)}${n===0?'</h1>':'</div>'}<p class="s">${R.t(`slides/${n}/s`)}</p></div></div></div>`).join('')}
<div class="ctl"><button class="prev" type="button" aria-label="이전">‹</button><div class="dots"></div><button class="next" type="button" aria-label="다음">›</button></div></section>` },
    intro: { label:'병원명 인트로', desc:'가운데 병원명·영문명·한 줄 소개와 세로선',
      fields:[F.text('t','병원명'), F.text('en','영문명'), F.text('s','한 줄 소개')],
      defaults: () => ({ t:'디투치과병원', en:'D2 DENTAL HOSPITAL', s:'치아와 턱관절의 밸런스를 맞춰 건강을 찾는 곳, 바로 디투치과병원입니다.' }),
      render:R=>`<section class="bi"><div class="wrap rv"><h2>${R.t('t')}</h2><span class="en">${R.t('en')}</span><p>${R.t('s')}</p><span class="ln"></span></div></section>` },
    reason: { label:'"이유 있는 선택" 배너', desc:'배경 사진 위 강조 라벨과 큰 문구',
      fields:[F.img('img','배경 사진'), F.area('sm','작은 문구',{rows:2}), F.text('lb','강조 라벨'), F.text('b1','큰 문구 1줄'), F.text('b2','큰 문구 2줄 (굵게)'), F.text('btn','버튼 글자'), F.link('href')],
      defaults: () => ({ img:'asset:doc2', sm:'비발치, 비수술이 중심이 되는 치료\n정직하고 수준 높은 전문 의료진', lb:'이유 있는 선택!', b1:'축적된 노하우로 중무장된 전문 의료진의', b2:'대학병원급 맞춤 진료 협진시스템', btn:'더 알아보기', href:'p:pg-special' }),
      render:(R,d,S,ctx)=>`<section class="br">${R.i('img')}<div class="in rv"><p class="sm">${R.t('sm')}</p><span class="lb">${R.t('lb')}</span><p class="big">${R.t('b1')}<br><b>${R.t('b2')}</b></p><a class="btn" href="${ctx.link(d.href)}">${R.t('btn')} &gt;</a></div></section>` },
    tiles: { label:'진료 타일 그리드', desc:'사진 위 글씨가 올라간 3열 진료 바로가기 타일',
      fields:[F.list('items','진료 타일','타일',9,[F.img('img','배경 사진'),F.text('cap','작은 설명'),F.text('t1','제목 앞부분'),F.text('hl','제목 강조 부분'),F.area('d','설명',{rows:2}),{key:'tone',label:'글씨 스타일',type:'select',options:[['','어두운 사진 + 흰 글씨'],['light','밝은 배경 + 검은 글씨'],['box','반투명 박스']]},F.link('href')],{max:24})],
      defaults: () => ({ items: BAL_TILES.map(([img,tone,cap,t1,hl,d,s])=>({img:'asset:'+img,tone,cap,t1,hl,d,href:'p:pg-'+s})) }),
      render:(R,d,S,ctx)=>`<section class="bt"><div class="grid">${(d.items||[]).map((it,n)=>`<a class="tile ${esc(it.tone||'')}" href="${ctx.link(it.href)}">${R.i(`items/${n}/img`)}<div class="tx"><small>${R.t(`items/${n}/cap`)}</small><h3>${R.t(`items/${n}/t1`)}<span class="hl">${R.t(`items/${n}/hl`)}</span></h3>${it.d?`<p>${R.t(`items/${n}/d`)}</p>`:''}<em>더 알아보기 &gt;</em></div></a>`).join('')}</div></section>` },
    video: { label:'유튜브 영상', desc:'유튜브 썸네일 3개 (링크는 [기본 정보]의 유튜브 채널)',
      fields:[F.list('items','영상','영상',3,[F.img('img','썸네일'),F.text('t','영상 제목')],{max:6})],
      defaults: () => ({ items:[['treatDoc','어린이 치아교정, 이때 하는 것이 가장 중요합니다'],['xray','안면비대칭 교정 치료 과정 설명'],['lounge','디투 자연미인 프로젝트 #3']].map(([a,t])=>({img:'asset:'+a,t})) }),
      render:(R,d,S)=>`<section class="bv"><div class="grid">${(d.items||[]).map((_,n)=>`<a href="${S.v('youtube')||'#'}" target="_blank" rel="noopener">${R.i(`items/${n}/img`)}${ic('play')}<span>${R.t(`items/${n}/t`)}</span></a>`).join('')}</div></section>` },
    ba: { label:'치료 전후 사진', desc:'분야별 4칸 전후 비교 (좌우로 밀어서 비교)',
      fields:[F.text('en','작은 영문 제목'), F.text('t','제목'), F.list('items','케이스','케이스',4,[F.text('t','치료명'),F.text('s','한 줄 설명'),F.img('b','치료 전'),F.img('a','치료 후')],{max:8})],
      defaults: () => ({ en:'BEFORE & AFTER', t:'치료 전후 사진', items:[['턱관절 질환 치료','수술 없이 치료'],['비발치 치아교정','뽑지 않고 완성'],['임플란트','적은 통증, 빠른 회복'],['심미(라미네이트) 치료','하루(1 DAY) 완성']].map(([t,s])=>({t,s,b:'asset:baBefore',a:'asset:baAfter'})) }),
      render:(R,d)=>`<section class="sec bb"><div class="wrap"><div class="btit rv"><small>${R.t('en')}</small><h2>${R.t('t')}</h2></div><div class="grid">${(d.items||[]).map((_,n)=>`<div class="it rv"><h3>${R.t(`items/${n}/t`)}</h3><span class="sub2">${R.t(`items/${n}/s`)}</span>${baBlock(R,`items/${n}/b`,`items/${n}/a`)}</div>`).join('')}</div></div></section>` },
    doctors: { label:'의료진', desc:'회색 배경 엠블럼 + 의료진 사진 카드',
      fields:[F.text('en','영문 제목'), F.text('t','제목'), F.list('items','의료진','의료진',3,[F.img('img','사진'),F.text('sp','전문 분야'),F.text('n','이름'),F.text('pos','직함')],{max:12})],
      defaults: () => ({ en:'D2 DENTAL HOSPITAL', t:'분야별 전문의 협진 시스템', items:[['doc2','보철과전문의','홍길동','대표원장'],['doc1','교정과전문의','김철수','원장'],['doc3','보존과전문의','이영희','원장']].map(([a,sp,n,pos])=>({img:'asset:'+a,sp,n,pos})) }),
      render:(R,d,S)=>`<section class="sec bd"><div class="wrap">${balMark(S,'emb')}<span class="en">${R.t('en')}</span><h2 class="rv">${R.t('t')}</h2><div class="grid">${(d.items||[]).map((_,n)=>`<div class="card rv">${R.i(`items/${n}/img`)}<span class="sp">${R.t(`items/${n}/sp`)}</span><div class="nm">${R.t(`items/${n}/n`)}<small>${R.t(`items/${n}/pos`)}</small></div></div>`).join('')}</div></div></section>` },
    about: { label:'ABOUT 배너', desc:'와이드 사진 위 흰 박스 소개',
      fields:[F.text('en','작은 제목'), F.text('t1','제목 1줄'), F.text('t2','제목 2줄 (굵게)'), F.area('d','설명',{rows:3}), F.text('btn','버튼 글자'), F.link('href'), F.img('img','사진')],
      defaults: () => ({ en:'ABOUT D2', t1:'가장 아름다운 미소는', t2:'건강한 밸런스에서 시작됩니다', d:'치아 하나가 아닌 턱관절과 교합, 얼굴의 균형까지 함께 봅니다.\n분야별 전문의가 한 자리에서 함께 진단하고 치료합니다.', btn:'디투치과 소개', href:'p:pg-greeting', img:'asset:lounge' }),
      render:(R,d,S,ctx)=>`<section class="sec ba2" style="padding-bottom:0"><div class="wrap"><div class="btit rv"><h2 style="font-size:24px;letter-spacing:.06em">${R.t('en')}</h2></div><div class="box">${R.i('img')}<div class="in rv"><small>D2 DENTAL</small><h3>${R.t('t1')}<br><b>${R.t('t2')}</b></h3><p>${R.t('d')}</p><a class="btn" href="${ctx.link(d.href)}">${R.t('btn')}</a></div></div></div></section>` },
    info: { label:'온라인상담 · 오시는길 · 진료시간', desc:'3단 안내 (연락처·시간·주소는 [기본 정보]에서 수정)',
      fields:[F.list('qs','온라인 상담 목록 (샘플)','글',4,[F.text('st','상태'),F.text('q','제목'),F.text('dt','날짜')],{max:6}), F.text('nv','초록 버튼 글자'), F.text('kk','노란 버튼 글자')],
      defaults: () => ({ qs:[['답변완료','사랑니 발치하고 싶어요','2026.11.09'],['답변대기','무턱 재교정 치료 문의','2026.11.07'],['답변완료','신경치료 문의 드립니다','2026.11.03'],['답변완료','임플란트 비용 상담','2026.11.01']].map(([st,q,dt])=>({st,q,dt})), nv:'네이버 진료예약 바로가기', kk:'카카오톡 채널 @디투치과' }),
      render:(R,d,S,ctx)=>`<section class="sec bf"><div class="wrap grid"><div class="col"><h3>온라인 상담</h3><ul class="roll" data-roll="3400">${(d.qs||[]).map((_,n)=>`<li><span class="st">${R.t(`qs/${n}/st`)}</span><span class="q">${R.t(`qs/${n}/q`)}</span><span class="dt">${R.t(`qs/${n}/dt`)}</span></li>`).join('')}</ul><a class="nv" href="${S.v('bal_book')||'#'}">${R.t('nv')} &gt;</a><a class="kk" href="${S.v('kakao')||'#'}">${ic('chat')}${R.t('kk')}</a></div>
<div class="col"><h3>오시는 길</h3>${mapBox(ctx.site)}<p class="addr">${S.t('address')}<br>${S.t('traffic')}</p></div>
<div class="col"><h3>진료 시간</h3><div class="hrs">${S.t('hours')}</div><h4>상담 전화</h4><a class="tel" href="tel:${S.v('phone')}">${S.t('phone')}</a></div></div></section>` },
    sms: { label:'SMS 빠른상담', desc:'회색 띠 위 한 줄 상담 신청서',
      fields:[F.text('t1','제목 앞'), F.text('t2','제목 뒤 (굵게)')],
      defaults: () => ({ t1:'SMS', t2:'빠른상담' }),
      render:(R,d,S,ctx)=>`<section class="bs">${ic('chat')}<div class="wrap"><h3>${R.t('t1')} <b>${R.t('t2')}</b></h3>${formHTML(ctx.site,S,{msg:true})}</div></section>` }
  },
  chrome:(S,body,ctx)=>`
<header class="hd"><div class="wrap"><a href="${ctx.home}" class="logo">${balLogo(S.v('bal_mark'))}<span><b>${S.t('name')}</b><small>${S.t('nameEn')}</small></span></a>
<nav>${navHTML(ctx)}</nav>
<div class="rb"><a href="${ctx.go('sms')}">${S.t('bal_cta')}</a><a href="${ctx.go('sms')}">${S.t('bal_cta2')}</a></div><button class="nav-tg" aria-label="메뉴">☰</button></div></header>
<aside class="qbar"><a class="home" href="${ctx.home}">HOME</a>
<a class="q" href="${S.v('kakao')||'#'}">${ic('chat')}톡톡<br>상담</a><a class="q" href="${ctx.go('sms')}">${ic('cal')}온라인<br>예약</a><a class="q" href="${ctx.link('p:pg-location')}">${ic('pin')}오시는길</a>
<a class="q" href="${S.v('bal_blog')||'#'}"><span class="blog">blog</span>블로그</a><a class="q" href="${S.v('youtube')||'#'}">${ic('play')}유튜브</a>
<a class="tel" href="tel:${S.v('phone')}"><small>문의전화</small><b>${S.t('phone')}</b></a><a class="tel" href="tel:${S.v('bal_phone2')}"><small>문의전화</small><b>${S.t('bal_phone2')}</b></a></aside>
<main id="top">${body}</main>
<footer class="ft"><div class="wrap"><div class="fl">${balMark(S,'')}<div>${S.t('name')}</div></div><div><p class="lk">이용약관 &nbsp;|&nbsp; <a href="#privacy" class="pv-open">개인정보처리방침</a></p><p>${S.t('biz')}</p><p style="margin-top:8px">COPYRIGHT © ${S.t('nameEn')}. ALL RIGHTS RESERVED.</p></div></div></footer>
<div class="mbar2"><a href="tel:${S.v('phone')}">전화상담</a><a href="${ctx.go('sms')}">빠른상담</a><a href="${ctx.link('p:pg-location')}">오시는길</a></div>`
};

/* ---------- 공통 블록 추가: 치료 후기 · 공지사항 ---------- */
const BAL_EXTRA_CSS = `<style>.cb-rev .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}.cb-rev .it{border:1px solid var(--line);padding:30px;border-radius:var(--r);background:rgba(127,127,127,.03)}.cb-rev .st{color:var(--pc2,var(--pc));letter-spacing:3px;margin-bottom:12px}.cb-rev b{display:block;font-size:17px;margin-bottom:8px}.cb-rev p{opacity:.75;font-size:14px;line-height:1.85}.cb-rev .nm{display:block;margin-top:16px;font-size:13px;opacity:.6}
.cb-ntc .wrap{max-width:960px}.cb-ntc ul{list-style:none;border-top:2px solid var(--ink)}.cb-ntc li{display:grid;grid-template-columns:90px 1fr 120px;gap:14px;padding:18px 10px;border-bottom:1px solid var(--line);align-items:center}.cb-ntc .tg{font-size:12px;font-weight:700;color:var(--pc);border:1px solid var(--pc);text-align:center;padding:3px 0}.cb-ntc .dt{text-align:right;opacity:.55;font-size:13px}@media(max-width:700px){.cb-ntc li{grid-template-columns:70px 1fr}.cb-ntc .dt{grid-column:2;text-align:left}}</style>`;
Object.assign(COMMON_BLOCKS, {
  c_reviews: { label:'치료 후기', desc:'별점과 함께 보여주는 후기 카드', fields:[F.text('lab','작은 제목'), F.text('t','제목'), F.list('items','후기','후기',6,[F.text('ti','후기 제목'),F.area('d','후기 내용',{rows:3}),F.text('n','작성자 · 치료')],{max:24})],
    defaults: () => ({ lab:'REVIEW', t:'환자분들이 직접 남긴 치료 후기', items:[
      ['턱 소리가 사라졌어요','몇 년 동안 입 벌릴 때마다 딱딱 소리가 났는데 스플린트 치료 후 거의 사라졌습니다.','김**님 · 턱관절 치료'],
      ['뽑지 않고 교정했어요','다른 곳에서는 발치를 권했는데 여기서는 비발치로 진행했고 결과도 만족스럽습니다.','이**님 · 비발치 교정'],
      ['하루 만에 끝나서 편했어요','충치 치료를 당일에 바로 끝내 주셔서 직장인인 저에게 정말 좋았습니다.','박**님 · 원데이 충치치료'],
      ['꼼꼼한 설명에 감동','CT 사진으로 하나하나 설명해 주셔서 믿고 맡길 수 있었습니다.','최**님 · 임플란트'],
      ['아이가 무서워하지 않아요','선생님들이 친절하셔서 아이가 치과를 즐겁게 다닙니다.','정**님 · 소아진료'],
      ['자연스러운 앞니','라미네이트가 너무 자연스러워서 아무도 시술한 줄 몰라요.','한**님 · 라미네이트']].map(([ti,d,n])=>({ti,d,n})) }),
    render: (R,d) => `${BAL_EXTRA_CSS}<section class="cb cb-rev"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div><div class="grid">${(d.items||[]).map((_,n)=>`<div class="it rv"><div class="st">★★★★★</div><b>${R.t(`items/${n}/ti`)}</b><p>${R.t(`items/${n}/d`)}</p><span class="nm">${R.t(`items/${n}/n`)}</span></div>`).join('')}</div></div></section>` },
  c_notice: { label:'공지사항 목록', desc:'분류·제목·날짜가 있는 게시판형 목록', fields:[F.text('lab','작은 제목'), F.text('t','제목'), F.list('items','공지','공지',5,[F.text('tg','분류'),F.text('ti','제목'),F.text('dt','날짜')],{max:30})],
    defaults: () => ({ lab:'NOTICE', t:'공지사항', items:[['공지','11월 진료 일정 안내','2026.11.01'],['이벤트','가을맞이 치아 건강 검진 이벤트','2026.10.20'],['공지','추석 연휴 휴진 안내','2026.09.20'],['언론','디투치과, 턱관절 치료 사례 학회 발표','2026.08.12'],['공지','토·일요일 진료 시간 변경 안내','2026.07.01']].map(([tg,ti,dt])=>({tg,ti,dt})) }),
    render: (R,d) => `${BAL_EXTRA_CSS}<section class="cb cb-ntc"><div class="wrap"><div class="cb-tit"><small>${R.t('lab')}</small><h2>${R.t('t')}</h2></div><ul>${(d.items||[]).map((_,n)=>`<li class="rv"><span class="tg">${R.t(`items/${n}/tg`)}</span><span>${R.t(`items/${n}/ti`)}</span><span class="dt">${R.t(`items/${n}/dt`)}</span></li>`).join('')}</ul></div></section>` }
});
Object.values(BLOCKDEFS).forEach(T => Object.assign(T.blocks, COMMON_BLOCKS));

/* ---------- 밸런스형 추가 진료 콘텐츠 ---------- */
const mk = (title, en, img, heroImg, icon, desc, lead, d, pts, points, steps, faq, ba) => ({ title, en, img, heroImg, icon, desc, lead, d, pts, points, steps, faq, ba });
Object.assign(TX, {
  tmj: mk('턱관절 치료','TMJ TREATMENT','treatDoc','floorDoc','shield','수술 없이, 턱과 치아의 밸런스를 되찾는 치료',
    '아픈 턱,\n수술 없이 치료합니다','입을 벌릴 때 나는 소리, 턱 통증, 두통과 어깨 결림까지. 턱관절 질환은 교합과 근육, 생활 습관이 함께 얽혀 있습니다. 정밀 검사로 원인을 찾고 스플린트·물리치료·교합 조정을 결합해 비수술로 치료합니다.',
    '턱관절 정밀 검사 · 3D CT\n비수술 스플린트 치료\n교합 조정 · 물리치료 병행\n두통·어깨 결림 동반 증상 관리',
    [['shield','비수술 치료','수술 없이 스플린트와 교합 조정으로 치료합니다.'],['tooth','원인 분석','교합·근육·습관까지 함께 살펴 재발을 줄입니다.'],['clock','통증 완화','단계별 치료로 빠르게 통증을 줄여 드립니다.']],
    [['정밀 검사','턱 움직임과 CT로 관절 상태를 확인합니다.'],['원인 진단','교합·근육·습관 중 원인을 찾습니다.'],['스플린트 치료','맞춤 장치로 턱의 위치를 안정시킵니다.'],['유지 관리','교합 조정과 정기 검진으로 관리합니다.']],
    [['턱에서 소리만 나도 치료가 필요한가요?','통증이 없더라도 소리가 계속되면 관절 원판의 위치 이상일 수 있어 검사를 권해드립니다.'],['치료 기간은 얼마나 걸리나요?','증상에 따라 3~6개월 정도이며, 대부분 1~2개월 안에 통증이 줄어듭니다.']]),
  'tmj-symptom': mk('턱관절 질환','TMJ DISORDER','xray','xray','pin','이런 증상이 있다면 턱관절을 의심해 보세요',
    '혹시 나도\n턱관절 질환일까?','턱관절 질환은 성인 10명 중 7명이 잠재적으로 가진 흔한 질환입니다. 초기에는 소리와 가벼운 불편감으로 시작하지만 방치하면 입이 잘 벌어지지 않거나 얼굴 비대칭으로 이어질 수 있습니다.',
    '입 벌릴 때 딱딱 소리\n턱·귀 주변 통증\n입이 잘 안 벌어짐\n잦은 두통 · 이갈이 · 이악물기',
    [['pin','소리','입을 벌리거나 다물 때 딱딱, 사각 소리가 납니다.'],['clock','통증','턱, 관자놀이, 귀 주변이 자주 아픕니다.'],['tooth','개구 제한','입이 세 손가락 너비만큼 벌어지지 않습니다.']],
    [['자가 체크','증상 체크리스트로 상태를 확인합니다.'],['정밀 검사','CT와 턱 움직임 분석을 합니다.'],['진단 상담','원인과 치료 방법을 자세히 설명드립니다.'],['맞춤 치료','증상에 맞는 비수술 치료를 시작합니다.']],
    [['턱관절 질환은 저절로 낫나요?','일시적으로 좋아질 수 있지만 원인이 남아 있으면 재발하기 쉬워 진단을 권해드립니다.'],['어떤 사람에게 잘 생기나요?','이갈이, 이악물기, 한쪽 씹기, 턱 괴기 습관이 있는 분들에게 흔합니다.']]),
  asymmetry: mk('안면비대칭교정','FACIAL ASYMMETRY','lounge','lounge','sparkle','턱교정과 치아교정을 한 번에, 얼굴의 밸런스를 찾습니다',
    '수술 없이 맞추는\n얼굴의 균형','틀어진 턱의 위치와 치아 교합을 함께 바로잡아 얼굴 좌우의 균형을 맞춥니다. 경미한 비대칭은 교정 장치와 턱관절 치료만으로도 수술 없이 개선할 수 있습니다.',
    '턱교정 + 치아교정 동시 진행\n3D 얼굴 분석\n경미한 비대칭은 비수술로\n교정과·턱관절 협진',
    [['sparkle','얼굴 라인 개선','턱 위치를 바로잡아 좌우 균형을 맞춥니다.'],['ortho','동시 교정','치아와 턱을 함께 교정해 기간을 줄입니다.'],['shield','비수술 우선','수술 없이 가능한 방법을 먼저 찾습니다.']],
    [['얼굴 분석','사진·CT로 비대칭 정도를 측정합니다.'],['치료 계획','턱과 치아를 함께 움직이는 계획을 세웁니다.'],['교정 진행','장치로 턱과 치아를 바로잡습니다.'],['유지 관리','바뀐 위치를 유지하도록 관리합니다.']],
    [['모든 비대칭이 비수술로 가능한가요?','골격 차이가 큰 경우 수술이 필요할 수 있어 정밀 분석 후 안내해 드립니다.'],['얼굴 변화는 언제부터 보이나요?','개인차가 있지만 보통 6개월 전후로 변화를 느끼십니다.']], true),
  splint: mk('턱관절 스플린트','TMJ SPLINT','prosth','implant','shield','맞춤 장치로 턱의 위치를 편안하게',
    '잠자는 동안\n턱을 쉬게 합니다','스플린트는 위아래 치아 사이에 끼우는 맞춤형 장치로, 턱관절과 근육의 부담을 줄이고 턱의 위치를 안정시킵니다. 이갈이·이악물기로 인한 치아 마모도 막아 줍니다.',
    '1:1 맞춤 제작\n이갈이 · 이악물기 보호\n수면 중 착용\n정기 조정으로 효과 유지',
    [['tooth','맞춤 제작','내 치아에 꼭 맞게 정밀하게 만듭니다.'],['shield','치아 보호','이갈이로 인한 마모와 파절을 막습니다.'],['cal','정기 조정','턱 위치 변화에 맞춰 주기적으로 조정합니다.']],
    [['검사','턱관절과 교합 상태를 확인합니다.'],['본뜨기','구강 스캔으로 정밀하게 본을 뜹니다.'],['장치 제작','맞춤 스플린트를 제작합니다.'],['착용 · 조정','착용감을 확인하며 조정합니다.']],
    [['하루 종일 껴야 하나요?','대부분 수면 중에만 착용하며, 증상에 따라 낮 시간 착용을 권하기도 합니다.'],['마우스피스와 다른가요?','스플린트는 교합과 턱 위치를 고려해 설계하는 치료 장치입니다.']]),
  'kids-ortho': mk('성장기 어린이 교정','KIDS ORTHODONTICS','treat','lounge','child','성장을 이용해 바르게 자라도록 돕는 교정',
    '바른 성장,\n바른 교정','성장기에는 턱뼈의 성장 방향을 이용해 교정할 수 있어, 나중에 발치나 수술이 필요한 상황을 줄일 수 있습니다. 만 6~7세 무렵 첫 교정 검진을 권해드립니다.',
    '만 6~7세 첫 교정 검진\n성장 방향 유도 장치\n주걱턱 · 무턱 조기 치료\n발치 · 수술 가능성 감소',
    [['child','성장 이용','자라는 시기를 활용해 효과적으로 교정합니다.'],['shield','조기 예방','심한 부정교합으로 커지기 전에 바로잡습니다.'],['cal','성장 관리','영구치가 날 때까지 꾸준히 관리합니다.']],
    [['교정 검진','성장 상태와 치아 배열을 확인합니다.'],['성장 분석','엑스레이로 턱뼈의 성장 방향을 봅니다.'],['1차 교정','장치로 성장 방향을 바르게 유도합니다.'],['관찰 · 2차 교정','필요 시 영구치 교정을 진행합니다.']],
    [['어릴 때 교정하면 다시 해야 하나요?','1차 교정 후 상태에 따라 2차 교정이 필요할 수 있지만 기간과 난이도가 크게 줄어듭니다.'],['첫 검진은 언제가 좋나요?','앞니 영구치가 나는 만 6~7세에 첫 검진을 권합니다.']]),
  underbite: mk('주걱턱교정','UNDERBITE','treatDoc','floor','ortho','수술 없이 개선할 수 있는 주걱턱부터',
    '나온 턱,\n교정으로 바로잡습니다','아래턱이나 아랫니가 앞으로 나온 반대교합은 발음과 씹는 기능, 얼굴 인상에 영향을 줍니다. 성장기에는 성장 조절 장치로, 성인은 정밀 진단 후 교정 또는 수술 교정을 계획합니다.',
    '반대교합 · 주걱턱 개선\n성장기 성장 조절 장치\n성인 비수술 · 수술 교정 판단\n발음 · 저작 기능 개선',
    [['ortho','기능 개선','씹는 기능과 발음을 함께 개선합니다.'],['sparkle','얼굴 인상','옆모습 라인이 자연스럽게 바뀝니다.'],['shield','정확한 판단','비수술 가능 여부를 정밀하게 진단합니다.']],
    [['정밀 진단','골격과 치아 원인을 분석합니다.'],['치료 결정','교정 · 수술 교정 여부를 정합니다.'],['교정 진행','계획에 따라 치아와 턱을 이동합니다.'],['유지 관리','유지장치로 결과를 지킵니다.']],
    [['성인도 수술 없이 가능한가요?','치아 원인의 주걱턱이라면 교정만으로 개선이 가능합니다.'],['언제 치료를 시작하나요?','성장기 아이라면 빠를수록 효과적이며, 만 7세 전후 검진을 권합니다.']], true),
  protrusion: mk('돌출입교정','PROTRUSION','desk','desk','ortho','얼굴이 먼저 예뻐지는 교정',
    '입이 들어가면\n얼굴이 달라집니다','앞니와 입술이 튀어나와 보이는 돌출입은 치아를 뒤로 이동시켜 입매와 옆모습을 개선합니다. 미니스크류를 활용해 짧은 기간 안에 얼굴 변화를 먼저 느낄 수 있도록 계획합니다.',
    '옆모습 · 입매 개선\n미니스크류로 효율적 이동\n6개월 안에 얼굴 변화 확인\n발치 · 비발치 정밀 판단',
    [['sparkle','얼굴 변화','입매와 옆모습이 먼저 달라집니다.'],['ortho','효율적 이동','미니스크류로 치아를 정확히 뒤로 옮깁니다.'],['clock','빠른 체감','교정 초기부터 변화를 확인할 수 있습니다.']],
    [['안모 분석','옆모습과 입술 위치를 분석합니다.'],['치료 계획','발치 여부와 이동량을 결정합니다.'],['교정 진행','앞니를 뒤로 이동시킵니다.'],['마무리','교합을 정리하고 유지합니다.']],
    [['돌출입은 꼭 발치해야 하나요?','돌출 정도에 따라 비발치로도 가능한 경우가 많아 정밀 진단 후 결정합니다.'],['교정 기간은요?','보통 1년 6개월~2년이며, 얼굴 변화는 6개월 전후로 느끼십니다.']], true),
  crowding: mk('덧니교정','CROWDING','treat','treat','ortho','삐뚤삐뚤한 치아를 가지런하게',
    '가지런한 치열,\n자신 있는 미소','덧니와 겹친 치아는 보기에도 신경 쓰이지만 양치가 어려워 충치와 잇몸병의 원인이 됩니다. 공간 분석을 통해 가능하면 발치 없이 치아를 가지런하게 배열합니다.',
    '덧니 · 겹친 치아 정리\n비발치 공간 확보 우선\n투명 · 세라믹 장치 선택\n양치 · 위생 관리 개선',
    [['ortho','가지런한 배열','겹친 치아를 고르게 정리합니다.'],['shield','충치 예방','양치가 쉬워져 충치와 잇몸병을 줄입니다.'],['sparkle','심미 장치','눈에 덜 띄는 장치를 선택할 수 있습니다.']],
    [['공간 분석','치아 크기와 턱의 공간을 계산합니다.'],['장치 선택','투명·세라믹 등 장치를 고릅니다.'],['교정 진행','치아를 단계적으로 배열합니다.'],['유지 관리','유지장치로 결과를 지킵니다.']],
    [['덧니가 하나만 있어도 교정하나요?','부분교정으로 짧게 해결되는 경우도 있어 상담 후 안내해 드립니다.'],['성인도 할 수 있나요?','잇몸과 뼈가 건강하다면 나이에 관계없이 가능합니다.']], true),
  'oneday-implant': mk('원데이 임플란트','ONE-DAY IMPLANT','implant','floorDoc','implant','식립에서 임시치아까지 하루에',
    '심은 날,\n바로 씹을 수 있게','뼈 상태가 좋은 경우 임플란트 식립과 동시에 임시치아를 연결해 당일부터 치아가 없는 기간 없이 생활할 수 있습니다. 바쁜 직장인과 앞니 상실 환자에게 특히 좋습니다.',
    '식립 당일 임시치아 연결\n치아 없는 기간 최소화\n원내 디지털 기공 시스템\n앞니 상실 시 심미 회복',
    [['clock','하루 완성','식립과 임시치아를 한 번에 끝냅니다.'],['sparkle','심미 유지','앞니가 빈 채로 지내지 않아도 됩니다.'],['implant','디지털 제작','원내 장비로 빠르고 정밀하게 제작합니다.']],
    [['정밀 검진','CT로 원데이 가능 여부를 확인합니다.'],['임플란트 식립','계획에 따라 정확히 식립합니다.'],['임시치아 연결','당일 임시치아를 연결합니다.'],['최종 보철','뼈와 붙은 뒤 최종 치아로 교체합니다.']],
    [['누구나 원데이가 가능한가요?','뼈의 양과 질이 충분해야 해서 검사 후 가능 여부를 안내해 드립니다.'],['임시치아로 식사해도 되나요?','부드러운 음식 위주로 드시면 되고, 단단한 음식은 최종 보철 후 권합니다.']]),
  'implant-denture': mk('임플란트 틀니','IMPLANT DENTURE','prosth','lobby','implant','흔들리지 않고 단단하게 씹는 틀니',
    '빠지지 않는 틀니로\n편안한 식사를','적은 수의 임플란트를 심어 틀니를 단단하게 고정합니다. 일반 틀니보다 잘 씹히고 덜 흔들리며, 전체 임플란트보다 비용 부담이 적습니다.',
    '임플란트 2~4개로 고정\n흔들림 · 통증 감소\n전체 임플란트 대비 비용 절감\n65세 이상 건강보험 적용 상담',
    [['implant','단단한 고정','임플란트가 틀니를 잡아 흔들리지 않습니다.'],['won','합리적 비용','적은 개수로 경제적으로 치료합니다.'],['tooth','편안한 식사','씹는 힘이 좋아져 식사가 편합니다.']],
    [['검진','잇몸뼈와 남은 치아를 확인합니다.'],['임플란트 식립','고정용 임플란트를 식립합니다.'],['틀니 제작','맞춤 틀니를 정밀하게 만듭니다.'],['연결 · 조정','틀니를 연결하고 맞춤 조정합니다.']],
    [['기존 틀니를 쓸 수 있나요?','상태가 좋다면 기존 틀니를 개조해 연결하는 방법도 있습니다.'],['관리는 어떻게 하나요?','틀니를 빼서 세척하고, 임플란트 주변은 칫솔로 깨끗이 관리하시면 됩니다.']]),
  prosthesis: mk('심미보철','ESTHETIC PROSTHESIS','prosth','prosth','sparkle','자연치아와 같은 색과 투명도의 지르코니아 보철',
    '내 치아처럼\n안전하고 튼튼하게','자연치아와 유사한 색상과 특성을 가진 지르코니아·올세라믹으로 깨지거나 변색된 치아를 아름답게 복원합니다. 원내 디지털 기공 시스템으로 정밀하게 제작합니다.',
    '지르코니아 · 올세라믹\n자연치아와 같은 색감\n금속 없는 보철로 잇몸 변색 방지\n원내 디지털 제작',
    [['sparkle','자연스러운 색','주변 치아와 어울리는 색을 맞춥니다.'],['shield','튼튼한 소재','강도 높은 지르코니아로 오래 사용합니다.'],['clock','빠른 제작','원내 장비로 제작 기간을 줄였습니다.']],
    [['상담 · 색 측정','원하는 모양과 치아 색을 확인합니다.'],['치아 준비','필요한 만큼만 다듬습니다.'],['디지털 제작','스캔 데이터로 정밀하게 제작합니다.'],['장착','교합을 맞추고 장착합니다.']],
    [['금니와 무엇이 다른가요?','치아색이라 티가 나지 않고, 금속이 없어 잇몸이 검게 변하지 않습니다.'],['얼마나 쓸 수 있나요?','관리만 잘하시면 10년 이상 사용할 수 있습니다.']], true),
  'oneday-cavity': mk('원데이 충치치료','ONE-DAY CAVITY CARE','prosth','floor','tooth','본뜨기 없이, 내원 당일 끝나는 충치치료',
    '하루 만에\n끝나는 충치치료','구강 스캐너와 원내 밀링 장비로 인레이·크라운을 그 자리에서 제작합니다. 여러 번 내원할 필요 없이 한 번의 방문으로 치료가 끝납니다.',
    '본뜨기 없는 디지털 스캔\n원내 밀링 장비 보유\n임시치아 없이 당일 완성\n바쁜 직장인 · 학생 추천',
    [['clock','1회 내원','한 번 방문으로 치료가 끝납니다.'],['tooth','정밀한 적합','디지털 스캔으로 오차를 줄였습니다.'],['sparkle','치아색 재료','티 나지 않는 세라믹으로 치료합니다.']],
    [['충치 제거','썩은 부분을 정확하게 제거합니다.'],['디지털 스캔','본뜨기 대신 스캐너로 촬영합니다.'],['원내 제작','밀링 장비로 바로 제작합니다.'],['당일 부착','완성된 보철을 바로 붙입니다.']],
    [['치료 시간은 얼마나 걸리나요?','치아 개수에 따라 다르지만 1개 기준 약 1~2시간입니다.'],['모든 충치가 원데이로 가능한가요?','신경치료가 필요한 경우 등은 여러 번 내원이 필요할 수 있습니다.']]),
  wisdom: mk('사랑니 발치','WISDOM TOOTH','xray','xray','tooth','구강외과 전문의의 안전한 사랑니 발치',
    '어려운 사랑니도\n안전하게','누워 있거나 신경과 가까운 매복 사랑니도 3D CT로 위치를 정확히 확인한 뒤 안전하게 발치합니다. 통증과 붓기를 줄이는 최소 절개 방법을 사용합니다.',
    '3D CT로 신경 위치 확인\n매복 사랑니 발치\n최소 절개 · 빠른 회복\n당일 발치 가능',
    [['shield','안전한 발치','CT로 신경을 피해 계획합니다.'],['clock','빠른 회복','최소 절개로 붓기와 통증을 줄입니다.'],['cal','당일 발치','검진 후 당일 발치가 가능합니다.']],
    [['CT 촬영','사랑니와 신경 위치를 확인합니다.'],['마취','충분히 마취해 통증을 줄입니다.'],['발치','최소 절개로 안전하게 뽑습니다.'],['소독 · 실밥','경과를 확인하고 실밥을 제거합니다.']],
    [['사랑니는 꼭 뽑아야 하나요?','바르게 나서 관리가 잘 되면 두어도 되지만, 매복되거나 염증이 반복되면 발치를 권합니다.'],['발치 후 붓기는 얼마나 가나요?','보통 2~3일 붓고 일주일 안에 가라앉습니다.']])
});

/* ---------- 밸런스형 메뉴 구성 (판교밸런스치과 메뉴 체계 기준) ---------- */
const SITEMAPS = {
  balance: [
    { label:'치과소개', children:[['greeting','대표원장 인사말'],['doctors','의료진 소개'],['special','디투만의 특별함'],['tour','치과 둘러보기'],['location','진료안내 · 오시는길']] },
    { label:'턱관절', children:[['tmj','턱관절 치료'],['tmj-symptom','턱관절 질환'],['asymmetry','안면비대칭교정'],['splint','턱관절 스플린트']] },
    { label:'치아교정', children:[['braces','치아교정 장치'],['kids-ortho','성장기 어린이 교정'],['clear-aligner','투명교정'],['underbite','주걱턱교정'],['protrusion','돌출입교정'],['crowding','덧니교정']] },
    { label:'임플란트', children:[['implant','임플란트의 특별함'],['nav-implant','네비게이션 임플란트'],['oneday-implant','원데이 임플란트'],['bone-graft','뼈이식 임플란트'],['implant-denture','임플란트 틀니']] },
    { label:'치아성형', children:[['laminate','라미네이트'],['prosthesis','심미보철'],['whitening','치아미백']] },
    { label:'일반진료', children:[['root-canal','자연치아보존 · 신경치료'],['oneday-cavity','원데이 충치치료'],['gum','잇몸치료 · 스케일링'],['wisdom','사랑니 발치'],['kids','소아진료']] },
    { label:'커뮤니티', children:[['reviews','치료후기'],['cases','치료전후 사진'],['notice','공지사항'],['faq','자주하는 질문']] }
  ]
};
const EXTRA_INFO = {
  special: (hero, title) => [hero('floor','SPECIAL','디투치과가 특별한 이유'),
    blk('c_points',{ lab:'WHY D2', t:'디투치과만의 특별함', items:[['shield','자연치아 보존 우선','꼭 필요한 수술만 시행하고, 치아를 뽑지 않는 치료를 먼저 고민합니다.'],['cal','1인 진료실 운영','환자 한 분 한 분의 시간을 위해 독립된 진료실에서 진료합니다.'],['won','합리적인 비용','정확한 진단을 토대로 과잉 진료 없는 합리적인 비용을 제시합니다.'],['clock','체계적인 사후관리','전담 의료진이 구강검진과 예방관리를 이어갑니다.']].map(([icon,t,d])=>({icon,t,d})) }),
    blk('c_treat',{ img:'asset:team', lab:'COLLABORATION', t:'분야별 전문의 협진 시스템', d:'보철과, 보존과, 교정과, 구강악안면외과 전문의가 한 자리에서 함께 진단합니다. 여러 분야가 얽힌 어려운 케이스도 병원을 옮겨 다닐 필요 없이 One-Stop으로 치료합니다.', pts:'분야별 전문의 상주\n원내 디지털 기공 시스템\n대학병원급 진단 장비\n자연치아 살리기 노하우', btn:'상담 예약하기', side:'right' }),
    blk('c_cta',{})],
  reviews: (hero) => [hero('lounge','REVIEW','디투치과를 경험한 분들의 이야기'), blk('c_reviews',{}), blk('c_cta',{})],
  notice: (hero) => [hero('desk','NOTICE','디투치과의 새로운 소식'), blk('c_notice',{})]
};

/* ---------- 샘플 등록 ---------- */
SEED.push({ theme:'balance', title:'06 분과협진 종합형 (밸런스 스타일)', once:'balance' });
