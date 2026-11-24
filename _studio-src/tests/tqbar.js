const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1800,height:1000}});p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1200);
const opts=await p.$$eval('#pgSel option',o=>o.map(x=>[x.value,x.textContent.trim()]));
for(const W of [1024,1280,1366]){
 await p.evaluate(w=>{const f=document.querySelector('#pv');f.style.width=w+'px';f.style.minWidth=w+'px';f.style.maxWidth='none';f.style.transform='none'},W);let bad=[];
 for(const [v,n] of opts){await p.selectOption('#pgSel',v);await p.waitForTimeout(900);const fr=p.frames().find(x=>x!==p.mainFrame());
  const r=await fr.evaluate(()=>{const q=document.querySelector('.qbar');if(!q||getComputedStyle(q).display==='none')return 'noq';const qr=q.getBoundingClientRect();const L=qr.left;
   return [...document.querySelectorAll('section .ba, section a, section button, section input, section h2, section p, section img')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.width<innerWidth*.85&&r.right>L+2&&!e.closest('.lh,.lv,.qbar,header,.cb-sub,.br')&&getComputedStyle(e).position!=='fixed'}).slice(0,3).map(e=>e.tagName+'.'+(e.className||'').toString().split(' ')[0]+'@'+(e.closest('section')||{}).className+':'+Math.round(e.getBoundingClientRect().right)+'>'+Math.round(L))});
  if(r!=='noq'&&r.length)bad.push(n.slice(0,10)+' '+r.join(' '))}
 console.log(W,bad.length?bad:'겹침 없음')}
await b.close()})();
