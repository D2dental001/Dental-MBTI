const { chromium } = require('playwright');const {setup}=require('./t2.js');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage({viewport:{width:1440,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>d.accept());
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');await p.waitForTimeout(800);
const out=await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('__mockdb'));const e=d.find(x=>x.content.site._seed==='estar'&&x.theme==='luxe')||d.find(x=>x.content.site._seed==='estar');
  const c=migrateContent(e.theme,JSON.parse(JSON.stringify(e.content)));const files={};const r={site:c.site,theme:e.theme,pages:[]};
  c.pages.forEach(pg=>r.pages.push({id:pg.id,slug:pg.slug,title:pg.title,file:(pg.id==='home'?'index':pg.slug)+'.html',html:renderSite(c,e.theme,'export',files,{page:pg.id})}));r.files=Object.keys(files);r.seo=seoFiles(c);return r});
fs.mkdirSync('export',{recursive:true});for(const pg of out.pages)fs.writeFileSync('export/'+pg.file,pg.html);for(const [n,t] of Object.entries(out.seo))fs.writeFileSync('export/'+n,t);
fs.writeFileSync('export/_meta.json',JSON.stringify({site:out.site,theme:out.theme,pages:out.pages.map(({html,...x})=>x),files:out.files},null,1));
console.log(out.theme,out.pages.length,'pages',out.files.length,'files','errors',errs);await b.close()})();
