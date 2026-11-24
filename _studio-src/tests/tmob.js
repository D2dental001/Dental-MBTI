const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1440,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);
await p.getByText('모바일',{exact:true}).click();await p.waitForTimeout(1500);

await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(2500);const fr=p.frames().find(x=>x!==p.mainFrame());
for(const [sel,name] of [['.bb','m_ba'],['.bt','m_tiles'],['.ba2','m_about']]){
  await fr.evaluate(s=>{const e=document.querySelector(s);document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-66)},sel);await p.waitForTimeout(2600);
  await p.locator('#pv').screenshot({path:'shots/'+name+'.png'});
}
// 실제로 밀었을 때
await fr.evaluate(()=>{const e=document.querySelector('.bb .ba');document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-200);const r=e.querySelector('input');r.value=30;r.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(700);
await p.locator('#pv').screenshot({path:'shots/m_ba_used.png'});
console.log('errors',errs);await b.close()})();
