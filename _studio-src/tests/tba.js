const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1440,height:900}});p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#barZip')]);await dl.saveAs('shots/ba.zip');
const q=await b.newPage({viewport:{width:1440,height:900}});const errs=[];q.on('pageerror',e=>errs.push(e.message));
require('child_process').execSync('rm -rf shots/baz && mkdir shots/baz && cd shots/baz && unzip -q ../ba.zip');
await q.goto('file://'+__dirname+'/shots/baz/homepage/index.html');await q.waitForTimeout(1000);
await q.evaluate(()=>document.querySelector('.ba').scrollIntoView({block:'center'}));
const seq=[];for(let i=0;i<8;i++){await q.waitForTimeout(250);seq.push(await q.evaluate(()=>document.querySelector('.ba').style.getPropertyValue('--p').slice(0,5)))}
console.log(seq,errs);await b.close()})();
