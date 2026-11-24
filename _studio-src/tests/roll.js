const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:900}});
await p.goto('file://'+process.cwd()+'/balz/homepage/index.html');await p.waitForTimeout(500);
await p.evaluate(()=>{const e=document.querySelector('.bf');scrollTo(0,e.getBoundingClientRect().top+scrollY-120)});await p.mouse.move(5,5);
for(let i=0;i<3;i++){await p.waitForTimeout(i?3500:1500);const box=await (await p.$('.bf .col')).boundingBox();await p.screenshot({path:`shots/roll${i}.png`,clip:box});console.log(await p.$$eval('.bf ul.roll li .q',x=>x.map(e=>e.innerText).join(' | ')));}
await b.close()})();
