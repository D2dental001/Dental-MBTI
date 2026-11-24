const { chromium } = require('playwright');const {setup}=require('./t2.js');const fs=require('fs');
const AUDIT=()=>{const out=[];
 const SEL='h1,h2,h3,h4,p,li,dt,dd,figcaption,small,label,button,a,em,strong,b,span';
 const els=[...document.querySelectorAll(SEL)].filter(e=>{
  if(e.closest('svg,script,style,.mb4,.qbar,.lbar,iframe,[hidden]'))return false;const st=getComputedStyle(e);if(st.display==='none'||st.visibility==='hidden'||+st.opacity===0)return false;
  if(!e.innerText||e.innerText.trim().length<2)return false;
  // 인라인 요소는 블록 부모가 이미 검사하면 건너뜀
  if(st.display.startsWith('inline')&&e.parentElement&&e.parentElement.closest('h1,h2,h3,h4,p,li,dt,dd,figcaption,label,button'))return false;
  // 안쪽에 블록 텍스트 요소가 있으면 그쪽에서 검사
  if([...e.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,div')].some(c=>c.innerText&&c.innerText.trim().length>1&&!getComputedStyle(c).display.startsWith('inline')))return false;
  return true});
 for(const e of els){const r=e.getBoundingClientRect();if(r.width<4||r.height<4)continue;
  const pre=getComputedStyle(e).whiteSpace.startsWith('pre');
  const items=[];const tw=document.createTreeWalker(e,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;
  while(n=tw.nextNode()){if(n.nodeType===1){if(n.tagName==='BR')items.push({br:1});continue}
   if(n.parentElement.closest('svg'))continue;const t=n.textContent;
   for(let i=0;i<t.length&&items.length<500;i++){if(t[i]==='\n'&&pre){items.push({br:1});continue}if(!t[i].trim()){items.push({c:' ',top:null});continue}
    const rg=document.createRange();rg.setStart(n,i);rg.setEnd(n,i+1);const rs=rg.getClientRects();if(!rs.length)continue;items.push({c:t[i],top:Math.round(rs[0].top)})}}
  // 강제 줄바꿈 단위로 구간 나누기, 구간마다 실제 줄 계산
  const segs=[[]];for(const x of items){if(x.br)segs.push([]);else segs[segs.length-1].push(x)}
  const issues=[];let allTxt=[];const isHead=/^(H[1-4])$/.test(e.tagName);const hasBR=segs.length>1;
  for(const seg of segs){const lines=[];let cur=null;
   for(const x of seg){if(x.top===null){if(cur)cur.t+=' ';continue}if(!cur||Math.abs(x.top-cur.top)>4){cur={top:x.top,t:''};lines.push(cur)}cur.t+=x.c}
   const txt=lines.map(l=>l.t.trim()).filter(Boolean);allTxt.push(txt.join(' ⏎ '));if(txt.length<2)continue;
   const last=txt[txt.length-1].replace(/[.,!?·)"'”’]/g,'').replace(/\s/g,'');const has=/[가-힣]/.test(txt.join(''));
   if(has&&(last.length<=2||(last.length<=4&&/^(P|H[1-4]|LI|SMALL|EM|STRONG|B)$/.test(e.tagName))))issues.push((hasBR?'강제+자동줄바꿈 ':'')+'외톨이:'+last);
   if(hasBR&&has&&txt.length>=2&&(isHead||e.tagName==='P'||e.tagName==='STRONG'||e.tagName==='B')&&txt[txt.length-1].length<=7)issues.push('강제줄바꿈 뒤 자동줄바꿈:'+txt[txt.length-1]);
   for(let i=0;i<lines.length-1;i++){const a=lines[i].t,b=lines[i+1].t;if(a.length&&b.length&&!/\s$/.test(a)&&!/^\s/.test(b)&&/[가-힣A-Za-z0-9]$/.test(a)&&/^[가-힣A-Za-z0-9]/.test(b))issues.push('단어중간:'+a.slice(-4)+'|'+b.slice(0,4))}
   if(isHead&&!hasBR){const L0=txt[0].length,Ln=txt[txt.length-1].length;if(Ln<=4||Ln/L0<.34)issues.push('제목쏠림')}
   if(e.tagName==='LI'&&e.textContent.trim().length<=45&&!hasBR)issues.push('짧은항목2줄')}
  if(issues.length)out.push({tag:e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:''),sec:(e.closest('section')||{}).className||'',text:allTxt.join(' ‖ ').slice(0,140),issues:[...new Set(issues)]})}
 return out};
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const VW=+process.argv[2]||1440;const MODES=(process.argv[3]||'PC,모바일').split(',');const p=await ctx.newPage({viewport:{width:VW,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);
await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1200);
const opts=await p.$$eval('#pgSel option',o=>o.map(x=>[x.value,x.textContent.trim()]));
const res=[];
for(const mode of MODES){
 const FW=+mode;await p.evaluate(w=>{const f=document.querySelector('#pv');f.style.width=w+'px';f.style.maxWidth='none';f.style.minWidth=w+'px';f.style.transform='none';f.style.zoom=1},FW);await p.waitForTimeout(800);
 for(const [v,name] of opts){await p.selectOption('#pgSel',v);await p.waitForTimeout(1400);
  const fr=p.frames().find(x=>x!==p.mainFrame());
  await fr.evaluate(()=>{document.querySelectorAll('.rv').forEach(e=>e.classList.add('in','on','show'));document.documentElement.style.scrollBehavior='auto'});
  await fr.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}window.scrollTo(0,0)});
  await p.waitForTimeout(500);
  const wnow=await fr.evaluate(()=>innerWidth);if(Math.abs(wnow-FW)>20)console.log('width mismatch',wnow,FW);const r=await fr.evaluate(AUDIT);const w=await fr.evaluate(()=>innerWidth);for(const x of r)res.push({mode:mode+w,page:name,...x})}}
fs.writeFileSync('wrap_'+VW+'.json',JSON.stringify(res,null,1));
const c={};for(const x of res)for(const i of x.issues){const k=x.mode+' '+i.split(':')[0];c[k]=(c[k]||0)+1}
console.log(opts.length,'pages',res.length,'flagged',c,'errors',errs.length);await b.close()})();
