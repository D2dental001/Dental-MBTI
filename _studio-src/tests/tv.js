const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1600,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&console.log('CON',m.text().slice(0,200)));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
// simulate stored v5 without video
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');const h=e.content.pages[0];h.blocks=h.blocks.filter(b=>b.type!=='lvideo');h.blocks.forEach(b=>{if(b.type==='lhero')b.hidden=false});delete e.content.site._video;localStorage.setItem('__mockdb',JSON.stringify(d))});
await p.reload();await p.waitForSelector('.card .thumb');await p.waitForTimeout(600);
console.log(await p.evaluate(()=>{const e=JSON.parse(localStorage.getItem('__mockdb')).find(x=>x.content.site._seed==='estar');const h=e.content.pages[0];return h.blocks.slice(0,3).map(b=>b.type+(b.hidden?'(hidden)':''))}));
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(3500);const fr=p.frames().find(x=>x!==p.mainFrame());
console.log(await fr.evaluate(()=>{const v=document.querySelector('.lv video');return v&&[v.currentSrc.slice(-40),v.readyState,v.paused,v.videoWidth]}));
await p.screenshot({path:'shots/vid_ed.png'});
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#barZip')]);await dl.saveAs('shots/lxv.zip');
console.log('errors',errs);await b.close()})();
