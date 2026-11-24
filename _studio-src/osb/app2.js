/* ===== 홈페이지 템플릿 스튜디오 v2 — 블록 편집기 (디투덴탈 편집모드 방식) ===== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const hEl = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

/* ---------- 저장소 (Supabase) ---------- */
const HP_BUCKET = 'hp-images';
const toRow = p => ({ id:p.id, title:p.title, theme:p.theme, sort_order:p.order, content:p.content, created_at:p.created, updated_at:p.updated, share_token:p.share_token||null, share_on:!!p.share_on });
const fromRow = r => ({ id:r.id, title:r.title, theme:r.theme, order:r.sort_order, content:r.content, created:r.created_at, updated:r.updated_at, share_token:r.share_token||null, share_on:!!r.share_on });
const DB = {
  async all(){ const { data, error } = await sb.from('hp_portfolios').select('*').order('sort_order',{ascending:true}).order('created_at',{ascending:true}); if (error) throw error; return data.map(fromRow); },
  async put(p){
    const row = toRow(p);
    const up = await sb.from('hp_portfolios').update(row).eq('id', p.id).select('id');
    if (up.error) throw up.error;
    if (up.data && up.data.length) return;
    const ins = await sb.from('hp_portfolios').insert(row);
    if (ins.error) throw ins.error;
  },
  async del(id){
    const { error } = await sb.from('hp_portfolios').delete().eq('id', id); if (error) throw error;
    try { const { data } = await sb.storage.from(HP_BUCKET).list(id, {limit:1000}); if (data && data.length) await sb.storage.from(HP_BUCKET).remove(data.map(f=>id+'/'+f.name)); } catch(e){ console.warn('사진 정리 실패', e); }
  }
};
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return (c==='x'?r:(r&3|8)).toString(16)}));
const now = () => new Date().toISOString();
const fdate = s => { const d=new Date(s); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
const toSrc = v => !v ? '' : v.startsWith('asset:') ? HP_ASSET_BASE + v.slice(6) + '.webp' : v.startsWith('ph:') ? phSvg(v.slice(3)) : v;
function newPF(theme, title, order, content){ return { id:uid(), title, theme, order, created:now(), updated:now(), content:content || defaultContent(theme) }; }

/* ---------- 상태 ---------- */
let list = [], cur = null, dirty = false, device = 'pc', editOn = true, curPage = 'home';
const curPg = () => cur.content.pages.find(p=>p.id===curPage) || cur.content.pages[0];
const curBlocks = () => curPg().blocks;

function show(view){
  $$('.view').forEach(v=>v.hidden = v.id !== view);
  $$('.tabs button').forEach(b=>b.classList.toggle('on', b.dataset.v===view));
  document.body.dataset.view = view;
  if (view !== 'editor') closeDrawer(true);
  window.scrollTo(0,0);
}

/* ---------- 목록 ---------- */
async function renderList(){
  list = await DB.all();
  drawList();
}
function drawList(){
  const q = ($('#q') && $('#q').value || '').trim().toLowerCase();
  const shown = list.filter(p => { if (!q) return true; const c = p.content || {}; const nm = (c.site && c.site.name) || c.name || ''; return (p.title + ' ' + nm).toLowerCase().includes(q); });
  $('#cnt').textContent = q ? `${shown.length} / 전체 ${list.length}개` : `전체 ${list.length}개`;
  $('#grid').innerHTML = shown.map(p=>{
    const th = THEMES[p.theme];
    const c = migrateContent(p.theme, clone(p.content || {}));
    const img = toSrc(firstImage(c));
    return `<article class="card">
      <div class="thumb" data-edit="${p.id}">${img?`<img src="${img}" alt="">`:''}<span class="badge">${th.label}</span>${p.share_on?'<span class="badge share">🔗 공유 중</span>':''}<span class="nm">${esc(c.site.name)}</span></div>
      <div class="meta"><b title="${esc(p.title)}">${esc(p.title)}</b><small>${th.ref} · 페이지 ${c.pages.length}개 · 수정 ${fdate(p.updated)}</small></div>
      <div class="acts"><button class="pri" data-edit="${p.id}">편집하기</button><button class="pv" data-pv="${p.id}">👁 미리보기</button><button data-dup="${p.id}">복제</button><button data-ren="${p.id}">이름변경</button><button class="del" data-del="${p.id}">삭제</button></div>
    </article>`;
  }).join('') + (q ? '' : `<button class="card add" id="addCard"><span>＋</span>새 포트폴리오 만들기<small>치과별로 제한 없이 만들 수 있습니다</small></button>`)
    + (q && !shown.length ? `<p class="empty">"${esc(q)}" 검색 결과가 없습니다.</p>` : '');
}
$('#grid').addEventListener('click', async e=>{
  const t = e.target.closest('[data-edit],[data-dup],[data-del],[data-ren],[data-pv],#addCard'); if(!t) return;
  if (t.dataset.pv){ const p = list.find(x=>x.id===t.dataset.pv); return openPreview(p); }
  if (t.id==='addCard') return openNew();
  if (t.dataset.edit) return openEditor(t.dataset.edit);
  const p = list.find(x=>x.id===(t.dataset.dup||t.dataset.del||t.dataset.ren));
  if (t.dataset.dup){
    const cp = clone(p); cp.id=uid(); cp.share_token=null; cp.share_on=false; cp.title=p.title+' (복사본)'; cp.order=Math.max(...list.map(x=>x.order))+1; cp.created=cp.updated=now();
    if(await safe(()=>DB.put(cp))){ toast('복제했습니다.'); renderList(); }
  } else if (t.dataset.ren){
    const n = prompt('포트폴리오 이름', p.title); if(!n) return; p.title=n.trim(); p.updated=now(); if(await safe(()=>DB.put(p))) renderList();
  } else if (t.dataset.del){
    if (!confirm(`'${p.title}' 포트폴리오를 삭제할까요?\n삭제하면 되돌릴 수 없습니다.`)) return;
    if(await safe(()=>DB.del(p.id))){ toast('삭제했습니다.'); renderList(); }
  }
});
function openNew(){
  $('#newGrid').innerHTML = Object.entries(THEMES).map(([k,t])=>`<button data-th="${k}"><img src="${toSrc(firstImage(defaultContent(k)))}" alt=""><b>${t.label}</b><small>${t.ref}</small></button>`).join('');
  $('#newModal').classList.add('on');
}
$('#newGrid').addEventListener('click', async e=>{
  const b = e.target.closest('[data-th]'); if(!b) return;
  const th = b.dataset.th;
  const title = prompt('새 포트폴리오 이름 (예: 강남 ○○치과 시안)', `${THEMES[th].label} 새 시안`); if(!title) return;
  const p = newPF(th, title.trim(), list.length ? Math.max(...list.map(x=>x.order))+1 : 0);
  if(!await safe(()=>DB.put(p))) return; $('#newModal').classList.remove('on'); await renderList(); openEditor(p.id);
});
$$('.modal .close').forEach(b=>b.onclick=()=>b.closest('.modal').classList.remove('on'));

/* =====================================================================
   편집기
===================================================================== */
const SITE_FIELDS = [
  F.img('logo','로고 이미지'), F.text('logoH','로고 높이 (px)',{hint:'로고 이미지를 넣으면 병원명 글자 로고 대신 표시됩니다. 투명 배경 PNG·SVG 권장, 높이 기본 44'}),
  F.img('logoLight','밝은 배경용 로고 (하단 · 의료진 구역)'),
  {key:'logoTone',label:'로고 색 보정',type:'select',options:[['','원본 그대로'],['white','흰색으로 (어두운 헤더용)'],['black','검정으로 (밝은 헤더용)']]},
  F.text('name','병원명'), F.text('nameEn','영문 병원명'), {key:'color',label:'대표 색상',type:'color'},
  F.text('phone','대표 전화'), F.text('address','주소',{hint:'실제 주소를 입력하면 지도가 표시됩니다.'}), F.text('traffic','교통 / 주차 안내'), F.img('mapImg','약도 이미지',{hint:'넣으면 구글 지도 대신 약도가 표시되고, [지도 앱에서 열기] 버튼이 붙습니다.'}),
  F.area('hours','진료시간',{rows:4}), F.text('email','문의 수신 이메일',{hint:'상담 신청서가 이 주소로 발송됩니다.'}),
  F.text('kakao','카카오톡 채널 링크'), F.text('youtube','유튜브 채널 링크'), F.text('form_btn','상담 신청 버튼 글자'),
  F.text('metaTitle','검색 노출 제목 (부제)'), F.area('metaDesc','검색 노출 설명',{hint:'네이버·구글 검색 결과에 보이는 문구'}), F.area('biz','하단 사업자 정보')
];

function openEditor(id){
  const p = list.find(x=>x.id===id); if (!p) return;
  cur = clone(p);
  const wasOld = !(cur.content && cur.content.v === 3); curPage = 'home';
  cur.content = migrateContent(cur.theme, cur.content);
  dirty = wasOld; updDirty();
  $('#edTitle').textContent = cur.title;
  $('#edTheme').textContent = THEMES[cur.theme].label + ' · ' + THEMES[cur.theme].ref;
  drawPageSel();
  show('editor'); setDevice(device); setEdit(true);
  if (wasOld) toast('메뉴별 개별 페이지 구조로 변환했습니다 (표준 치과 페이지 19개 추가). 저장하면 확정됩니다.');
}
const PREVIEW_RUNTIME = `(function(){function go(pg,h){if(window.parent!==window){parent.postMessage({t:'go',page:pg,hash:h},'*')}else if(window.opener&&window.opener.__pvGo){window.opener.__pvGo(window,pg,h)}}document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'';if(h.indexOf('#pg=')===0){e.preventDefault();var q=new URLSearchParams(h.slice(1));document.body.classList.remove('nav-open');go(q.get('pg'),q.get('h')||'');return}if(h.charAt(0)!=='#')return;e.preventDefault();if(h==='#'||h==='#top'){if(h==='#top')scrollTo({top:0,behavior:'smooth'});return}var t=null;try{t=document.querySelector(h)}catch(x){}if(t)t.scrollIntoView({behavior:'smooth',block:'start'});document.body.classList.remove('nav-open')},true)})();`;

function previewHTML(){
  const T = BLOCKDEFS[cur.theme];
  if (!editOn) return renderSite(cur.content, cur.theme, 'edit', {}, { page:curPage, head:'<script>window.__EDIT=false<\/script>', tail:`<script>${PREVIEW_RUNTIME}<\/script>` });
  const bl = curBlocks();
  const meta = bl.map((b,i)=>({ id:b.id, label:(T.blocks[b.type]||{}).label||b.type, hidden:!!b.hidden, first:i===0, last:i===bl.length-1 }));
  return renderSite(cur.content, cur.theme, 'edit', {}, { page:curPage, editUI:true, head:'<script>window.__EDIT=true<\/script>', tail:`<script>window.__BLK=${JSON.stringify(meta).replace(/</g,'\\u003c')};${EDIT_RUNTIME}<\/script>` });
}
function renderPreview(keepScroll, hash){
  const fr = $('#pv'); let y = 0;
  try { y = fr.contentWindow.scrollY; } catch(e){}
  fr.onload = () => { try { if (hash){ const el = fr.contentDocument.getElementById(hash); if (el) el.scrollIntoView(); } else if (keepScroll) fr.contentWindow.scrollTo(0, y); } catch(e){} if (drawer && drawer.blockId) post({t:'editing', id:drawer.blockId}); };
  fr.srcdoc = previewHTML();
}
const post = m => { try { $('#pv').contentWindow.postMessage(m, '*'); } catch(e){} };
function liveBlock(id){
  const b = curBlocks().find(x=>x.id===id); if (!b) return;
  post({ t:'block', id, html: renderBlockHTML(cur.content, cur.theme, b, 'edit', {}, { page:curPage }) });
}

/* ---------- 미리보기 안에서 실행되는 편집 스크립트 ---------- */
const EDIT_RUNTIME = `
(function(){
var A='#ff7828';
var st=document.createElement('style');st.textContent=
'[data-k]{outline:1px dashed transparent;outline-offset:3px;cursor:text;border-radius:2px;transition:outline-color .15s}[data-k]:hover{outline-color:rgba(255,120,40,.9)}[data-k]:focus{outline:2px solid '+A+';background:rgba(255,120,40,.08)}'+
'[data-img]{cursor:pointer}#__pic{position:fixed;z-index:99999;pointer-events:none;background:'+A+';color:#fff;font:600 13px Pretendard,sans-serif;padding:8px 14px;border-radius:30px;box-shadow:0 6px 18px rgba(0,0,0,.3);display:none}'+
'.rv{opacity:1!important;transform:none!important}html{scroll-snap-type:none!important}'+
'.blk{position:relative;outline:2px dashed transparent;outline-offset:-2px;transition:outline-color .15s}.blk:hover,.blk.ad-editing{outline-color:'+A+'}.blk.ad-editing{outline-style:solid}'+
'.blk.is-hidden{display:block!important;opacity:.45;background-image:repeating-linear-gradient(45deg,transparent 0 14px,rgba(0,0,0,.05) 14px 28px)}.blk.is-hidden>section{pointer-events:none}'+
'.ad-tools{position:absolute;z-index:9998;top:12px;right:12px;display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:6px;background:rgba(255,255,255,.97);border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.2);font:500 13px/1 Pretendard,sans-serif;color:#222;max-width:calc(100% - 24px);opacity:0;pointer-events:none;transition:opacity .15s}'+
'.blk:hover>.ad-tools,.blk.ad-editing>.ad-tools{opacity:1;pointer-events:auto}html.ad-hd-on .blk>.ad-tools{opacity:0!important;pointer-events:none!important}html.ad-hd-on .blk:hover{outline-color:transparent}'+
'.ad-tag{font-size:12px;font-weight:800;color:#c2560a;padding:0 6px}.ad-tb{border:1px solid #e3ddd6;background:#fff;color:#222;border-radius:6px;padding:6px 10px;font:600 12px/1 Pretendard,sans-serif;cursor:pointer}.ad-tb:hover{border-color:'+A+'}.ad-tb:disabled{opacity:.35;cursor:not-allowed}.ad-tb.strong{background:'+A+';border-color:'+A+';color:#fff}.ad-tb.danger{color:#c0392b}'+
'.ad-insert{position:relative;z-index:9997;height:0;display:flex;justify-content:center}.ad-add{transform:translateY(-50%);height:34px;padding:0 16px;border-radius:17px;border:2px solid '+A+';background:#fff;color:#c2560a;font:700 13px/1 Pretendard,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.15);opacity:0;transition:opacity .15s}'+
'.ad-insert:hover .ad-add,.blk:hover+.ad-insert .ad-add,.ad-insert.last .ad-add{opacity:1}@media(hover:none){.ad-add,.ad-tools{opacity:1}}';
document.head.appendChild(st);
var tip=document.createElement('div');tip.id='__pic';tip.textContent='📷 클릭해서 사진 변경';document.body.appendChild(tip);
var M={};(window.__BLK||[]).forEach(function(b){M[b.id]=b});
function editable(root){root.querySelectorAll('[data-k]').forEach(function(el){if(el.isContentEditable)return;
  el.contentEditable='true';el.spellcheck=false;
  el.addEventListener('input',function(){parent.postMessage({t:'text',k:el.dataset.k,v:el.innerText.replace(/\\n$/,'')},'*');
    document.querySelectorAll('[data-k="'+el.dataset.k+'"]').forEach(function(o){if(o!==el)o.innerText=el.innerText})});
  el.addEventListener('paste',function(e){e.preventDefault();var t=(e.clipboardData||window.clipboardData).getData('text');document.execCommand('insertText',false,t)});
  el.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.closest('a,button')){e.preventDefault()}});
});}
function tools(el){var b=M[el.dataset.block];if(!b||el.querySelector(':scope>.ad-tools'))return;
  if(b.first)el.classList.add('first');
  var t=document.createElement('div');t.className='ad-tools';t.contentEditable='false';
  t.innerHTML='<span class="ad-tag">'+b.label.replace(/</g,'&lt;')+(b.hidden?' · 숨김':'')+'</span>'+
   '<button type="button" class="ad-tb strong" data-a="edit">편집</button>'+
   '<button type="button" class="ad-tb" data-a="up" '+(b.first?'disabled':'')+' title="위로">↑</button>'+
   '<button type="button" class="ad-tb" data-a="down" '+(b.last?'disabled':'')+' title="아래로">↓</button>'+
   '<button type="button" class="ad-tb" data-a="hide">'+(b.hidden?'보이기':'숨기기')+'</button>'+
   '<button type="button" class="ad-tb" data-a="dup">복제</button>'+
   '<button type="button" class="ad-tb danger" data-a="del">삭제</button>';
  t.addEventListener('click',function(e){var x=e.target.closest('[data-a]');if(!x)return;e.preventDefault();e.stopPropagation();parent.postMessage({t:'blk',id:b.id,act:x.dataset.a},'*')});
  el.prepend(t);if(b.hidden)el.classList.add('is-hidden');if(window.__place)window.__place(el);
}
function inserts(){document.querySelectorAll('.ad-insert').forEach(function(x){x.remove()});
  var bl=[].slice.call(document.querySelectorAll('.blk'));
  function mk(i,last){var d=document.createElement('div');d.className='ad-insert'+(last?' last':'');d.innerHTML='<button type="button" class="ad-add">＋ 블록 추가</button>';
    d.querySelector('button').onclick=function(e){e.preventDefault();parent.postMessage({t:'insert',index:i},'*')};return d}
  if(!bl.length){var m=document.querySelector('main');m&&m.appendChild(mk(0,true));return}
  bl.forEach(function(el,i){el.after(mk(i+1,i===bl.length-1))});
}
function hdBottom(){var h=document.querySelector('.hd');if(!h)return 0;var p=getComputedStyle(h).position;if(p!=='fixed'&&p!=='sticky')return 0;var r=h.getBoundingClientRect();return r.bottom>0?r.bottom:0}
window.__place=place;function place(el){var t=el.querySelector(':scope>.ad-tools');if(!t)return;var r=el.getBoundingClientRect();var top=Math.max(12,hdBottom()-r.top+12);top=Math.min(top,Math.max(12,r.height-56));t.style.top=top+'px';var q=document.querySelector('.qbar');var qw=(q&&getComputedStyle(q).display!=='none'&&getComputedStyle(q).position==='fixed')?q.getBoundingClientRect().width:0;t.style.right=(qw?qw+12:12)+'px'}
document.addEventListener('mouseover',function(e){var b=e.target.closest&&e.target.closest('.blk');if(b)place(b)});
window.addEventListener('scroll',function(){document.querySelectorAll('.blk:hover,.blk.ad-editing').forEach(place)},{passive:true});document.addEventListener('mousemove',function(e){var b=e.target.closest&&e.target.closest('.blk');if(b)place(b)},{passive:true});
editable(document);document.querySelectorAll('.blk').forEach(tools);document.querySelectorAll('.blk').forEach(place);inserts();
(function(){var nav=document.querySelector('.hd nav');var hd=document.querySelector('.hd');if(!nav||!hd)return;
  var s2=document.createElement('style');s2.textContent='.hd nav{outline:2px dashed transparent;outline-offset:6px;border-radius:6px;transition:outline-color .15s}.hd:hover nav,.hd.ad-menu-on nav{outline-color:'+A+'}'+
  '.hd .logo{outline:2px dashed transparent;outline-offset:6px;border-radius:6px;cursor:pointer}.hd:hover .logo{outline-color:rgba(255,120,40,.6)}'+
  '.ad-mtools{position:absolute;z-index:10000;top:100%;left:16px;padding-top:8px;opacity:0;pointer-events:none;transition:opacity .15s}'+
  '.ad-mtools .in{display:flex;align-items:center;gap:4px;padding:6px;background:#fff;border:2px solid '+A+';border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.25);font:500 13px/1 Pretendard,sans-serif;white-space:nowrap}'+
  '.hd:hover .ad-mtools,.ad-mtools:hover,.hd.ad-show .ad-mtools{opacity:1;pointer-events:auto}.hd.ad-show nav{outline-color:'+A+'}@media(hover:none){.ad-mtools{opacity:1;pointer-events:auto}}';
  document.head.appendChild(s2);
  var t=document.createElement('div');t.className='ad-mtools';t.contentEditable='false';
  t.innerHTML='<div class="in"><span class="ad-tag">상단 헤더</span><button type="button" class="ad-tb strong" data-m="logo">로고 이미지</button><button type="button" class="ad-tb" data-m="site">병원 정보</button><button type="button" class="ad-tb strong" data-m="edit">메뉴 편집</button><button type="button" class="ad-tb" data-m="add">＋ 메뉴 추가</button></div>';
  t.addEventListener('click',function(e){var x=e.target.closest('[data-m]');if(!x)return;e.preventDefault();e.stopPropagation();parent.postMessage(x.dataset.m==='site'?{t:'site'}:x.dataset.m==='logo'?{t:'pick',k:'s/logo'}:{t:'menu',add:x.dataset.m==='add'},'*')});
  var R=document.documentElement,tm=0;function on(){clearTimeout(tm);hd.classList.add('ad-show');R.classList.add('ad-hd-on')}function off(){clearTimeout(tm);tm=setTimeout(function(){hd.classList.remove('ad-show');R.classList.remove('ad-hd-on')},900)}hd.addEventListener('mouseenter',on);hd.addEventListener('mouseleave',off);t.addEventListener('mouseenter',on);
  if(getComputedStyle(hd).position==='static')hd.style.position='relative';hd.appendChild(t);
})();
document.addEventListener('click',function(e){
  if(e.target.closest('.ad-tools,.ad-insert,.ad-mtools'))return;
  if(e.target.closest('.hd .logo')&&!e.target.closest('[data-k],[data-img]')){e.preventDefault();parent.postMessage({t:'site'},'*');return}
  var a=e.target.closest('a');
  if(a){e.preventDefault();var h=a.getAttribute('href')||'';
    if(h.indexOf('#pg=')===0&&!e.target.closest('[data-k]')){var q=new URLSearchParams(h.slice(1));document.body.classList.remove('nav-open');parent.postMessage({t:'go',page:q.get('pg'),hash:q.get('h')||''},'*');return}
    if(h.charAt(0)==='#'&&h.length>1&&!e.target.closest('[data-k]')){var t=null;try{t=document.querySelector(h)}catch(x){}if(t)t.scrollIntoView({behavior:'smooth',block:'start'});document.body.classList.remove('nav-open')}}
  var im=e.target.closest('[data-img]');if(im&&!e.target.closest('[data-k]')){e.preventDefault();parent.postMessage({t:'pick',k:im.dataset.img},'*')}
},true);
document.addEventListener('mousemove',function(e){var im=e.target.closest&&e.target.closest('[data-img]');if(im&&!e.target.closest('[data-k],.ad-tools')){tip.style.display='block';tip.style.left=(e.clientX+14)+'px';tip.style.top=(e.clientY+14)+'px'}else tip.style.display='none'});
document.addEventListener('mouseleave',function(){tip.style.display='none'});
window.addEventListener('message',function(e){var d=e.data||{};
  if(d.t==='img')document.querySelectorAll('[data-img="'+d.k+'"]').forEach(function(i){i.src=d.src});
  if(d.t==='set')document.querySelectorAll('[data-k="'+d.k+'"]').forEach(function(o){if(o!==document.activeElement)o.innerText=d.v});
  if(d.t==='color')document.documentElement.style.setProperty('--pc',d.v);
  if(d.t==='editing'){document.querySelectorAll('.blk.ad-editing').forEach(function(x){x.classList.remove('ad-editing')});if(d.id){var el=document.querySelector('[data-block="'+d.id+'"]');if(el){el.classList.add('ad-editing');if(d.scroll)el.scrollIntoView({behavior:'smooth',block:'start'})}}}
  if(d.t==='block'){var old=document.querySelector('[data-block="'+d.id+'"]');if(!old)return;var w=document.createElement('div');w.innerHTML=d.html;var nb=w.firstElementChild;
    var ed=old.classList.contains('ad-editing');old.replaceWith(nb);if(ed)nb.classList.add('ad-editing');
    window.__init&&window.__init(nb);editable(nb);tools(nb);inserts();}
});
})();`;

/* ---------- 미리보기 → 편집기 메시지 ---------- */
window.addEventListener('message', e=>{
  const d = e.data||{}; if(!cur || e.source !== $('#pv').contentWindow) return;
  if (d.t==='text'){ setPath(cur.content, d.k, d.v); markDirty(); syncDrawerField(d.k, d.v); }
  if (d.t==='site'){ if (!editOn) setEdit(true); openSiteEditor(); }
  if (d.t==='pick'){ pickImage(async url=>{ setPath(cur.content, d.k, url); markDirty(); post({t:'img',k:d.k,src:toSrc(url)}); syncDrawerField(d.k, url); if (d.k.startsWith('s/')) renderPreview(true); }); }
  if (d.t==='blk') blockAction(d.id, d.act);
  if (d.t==='insert') openPicker(d.index);
  if (d.t==='menu') openMenuEditor(!!d.add);
});

window.addEventListener('message', e=>{
  const d = e.data||{}; if (d.t !== 'go') return;
  if (cur && e.source === $('#pv').contentWindow) return switchPage(d.page, d.hash);
  if (pvItem && e.source === $('#pvFrame').contentWindow) return pvShow(d.page, d.hash);
});

/* ---------- 블록 동작 ---------- */
async function blockAction(id, act){
  const bl = curBlocks(), i = bl.findIndex(b=>b.id===id); if (i<0) return;
  const T = BLOCKDEFS[cur.theme], label = (T.blocks[bl[i].type]||{}).label || '블록';
  if (act==='edit') return openBlockEditor(id);
  if (drawer) closeDrawer(true);
  if (act==='up' && i>0) [bl[i-1], bl[i]] = [bl[i], bl[i-1]];
  if (act==='down' && i<bl.length-1) [bl[i+1], bl[i]] = [bl[i], bl[i+1]];
  if (act==='hide'){ bl[i].hidden = !bl[i].hidden; toast(bl[i].hidden ? `"${label}" 블록을 숨겼습니다. 내려받는 홈페이지에서 빠집니다.` : `"${label}" 블록을 다시 보이게 했습니다.`); }
  if (act==='dup'){ const c = clone(bl[i]); c.id = bid(); bl.splice(i+1, 0, c); toast(`"${label}" 블록을 복제했습니다.`); }
  if (act==='del'){ if (!confirm(`"${label}" 블록을 삭제할까요?\n저장 후에는 되살릴 수 없습니다.`)) return; bl.splice(i,1); toast(`"${label}" 블록을 삭제했습니다.`); }
  markDirty(); renderPreview(true); await savePF(true);
}
function openPicker(index){
  const T = BLOCKDEFS[cur.theme];
  const own = Object.entries(T.blocks).filter(([k])=>!COMMON_BLOCKS[k]), com = Object.entries(COMMON_BLOCKS);
  const card = ([k,d]) => `<button type="button" class="pick" data-t="${k}"><b>${esc(d.label)}</b><span>${esc(d.desc||'')}</span></button>`;
  $('#pickBody').innerHTML = `<h4>이 디자인 전용 블록</h4><div class="pgrid">${own.map(card).join('')}</div><h4>공통 블록</h4><div class="pgrid">${com.map(card).join('')}</div>`;
  $('#pickModal').classList.add('on');
  $('#pickBody').onclick = e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    const type = b.dataset.t, block = { id:bid(), type, hidden:false, data:clone(newBlockData(cur.theme, type)) };
    curBlocks().splice(Math.min(Math.max(0,index), curBlocks().length), 0, block);
    $('#pickModal').classList.remove('on'); markDirty(); renderPreview(true);
    setTimeout(()=>{ openBlockEditor(block.id, true); }, 350);
    toast(`"${T.blocks[type].label}" 블록을 추가했습니다. 오른쪽 편집 창에서 내용을 바꾸세요.`);
  };
}

/* ---------- 오른쪽 편집 창(서랍) ---------- */
let drawer = null;
function openDrawer({ title, sub, body, onSave, onCancel, blockId }){
  closeDrawer(true);
  const el = $('#drawer');
  $('#drTitle').textContent = title; $('#drSub').textContent = sub || '';
  const b = $('#drBody'); b.innerHTML = ''; b.appendChild(body); b.scrollTop = 0;
  drawer = { onSave, onCancel, blockId };
  el.hidden = false; document.body.classList.add('dr-open');
  if (blockId) post({t:'editing', id:blockId});
}
function closeDrawer(cancel){
  if (!drawer) return;
  const d = drawer; drawer = null;
  if (cancel && d.onCancel) d.onCancel();
  $('#drawer').hidden = true; document.body.classList.remove('dr-open');
  post({t:'editing', id:null});
}
$('#drX').onclick = $('#drCancel').onclick = () => closeDrawer(true);
$('#drSave').onclick = async () => {
  if (!drawer) return; const btn = $('#drSave'); btn.disabled = true;
  try { const r = await drawer.onSave(); if (r !== false){ drawer = null; $('#drawer').hidden = true; document.body.classList.remove('dr-open'); post({t:'editing', id:null}); } }
  finally { btn.disabled = false; }
};
function syncDrawerField(path, v){
  const el = $(`#drBody [data-path="${CSS.escape(path)}"]`); if (!el) return;
  if (el.dataset.kind === 'image'){ const im = el.querySelector('img'); if (im) im.src = toSrc(v); }
  else { const inp = el.querySelector('input,textarea,select'); if (inp && document.activeElement !== inp) inp.value = v ?? ''; }
}

function openBlockEditor(id, scroll){
  const b = curBlocks().find(x=>x.id===id); if (!b) return;
  const def = BLOCKDEFS[cur.theme].blocks[b.type]; const snap = clone(b);
  let t; const live = () => { markDirty(); clearTimeout(t); t = setTimeout(()=>liveBlock(id), 120); };
  const body = document.createElement('div');
  body.appendChild(hEl(`<p class="dr-desc">${esc(def.desc||'')}</p>`));
  body.appendChild(buildForm(def.fields.filter(f=>f.key!=='menu'), b.data, 'b/'+id+'/', live));
  openDrawer({ title: def.label + ' 편집', sub:'입력하는 대로 화면에 바로 반영됩니다. [저장]을 누르면 포트폴리오에 저장됩니다.', body, blockId:id,
    onSave: async () => { renderPreview(true); return await savePF(); },
    onCancel: () => { const bl = curBlocks(), i = bl.findIndex(x=>x.id===id); if (i>=0){ bl[i] = snap; liveBlock(id); } } });
  if (scroll) post({t:'editing', id, scroll:true});
}
function openSiteEditor(){
  const snap = clone(cur.content.site);
  let t; const live = (k) => { markDirty(); if (k==='color') return post({t:'color', v:cur.content.site.color}); clearTimeout(t); t = setTimeout(()=>renderPreview(true), 500); };
  const body = document.createElement('div');
  body.appendChild(hEl(`<p class="dr-desc">병원명·연락처·진료시간처럼 홈페이지 여러 곳에 함께 쓰이는 정보입니다. 여기서 한 번 바꾸면 전체에 반영됩니다.</p>`));
  body.appendChild(buildForm([...SITE_FIELDS, ...(BLOCKDEFS[cur.theme].siteFields||[])], cur.content.site, 's/', live));
  openDrawer({ title:'기본 정보', sub:'병원 공통 정보', body,
    onSave: async () => { renderPreview(true); return await savePF(); },
    onCancel: () => { cur.content.site = snap; renderPreview(true); } });
}

/* ---------- 페이지 (메뉴별 개별 페이지) ---------- */
function pageOptionsHTML(content){
  const used = new Set(), groups = [];
  const pid = h => String(h||'').startsWith('p:') ? h.slice(2).split('#')[0] : null;
  const title = id => (content.pages.find(p=>p.id===id)||{}).title;
  groups.push(['', [['home', '🏠 홈 (첫 화면)']]]); used.add('home');
  (content.site.nav||[]).forEach(n => {
    const ids = [];
    [pid(n.href), ...(n.children||[]).map(c=>pid(c.href))].forEach(id => { if (id && title(id) && !used.has(id)){ used.add(id); ids.push(id); } });
    if (ids.length) groups.push([n.label, ids.map(id => [id, title(id)])]);
  });
  const rest = content.pages.filter(p => !used.has(p.id)).map(p => [p.id, p.title]);
  if (rest.length) groups.push(['메뉴에 없는 페이지', rest]);
  return groups.map(([g, items]) => (g ? `<optgroup label="${esc(g)}">` : '') + items.map(([v,l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('') + (g ? '</optgroup>' : '')).join('');
}
function drawPageSel(){
  if (!cur) return;
  $('#pgSel').innerHTML = pageOptionsHTML(cur.content); $('#pgSel').value = curPg().id;
  $('#barPage').textContent = '현재 페이지: ' + curPg().title;
}
function switchPage(pid, hash){
  if (!cur || !cur.content.pages.some(p=>p.id===pid)) return;
  if (drawer) closeDrawer(true);
  curPage = pid; drawPageSel(); renderPreview(false, hash);
}
$('#pgSel').onchange = () => switchPage($('#pgSel').value);

const PAGE_TPL = {
  treat: { label:'진료 소개 페이지', desc:'상단 배너 · 진료 설명 · 특징 · 치료 과정 · FAQ · 상담 배너',
    make: t => [['c_subhero',{t, en:'TREATMENT', d:t+' 진료를 소개합니다', crumb:'HOME  >  '+t}],['c_treat',{t, lab:'TREATMENT'}],['c_points',{t:t+', 이런 점이 다릅니다'}],['c_steps',{t:t+' 치료 과정'}],['c_faq',{t:t+' 자주 묻는 질문'}],['c_cta',{t:t+' 상담이 필요하신가요?'}]] },
  info: { label:'일반 소개 페이지', desc:'상단 배너 · 제목+글 · 큰 사진 · 상담 배너',
    make: t => [['c_subhero',{t, en:'ABOUT', d:'', crumb:'HOME  >  '+t}],['c_text',{t}],['c_img',{}],['c_cta',{}]] },
  blank: { label:'빈 페이지', desc:'상단 배너만 있는 페이지 (블록은 직접 추가)',
    make: t => [['c_subhero',{t, en:'PAGE', d:'', crumb:'HOME  >  '+t}]] }
};
const cleanSlug = v => String(v||'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
function uniqueSlug(base, pages, selfId){ let s = cleanSlug(base) || 'page', n = 2, b = s; while (s === 'index' || pages.some(p => p.id !== selfId && p.slug === s)) s = b + '-' + (n++); return s; }

function openPageManager(){
  if (!editOn) setEdit(true);
  const C = cur.content, snap = { pages: clone(C.pages), nav: clone(C.site.nav || []) }, curSnap = curPage;
  const body = document.createElement('div');
  const draw = () => {
    body.innerHTML = '';
    body.appendChild(hEl(`<p class="dr-desc">홈페이지의 <b>모든 페이지</b>입니다. 페이지 이름을 바꾸거나 순서를 바꾸고, 새 페이지를 만들 수 있습니다. 페이지를 상단 메뉴에 연결하려면 아래 <b>새 페이지 만들기</b>에서 메뉴 위치를 고르거나 <b>상단 메뉴 편집</b>을 사용하세요.</p>`));
    const lst = hEl(`<div class="pg-list"></div>`);
    C.pages.forEach((pg, i) => {
      const home = pg.id === 'home';
      const row = hEl(`<div class="pg-row${pg.id===curPage?' on':''}"><div class="pg-main"><input class="pg-t" value="${esc(pg.title)}" aria-label="페이지 이름"><div class="pg-slug">${home ? '<span>index.html (첫 화면)</span>' : `<input class="pg-s" value="${esc(pg.slug)}" aria-label="주소 이름"><span>.html</span>`}</div><small>블록 ${pg.blocks.length}개</small></div>
        <div class="pg-tools"><button type="button" class="dbtn sm" data-a="open">열기</button>${home?'':`<button type="button" class="dbtn sm" data-a="up" ${i<=1?'disabled':''}>↑</button><button type="button" class="dbtn sm" data-a="down" ${i===C.pages.length-1?'disabled':''}>↓</button><button type="button" class="dbtn sm" data-a="dup">복제</button><button type="button" class="dbtn sm danger" data-a="del">삭제</button>`}</div></div>`);
      row.querySelector('.pg-t').oninput = e => { pg.title = e.target.value; markDirty(); if (pg.id===curPage) $('#barPage').textContent = '현재 페이지: ' + pg.title; };
      const sl = row.querySelector('.pg-s'); if (sl) sl.onchange = e => { pg.slug = uniqueSlug(e.target.value, C.pages, pg.id); e.target.value = pg.slug; markDirty(); };
      row.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
        const a = b.dataset.a;
        if (a==='open'){ curPage = pg.id; drawPageSel(); renderPreview(false); draw(); return; }
        if (a==='up') [C.pages[i-1], C.pages[i]] = [C.pages[i], C.pages[i-1]];
        if (a==='down') [C.pages[i+1], C.pages[i]] = [C.pages[i], C.pages[i+1]];
        if (a==='dup'){ const cp = clone(pg); cp.id = 'pg-' + bid(); cp.title = pg.title + ' (복사본)'; cp.slug = uniqueSlug(pg.slug + '-copy', C.pages); cp.blocks.forEach(x => x.id = bid()); C.pages.splice(i+1, 0, cp); }
        if (a==='del'){
          if (!confirm(`'${pg.title}' 페이지를 삭제할까요?\n이 페이지로 연결된 메뉴도 함께 지워집니다.`)) return;
          C.pages.splice(i, 1);
          const hit = h => String(h||'').startsWith('p:' + pg.id);
          C.site.nav = (C.site.nav||[]).filter(n => !hit(n.href) || (n.children||[]).some(c=>!hit(c.href))).map(n => ({ ...n, children:(n.children||[]).filter(c => !hit(c.href)), href: hit(n.href) ? ((n.children||[]).find(c=>!hit(c.href))||{}).href || 'p:home' : n.href }));
          if (curPage === pg.id) curPage = 'home';
        }
        markDirty(); drawPageSel(); renderPreview(a!=='del'); draw();
      });
      lst.appendChild(row);
    });
    body.appendChild(lst);
    // 새 페이지
    const mains = (C.site.nav||[]).map((n,i)=>`<option value="${i}">'${esc(n.label)}' 메뉴의 소메뉴로</option>`).join('');
    const add = hEl(`<div class="dr-list pg-add"><div class="dr-list-head"><b>＋ 새 페이지 만들기</b></div><div class="dr-form">
      <div class="dr-field"><label>페이지 이름</label><input type="text" class="na-t" placeholder="예) 턱관절 치료"></div>
      <div class="dr-field"><label>주소 이름 (영문)</label><input type="text" class="na-s" placeholder="예) tmj  →  tmj.html"><small>영문 소문자·숫자·-(하이픈)만 사용합니다. 비워두면 자동으로 정합니다.</small></div>
      <div class="dr-field"><label>페이지 구성</label><select class="na-k">${Object.entries(PAGE_TPL).map(([k,t])=>`<option value="${k}">${t.label} — ${t.desc}</option>`).join('')}</select></div>
      <div class="dr-field"><label>상단 메뉴</label><select class="na-m"><option value="sub-last">맨 뒤 메뉴의 소메뉴로</option>${mains}<option value="main">새 메인 메뉴로 추가</option><option value="none">메뉴에 넣지 않음</option></select></div>
      <button type="button" class="dbtn add na-go">페이지 만들기</button></div></div>`);
    if (C.site.nav && C.site.nav.length){ const sel = add.querySelector('.na-m'); const idx = C.site.nav.findIndex(n=>/일반|진료과목/.test(n.label)); sel.value = idx >= 0 ? String(idx) : 'sub-last'; }
    add.querySelector('.na-go').onclick = () => {
      const t = add.querySelector('.na-t').value.trim(); if (!t) { add.querySelector('.na-t').focus(); return toast('페이지 이름을 입력하세요.'); }
      const slug = uniqueSlug(add.querySelector('.na-s').value || ('page-' + (C.pages.length)), C.pages);
      const pg = { id:'pg-' + bid(), slug, title:t, blocks: PAGE_TPL[add.querySelector('.na-k').value].make(t).map(([type,data]) => ({ id:bid(), type, hidden:false, data:{ ...newBlockData(cur.theme, type), ...data } })) };
      C.pages.push(pg);
      const m = add.querySelector('.na-m').value, item = { label:t, href:'p:' + pg.id, children:[] };
      C.site.nav = C.site.nav || [];
      if (m === 'main') C.site.nav.push(item);
      else if (m === 'sub-last'){ if (C.site.nav.length) C.site.nav[C.site.nav.length-1].children.push(item); else C.site.nav.push(item); }
      else if (m !== 'none') C.site.nav[+m].children.push(item);
      curPage = pg.id; markDirty(); drawPageSel(); renderPreview(false); draw();
      toast(`'${t}' 페이지를 만들었습니다. 화면에서 블록을 눌러 내용을 바꾸세요.`);
    };
    body.appendChild(add);
  };
  draw();
  openDrawer({ title:'페이지 관리', sub:`전체 ${C.pages.length}개 페이지 · 내려받으면 페이지마다 html 파일이 만들어집니다.`, body,
    onSave: async () => { drawPageSel(); renderPreview(true); return await savePF(); },
    onCancel: () => { C.pages = snap.pages; C.site.nav = snap.nav; curPage = C.pages.some(p=>p.id===curSnap) ? curSnap : 'home'; drawPageSel(); renderPreview(false); } });
}
$('#btnPages').onclick = openPageManager;

/* ---------- 상단 메뉴 편집 (메인 메뉴 + 소메뉴) ---------- */
const MENU_FIELDS = [
  F.list('nav','메인 메뉴','메인 메뉴',0,[
    F.text('label','메뉴 이름'),
    {key:'href', label:'연결할 곳', type:'target'},
    F.list('children','소메뉴','소메뉴',0,[F.text('label','소메뉴 이름'),{key:'href',label:'연결할 곳',type:'target'}],{max:12,fresh:()=>({label:'새 소메뉴',href:'#top'})})
  ],{max:10,fresh:()=>({label:'새 메뉴',href:'#top',children:[]})})
];
function openMenuEditor(addNew){
  if (!editOn) setEdit(true);
  const site = cur.content.site; if (!Array.isArray(site.nav)) site.nav = [];
  const snap = clone(site.nav);
  if (addNew && site.nav.length < 10) site.nav.push({ label:'새 메뉴', href:'#top', children:[] });
  let t; const live = () => { markDirty(); clearTimeout(t); t = setTimeout(()=>renderPreview(true), 450); };
  const body = document.createElement('div');
  body.appendChild(hEl(`<p class="dr-desc"><b>메인 메뉴</b>를 추가하고, 메뉴마다 <b>소메뉴</b>를 넣을 수 있습니다. 예) 진료과목 → 임플란트 · 치아교정 · 라미네이트<br>각 메뉴의 <b>연결할 곳</b>에서 이동할 <b>페이지(📄)</b>나 페이지 안의 섹션, 외부 링크를 고르세요. 새 진료 페이지가 필요하면 상단의 <b>📄 페이지 관리 → 새 페이지 만들기</b>를 사용하세요.</p>`));
  const form = buildForm(MENU_FIELDS, site, 's/', live);
  body.appendChild(form);
  if (addNew){ const its = form.querySelectorAll(':scope .dr-list > .items > .it'); const last = its[its.length-1]; if (last) last.querySelector('.it-tg').click(); live(); }
  openDrawer({ title:'상단 메뉴 편집', sub:'메뉴에 마우스를 올리면 소메뉴가 펼쳐집니다. 모바일에서는 들여쓰기 목록으로 보입니다.', body,
    onSave: async () => { renderPreview(true); return await savePF(); },
    onCancel: () => { site.nav = snap; renderPreview(true); } });
}
function targetOptions(){
  const T = BLOCKDEFS[cur.theme];
  const clean = v => typeof v === 'string' && v && !/^(asset:|https?:|data:|#)/.test(v) && !/^(left|right)$/.test(v) ? v.split('\n')[0].slice(0,40) : '';
  const firstText = d => {
    const keys = Object.keys(d);
    const pick = keys.find(k => k === 't' && clean(d[k])) || keys.find(k => /(^title$|_t$|h1$|_n$|^sig_name$)/.test(k) && clean(d[k]));
    if (pick) return clean(d[pick]);
    const arr = Object.values(d).find(v => Array.isArray(v) && v[0]); if (arr){ const x = arr[0]; const v = clean(x.t) || clean(x.n) || clean(x.label); if (v) return v; }
    for (const v of Object.values(d)) if (clean(v)) return clean(v);
    return ''; };
  const opts = [];
  cur.content.pages.forEach(pg => {
    opts.push(['p:'+pg.id, `📄 ${pg.title}${pg.id==='home'?' (첫 화면)':''}`]);
    pg.blocks.forEach((b,i) => {
      const lab = (T.blocks[b.type]||{}).label || b.type, ft = firstText(Object.fromEntries(Object.entries(b.data).filter(([k])=>k!=='menu')));
      opts.push(['p:'+pg.id+'#b-'+b.id, `　　└ ${lab}${ft ? ' — ' + ft : ''}${b.hidden ? ' (숨김)' : ''}`]);
    });
  });
  return opts;
}

/* ---------- 폼 빌더 ---------- */
function buildForm(fields, data, prefix, onChange){
  const wrap = document.createElement('div'); wrap.className = 'dr-form';
  fields.forEach(f => wrap.appendChild(buildField(f, data, prefix, onChange)));
  return wrap;
}
function buildField(f, data, prefix, onChange){
  const path = prefix + f.key, val = getp(data, f.key), id = 'f' + Math.random().toString(36).slice(2,8);
  const write = v => { setp(data, f.key, v); onChange && onChange(f.key); };
  let el;
  if (f.type === 'text' || f.type === 'textarea'){
    el = hEl(`<div class="dr-field" data-path="${esc(path)}"><label for="${id}">${esc(f.label)}</label>${f.type==='text'?`<input id="${id}" type="text">`:`<textarea id="${id}" rows="${f.rows || Math.min(8, Math.max(3, String(val||'').split('\n').length+1))}"></textarea>`}${f.hint?`<small>${esc(f.hint)}</small>`:''}</div>`);
    const inp = el.querySelector('input,textarea'); inp.value = val ?? ''; inp.oninput = e => write(e.target.value);
  } else if (f.type === 'color'){
    el = hEl(`<div class="dr-field" data-path="${esc(path)}"><label>${esc(f.label)}</label><div class="crow"><input type="color" value="${esc(val)}"><input type="text" value="${esc(val)}"></div></div>`);
    const [c, tx] = el.querySelectorAll('input');
    c.oninput = () => { tx.value = c.value; write(c.value); };
    tx.oninput = () => { if (/^#[0-9a-f]{6}$/i.test(tx.value)){ c.value = tx.value; write(tx.value); } };
  } else if (f.type === 'select'){
    el = hEl(`<div class="dr-field" data-path="${esc(path)}"><label for="${id}">${esc(f.label)}</label><select id="${id}">${f.options.map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join('')}</select></div>`);
    const s = el.querySelector('select'); s.value = val || f.options[0][0]; s.onchange = () => write(s.value);
  } else if (f.type === 'target'){
    const opts = targetOptions(), v = (!val || val==='#top') ? 'p:home' : val, known = opts.some(o=>o[0]===v);
    el = hEl(`<div class="dr-field" data-path="${esc(path)}"><label for="${id}">${esc(f.label)}</label><select id="${id}">${opts.map(([o,l])=>`<option value="${esc(o)}">${esc(l)}</option>`).join('')}<option value="__url">외부 링크 직접 입력 (예: 네이버 예약, 블로그)</option></select><input type="text" placeholder="https://" style="margin-top:6px"></div>`);
    const sel = el.querySelector('select'), url = el.querySelector('input');
    sel.value = known ? v : '__url'; url.value = known ? '' : v; url.hidden = known;
    sel.onchange = () => { if (sel.value === '__url'){ url.hidden = false; url.focus(); write(url.value || ''); } else { url.hidden = true; write(sel.value); } };
    url.oninput = () => write(url.value.trim());
  } else if (f.type === 'image'){
    el = hEl(`<div class="dr-field" data-path="${esc(path)}" data-kind="image"><label>${esc(f.label)}</label><div class="img-row"><div class="thumb">${val?`<img src="${toSrc(val)}" alt="">`:'<span>사진 없음</span>'}</div><div class="img-btns"><button type="button" class="dbtn" data-up>사진 변경</button><button type="button" class="dbtn ghost" data-rm>사진 삭제</button><small>사진은 자동으로 최적화되어 저장됩니다.</small></div></div></div>`);
    const th = el.querySelector('.thumb');
    const setImg = v => { write(v); th.innerHTML = v ? `<img src="${toSrc(v)}" alt="">` : '<span>사진 없음</span>'; };
    el.querySelector('[data-up]').onclick = () => pickImage(url => setImg(url));
    el.querySelector('[data-rm]').onclick = () => { if (confirm('이 사진을 비울까요?')) setImg(''); };
  } else if (f.type === 'list'){
    el = buildList(f, data, prefix, onChange);
  } else { el = document.createElement('div'); }
  return el;
}
function buildList(f, data, prefix, onChange){
  if (!Array.isArray(data[f.key])) data[f.key] = [];
  const arr = data[f.key], max = f.max || 12;
  const el = hEl(`<div class="dr-list"><div class="dr-list-head"><b>${esc(f.label)}</b><span class="cnt"></span></div><div class="items"></div><button type="button" class="dbtn add">＋ ${esc(f.itemLabel)} 추가</button></div>`);
  const items = el.querySelector('.items'); let open = -1;
  const summary = it => { const k = f.item.find(x=>x.type==='text'||x.type==='textarea'); const sub = Array.isArray(it.children) && it.children.length ? `  (소메뉴 ${it.children.length}개)` : ''; return k ? String(it[k.key]||'').split('\n')[0] + sub : ''; };
  const thumbOf = it => { const k = f.item.find(x=>x.type==='image'); return k && it[k.key] ? toSrc(it[k.key]) : ''; };
  const draw = () => {
    el.querySelector('.cnt').textContent = `${arr.length}개`;
    el.querySelector('.add').disabled = arr.length >= max;
    items.innerHTML = '';
    arr.forEach((it, n) => {
      const row = hEl(`<div class="it${open===n?' open':''}"><div class="it-head"><button type="button" class="it-tg">${thumbOf(it)?`<img src="${thumbOf(it)}" alt="">`:''}<span>${n+1}. ${esc(summary(it) || f.itemLabel)}</span></button><div class="it-tools"><button type="button" class="dbtn sm" data-m="-1" ${n===0?'disabled':''}>↑</button><button type="button" class="dbtn sm" data-m="1" ${n===arr.length-1?'disabled':''}>↓</button><button type="button" class="dbtn sm danger" data-del>삭제</button></div></div></div>`);
      row.querySelector('.it-tg').onclick = () => { open = open===n ? -1 : n; draw(); };
      row.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { const m = +b.dataset.m; [arr[n], arr[n+m]] = [arr[n+m], arr[n]]; open = n+m; draw(); onChange(); });
      row.querySelector('[data-del]').onclick = () => { if (!confirm(`${n+1}번 ${f.itemLabel}을(를) 삭제할까요?`)) return; arr.splice(n,1); open = -1; draw(); onChange(); };
      if (open === n){
        const bd = document.createElement('div'); bd.className = 'it-body';
        f.item.forEach(x => bd.appendChild(buildField(x, it, `${prefix}${f.key}/${n}/`, () => { onChange(); const s = row.querySelector('.it-tg span'); if (s) s.textContent = `${n+1}. ${summary(it) || f.itemLabel}`; })));
        row.appendChild(bd);
      }
      items.appendChild(row);
    });
  };
  el.querySelector('.add').onclick = () => {
    if (arr.length >= max) return;
    const tpl = f.fresh ? f.fresh() : arr.length ? clone(arr[arr.length-1]) : Object.fromEntries(f.item.map(x=>[x.key, x.type==='list' ? [] : x.dflt ? x.dflt(0) : (x.def ?? '')]));
    arr.push(tpl); open = arr.length-1; draw(); onChange();
  };
  draw();
  return el;
}

/* ---------- 사진 고르기 → 최적화 → Supabase Storage 업로드 ---------- */
let pickCb = null;
function pickImage(cb){ pickCb = cb; $('#file').value=''; $('#file').click(); }
$('#file').addEventListener('change', async ()=>{
  const f = $('#file').files[0], cb = pickCb; pickCb = null; if(!f || !cb) return;
  if (!f.type.startsWith('image/')) return toast('사진 파일만 올릴 수 있습니다.');
  toast('사진을 최적화해서 올리는 중…');
  try {
    const blob = await shrinkBlob(f, 1920, .82);
    const ext = blob.type==='image/webp' ? 'webp' : blob.type==='image/png' ? 'png' : 'jpg';
    const path = `${cur.id}/img-${Date.now()}-${Math.random().toString(36).slice(2,6)}.${ext}`;
    const { error } = await sb.storage.from(HP_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl:'31536000', upsert:false });
    if (error) throw error;
    const url = sb.storage.from(HP_BUCKET).getPublicUrl(path).data.publicUrl;
    await cb(url);
    toast('사진을 교체했습니다.');
  } catch(e){ console.error(e); toast('사진 업로드 실패: '+(e.message||e)); }
});
async function shrinkBlob(file, max, q){ const d = await shrink(file, max, q); const r = await fetch(d); return r.blob(); }
function shrink(file, max, q){
  return new Promise((res,rej)=>{ const img=new Image(); const url=URL.createObjectURL(file);
    img.onload=()=>{ let {width:w,height:h}=img; const s=Math.min(1,max/Math.max(w,h)); w=Math.round(w*s); h=Math.round(h*s);
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h; cv.getContext('2d').drawImage(img,0,0,w,h);
      let out=cv.toDataURL('image/webp',q); if(!out.startsWith('data:image/webp')) out=/png|svg|gif/.test(file.type)?cv.toDataURL('image/png'):cv.toDataURL('image/jpeg',q);
      URL.revokeObjectURL(url); res(out); };
    img.onerror=rej; img.src=url; });
}

/* ---------- 저장 ① 포트폴리오에 저장 ---------- */
function markDirty(){ dirty=true; updDirty(); }
function updDirty(){ $('#dirty').hidden=!dirty; $('#barSave').classList.toggle('pulse', dirty); }
/* 저장 전 로그인 상태 확인 + 임시 보관(저장 실패 시 수정 내용이 사라지지 않도록) */
let ME = null;
const DRAFT = id => 'hp_draft_' + id;
function keepDraft(p){ try { localStorage.setItem(DRAFT(p.id), JSON.stringify({ at:now(), pf:p })); } catch(e){} }
function dropDraft(id){ try { localStorage.removeItem(DRAFT(id)); } catch(e){} }
async function checkLogin(){
  let { data:{ session } } = await sb.auth.getSession();
  if (!session || (ME && session.user.id !== ME.id)){ try { await sb.auth.refreshSession(); } catch(e){} ({ data:{ session } } = await sb.auth.getSession()); }
  if (!session) return '로그인이 만료되었습니다.';
  if (ME && session.user.id !== ME.id) return `이 브라우저의 로그인 계정이 바뀌었습니다 (현재: ${session.user.email || '다른 계정'}). 다른 탭에서 다른 계정으로 로그인하면 이 화면의 로그인도 함께 바뀝니다.`;
  try { const r = await sb.rpc('hp_is_admin'); if (r.data === false) return '현재 로그인한 계정에 관리자 권한이 확인되지 않습니다.'; } catch(e){}
  return '';
}
function loginLost(why){
  dirty = false; updDirty();
  if (confirm(`저장하지 못했습니다.\n\n${why}\n\n수정한 내용은 이 브라우저에 임시 보관했습니다. 관리자 계정(${ME && ME.email || ''})으로 다시 로그인한 뒤 스튜디오를 열면 그대로 복구할 수 있습니다.\n\n지금 로그인 화면으로 이동할까요?`)){ location.href = 'index.html'; }
}
async function savePF(quiet){
  cur.updated = now();
  keepDraft(clone(cur));
  const why = await checkLogin();
  if (why){ loginLost(why); return false; }
  try { await DB.put(clone(cur)); }
  catch(e){
    const rls = /row-level security|permission denied|42501|JWT/i.test((e.message||'') + (e.code||''));
    if (rls){ const w2 = await checkLogin(); loginLost(w2 || '로그인 권한이 확인되지 않아 저장이 거부되었습니다. 다시 로그인해 주세요.'); return false; }
    toast('저장 실패: '+(e.message||e)+' (수정 내용은 임시 보관됨)'); return false;
  }
  dropDraft(cur.id);
  dirty=false; updDirty(); list = await DB.all(); if (!quiet) toast('포트폴리오에 저장했습니다 ✔'); return true;
}
async function restoreDrafts(all){
  for (const p of all){
    let d = null; try { d = JSON.parse(localStorage.getItem(DRAFT(p.id)) || 'null'); } catch(e){}
    if (!d || !d.pf) continue;
    if (new Date(d.at) <= new Date(p.updated)){ dropDraft(p.id); continue; }
    if (confirm(`[${p.title}] 저장하지 못한 수정 내용이 있습니다 (${fdate(d.at)}).\n지금 복구해서 저장할까요?\n(취소하면 임시 보관본을 지웁니다)`)){
      d.pf.updated = now();
      try { await DB.put(d.pf); dropDraft(p.id); toast('수정 내용을 복구해 저장했습니다 ✔'); } catch(e){ toast('복구 저장 실패: '+(e.message||e)); }
    } else dropDraft(p.id);
  }
}
$('#barSave').onclick = () => savePF();

/* ---------- 저장 ② 홈페이지 파일 다운로드 (ZIP) ---------- */
function dataToBytes(d){
  if (d.startsWith('data:image/svg+xml;charset=utf-8,')) return new TextEncoder().encode(decodeURIComponent(d.split(',')[1]));
  const b = atob(d.split(',')[1]); const u = new Uint8Array(b.length); for(let i=0;i<b.length;i++) u[i]=b.charCodeAt(i); return u;
}
const aslug = s => ((s||'').normalize('NFKD').replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || 'clinic');
async function exportZip(){
  const site = cur.content.site;
  if (!site.email) { if(!confirm('문의 수신 이메일이 비어 있습니다.\n이대로 내보내면 상담 신청서가 작동하지 않습니다.\n\n그래도 다운로드할까요? (하단 [기본 정보]에서 입력할 수 있습니다)')) return; }
  if (dirty && !(await savePF(true))) return;
  toast('홈페이지 파일을 만드는 중…');
  const files = {};
  const zip = new JSZip(); const root = zip.folder('homepage');
  cur.content.pages.forEach(pg => root.file((pg.id==='home' ? 'index' : pg.slug) + '.html', renderSite(cur.content, cur.theme, 'export', files, { page:pg.id })));
  try {
    for (const [name, data] of Object.entries(files)){
      if (typeof data === 'string') root.file(name, dataToBytes(data));
      else { const r = await fetch(data.url); if(!r.ok) throw new Error(name+' 사진을 불러오지 못했습니다'); root.file(name, await r.arrayBuffer()); }
    }
  } catch(e){ return toast('다운로드 실패: '+e.message); }
  root.file('deploy-guide.html', guidePage(site));
  root.file('README.txt', '\ufeff'+readme(site));
  root.file('portfolio-backup.json', JSON.stringify(cur));
  const blob = await zip.generateAsync({type:'blob', compression:'DEFLATE'});
  const d = new Date(); const ds = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  download(blob, `${aslug(site.nameEn)}_homepage_${ds}.zip`);
  toast('홈페이지 파일을 다운로드했습니다. 배포 방법은 압축파일 안의 [deploy-guide.html]을 보세요.');
}
$('#barZip').onclick = exportZip;
function download(blob, name){ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000); }
function readme(c){
  return `${c.name} 홈페이지 파일\r\n========================\r\n\r\n[폴더 구성]\r\n- index.html : 홈페이지 본문 (이 파일이 첫 화면입니다)\r\n- images/ : 홈페이지에 쓰인 사진\r\n- deploy-guide.html : 인터넷에 올리는 방법 (더블클릭해서 보세요)\r\n- portfolio-backup.json : 스튜디오에서 다시 불러와 수정할 때 쓰는 백업 파일\r\n\r\n[가장 빠른 배포]\r\n1) zip을 압축 해제하면 나오는 homepage 폴더를 사용합니다.\r\n2) Cloudflare 로그인 > Workers & Pages > 만들기 > Pages > 에셋 업로드(Direct Upload)\r\n3) 프로젝트 이름(영문) 입력 > 이 폴더를 끌어다 놓기 > 배포\r\n4) 자세한 내용은 deploy-guide.html 참고\r\n`;
}

/* ---------- 미리보기 (영업용: 완성된 홈페이지 모습) ---------- */
let pvItem = null, pvPage = 'home';
function previewSiteHTML(content, theme, page){
  return renderSite(content, theme, 'edit', {}, { page: page || 'home', head:'<script>window.__EDIT=false<\/script>', tail:`<script>${PREVIEW_RUNTIME}<\/script>` });
}
function openPreview(item){
  // item: 목록의 포트폴리오(저장본) 또는 편집 중인 cur(수정 중 내용 포함)
  pvItem = item;
  const content = item === cur ? cur.content : migrateContent(item.theme, clone(item.content || {}));
  pvItem = { ...item, content }; pvPage = item === cur ? curPage : 'home';
  $('#pvPg').innerHTML = pageOptionsHTML(content); $('#pvPg').value = pvPage;
  $('#pvTitle').textContent = item.title;
  $('#pvSub').textContent = (item === cur && dirty) ? '저장 전 수정 내용까지 반영된 미리보기입니다.' : '완성된 홈페이지 모습입니다. 메뉴·슬라이드·버튼이 실제처럼 동작합니다.';
  pvShow(pvPage);
  setPvDev($('#pvModal').dataset.dev || 'pc');
  $('#pvModal').classList.add('on'); document.body.classList.add('pv-open');
}
function closePreview(){ $('#pvModal').classList.remove('on'); document.body.classList.remove('pv-open'); $('#pvFrame').srcdoc = ''; pvItem = null; }
function setPvDev(d){ $('#pvModal').dataset.dev = d; $$('#pvDevs button').forEach(b=>b.classList.toggle('on', b.dataset.d===d)); }
$('#pvDevs').addEventListener('click', e=>{ const b=e.target.closest('[data-d]'); if(b) setPvDev(b.dataset.d); });
$('#pvClose').onclick = closePreview;
function pvShow(pid, hash){
  pvPage = pid; $('#pvPg').value = pid;
  const fr = $('#pvFrame');
  fr.onload = () => { if (hash) try { const el = fr.contentDocument.getElementById(hash); el && el.scrollIntoView(); } catch(e){} };
  fr.srcdoc = previewSiteHTML(pvItem.content, pvItem.theme, pid);
}
$('#pvPg').onchange = () => pvShow($('#pvPg').value);
const winHTML = (content, theme, pid) => renderSite(content, theme, 'edit', {}, { page:pid, head:`<base href="${location.href.replace(/[^/]*$/,'')}"><script>window.__EDIT=false<\/script>`, tail:`<script>${PREVIEW_RUNTIME}<\/script>` });
window.__pvGo = (w, pid, hash) => { const it = w.__pvItem || pvItem; if (!it) return; w.document.open(); w.document.write(winHTML(it.content, it.theme, pid)); w.document.close(); w.__pvItem = it; if (hash) setTimeout(()=>{ const el = w.document.getElementById(hash); el && el.scrollIntoView(); }, 300); };
$('#pvNew').onclick = ()=>{ if(!pvItem) return; const it = { content: clone(pvItem.content), theme: pvItem.theme };
  const w=window.open('','_blank'); if(!w) return toast('팝업이 차단되었습니다.'); w.__pvItem = it; window.__pvGo(w, pvPage); };
$('#pvShare').onclick = ()=>{ if(pvItem) openShare(pvItem); };
$('#btnPreview').onclick = ()=>{ if(cur) openPreview(cur); };

/* ---------- 공유 링크 (로그인 없이 원장님이 볼 수 있는 주소) ---------- */
const shareUrl = tok => location.href.replace(/[^/]*$/, '') + 'hp-view.html?p=' + encodeURIComponent(tok);
const newToken = () => { const a = new Uint8Array(16); crypto.getRandomValues(a); return [...a].map(x=>x.toString(36).padStart(2,'0')).join('').slice(0,24); };
let shareItem = null;
function drawShare(){
  const p = shareItem, on = !!(p.share_on && p.share_token);
  $('#shTitle').textContent = p.title;
  $('#shOn').hidden = !on; $('#shOff').hidden = on;
  if (on) $('#shUrl').value = shareUrl(p.share_token);
  $('#shNote').hidden = !(cur && cur.id === p.id && dirty);
}
function openShare(p){ shareItem = p; drawShare(); $('#shareModal').classList.add('on'); }
async function setShare(on, regen){
  const p = shareItem;
  if (on && (!p.share_token || regen)) p.share_token = newToken();
  p.share_on = on;
  const row = list.find(x=>x.id===p.id);
  const target = (cur && cur.id === p.id) ? cur : row;
  if (target && target !== p){ target.share_token = p.share_token; target.share_on = p.share_on; }
  try {
    const { error } = await sb.from('hp_portfolios').update({ share_token:p.share_token, share_on:p.share_on }).eq('id', p.id);
    if (error) throw error;
  } catch(e){ toast('공유 설정 실패: '+(e.message||e)+' — hp_studio_v2.sql 을 실행했는지 확인하세요.'); return; }
  if (row){ row.share_token = p.share_token; row.share_on = p.share_on; }
  drawShare(); if (document.body.dataset.view==='list') drawList();
  toast(on ? (regen ? '새 링크를 만들었습니다. 예전 링크는 더 이상 열리지 않습니다.' : '공유 링크를 만들었습니다.') : '공유를 껐습니다. 링크로 더 이상 볼 수 없습니다.');
}
$('#shCreate').onclick = ()=>setShare(true);
$('#shStop').onclick = ()=>{ if(confirm('공유를 끌까요? 보낸 링크로 더 이상 볼 수 없습니다.')) setShare(false); };
$('#shRegen').onclick = ()=>{ if(confirm('링크를 새로 만들까요? 예전에 보낸 링크는 더 이상 열리지 않습니다.')) setShare(true, true); };
$('#shCopy').onclick = async ()=>{ const u=$('#shUrl').value; try{ await navigator.clipboard.writeText(u); toast('링크를 복사했습니다. 카카오톡·문자에 붙여넣어 보내세요.'); }catch(e){ $('#shUrl').select(); document.execCommand('copy'); toast('링크를 복사했습니다.'); } };
$('#shOpen').onclick = ()=>window.open($('#shUrl').value, '_blank');
$('#shSave').onclick = async ()=>{ if (await savePF()) drawShare(); };
$('#btnShare').onclick = ()=>{ if(cur) openShare(cur); };

/* ---------- 하단 관리자 바 / 상단 ---------- */
function setDevice(d){ device=d; $('#stage').dataset.dev=d; $$('#devs button').forEach(b=>b.classList.toggle('on',b.dataset.d===d)); }
$('#devs').addEventListener('click', e=>{ const b=e.target.closest('[data-d]'); if(b) setDevice(b.dataset.d); });
function setEdit(on){ editOn = on; $('#editSw').checked = on; document.body.classList.toggle('edit-off', !on); if (!on) closeDrawer(true); renderPreview(true); }
$('#editSw').onchange = e => setEdit(e.target.checked);
$('#barSite').onclick = () => { if (!editOn) setEdit(true); openSiteEditor(); };
$('#btnBack').onclick = ()=>{ if(dirty && !confirm('저장하지 않은 수정 내용이 있습니다.\n저장하지 않고 목록으로 갈까요?')) return; closeDrawer(true); cur=null; show('list'); renderList(); };
$('#btnTitle').onclick = ()=>{ const n=prompt('포트폴리오 이름', cur.title); if(!n) return; cur.title=n.trim(); $('#edTitle').textContent=cur.title; $('#barPage').textContent='현재: '+cur.title; markDirty(); };
$('#btnReset').onclick = ()=>{ if(!confirm('이 포트폴리오를 기본 샘플 내용으로 되돌릴까요?\n(블록·사진·문구 수정 내용이 모두 사라집니다. 저장 전까지는 목록으로 나가면 취소됩니다)')) return; closeDrawer(true); const sd = cur.content.site && cur.content.site._seed, sb = sd && SEED.find(x => x.once === sd && x.build); cur.content = sb ? sb.build() : defaultContent(cur.theme); curPage = 'home'; drawPageSel(); markDirty(); renderPreview(); };
window.addEventListener('beforeunload', e=>{ if(dirty){ e.preventDefault(); e.returnValue=''; } });
document.addEventListener('keydown', e=>{ if((e.ctrlKey||e.metaKey)&&e.key==='s'&&cur){ e.preventDefault(); savePF(); } if(e.key==='Escape'){ if($('#pvModal').classList.contains('on')) closePreview(); $$('.modal.on').forEach(m=>m.classList.remove('on')); } });

/* ---------- 백업 / 불러오기 ---------- */
$('#btnBackup').onclick = async ()=>{ const all=await DB.all(); download(new Blob([JSON.stringify({app:'d2-hp-studio',v:2,at:now(),items:all})],{type:'application/json'}), `D2-HP-Studio_backup_${new Date().toISOString().slice(0,10)}.json`); toast('전체 백업 파일을 다운로드했습니다.'); };
$('#btnRestore').onclick = ()=>{ $('#jfile').value=''; $('#jfile').click(); };
$('#jfile').addEventListener('change', async ()=>{
  const f=$('#jfile').files[0]; if(!f) return;
  try{
    const j = JSON.parse(await f.text());
    const items = j.items ? j.items : (j.content && j.theme ? [j] : null);
    if(!items) throw new Error('형식이 맞지 않습니다');
    const cur_ = await DB.all(); let added=0;
    for (const it of items){
      if (!THEMES[it.theme]) continue;
      const ex = cur_.find(x=>x.id===it.id);
      if (!ex) added++;
      await DB.put({...it, id: /^[0-9a-f-]{36}$/i.test(it.id)?it.id:uid(), order: ex?ex.order:(cur_.length+added)});
    }
    toast(`불러오기 완료 (${items.length}개 확인)`); renderList();
  }catch(e){ toast('불러오기 실패: '+e.message); }
});

function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('on'),3400); }
$$('.tabs button').forEach(b=>b.onclick=()=>{ if(document.body.dataset.view==='editor' && dirty && !confirm('저장하지 않은 수정 내용이 있습니다. 이동할까요?')) return; if(b.dataset.v==='list'){cur=null;renderList();} show(b.dataset.v); });
async function safe(fn){ try { await fn(); return true; } catch(e){ console.error(e); toast('처리 실패: '+(e.message||e)); return false; } }

$('#q').addEventListener('input', drawList);

/* ---------- 시작: 관리자만 입장 ---------- */
(async ()=>{
  $('#guideBody').innerHTML = guideInner(null);
  const profile = await sbGetMyProfile();
  if (!profile){ location.href='index.html'; return; }
  if (profile.role !== 'admin'){ alert('관리자 전용 화면입니다.'); location.href='index.html'; return; }
  if (!profile.is_active){ alert('관리자에 의해 계정 사용이 정지되었습니다.'); await sb.auth.signOut(); location.href='index.html'; return; }
  $('#who').textContent = profile.email || ''; ME = { id:profile.id, email:profile.email };
  sb.auth.onAuthStateChange((ev, session) => { if (ME && session && session.user.id !== ME.id) toast('⚠ 다른 탭에서 다른 계정으로 로그인되었습니다. 저장하려면 관리자 계정으로 다시 로그인해야 합니다.'); if (ev === 'SIGNED_OUT') toast('⚠ 로그아웃되었습니다. 저장 전에 다시 로그인해 주세요.'); });
  let all;
  try { all = await DB.all(); }
  catch(e){
    $('#grid').innerHTML = `<div class="err"><b>홈페이지 스튜디오 데이터베이스가 아직 준비되지 않았습니다.</b><br><br>Supabase → SQL Editor 에서 <code>hp_studio.sql</code> 내용을 붙여넣고 [Run]을 한 번 실행해 주세요.<br><small>(오류: ${esc(e.message||String(e))})</small></div>`;
    show('list'); return;
  }
  if (!all.length){ for (const [i,s] of SEED.entries()) await DB.put(newPF(s.theme, s.title, i, s.build && s.build())); }
  else {
    // 새로 추가된 샘플 디자인(예: 06 밸런스 스타일)을 기존 목록에 한 번만 추가
    for (const s of SEED.filter(x => x.once)){
      const flag = 'hp_seed_' + s.once;
      let done = false; try { done = !!localStorage.getItem(flag); } catch(e){}
      const has = all.some(p => s.build ? (p.content && p.content.site && p.content.site._seed === s.once) || p.title === s.title : p.theme === s.theme && !(p.content && p.content.site && p.content.site._seed));
      if (!done && !has){ await DB.put(newPF(s.theme, s.title, all.length, s.build && s.build())); all.push({theme:s.theme, title:s.title}); }
      try { localStorage.setItem(flag, '1'); } catch(e){}
    }
  }
  // 샘플 새 버전 안내 (예: 07 e-스타치과 v2) — 기존 내용은 복사본으로 보관 후 교체
  for (const s of SEED.filter(x => x.once && x.ver && x.build)){
    const flag = 'hp_seedver_' + s.once + '_' + s.ver; let done = false; try { done = !!localStorage.getItem(flag); } catch(e){}
    if (done) continue;
    const olds = all.filter(p => p.id && p.content && p.content.site && p.content.site._seed === s.once && (p.content.site._seedVer || 1) < s.ver && !/\(이전 버전\)/.test(p.title || ''));
    for (const p of olds){
      if (!confirm(`[${p.title}] 샘플이 새 버전으로 업데이트되었습니다.\n(${s.note || '새 사진과 내용 반영'})\n\n지금 적용할까요?\n지금까지 수정한 내용은 '(이전 버전)' 복사본으로 따로 보관됩니다.`)) continue;
      try {
        const bak = clone(p); bak.id = uid(); bak.title = p.title + ' (이전 버전)'; bak.share_token = null; bak.share_on = false; bak.order = Math.max(...all.filter(x=>x.id).map(x=>x.order||0)) + 1; bak.created = bak.updated = now(); if (bak.content && bak.content.site) bak.content.site._seed = s.once + '-backup';
        await DB.put(bak);
        const nw = clone(p); nw.content = s.build(); if (s.theme) nw.theme = s.theme; if (s.title && (p.title||'').slice(0,10) === s.title.slice(0,10)) nw.title = s.title; nw.updated = now(); await DB.put(nw);
        toast('새 버전을 적용했습니다 ✔ (이전 내용은 복사본으로 보관)');
      } catch(e){ toast('새 버전 적용 실패: '+(e.message||e)); }
    }
    try { localStorage.setItem(flag, '1'); } catch(e){}
  }
  // 내용은 그대로 두고 빠진 항목만 채우는 가벼운 보정 (e-스타 07: 밝은 배경용 컬러 로고)
  for (const p of all.filter(p => p.id && p.content && p.content.site && p.content.site._seed === 'estar' && !p.content.site.logoLight)){
    try { p.content.site.logoLight = 'asset:estar/logoC'; p.updated = now(); await DB.put(clone(p)); } catch(e){}
  }
  // 가격 · 이벤트 문구 정리 (의료광고 기준): 저장된 e-스타 포트폴리오에도 적용 — 다른 수정 내용은 그대로 유지
  if (typeof ES_PRICE_FIX !== 'undefined') for (const p of all.filter(p => p.id && p.content && p.content.site && /^estar/.test(p.content.site._seed || '') && !p.content.site._fixPrice)){
    try {
      let j = JSON.stringify(p.content);
      for (const [a, b] of ES_PRICE_FIX) j = j.split(JSON.stringify(a).slice(1, -1)).join(JSON.stringify(b).slice(1, -1));
      j = j.split('"tg":"이벤트"').join('"tg":"안내"').replace(/\s*\(?부가세\s*별도\)?/g, '').replace(/\s*1?\s*치아당?\s*\d+\s*만\s*원/g, '');
      const c = JSON.parse(j); c.site._fixPrice = 1; p.content = c; p.updated = now(); await DB.put(clone(p));
      const left = (j.match(/\d+\s*만\s*원|이벤트|할인|특가/g) || []).length;
      toast(left ? `[${p.title}] 가격·이벤트 문구를 정리했습니다. 직접 쓰신 문구 중 ${left}곳은 확인이 필요합니다.` : `[${p.title}] 가격·이벤트 문구를 정리했습니다 ✔`);
    } catch(e){}
  }
  // e-스타 07: 원본과 같은 모양의 고화질 로고로 교체 (다른 내용은 유지)
  for (const p of all.filter(p => p.id && p.content && p.content.site && /^estar/.test(p.content.site._seed || '') && /estar\/(lgW|lgC|logoW|logoC)$/.test((p.content.site.logo||'') + '|' ) === false && ['asset:estar/lgW','asset:estar/logoW'].includes(p.content.site.logo))){
    try { p.content.site.logo = 'asset:estar/eLogoW'; p.content.site.logoLight = 'asset:estar/eLogoC'; p.content.site.logoTone = ''; p.updated = now(); await DB.put(clone(p)); } catch(e){}
  }
  // e-스타 07: 메인을 풀스크린 영상으로 (기존 롤링 배너는 숨김으로 보관, 다른 내용 유지)
  if (typeof ES_VIDEO !== 'undefined') for (const p of all.filter(p => p.id && p.theme === 'luxe' && p.content && p.content.site && p.content.site._seed === 'estar' && !p.content.site._video)){
    try { const h = p.content.pages[0]; if (!h.blocks.some(b => b.type === 'lvideo')) h.blocks.unshift(({ id: bid(), type:'lvideo', hidden:false, data: ES_VIDEO() }));
      h.blocks.forEach(b => { if (b.type === 'lhero') b.hidden = true; }); p.content.site._video = 1; p.updated = now(); await DB.put(clone(p)); } catch(e){}
  }
  // e-스타 07: 온라인 상담 목록을 8개로 (롤링 효과용, 직접 고친 목록은 유지)
  if (typeof estarLuxe === 'function') for (const p of all.filter(p => p.id && p.theme === 'luxe' && p.content && p.content.site && p.content.site._seed === 'estar' && !p.content.site._qs8)){
    try { const ib = p.content.pages[0].blocks.find(b => b.type === 'info'); const src = estarLuxe().pages[0].blocks.find(b => b.type === 'info');
      if (ib && src && (ib.data.qs || []).length <= 4 && (ib.data.qs || [])[0] && ib.data.qs[0].q === '무삭제 라미네이트 상담 문의') ib.data.qs = src.data.qs;
      p.content.site._qs8 = 1; p.updated = now(); await DB.put(clone(p)); } catch(e){}
  }
  // e-스타 07: 오시는 길 약도
  for (const p of all.filter(p => p.id && p.content && p.content.site && p.content.site._seed === 'estar' && !p.content.site._map1)){
    try { if (!p.content.site.mapImg) p.content.site.mapImg = 'asset:estar/mapIllust3'; p.content.site._map1 = 1; p.updated = now(); await DB.put(clone(p)); } catch(e){}
  }
  for (const p of all.filter(p => p.id && p.content && p.content.site && /^asset:estar\/mapIllust2?$/.test(p.content.site.mapImg||''))){
    try { p.content.site.mapImg = 'asset:estar/mapIllust3'; p.updated = now(); await DB.put(clone(p)); } catch(e){}
  }
  // e-스타 07: 메인 영상 1080p 와이드 버전으로 교체 (기본 영상을 쓰는 경우만)
  for (const p of all.filter(p => p.id && p.content && p.content.pages && !(p.content.site||{})._v1080b)){
    try { let hit = false;
      p.content.pages.forEach(pg => (pg.blocks||[]).forEach(b => { if (b.type === 'lvideo' && b.data && /estar\/estar_hero2?\.mp4$/.test(b.data.video||'')){ b.data.video = 'assets/hp-studio/estar/estar_hero3.mp4'; if (b.data.poster === 'asset:estar/heroPoster') b.data.poster = 'asset:estar/heroPoster2'; hit = true; } }));
      if (hit){ p.content.site._v1080b = 1; p.updated = now(); await DB.put(clone(p)); } } catch(e){}
  }
  await restoreDrafts(all.filter(p => p.id)); await renderList(); show('list');
})();
