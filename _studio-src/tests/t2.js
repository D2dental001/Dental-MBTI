const { chromium } = require('playwright');const path=require('path'),fs=require('fs');
const S=__dirname, OS=path.join(S,'os'), store={};
async function setup(b){const ctx=await b.newContext({viewport:{width:1600,height:950},acceptDownloads:true});
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
  if(u.hostname!=='hp.local'){ if(u.href.includes('jszip')) return route.fulfill({body:fs.readFileSync(S+'/npm/node_modules/jszip/dist/jszip.min.js'),contentType:'text/javascript'});
    if(u.href.includes('supabase-js')) return route.fulfill({body:'window.supabase={createClient:()=>({})}',contentType:'text/javascript'});
    return route.fulfill({body:''}); }
  if(u.pathname==='/supabase-init.js') return route.fulfill({body:fs.readFileSync(S+'/mock-sb.js'),contentType:'text/javascript'});
  if(u.pathname.startsWith('/__store/')){ const k=u.pathname; if(route.request().method()==='PUT'){store[k]={b:route.request().postDataBuffer(),t:route.request().headers()['content-type']};return route.fulfill({status:200,body:'ok'})} const f=store[k]; return f?route.fulfill({body:f.b,contentType:f.t}):route.fulfill({status:404}); }
  const fp=path.join(OS,decodeURIComponent(u.pathname));if(fs.existsSync(fp)&&fs.statSync(fp).isFile()) return route.fulfill({path:fp});return route.fulfill({status:404});});
return ctx;}
module.exports={setup};
if(require.main===module)(async()=>{const b=await chromium.launch();const ctx=await setup(b);const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGE '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/404|ERR_/.test(m.text()))errs.push(m.text())});
p.on('dialog',d=>d.accept(d.type()==='prompt'?'테스트':undefined));
await p.goto('http://hp.local/hp-studio.html');await p.waitForSelector('.card .thumb');
console.log('cards',await p.textContent('#cnt'));await p.screenshot({path:'shots/v2_list.png'});
const ids=await p.$$eval('.acts .pri',x=>x.map(e=>e.dataset.edit));
const fr=()=>p.frameLocator('#pv');
for(const [i,id] of ids.entries()){await p.click(`.acts [data-edit="${id}"]`);await fr().locator('.ad-tools').first().waitFor({state:'attached'});await p.waitForTimeout(500);
  const info=await p.evaluate(()=>{const d=document.querySelector('#pv').contentDocument;return {blk:d.querySelectorAll('.blk').length,tools:d.querySelectorAll('.ad-tools').length,ins:d.querySelectorAll('.ad-insert').length,nav:d.querySelectorAll('.hd nav a').length,broken:[...d.images].filter(i=>i.complete&&!i.naturalWidth).length}});
  console.log('theme',i,JSON.stringify(info));
  if(i===0){ // hover second block for screenshot
    const blk=fr().locator('.blk').nth(1);await blk.scrollIntoViewIfNeeded();await blk.hover();await p.waitForTimeout(300);await p.screenshot({path:'shots/v2_hover.png'});}
  await p.click('#btnBack');}
console.log('errors',errs);await b.close();})();
