const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
// simulate older stored copy without map
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');e.content.site.mapImg='asset:estar/mapIllust';localStorage.setItem('__mockdb',JSON.stringify(d))});
await p.reload();await p.waitForSelector('.card .thumb');await p.waitForTimeout(600);
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);
const v=await p.$$eval('#pgSel option',o=>o.find(x=>/오시는/.test(x.textContent)).value);await p.selectOption('#pgSel',v);await p.waitForTimeout(2500);
const fr=p.frames().find(x=>x!==p.mainFrame());
console.log(await fr.evaluate(()=>{const m=document.querySelector('.mapbox');m.scrollIntoView({block:'center'});const i=m.querySelector('img');return [m.className,i&&i.naturalWidth,!!m.querySelector('.mapgo'),!!m.querySelector('iframe')]}));
await p.waitForTimeout(800);await p.screenshot({path:'shots/map_ed.png'});
const home=await p.$$eval('#pgSel option',o=>o[0].value);await p.selectOption('#pgSel',home);await p.waitForTimeout(2000);
console.log(await p.frames().find(x=>x!==p.mainFrame()).evaluate(()=>[...document.querySelectorAll('.mapbox')].map(m=>m.className)));
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#barZip')]);await dl.saveAs('shots/map.zip');
console.log('errors',errs);await b.close()})();
