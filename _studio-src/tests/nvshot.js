const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1.5});
await p.goto('file://'+__dirname+'/map/nv.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.locator('#m').screenshot({path:'map/nvm.png'});await b.close()})();
