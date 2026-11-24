const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1800,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
// 저장본 흉내: 새 페이지·메뉴 제거
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');e.content.pages=e.content.pages.filter(pg=>!['overlay','maryland'].includes(pg.slug));e.content.site.nav.forEach(g=>g.children=(g.children||[]).filter(k=>!/overlay|maryland/.test(k.href)));delete e.content.site._mo1;localStorage.setItem('__mockdb',JSON.stringify(d))});
await p.reload();await p.waitForSelector('.card .thumb');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');return e.content.site.nav.filter(g=>/자연치아|임플란트/.test(g.label)).map(g=>g.label+': '+g.children.map(k=>k.label).join(', '))}));
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1200);
await p.evaluate(w=>{const f=document.querySelector('#pv');f.style.width=w+'px';f.style.minWidth=w+'px';f.style.maxWidth='none';f.style.transform='none'},1340);
for(const [nm,key] of [['지르코니아 오버레이','ov'],['메릴랜드 브릿지','md']]){
 const v=await p.$$eval('#pgSel option',(o,nm)=>o.find(x=>x.textContent.includes(nm)).value,nm);await p.selectOption('#pgSel',v);await p.waitForTimeout(2500);
 const fr=p.frames().find(x=>x!==p.mainFrame());
 await fr.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('.rv').forEach(x=>x.classList.add('in'))});
 const H=await fr.evaluate(()=>document.body.scrollHeight);let i=0;
 for(let y=0;y<H;y+=620){await fr.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(500);await p.locator('#pv').screenshot({path:`shots/${key}${String(i++).padStart(2,'0')}.png`})}
 console.log(nm,'height',H,'shots',i,'broken imgs',await fr.evaluate(()=>[...document.images].filter(im=>im.complete&&!im.naturalWidth).map(im=>im.src.slice(-40))));
}
console.log('errors',errs);await b.close()})();
