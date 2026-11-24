const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('dialog',d=>d.accept(d.type()==='prompt'?'테스트':undefined));
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
console.log('list meta:',await p.textContent('.card .meta small'));
const ids=await p.$$eval('.acts .pri',x=>x.map(e=>e.dataset.edit));const fr=p.frameLocator('#pv');const g=js=>p.evaluate(js);
const D=()=>'document.querySelector("#pv").contentDocument';
for(const [i,id] of ids.entries()){
  await p.click(`.acts [data-edit="${id}"]`);await fr.locator('.ad-tools').first().waitFor({state:'attached'});
  const navs=await g(()=>[...document.querySelector('#pv').contentDocument.querySelectorAll('.hd nav > a, .hd nav > .mi')].map(x=>{const a=x.matches('a')?x:x.querySelector('.mi-a');return a.innerText+'('+x.querySelectorAll('.sub a').length+')'}).join(' '));
  console.log('theme',i,'nav:',navs,'| pages:',await p.$$eval('#pgSel option',o=>o.length));
  // click submenu link "네비게이션 임플란트"
  const mi=fr.locator('.hd nav .mi').nth(1);await mi.hover();await mi.locator('.sub a').nth(1).click();await p.waitForTimeout(900);
  const info=await g(()=>{const d=document.querySelector('#pv').contentDocument;const h=d.querySelector('.cb-sub h1');return [d.title, h?h.innerText:'-', d.querySelectorAll('.blk').length, [...d.images].filter(i=>i.complete&&!i.naturalWidth).length, d.querySelector('.hd nav .mi.on .mi-a')?.innerText||'-']});
  console.log('   → page:',JSON.stringify(info),'sel:',await p.inputValue('#pgSel'));
  await p.screenshot({path:`shots/pg_${i}.png`});
  // logo back home
  await fr.locator('.hd .logo').first().click({position:{x:5,y:5}});await p.waitForTimeout(800);
  console.log('   → logo home:',await p.inputValue('#pgSel'));
  // home card link to page (services/clinics/c_quick)
  const card=await g(()=>{const d=document.querySelector('#pv').contentDocument;const a=d.querySelector('.cb-quick a,.s5 .grid a,.svc .grid a,.clinic a');return a?a.getAttribute('href'):'none'});
  console.log('   → home card href:',card);
  await p.click('#btnBack');
}
console.log('errors',errs);await b.close();})();
