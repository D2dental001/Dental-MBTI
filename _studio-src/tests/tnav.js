const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);
const v=await p.$$eval('#pgSel option',o=>o.find(x=>x.textContent.trim().endsWith('신경치료')).value);await p.selectOption('#pgSel',v);await p.waitForTimeout(2500);
// turn off edit mode toggle if exists so it's like view
let fr=p.frames().find(x=>x!==p.mainFrame());
const box=await fr.evaluate(()=>{const m=document.querySelector('.hd nav .mi.on');const r=m.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2, getComputedStyle(m.querySelector('.mi-a')).color]});console.log(box);
const fb=await (await p.$('iframe')).boundingBox();
await p.mouse.move(fb.x+box[0],fb.y+box[1]);await p.waitForTimeout(500);
await p.screenshot({path:'shots/nav1.png',clip:{x:fb.x+box[0]-400,y:fb.y,width:800,height:360}});
// BA on home
const h=await p.$$eval('#pgSel option',o=>o[0].value);await p.selectOption('#pgSel',h);await p.waitForTimeout(2500);
await p.mouse.move(5,5);
fr=p.frames().find(x=>x!==p.mainFrame());
const ok=await fr.evaluate(()=>{const b=document.querySelector('.ba');b.scrollIntoView({block:'center'});return !!b.querySelector('.ba-tip')});console.log('tip',ok);
await p.waitForTimeout(1300);
const bb=await fr.evaluate(()=>{const r=document.querySelector('.ba').getBoundingClientRect();return [r.x,r.y,r.width,r.height,document.querySelector('.ba').style.getPropertyValue('--p')]});console.log(bb);
await p.screenshot({path:'shots/ba1.png',clip:{x:fb.x+bb[0]-10,y:fb.y+bb[1]-10,width:bb[2]+20,height:bb[3]+20}});
console.log('errors',errs);await b.close()})();
