const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1440,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
// 예전 문구 저장본 흉내
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');let j=JSON.stringify(e.content);
 j=j.split('"소중한 내 치아, 이제 깎지 않고 예뻐지세요"').join('"멀쩡한 치아, 깎지 않고 예뻐집니다"').split('"25년 넘게 치아를 만들어 온 전문가가 정밀하게 제작합니다"').join('"한 장 한 장 정밀하게 만듭니다"');
 e.content=JSON.parse(j);delete e.content.site._copy2;localStorage.setItem('__mockdb',JSON.stringify(d))});
await p.reload();await p.waitForSelector('.card .thumb');await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');const j=JSON.stringify(e.content);return {copy2:e.content.site._copy2,old:j.includes('멀쩡한')||j.includes('한 장 한 장'),neu:j.includes('소중한 내 치아')&&j.includes('25년 넘게 치아를'),woman:j.includes('여자 원장')}});
console.log(r);
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);
await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1500);
const v=await p.$$eval('#pgSel option',o=>o.find(x=>/무삭제 라미네이트/.test(x.textContent)).value);await p.selectOption('#pgSel',v);await p.waitForTimeout(2500);
const fr=p.frames().find(x=>x!==p.mainFrame());
const txt=await fr.evaluate(()=>document.body.innerText);
console.log(['소중한 내 치아','이렇게 다릅니다','반영구','마취 없이','25년 넘게','0.1mm','세라믹(엠프레스)'].map(k=>k+':'+txt.includes(k)).join(' '),'| 얇은 세라믹:',txt.includes('얇은 세라믹'),'| 크라운보다:',txt.includes('크라운보다'));
for(const [k,n] of [['이렇게 다릅니다','c_pts'],['25년 넘게 치아를','c_gal'],['소중한 내 치아','c_hero']]){
 await fr.evaluate(k=>{document.documentElement.style.scrollBehavior='auto';const el=[...document.querySelectorAll('h2,h3,p')].find(e=>e.innerText.includes(k));window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-160)},k);await p.waitForTimeout(1800);await p.locator('#pv').screenshot({path:'shots/'+n+'.png'})}
console.log('errors',errs);await b.close()})();
