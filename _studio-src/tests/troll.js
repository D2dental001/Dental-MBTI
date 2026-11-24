const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1800,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
// 저장본 흉내: 롤링 블록 제거 후 다시 열기
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar'&&x.theme==='luxe');const sp=e.content.pages.find(p=>p.slug==='special');sp.blocks=sp.blocks.filter(b=>b.type!=='lroll');sp.blocks.forEach(b=>{if(b.type==='c_treat')b.hidden=false});delete e.content.site._roll1;localStorage.setItem('__mockdb',JSON.stringify(d))});
await p.reload();await p.waitForSelector('.card .thumb');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const sp=d.find(x=>x.content.site._seed==='estar'&&x.theme==='luxe').content.pages.find(p=>p.slug==='special');return sp.blocks.map(b=>b.type+(b.hidden?'(숨김)':'')).join(' > ')}));
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1200);
const v=await p.$$eval('#pgSel option',o=>o.find(x=>/특별함/.test(x.textContent)).value);await p.selectOption('#pgSel',v);await p.waitForTimeout(1500);
for(const [W,tag] of [[1440,'pc'],[390,'m']]){
 await p.evaluate(w=>{const f=document.querySelector('#pv');f.style.width=w+'px';f.style.minWidth=w+'px';f.style.maxWidth='none';f.style.transform='none'},W);await p.waitForTimeout(800);
 const fr=p.frames().find(x=>x!==p.mainFrame());
 for(const k of [0,1]){
  await fr.evaluate(k=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('.rv').forEach(x=>x.classList.add('in'));const e=document.querySelectorAll('.lrl')[k];window.scrollTo(0,e.getBoundingClientRect().top+scrollY-70)},k);
  await p.waitForTimeout(3200);
  console.log(W,k,JSON.stringify(await fr.evaluate(k=>[...document.querySelectorAll('.lrl')[k].querySelectorAll('video')].map(v=>({cls:v.className,shown:v.offsetParent!==null,t:+v.currentTime.toFixed(1),paused:v.paused,ready:v.readyState})),k)));
  await p.locator('#pv').screenshot({path:`shots/roll_${tag}${k}.png`})}}
console.log('errors',errs);await b.close()})();
