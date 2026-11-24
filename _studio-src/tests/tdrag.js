const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1800,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CON '+m.text())});p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
const id=await p.$$eval('.card',cs=>cs.find(c=>{const b=c.querySelector('.meta b');return b&&b.innerText.startsWith('07')}).querySelector('.acts .pri').dataset.edit);
await p.click(`.acts [data-edit="${id}"]`);await p.waitForTimeout(2500);await p.getByText('편집 모드',{exact:true}).click();await p.waitForTimeout(1200);
await p.evaluate(w=>{const f=document.querySelector('#pv');f.style.width=w+'px';f.style.minWidth=w+'px';f.style.maxWidth='none';f.style.transform='none'},1340);
const v=await p.$$eval('#pgSel option',o=>o.find(x=>/치료전후/.test(x.textContent)).value);await p.selectOption('#pgSel',v);await p.waitForTimeout(2500);
const fr=p.frames().find(x=>x!==p.mainFrame());
await fr.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('.rv').forEach(x=>x.classList.add('in'));window.scrollTo(0,document.querySelector('.cb-ba').getBoundingClientRect().top+scrollY-60)});
await p.screenshot({path:'shots/cases_now.png'});await p.waitForTimeout(3500);
const pv=await p.locator('#pv').boundingBox();
const n=await fr.evaluate(()=>document.querySelectorAll('.ba').length);console.log('cards',n);
for(let i=0;i<Math.min(n,8);i++){
  const r=await fr.evaluate(i=>{const b=document.querySelectorAll('.ba')[i];b.scrollIntoView({block:'center'});const x=b.getBoundingClientRect();return {x:x.x,y:x.y,w:x.width,h:x.height}},i);await p.waitForTimeout(300);
  const r2=await fr.evaluate(i=>{const x=document.querySelectorAll('.ba')[i].getBoundingClientRect();return {x:x.x,y:x.y,w:x.width,h:x.height}},i);
  const ox=pv.x+r2.x, oy=pv.y+r2.y+r2.h*0.4;
  const seq=[];
  // 손잡이(가운데)에서 잡아서 왼쪽 끝 → 오른쪽 끝으로
  await p.mouse.move(ox+r2.w*0.5,oy);await p.mouse.down();
  for(const f of [0.4,0.3,0.2,0.1,0.3,0.6,0.8,0.9,0.7,0.5]){await p.mouse.move(ox+r2.w*f,oy,{steps:4});await p.waitForTimeout(30);
    seq.push(await fr.evaluate(i=>Math.round(parseFloat(document.querySelectorAll('.ba')[i].style.getPropertyValue('--p'))),i))}
  await p.mouse.up();
  // 가운데가 아닌 곳을 잡고 끌기
  await p.mouse.move(ox+r2.w*0.85,oy);await p.mouse.down();await p.mouse.move(ox+r2.w*0.2,oy,{steps:6});
  const v2=await fr.evaluate(i=>Math.round(parseFloat(document.querySelectorAll('.ba')[i].style.getPropertyValue('--p'))),i);await p.mouse.up();
  console.log(i,'expected 40,30,20,10,30,60,80,90,70,50 →',seq.join(','),'| grab-off-center→20:',v2);
}
console.log('errors',errs);await b.close()})();
