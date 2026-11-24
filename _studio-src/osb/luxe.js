/* =====================================================================
   8. LUXE — 프리미엄 심미형 (구성 참고: 판교밸런스치과 / 디자인: 아이보리 · 미드나잇 네이비 · 샴페인 골드)
   아치형 사진 프레임 · 세리프 타이포 · 오른쪽 플로팅 퀵바 · PC 하단 빠른상담 바 · 모바일 하단 4버튼
===================================================================== */
const LX_FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+KR:wght@300;400;600&display=swap" rel="stylesheet">`;
const LX_KAKAO = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12 3.5c-5 0-9 3.1-9 7 0 2.5 1.7 4.7 4.2 6l-.9 3.4c-.1.3.3.6.6.4l4-2.7c.4 0 .7.1 1.1.1 5 0 9-3.1 9-7s-4-7.2-9-7.2z"/></svg>`;
const LX_NAVER = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" stroke="none"/><path d="M8.5 7.5v9h2.6v-4.6l3 4.6h2.4v-9h-2.6v4.6l-3-4.6z" fill="#3a2f29" stroke="none"/></svg>`;
const T_LUXE = {
  label:'프리미엄 심미형', ref:'판교밸런스치과 구성 · 고급 심미 디자인', ogKey:'img_hero', fonts: LX_FONTS,
  css:`
:root{--ink:#2b2421;--bg:#faf7f2;--line:#e7e0d4;--field:#fff;--r:14px;--gold:#b89565;--gold2:#d8c19a;--navy:#2e2622;--ivory:#faf7f2;--muted:#6f6a62}
.t-luxe{background:var(--ivory)}.t-luxe .wrap{width:min(1240px,100% - 220px)}@media(max-width:1400px){.t-luxe .wrap{width:min(1240px,100% - 48px)}}
.sf{font-family:'Noto Serif KR',serif}.en{font-family:'Cormorant Garamond',serif}
/* header */
.hd{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(33,27,24,.9);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:#f3efe8;border-bottom:1px solid rgba(216,193,154,.25)}
.hd .wrap{display:flex;align-items:center;justify-content:space-between;height:84px;width:min(1440px,100% - 48px)}
.logo{display:flex;align-items:center;gap:10px;color:var(--gold2)}.logo b{font-family:'Noto Serif KR',serif;font-weight:600;font-size:20px;color:#fff}.logo small{display:block;font-family:'Cormorant Garamond',serif;letter-spacing:.24em;font-size:11px;color:var(--gold2)}
.hd nav{display:flex;align-items:stretch;height:84px}
.hd nav>a,.hd nav .mi-a{position:relative;display:flex;align-items:center;height:84px;padding:0 22px;font-size:15px;font-weight:500;color:#efe9df;letter-spacing:-.01em}
.hd nav>a:after,.hd nav .mi>.mi-a:before{content:'';position:absolute;left:22px;right:22px;bottom:24px;height:1px;background:var(--gold2);transform:scaleX(0);transition:.3s}
.hd nav>a:hover:after,.hd nav .mi:hover>.mi-a:before,.hd nav .mi.on>.mi-a:before{transform:scaleX(1)}.hd nav .mi.has-sub>.mi-a:after{display:none}
.hd nav .sub{padding-top:0}.hd nav .sub-in{border-radius:0 0 14px 14px;border-top:2px solid var(--gold);background:#fffdf9}.hd nav .sub a:hover{color:var(--gold)!important}
.hd .rt{display:flex;align-items:center;gap:18px}.hd .tl{font-family:'Cormorant Garamond',serif;font-size:22px;letter-spacing:.04em;color:#fff}.hd .tl small{font-family:Pretendard,sans-serif;font-size:11px;color:var(--gold2);margin-right:8px;letter-spacing:.1em}
.hd .bk{border:1px solid var(--gold2);color:var(--gold2);padding:9px 20px;border-radius:30px;font-size:13px;font-weight:600;transition:.3s}.hd .bk:hover{background:var(--gold2);color:var(--navy)}
/* floating quick bar (PC) */
.qbar{position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:45;width:78px;padding:14px 0 10px;border-radius:40px;background:rgba(33,27,24,.93);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 18px 40px rgba(43,34,28,.28);text-align:center;color:#efe9df}
.qbar .qh{display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:var(--gold2);margin-bottom:4px}
.qbar a.q{position:relative;display:grid;justify-items:center;gap:4px;padding:11px 4px;font-size:11px;line-height:1.25;color:#efe9df;transition:.25s}
.qbar a.q .ic{width:22px;height:22px;color:var(--gold2)}.qbar a.q.kk .ic{color:#fee500}.qbar a.q.nv .ic{color:#03c75a}
.qbar a.q:hover{background:rgba(216,193,154,.14)}.qbar a.q+a.q{border-top:1px solid rgba(255,255,255,.07)}
.qbar a.q[data-tip]:hover:after{content:attr(data-tip);position:absolute;right:88px;top:50%;transform:translateY(-50%);white-space:nowrap;background:#fff;color:var(--navy);font-weight:700;font-size:14px;padding:9px 14px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.15)}
.qbar .top{display:grid;place-items:center;width:44px;height:44px;margin:8px auto 0;border-radius:50%;background:var(--gold);color:#fff;font-size:11px;font-weight:700;letter-spacing:.08em}
/* hero — gallery stage */
.lh{position:relative;height:100vh;min-height:720px;max-height:1100px;background:#211b18;color:#f3ece2;overflow:hidden}
.lh .slide{display:block}
.lh .stage{position:absolute;top:84px;right:0;bottom:0;width:58%;overflow:hidden;background:#2b2421}
.lh .stage .one,.lh .stage .two>div{position:absolute;inset:0;overflow:hidden}.lh .stage .two>div:first-child{bottom:50%}.lh .stage .two>div:last-child{top:50%}
.lh .stage img{width:100%;height:100%;object-fit:cover;transform:scale(1.07);transition:transform 7.5s cubic-bezier(.2,.6,.2,1);filter:saturate(1.04) contrast(1.03)}
.lh .slide.on .stage img{transform:scale(1)}
.lh .stage .two:after{content:'';position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:#c9a876;z-index:2}
.lh .stage .lb{position:absolute;z-index:3;right:120px;bottom:22px;font-family:'Noto Serif KR',serif;font-size:14px;letter-spacing:.08em;color:#fff;background:rgba(33,27,24,.55);backdrop-filter:blur(6px);padding:7px 16px;border-radius:30px}
.lh .stage .two>div:last-child .lb{background:rgba(201,168,118,.9);color:#211b18}
.lh .stage:before{content:'';position:absolute;inset:0 auto 0 0;width:38%;z-index:2;background:linear-gradient(90deg,#211b18,rgba(33,27,24,0));pointer-events:none}
.lh .tx{position:relative;z-index:3;height:100%;display:flex;flex-direction:column;justify-content:center;padding:84px 0 0 max(56px,calc((100% - 1320px)/2));width:min(640px,44%)}
.lh .tag{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:24px;color:#c9a876}
.lh .l1{font-family:'Noto Serif KR',serif;font-weight:300;font-size:clamp(24px,2.3vw,36px);line-height:1.45;margin-top:22px;color:#e9e0d3;letter-spacing:-.02em}
.lh .l2{font-family:'Noto Serif KR',serif;font-weight:600;font-size:clamp(30px,3vw,50px);line-height:1.3;word-break:keep-all;margin-top:4px;color:#fbf6ee;letter-spacing:-.035em}
.lh .s{margin-top:24px;color:#b9ad9f;font-size:16px;line-height:1.8;max-width:440px}
.lh .acts{display:flex;gap:12px;margin-top:40px;flex-wrap:wrap}.lh .acts a{padding:15px 30px;border-radius:40px;font-size:14px;font-weight:600;transition:.3s}
.lh .acts .p{background:#c9a876;color:#211b18}.lh .acts .p:hover{background:#dcc092}.lh .acts .g{border:1px solid rgba(243,236,226,.45);color:#f3ece2}.lh .acts .g:hover{border-color:#f3ece2}
.lh .tx>*{opacity:0;transform:translateY(14px);transition:opacity .8s,transform .8s}.lh .slide.on .tx>*{opacity:1;transform:none}
.lh .slide.on .tx>*:nth-child(2){transition-delay:.12s}.lh .slide.on .tx>*:nth-child(3){transition-delay:.22s}.lh .slide.on .tx>*:nth-child(4){transition-delay:.32s}.lh .slide.on .tx>*:nth-child(5){transition-delay:.42s}
.lh .cnt{position:absolute;z-index:4;left:max(56px,calc((100% - 1320px)/2));bottom:122px;display:flex;align-items:center;gap:18px;font-family:'Cormorant Garamond',serif;font-size:20px;color:#e9e0d3}
.lh .cnt .bar{width:120px;height:1px;background:rgba(243,236,226,.25);position:relative;overflow:hidden}.lh .cnt .bar i{position:absolute;inset:0;background:#c9a876;transform:scaleX(0);transform-origin:left}
.lh .slide.on .cnt .bar i{animation:lhbar 6.5s linear forwards}@keyframes lhbar{to{transform:scaleX(1)}}
.lh .cnt small{color:#8f8275;font-size:16px}
.lh .ctl{position:absolute;z-index:5;left:calc(max(56px,calc((100% - 1320px)/2)) + 230px);bottom:110px;display:flex;align-items:center;gap:10px}
.lh .prev,.lh .next{width:46px;height:46px;border-radius:50%;border:1px solid rgba(243,236,226,.3);background:transparent;font-size:17px;color:#f3ece2;cursor:pointer;transition:.3s}.lh .prev:hover,.lh .next:hover{background:#c9a876;border-color:#c9a876;color:#211b18}
.lh .dots{display:none}
@media (prefers-reduced-motion:reduce){.lh .stage img,.lh .tx>*{transition:none;transform:none}.lh .slide.on .cnt .bar i{animation:none;transform:scaleX(1)}}
/* video hero (full-screen film) */
.lv{position:relative;height:100vh;min-height:640px;max-height:1100px;overflow:hidden;background:#211b18;color:#fbf6ee}
.lv video,.lv .pst{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lv:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(33,27,24,.45) 0%,rgba(33,27,24,.15) 40%,rgba(33,27,24,.7) 100%)}
.lv .in{position:absolute;z-index:2;left:0;right:0;bottom:17%;text-align:center;padding:0 24px}
.lv .en{display:block;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(40px,5.4vw,84px);line-height:1.05;letter-spacing:.01em;color:#fbf6ee}
.lv h1{font-family:'Noto Serif KR',serif;font-weight:400;font-size:clamp(17px,1.5vw,22px);letter-spacing:.02em;margin-top:22px;color:#efe6d8;word-break:keep-all}
.lv .more{display:inline-block;margin-top:34px;padding:13px 34px;border:1px solid rgba(251,246,238,.6);border-radius:40px;font-size:13px;letter-spacing:.12em;color:#fbf6ee;transition:.3s}.lv .more:hover{background:#c9a876;border-color:#c9a876;color:#211b18}
.lv .snd{position:absolute;z-index:3;right:max(120px,4vw);bottom:48px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(251,246,238,.5);background:transparent;color:#fbf6ee;cursor:pointer;font-size:13px}
.lv .sc{position:absolute;z-index:2;left:50%;bottom:34px;width:1px;height:46px;background:rgba(251,246,238,.35);overflow:hidden}.lv .sc:after{content:'';position:absolute;left:0;top:-46px;width:1px;height:46px;background:#c9a876;animation:lvsc 2.2s ease-in-out infinite}@keyframes lvsc{to{top:46px}}
@media(max-width:900px){.lv{height:82vh;min-height:520px}.lv .in{bottom:16%}.lv .snd{display:none}}
@media (prefers-reduced-motion:reduce){.lv .sc:after{animation:none}}
/* manifesto */
.lm{padding:150px 0 130px;text-align:center}.lm .en{display:block;font-style:italic;font-size:22px;color:var(--gold);margin-bottom:22px}
.lm h2{font-family:'Noto Serif KR',serif;font-weight:300;font-size:clamp(26px,2.6vw,40px);line-height:1.55;letter-spacing:-.02em;color:var(--navy)}.lm h2 b{font-weight:600}
.lm p{max-width:640px;margin:26px auto 0;color:var(--muted);font-size:16px;line-height:1.9}
.lm .st{display:grid;grid-template-columns:repeat(3,1fr);max-width:900px;margin:70px auto 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.lm .st>div{padding:34px 10px}.lm .st>div+div{border-left:1px solid var(--line)}.lm .st b{display:block;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:56px;line-height:1;color:var(--gold)}.lm .st b small{font-family:'Noto Serif KR',serif;font-size:18px;margin-left:4px}.lm .st span{display:block;margin-top:12px;font-size:14px;color:var(--ink)}
/* signature */
.lsg{background:var(--navy);color:#efe9df;padding:130px 0;position:relative;overflow:hidden}.lsg:before{content:'';position:absolute;width:900px;height:900px;border-radius:50%;border:1px solid rgba(216,193,154,.12);right:-300px;top:-380px}
.ltit{margin-bottom:64px}.ltit .en{display:block;font-style:italic;font-size:20px;color:var(--gold)}.ltit h2{font-family:'Noto Serif KR',serif;font-weight:400;font-size:clamp(28px,2.6vw,42px);letter-spacing:-.02em;margin-top:8px;line-height:1.4}.ltit p{margin-top:14px;opacity:.7}
.ltit.c{text-align:center}
.lsg .grid{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.lsg .card{background:rgba(255,255,255,.04);border:1px solid rgba(216,193,154,.22);border-radius:26px;padding:22px 22px 34px;transition:.4s}.lsg .card:hover{border-color:var(--gold2);transform:translateY(-6px)}
.lsg .ba{border-radius:18px;aspect-ratio:3/2}.lsg .no{display:flex;justify-content:space-between;align-items:center;margin:30px 12px 0}.lsg .no .en{font-size:15px;letter-spacing:.3em;color:var(--gold2)}
.lsg h3{font-family:'Noto Serif KR',serif;font-weight:400;font-size:30px;margin:10px 12px 0;color:#fff}.lsg p{margin:14px 12px 0;font-size:15px;line-height:1.85;opacity:.75}
.lsg .lk{display:inline-flex;gap:10px;align-items:center;margin:26px 12px 0;color:var(--gold2);font-size:14px;font-weight:600;border-bottom:1px solid currentColor;padding-bottom:4px}
/* before & after (reuse .bb) */
.t-luxe .bb{background:#fff}.t-luxe .bb .btit small{font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.05em;font-size:20px;color:var(--gold)}.t-luxe .btit h2{font-family:'Noto Serif KR',serif;font-weight:400;color:var(--navy)}
.t-luxe .bb .grid{gap:26px}.t-luxe .bb h3{font-family:'Noto Serif KR',serif;font-weight:600;color:var(--navy);font-size:19px}.t-luxe .bb .ba{border-radius:16px}
/* treatment cards (reuse .bt) */
.t-luxe .bt{padding:130px 0;background:var(--ivory)}.t-luxe .bt .grid{width:min(1240px,100% - 220px);margin:0 auto;gap:30px}.t-luxe .bt .ltit{color:var(--navy)}
@media(max-width:1400px){.t-luxe .bt .grid{width:min(1240px,100% - 48px)}}
.t-luxe .bt .tile{display:block;height:auto;color:var(--ink);background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 1px 0 var(--line);transition:.4s}.t-luxe .bt .tile:hover{transform:translateY(-6px);box-shadow:0 26px 50px rgba(43,34,28,.12)}
.t-luxe .bt .tile:after{display:none}.t-luxe .bt .tile>img{position:static;display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
.t-luxe .bt .tx{position:static;max-width:none;padding:28px 30px 32px}.t-luxe .bt .tx small{color:var(--gold);opacity:1;font-weight:600;letter-spacing:.02em}
.t-luxe .bt .tx h3{font-family:'Noto Serif KR',serif;font-weight:400;font-size:24px;color:var(--navy)}.t-luxe .bt .tile .tx h3 .hl{color:var(--navy)!important;font-weight:600}
.t-luxe .bt .tx p{color:var(--muted);opacity:1}.t-luxe .bt .tx em{border:0;padding:0;border-bottom:1px solid var(--gold);border-radius:0;color:var(--gold);font-weight:600}
.t-luxe .bt .tile.box .tx{background:none;margin:0;padding:28px 30px 32px}
/* doctor feature */
.ld{padding:140px 0;background:linear-gradient(180deg,#f4eee5,#faf7f2)}.ld .wrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:90px;align-items:center}
.ld .pf{position:relative;aspect-ratio:4/5}.ld .pf .ph{position:absolute;inset:0;border-radius:999px 999px 30px 30px;overflow:hidden;background:#fff}.ld .pf .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 12%}
.ld .pf:after{content:'';position:absolute;inset:-24px -24px 24px 24px;border:1px solid var(--gold);border-radius:999px 999px 30px 30px;z-index:-1}
.ld .chip{display:inline-block;background:var(--navy);color:var(--gold2);font-size:14px;font-weight:600;padding:7px 16px;border-radius:30px}
.ld .nm{font-family:'Noto Serif KR',serif;font-size:46px;font-weight:600;color:var(--navy);margin-top:20px;letter-spacing:-.02em}.ld .nm small{font-weight:300;font-size:24px;margin-left:10px;color:var(--muted)}
.ld .hl{margin-top:22px;padding-bottom:30px;border-bottom:1px solid var(--line);font-family:'Noto Serif KR',serif;font-size:20px;line-height:1.7;color:var(--gold)}
.ld ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px 30px;margin-top:30px;font-size:15px;color:#4a4740}.ld li{padding-left:16px;position:relative}.ld li:before{content:'';position:absolute;left:0;top:11px;width:6px;height:1px;background:var(--gold)}
.ld .sg{margin-top:36px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--navy)}
/* about (reuse .ba2) */
.t-luxe .ba2{padding:0 0 130px!important}.t-luxe .ba2 .btit{display:none}.t-luxe .ba2 .box{border-radius:30px;overflow:hidden;min-height:560px}
.t-luxe .ba2 .in{border-radius:22px;background:rgba(250,247,242,.94);backdrop-filter:blur(8px);padding:54px 50px;margin-left:56px;max-width:470px}.t-luxe .ba2 .in small{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;letter-spacing:.04em}
.t-luxe .ba2 h3{font-family:'Noto Serif KR',serif;color:var(--navy)}.t-luxe .ba2 .btn{background:var(--navy);border-radius:30px;padding:13px 28px}
/* info (reuse .bf) */
.t-luxe .bf{background:#fff}.t-luxe .bf .grid{border:0;gap:24px}.t-luxe .bf .col{background:var(--ivory);border-radius:24px;padding:38px 34px}.t-luxe .bf .col+.col{border-left:0}
.t-luxe .bf h3{font-family:'Noto Serif KR',serif;font-weight:600;color:var(--navy)}.t-luxe .bf li .st{background:var(--gold);border-radius:4px}.t-luxe .bf .nv,.t-luxe .bf .kk{border-radius:40px}.t-luxe .bf .mapbox{border-radius:16px;overflow:hidden}
.t-luxe .bf .tel{font-family:'Cormorant Garamond',serif;font-size:34px;color:var(--navy)}
/* sms (reuse .bs) */
.t-luxe .bs{background:var(--navy);color:#efe9df;--field:rgba(255,255,255,.06);--line:rgba(216,193,154,.3)}.t-luxe .bs h3{font-family:'Noto Serif KR',serif;color:#fff}.t-luxe .bs h3 b{color:var(--gold2)}.t-luxe .bs>.ic{color:rgba(216,193,154,.08)}
.t-luxe .bs .cform input,.t-luxe .bs .cform textarea{color:#fff;border-radius:10px}.t-luxe .bs .cform button{background:var(--gold);border-radius:10px;color:#fff}.t-luxe .bs .cform .agree{color:#d9d2c6}
/* footer */
.ft{background:#1d1815;color:#b3a798;padding:70px 0 120px;font-size:13px}.ft .wrap{display:grid;grid-template-columns:220px 1fr;gap:40px}.ft .fl img{height:42px;width:auto}.ft .fl b{display:block;color:#fff;font-family:'Noto Serif KR',serif;font-size:18px}
.ft .lk{color:#e5dccd;margin-bottom:14px;font-weight:600}.ft b{color:#e5dccd}
/* PC bottom quick consult bar */
.lbar{position:fixed;left:0;right:0;bottom:0;z-index:44;background:rgba(33,27,24,.96);backdrop-filter:blur(10px);color:#efe9df;border-top:1px solid rgba(216,193,154,.3);transition:transform .4s}
.lbar form{display:flex;align-items:center;gap:12px;height:72px;width:min(1240px,100% - 220px);margin:0 auto}
.lbar .ttl{font-family:'Noto Serif KR',serif;font-size:18px;color:#fff;white-space:nowrap;margin-right:10px}.lbar .ttl small{display:block;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;color:var(--gold2)}
.lbar input:not([type=checkbox]),.lbar select{height:42px;padding:0 14px;border-radius:8px;border:1px solid rgba(216,193,154,.3);background:rgba(255,255,255,.06);color:#fff;font:inherit;font-size:14px;min-width:0;flex:1}
.lbar select option{color:#222}.lbar label{display:flex;align-items:center;gap:6px;font-size:12px;white-space:nowrap;color:#cfc8bb}.lbar label a{text-decoration:underline}
.lbar button{height:42px;padding:0 26px;border:0;border-radius:8px;background:var(--gold);color:#fff;font-weight:700;white-space:nowrap}
.lbar .x{position:absolute;right:20px;top:-34px;height:34px;padding:0 16px;border-radius:12px 12px 0 0;background:rgba(33,27,24,.96);color:var(--gold2);font-size:12px;border:1px solid rgba(216,193,154,.3);border-bottom:0}
body.lbar-off .lbar{transform:translateY(72px)}body.lbar-off .lbar .x:after{content:' 열기'}body:not(.lbar-off) .lbar .x:after{content:' 접기'}
/* mobile bottom 4 buttons */
.mb4{display:none}
/* sub pages */
.t-luxe .cb-sub{background:var(--navy);min-height:460px}.t-luxe .cb-sub>img{left:45%;width:55%;-webkit-mask-image:linear-gradient(90deg,transparent,#000 40%);mask-image:linear-gradient(90deg,transparent,#000 40%)}
.t-luxe .cb-sub:after{background:linear-gradient(90deg,var(--navy) 40%,rgba(43,34,28,.25))}.t-luxe .cb-sub .wrap{padding-top:170px}.t-luxe .cb-sub small{color:var(--gold2);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;letter-spacing:.05em}
.t-luxe .cb-sub h1{font-family:'Noto Serif KR',serif;font-weight:400}
.t-luxe .cb-tit small{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;letter-spacing:.04em;color:var(--gold)}.t-luxe .cb-tit h2{font-family:'Noto Serif KR',serif;font-weight:400;color:var(--navy)}
.t-luxe .cb-pts{background:var(--navy);color:#efe9df}.t-luxe .cb-pts .cb-tit h2{color:#fff}.t-luxe .cb-pts .it{border-color:rgba(216,193,154,.25);background:rgba(255,255,255,.04);border-radius:20px}.t-luxe .cb-pts .ic{background:var(--gold)}
.t-luxe .cb-steps{background:#f4eee5}.t-luxe .cb-cta{background:#1d1815}.t-luxe .cb-cta a{background:var(--gold);color:#fff;border-radius:40px}.t-luxe .cb-ba .ba,.t-luxe .cb-gal img,.t-luxe .cb-treat img{border-radius:18px}
.t-luxe .cb-treat h2,.t-luxe .cb-treat h3{font-family:'Noto Serif KR',serif;font-weight:400}
@media(min-width:901px){body.t-luxe{padding-bottom:72px}}
@media(max-width:1180px){.hd nav>a,.hd nav .mi-a{padding:0 13px;font-size:14px}.hd .tl{display:none}.lbar label{display:none}}
@media(max-width:900px){
 .hd .wrap{height:64px}.hd .rt{display:none}.qbar,.lbar{display:none}.t-luxe .wrap{width:calc(100% - 40px)}
 .lh{height:auto;min-height:0;max-height:none;padding-bottom:110px}.lh .slide{position:relative!important;display:none}.lh .slide.on{display:block}
 .lh .stage{position:relative;top:0;width:100%;margin-top:64px;height:62vh;min-height:420px;max-height:560px}.lh .stage:before{inset:auto 0 0 0;width:auto;height:40%;background:linear-gradient(0deg,#211b18,rgba(33,27,24,0))}.lh .stage .lb{left:auto;right:12px;bottom:10px;top:auto;font-size:12px;padding:5px 12px}
 .lh .tx{width:auto;height:auto;padding:0 22px;margin-top:-40px}.lh .l2{font-size:30px}.lh .s{font-size:15px}.lh .acts{margin-top:26px}.lh .acts a{padding:13px 22px}
 .lh .cnt{display:none}.lh .ctl{left:auto;right:20px;bottom:30px}
 .lm{padding:90px 0}.lm .st b{font-size:40px}.lsg{padding:90px 0}.lsg .grid,.ld .wrap{grid-template-columns:1fr}.ld{padding:90px 0}.ld .wrap{gap:50px}.ld .pf{max-width:360px;margin:0 auto;width:85%}.ld ul{grid-template-columns:1fr}.ld .nm{font-size:36px}
 .t-luxe .bt{padding:90px 0}.t-luxe .bt .grid{width:calc(100% - 40px);grid-template-columns:1fr 1fr;gap:14px}.t-luxe .bt .tx{padding:18px}.t-luxe .bt .tx h3{font-size:18px}.t-luxe .bt .tx p{display:none}
 .t-luxe .bf .grid{grid-template-columns:1fr}.t-luxe .ba2 .in{margin:20px;padding:34px 26px}.ft .wrap{grid-template-columns:1fr}.ft{padding-bottom:110px}
 .mb4{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;left:0;right:0;bottom:0;z-index:60;background:#1d1815;padding-bottom:env(safe-area-inset-bottom);border-top:1px solid rgba(216,193,154,.3)}
 .mb4 a{display:grid;justify-items:center;gap:4px;padding:11px 0 10px;font-size:12px;color:#efe9df}.mb4 a+a{border-left:1px solid rgba(255,255,255,.07)}.mb4 .ic{width:24px;height:24px;color:var(--gold2)}.mb4 .kk .ic{color:#fee500}.mb4 .nv .ic{color:#03c75a}
 .t-luxe .cb-sub .wrap{padding-top:120px}
}
`
};
/* 밸런스형에서 가져온 블록(전후 사진 · 진료 타일 · 영상 · 3단 안내 · SMS)의 기본 레이아웃을 먼저 깔고, 위에서 정의한 고급 스타일로 덮어씀 */
T_LUXE.css = '.t-luxe .bs{overflow:hidden}.t-luxe .bs .cform{display:grid;grid-template-columns:1fr 1fr;gap:12px}.t-luxe .bs .cform textarea,.t-luxe .bs .cform .agree,.t-luxe .bs .cform button{grid-column:1/-1}\n' + T_BALANCE.css.split('\n').filter(l => /^\.(bt|bv|bb|bf|bs|ba2|sec|btit) /.test(l) || /^\.sec\{/.test(l) || /^\.btit/.test(l)).join('\n')
  + '\n@media(max-width:900px){.bt .grid,.bv .grid,.bf .grid{grid-template-columns:1fr}.bb .grid{grid-template-columns:1fr 1fr}.bf .col+.col{border-left:0;border-top:1px solid var(--line)}.bs .wrap{grid-template-columns:1fr}.bs .cform{grid-template-columns:1fr}.bs .cform .agree,.bs .cform button{grid-column:auto;grid-row:auto}.sec{padding:70px 0}}\n'
  + T_LUXE.css;
T_LUXE.css += '\n@keyframes rollin{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.bf ul.roll li.new{animation:none}}';
T_LUXE.css += '\n.t-luxe .bs>svg.ic{display:none}html:has(body.t-luxe),body.t-luxe{overflow-x:hidden}';
THEMES.luxe = T_LUXE;
DEFAULTS.luxe = () => ({ ...baseContent(), color:'#3a2f29', color2:'#b89565', phone:'00-0000-0000', bal_phone2:'00-0000-0000',
  hours:'평일   AM 09:30 - PM 06:30\n토요일   AM 09:30 - PM 02:00\n일요일 · 공휴일   휴진', bal_blog:'', bal_book:'', bal_cta:'상담 예약', bal_cta2:'' });

const LX_SLIDES = [
  ['doc1','PREMIUM AESTHETIC','자연스러운 아름다움을','디자인하는 치과','심미치료 전문 의료진이 처음부터 끝까지 함께합니다','심미치료 상담','pg-laminate','1:1 맞춤 스마일 디자인','상담부터 완성까지 한 분의 의료진이'],
  ['prosth','LAMINATE','깎지 않고, 얇게','빛나는 미소로','0.1mm 지르코니아로 완성하는 자연스러운 라미네이트','라미네이트 보기','pg-laminate','최소 삭제 원칙','자연치아를 지키는 심미치료'],
  ['lounge','WHITENING','한 톤 밝아진','첫인상','치아 손상 없이 본래의 밝기를 되찾는 전문가 미백','치아미백 보기','pg-whitening','전문가 미백','착색 원인에 맞춘 맞춤 상담']
];
BLOCKDEFS.luxe = {
  siteFields: BLOCKDEFS.balance.siteFields,
  layout: ['lhero','manifesto','sig','ba','tiles','dfeat','about','info','sms'],
  blocks: Object.assign({}, BLOCKDEFS.balance.blocks, {
    tiles: Object.assign({}, BLOCKDEFS.balance.blocks.tiles, { label:'진료 안내 카드', desc:'사진 카드형 진료 바로가기',
      fields:[F.text('en','영문 소제목'), F.text('t','제목')].concat(BLOCKDEFS.balance.blocks.tiles.fields),
      defaults: () => Object.assign({ en:'Treatment', t:'진료 안내' }, BLOCKDEFS.balance.blocks.tiles.defaults()),
      render:(R,d,S,ctx)=>BLOCKDEFS.balance.blocks.tiles.render(R,d,S,ctx).replace('<section class="bt">',`<section class="bt"><div class="ltit c rv"><span class="en">${R.t('en')}</span><h2>${R.t('t')}</h2></div>`) }),
    lhero: { label:'메인 배너 (갤러리형 사진)', desc:'왼쪽 문구 + 오른쪽 큰 사진. 두 번째 사진을 넣으면 위(치료 전) · 아래(치료 후) 비교로 보입니다',
      fields:[F.list('slides','슬라이드','슬라이드',3,[F.img('img','사진 (치료 전 또는 단독 사진)'),F.img('img2','치료 후 사진 (비우면 단독 사진)'),F.text('tag','영문 소제목'),F.text('l1','얇은 문구'),F.text('l2','굵은 문구'),F.text('s','설명'),F.text('btn','버튼 글자'),F.link('href')],{max:8})],
      defaults: () => ({ slides: LX_SLIDES.map(([a,tag,l1,l2,s,btn,p])=>({img:'asset:'+a,img2:'',tag,l1,l2,s,btn,href:'p:'+p})) }),
      render:(R,d,S,ctx)=>{ const N=(d.slides||[]).length, z=n=>String(n).padStart(2,'0');
        return `<section class="lh slides" data-slides="6500">${(d.slides||[]).map((it,n)=>`<div class="slide"><div class="stage">${it.img2?`<div class="two"><div>${R.i(`slides/${n}/img`)}<span class="lb">치료 전</span></div><div>${R.i(`slides/${n}/img2`)}<span class="lb">치료 후</span></div></div>`:`<div class="one">${R.i(`slides/${n}/img`)}</div>`}</div>
<div class="tx"><span class="tag">${R.t(`slides/${n}/tag`)}</span><div class="l1">${R.t(`slides/${n}/l1`)}</div>${n===0?'<h1 class="l2">':'<div class="l2">'}${R.t(`slides/${n}/l2`)}${n===0?'</h1>':'</div>'}<p class="s">${R.t(`slides/${n}/s`)}</p><div class="acts"><a class="p" href="${ctx.link(it.href)}">${R.t(`slides/${n}/btn`)}</a><a class="g" href="tel:${S.v('phone')}">전화 상담</a></div></div>
<div class="cnt">${z(n+1)}<span class="bar"><i></i></span><small>${z(N)}</small></div></div>`).join('')}
<div class="ctl"><button class="prev" type="button" aria-label="이전 슬라이드">←</button><div class="dots"></div><button class="next" type="button" aria-label="다음 슬라이드">→</button></div></section>`; } },
    lvideo: { label:'메인 영상 (풀스크린)', desc:'화면 전체에 영상이 반복 재생되고 가운데 아래에 문구가 올라갑니다',
      fields:[F.text('video','영상 주소 (mp4)'), F.img('poster','영상 첫 화면 사진'), F.text('en','영문 제목'), F.text('t','한글 문구'), F.text('btn','버튼 글자'), F.link('href')],
      defaults: () => ({ video:'', poster:'asset:lobby', en:'Aesthetic Dental Care', t:'자연스러운 미소를 오래 지켜가는 치과', btn:'VIEW MORE', href:'p:pg-greeting' }),
      render:(R,d,S,ctx)=>{ let v = d.video || ''; if (v.startsWith('assets/') && ctx.mode === 'export') v = 'https://dentalmbti.co.kr/' + v;
        return `<section class="lv">${R.i('poster').replace('<img','<img class="pst"')}${v?`<video autoplay muted loop playsinline preload="auto" poster="" src="${esc(v)}"></video>`:''}<div class="in"><span class="en">${R.t('en')}</span><h1>${R.t('t')}</h1><a class="more" href="${ctx.link(d.href)}">${R.t('btn')}</a></div><span class="sc" aria-hidden="true"></span></section>`; } },
    manifesto: { label:'철학 · 핵심 숫자', desc:'가운데 정렬 문구와 숫자 3개',
      fields:[F.text('en','영문 소제목'), F.text('t1','제목 1줄'), F.text('t2','제목 2줄 (굵게)'), F.area('d','설명',{rows:3}), F.list('st','숫자','숫자',3,[F.text('n','숫자'),F.text('u','단위'),F.text('l','설명')],{max:4})],
      defaults: () => ({ en:'Our Philosophy', t1:'가장 아름다운 미소는', t2:'가장 건강한 치아에서 시작됩니다', d:'보이는 아름다움만이 아니라 오래 지켜갈 수 있는 건강까지 함께 설계합니다.', st:[['20','년+','임상 경력'],['1',':1','전담 진료'],['100','%','정품 재료 사용']].map(([n,u,l])=>({n,u,l})) }),
      render:(R,d)=>`<section class="lm"><div class="wrap rv"><span class="en">${R.t('en')}</span><h2>${R.t('t1')}<br><b>${R.t('t2')}</b></h2><p>${R.t('d')}</p><div class="st">${(d.st||[]).map((_,n)=>`<div><b>${R.t(`st/${n}/n`)}<small>${R.t(`st/${n}/u`)}</small></b><span>${R.t(`st/${n}/l`)}</span></div>`).join('')}</div></div></section>` },
    sig: { label:'시그니처 심미 진료 (전후 비교)', desc:'남색 배경 위 대표 진료 2개 + 전후 비교 슬라이더',
      fields:[F.text('en','영문 소제목'), F.text('t','제목'), F.text('s','설명'), F.list('items','대표 진료','진료',2,[F.text('no','번호/영문'),F.text('t','진료명'),F.area('d','설명',{rows:3}),F.img('b','치료 전'),F.img('a','치료 후'),F.text('btn','링크 글자'),F.link('href')],{max:4})],
      defaults: () => ({ en:'Signature Care', t:'심미치료의 기준을 새롭게', s:'좌우로 밀어서 치료 전후를 비교해 보세요', items:[['01  LAMINATE','라미네이트','치아를 깎지 않고 0.1mm 지르코니아를 붙여 색과 모양, 배열을 함께 개선합니다.','라미네이트 자세히','pg-laminate'],['02  WHITENING','전문가 치아미백','치아 표면을 깎지 않고 착색된 색소만 분해해 본래의 밝기를 되찾습니다.','치아미백 자세히','pg-whitening']].map(([no,t,d,btn,p])=>({no,t,d,btn,href:'p:'+p,b:'asset:baBefore',a:'asset:baAfter'})) }),
      render:(R,d,S,ctx)=>`<section class="lsg"><div class="wrap"><div class="ltit rv"><span class="en">${R.t('en')}</span><h2>${R.t('t')}</h2><p>${R.t('s')}</p></div><div class="grid">${(d.items||[]).map((it,n)=>`<div class="card rv">${baBlock(R,`items/${n}/b`,`items/${n}/a`)}<div class="no"><span class="en">${R.t(`items/${n}/no`)}</span></div><h3>${R.t(`items/${n}/t`)}</h3><p>${R.t(`items/${n}/d`)}</p><a class="lk" href="${ctx.link(it.href)}">${R.t(`items/${n}/btn`)} →</a></div>`).join('')}</div></div></section>` },
    dfeat: { label:'대표원장 소개 (크게)', desc:'아치형 프로필 사진 + 전문의 배지 · 약력',
      fields:[F.img('img','프로필 사진'), F.text('chip','배지 (예: 치과보존과 인정의)'), F.text('n','이름'), F.text('pos','직함'), F.area('hl','강조 약력 (줄바꿈)',{rows:2}), F.area('cr','약력 목록 (줄바꿈)',{rows:6}), F.text('sg','서명 문구')],
      defaults: () => ({ img:'asset:doc1', chip:'보철과 전문의', n:'홍길동', pos:'대표원장', hl:'00대학교 치의학대학원 박사\n대한심미치과학회 정회원', cr:'00대학교 치과대학 졸업\n00대학교 치과병원 수련\n대한치과보철학회 정회원\n대한심미치과학회 정회원', sg:'With sincere care' }),
      render:(R,d)=>`<section class="ld"><div class="wrap"><div class="pf rv"><div class="ph">${R.i('img')}</div></div><div class="rv"><span class="chip">${R.t('chip')}</span><div class="nm">${R.t('n')}<small>${R.t('pos')}</small></div><div class="hl">${R.t('hl')}</div>${(()=>{const cr=String(d.cr||'').split('\n').filter(Boolean);return `<ul style="--rows:${Math.ceil(cr.length/2)}">${cr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`})()}<p class="sg">${R.t('sg')}</p></div></div></section>` }
  }),
  chrome:(S,body,ctx)=>`
<header class="hd"><div class="wrap"><a href="${ctx.home}" class="logo">${balLogo(S.v('bal_mark'))}<span><b>${S.t('name')}</b><small>${S.t('nameEn')}</small></span></a>
<nav>${navHTML(ctx)}</nav>
<div class="rt"><a class="tl" href="tel:${S.v('phone')}"><small>TEL</small>${S.t('phone')}</a><a class="bk" href="${S.v('bal_book')||ctx.go('sms')}">${S.t('bal_cta')}</a></div><button class="nav-tg" aria-label="메뉴">☰</button></div></header>
<aside class="qbar"><span class="qh">Quick</span>
<a class="q" href="tel:${S.v('phone')}" data-tip="${S.v('phone')}">${ic('phone')}전화상담</a>
<a class="q kk" href="${S.v('kakao')||'#'}" target="_blank" rel="noopener">${LX_KAKAO}카카오톡</a>
<a class="q nv" href="${S.v('bal_book')||'#'}" target="_blank" rel="noopener">${LX_NAVER}네이버<br>예약</a>
<a class="q" href="${ctx.link('p:pg-location')}">${ic('pin')}오시는길</a>
<a class="q" href="${S.v('bal_blog')||'#'}" target="_blank" rel="noopener">${ic('chat')}블로그</a>
<a class="q" href="${ctx.go('sms')}">${ic('cal')}빠른상담</a>
<a class="top" href="#top">TOP</a></aside>
<main id="top">${body}</main>
<footer class="ft"><div class="wrap"><div class="fl">${S.v('logo') ? S.i('logo','','logo') : balMark(S,'')}<b>${S.t('name')}</b></div><div><p class="lk">이용약관 &nbsp;·&nbsp; <a href="#privacy" class="pv-open">개인정보처리방침</a></p><p>${S.t('biz')}</p><p style="margin-top:10px">COPYRIGHT © ${S.t('nameEn')}. ALL RIGHTS RESERVED.</p></div></div></footer>
<div class="lbar"><button type="button" class="x" onclick="document.body.classList.toggle('lbar-off')">빠른상담</button>
<form class="cform" action="https://formsubmit.co/${esc(ctx.site.email)}" method="POST" data-mail="${esc(ctx.site.email)}"><input type="hidden" name="_subject" value="[${esc(ctx.site.name)}] 빠른 상담 신청"><input type="hidden" name="_captcha" value="false">
<span class="ttl">빠른 상담 신청<small>Quick Consultation</small></span><input name="이름" placeholder="이름" required><input name="연락처" placeholder="연락처" required>
<select name="상담분야" class="dd"><option>상담 분야 선택</option><option>라미네이트</option><option>치아미백</option><option>잇몸 · 심미</option><option>신경치료 · 자연치아</option><option>턱관절 · 보톡스</option><option>기타</option></select>
<label><input type="checkbox" required> 개인정보 수집 동의 <a href="#privacy" class="pv-open">보기</a></label><button type="submit">상담 신청</button></form></div>
<nav class="mb4"><a href="tel:${S.v('phone')}">${ic('phone')}전화하기</a><a class="kk" href="${S.v('kakao')||'#'}">${LX_KAKAO}카카오톡 상담</a><a class="nv" href="${S.v('bal_book')||'#'}">${LX_NAVER}네이버 예약</a><a href="${ctx.link('p:pg-location')}">${ic('pin')}오시는 길</a></nav>`
};
Object.assign(BLOCKDEFS.luxe.blocks, COMMON_BLOCKS);

T_LUXE.css += '\n.dd-w{position:relative;flex:1;min-width:0;display:flex}.dd-w .dd-n{position:absolute;inset:0;opacity:0;pointer-events:none}'
 + '.lbar .dd-b{flex:1;height:42px;padding:0 38px 0 14px;border-radius:8px;border:1px solid rgba(216,193,154,.3);background:rgba(255,255,255,.06);color:#fff;font:inherit;font-size:14px;text-align:left;cursor:pointer;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
 + '.lbar .dd-b.ph{color:#cfc8bb}.lbar .dd-b:after{content:"";position:absolute;right:16px;top:50%;width:7px;height:7px;border-right:1.5px solid #d8c19a;border-bottom:1.5px solid #d8c19a;transform:translateY(-70%) rotate(45deg);transition:transform .2s}'
 + '.lbar .dd-w.on .dd-b{border-color:rgba(216,193,154,.65);background:rgba(255,255,255,.1)}.lbar .dd-w.on .dd-b:after{transform:translateY(-30%) rotate(-135deg)}.lbar .dd-b:focus-visible{outline:2px solid #d8c19a;outline-offset:2px}'
 + '.dd-l{position:absolute;left:0;right:0;bottom:calc(100% + 10px);margin:0;padding:6px;list-style:none;border-radius:12px;background:rgba(33,27,24,.78);backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid rgba(216,193,154,.28);box-shadow:0 18px 40px rgba(0,0,0,.35);opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .18s,transform .18s,visibility .18s;z-index:60}'
 + '.dd-w.on .dd-l{opacity:1;visibility:visible;transform:none}'
 + '.dd-l li{padding:10px 14px;border-radius:8px;color:#efe6d6;font-size:14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center}'
 + '.dd-l li:hover,.dd-l li:focus{background:rgba(201,168,118,.22);color:#fff;outline:none}.dd-l li[aria-selected=true]{color:#e3c995;font-weight:600}.dd-l li[aria-selected=true]:after{content:"";width:5px;height:10px;border-right:2px solid #e3c995;border-bottom:2px solid #e3c995;transform:rotate(45deg) translateY(-2px)}'
 + '@media (prefers-reduced-motion:reduce){.dd-l,.lbar .dd-b:after{transition:none}}';

T_LUXE.css += '\n.t-luxe .hd nav>a.on,.t-luxe .hd nav .mi.on>.mi-a{color:var(--gold2)!important}.t-luxe .hd nav>a:hover,.t-luxe .hd nav .mi:hover>.mi-a{color:#fff}'
 + '@media(min-width:901px){.t-luxe .hd nav .sub{display:block;padding-top:0;opacity:0;visibility:hidden;transform:translate(-50%,8px);transition:opacity .22s,transform .22s,visibility .22s}'
 + '.t-luxe .hd nav .mi:hover .sub,.t-luxe .hd nav .mi:focus-within .sub{opacity:1;visibility:visible;transform:translate(-50%,0)}'
 + '.t-luxe .hd nav .sub-in{min-width:210px;padding:10px;border-radius:0 0 14px 14px;background:rgba(33,27,24,.9);backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid rgba(216,193,154,.2);border-top:2px solid var(--gold);box-shadow:0 22px 44px rgba(0,0,0,.35)}'
 + '.t-luxe .hd nav .sub a{position:relative;padding:12px 16px 12px 30px;border-radius:8px;color:#e9e1d3!important;font-size:14.5px;transition:background .2s,color .2s}'
 + '.t-luxe .hd nav .sub a:before{content:"";position:absolute;left:14px;top:50%;width:4px;height:4px;margin-top:-2px;border-radius:50%;background:rgba(216,193,154,.45);transition:.2s}'
 + '.t-luxe .hd nav .sub a:hover{background:rgba(201,168,118,.14);color:#fff!important}.t-luxe .hd nav .sub a:hover:before{width:9px;border-radius:2px;background:var(--gold2)}'
 + '.t-luxe .hd nav .sub a.on{color:var(--gold2)!important;font-weight:600}.t-luxe .hd nav .sub a.on:before{width:9px;border-radius:2px;background:var(--gold2)}'
 + '.t-luxe .hd nav .sub a+a{margin-top:2px}}'
 + '@media (prefers-reduced-motion:reduce){.t-luxe .hd nav .sub{transition:none}}';

/* 2026-11-24 모바일 정리: 전후비교 겹침 줄이기 · 모바일 1열 · 소개 카드 반투명 */
T_LUXE.css += '\n.t-luxe .ba .ba-l,.t-luxe .ba .ba-r{top:10px;font-size:10.5px;letter-spacing:.12em;padding:3px 8px;border-radius:4px;background:rgba(20,16,14,.3);transition:opacity .35s}.t-luxe .ba .ba-l{left:10px}.t-luxe .ba .ba-r{right:10px}'
 + '.t-luxe .ba .ba-tip{top:auto;bottom:10px;font-size:11.5px;padding:5px 11px;background:rgba(20,16,14,.45)}'
 + '.t-luxe .ba .ba-h,.t-luxe .ba .ba-h:after{transition:opacity .35s}'
 /* 실제로 밀어서 비교하면(또는 누르고 있는 동안) 라벨·손잡이를 흐리게 해서 치아가 잘 보이게 */
 + '.t-luxe .ba.used .ba-l,.t-luxe .ba.used .ba-r,.t-luxe .ba:active .ba-l,.t-luxe .ba:active .ba-r{opacity:.2}'
 + '.t-luxe .ba.used .ba-h:after,.t-luxe .ba:active .ba-h:after{opacity:.4}.t-luxe .ba.used .ba-h,.t-luxe .ba:active .ba-h{opacity:.75}'
 + '@media(max-width:900px){'
 + '.t-luxe .bb .grid{grid-template-columns:1fr;gap:22px}.t-luxe .bb h3{font-size:19px}.t-luxe .bb .sub2{margin:2px 0 10px}.t-luxe .bb .ba{aspect-ratio:16/10}'
 + '.t-luxe .ba .ba-h:after{width:38px;height:38px;background-size:38px}.t-luxe .ba .ba-h:before{width:38px;height:38px;margin:-19px 0 0 -19px}'
 + '.t-luxe .bt .grid{grid-template-columns:1fr;gap:16px}.t-luxe .bt .tile>img{aspect-ratio:2/1}.t-luxe .bt .tx{padding:16px 20px 20px}.t-luxe .bt .tx small{margin-bottom:4px}.t-luxe .bt .tx h3{font-size:21px}.t-luxe .bt .tx em{margin-top:10px}'
 + '.t-luxe .ba2 .box{min-height:600px;align-items:flex-end}.t-luxe .ba2 .in{margin:230px 14px 14px;padding:26px 22px;background:rgba(250,247,242,.68);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}'
 + '}'
 + '.t-luxe .ba2 .in{background:rgba(250,247,242,.74);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}'
 + '@media(max-width:900px){.t-luxe .ba2 .in{background:rgba(250,247,242,.68)}}';

/* 2026-11-24 줄바꿈 정리: 제목은 줄 길이 균형, 문단은 마지막 줄 외톨이 방지, 숫자·단위·전화·버튼은 한 줄 */
T_LUXE.css += '\n.t-luxe{word-break:keep-all;overflow-wrap:break-word}'
 + '.t-luxe h1,.t-luxe h2,.t-luxe h3,.t-luxe h4,.t-luxe .l2,.t-luxe .big,.t-luxe .lead{text-wrap:balance}'
 + '.t-luxe p,.t-luxe li,.t-luxe small,.t-luxe dd,.t-luxe figcaption,.t-luxe .lm .st span{text-wrap:pretty}'
 + '.t-luxe .lm .st span{text-wrap:balance}'
 + '.t-luxe .lm .st b,.t-luxe .hd .tl,.t-luxe .hd .bk,.t-luxe .btn,.t-luxe a.bk{white-space:nowrap}'
 + '@media(max-width:1366px){.t-luxe .hd .tl{display:none}}'
 /* 대표원장 이력: 두 열 간격을 넓히고, 넓은 화면에서는 열 폭을 내용에 맞춰 한 줄로 */
 + '.t-luxe .ld ul{column-gap:56px}'
 + '@media(min-width:901px){.t-luxe .ld ul{grid-auto-flow:column;grid-template-rows:repeat(var(--rows,4),auto);grid-template-columns:auto auto;justify-content:start;column-gap:48px}}' + '@media(min-width:901px) and (max-width:1300px){.t-luxe .ld ul{font-size:14px;column-gap:36px}}'
 + '.t-luxe .bf .addr,.t-luxe .cb-loc small{text-wrap:balance}';
T_LUXE.css += '.t-luxe .seg{display:block}.t-luxe .seg-gap{height:1em}'
 + '.t-luxe .cb-pts b,.t-luxe .ld ul li,.t-luxe .cb-sub p{text-wrap:balance}.t-luxe .cb-loc small{display:inline-block;text-wrap:balance}';
