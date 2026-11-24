const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1800,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1200);
for(const [W,tag] of [[1440,'pc'],[390,'m']]){
 await p.evaluate(w=>{const f=document.querySelector('#pv');f.style.width=w+'px';f.style.minWidth=w+'px';f.style.maxWidth='none';f.style.transform='none'},W);
 for(const [pg,sel,nm] of [['홈','.lv','hero'],['홈','.cb-faq','homefaq'],['진료안내','.cb-pts','near'],['진료안내','.cb-faq','locfaq'],['무삭제 라미네이트','.cb-sub','lami']]){
  const v=await p.$$eval('#pgSel option',(o,pg)=>o.find(x=>x.textContent.includes(pg)).value,pg);await p.selectOption('#pgSel',v);await p.waitForTimeout(1800);
  const fr=p.frames().find(x=>x!==p.mainFrame());
  await fr.evaluate(s=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('.rv').forEach(x=>x.classList.add('in'));const e=document.querySelector(s);window.scrollTo(0,e.getBoundingClientRect().top+scrollY-(s==='.lv'?0:70))},sel);await p.waitForTimeout(900);
  await p.locator('#pv').screenshot({path:`shots/seo_${tag}_${nm}.png`})}}
console.log('errors',errs);await b.close()})();
