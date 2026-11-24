const { chromium } = require('playwright');const {setup}=require('./t2.js');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');let j=JSON.stringify(e.content);
 j=j.split('"메릴랜드 브릿지 치료 사례"').join('"메릴랜드 브릿지 제작 사례"').split('"지르코니아 오버레이 치료 사례"').join('"지르코니아 오버레이 제작 사례"');
 e.content=JSON.parse(j);e.content.pages.forEach(pg=>pg.blocks.forEach(bk=>{if(bk.type==='c_ba'&&/메릴랜드|오버레이/.test(bk.data.t||''))bk.data.s='협력 기공소 디투덴탈의 지르코니아 '+(/메릴/.test(bk.data.t)?'메릴랜드 브릿지':'오버레이')+' 제작 사례입니다'}));delete e.content.site._copy4;localStorage.setItem('__mockdb',JSON.stringify(d))});
await p.reload();await p.waitForSelector('.card .thumb');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar');const r=[];e.content.pages.forEach(pg=>pg.blocks.forEach(bk=>{if(bk.type==='c_ba'&&/메릴랜드|오버레이/.test(bk.data.t||''))r.push(bk.data.t+' / '+bk.data.s)}));return r}));
console.log('errors',errs);await b.close()})();
