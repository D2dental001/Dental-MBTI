const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1800,height:1000}});p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1200);
await p.evaluate(w=>{const f=document.querySelector('#pv');f.style.width=w+'px';f.style.minWidth=w+'px';f.style.maxWidth='none';f.style.transform='none'},1440);
const opts=await p.$$eval('#pgSel option',o=>o.map(x=>[x.value,x.textContent.trim()]));
for(const [v,n] of opts){await p.selectOption('#pgSel',v);await p.waitForTimeout(1500);const fr=p.frames().find(x=>x!==p.mainFrame());
 await fr.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}});await p.waitForTimeout(400);
 const r=await fr.evaluate(()=>[...document.querySelectorAll('.ba')].map(b=>{const i=b.querySelector('img');const w=Math.round(b.getBoundingClientRect().width);return {w,nw:i.naturalWidth,cap:(b.parentElement.style.maxWidth||b.style.maxWidth)}}).filter(x=>x.cap||x.w>x.nw*1.4+2));
 if(r.length)console.log(n,JSON.stringify(r))}
await b.close()})();
