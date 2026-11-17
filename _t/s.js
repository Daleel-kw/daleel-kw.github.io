const {webkit,devices}=require('playwright');(async()=>{const b=await webkit.launch();
const c=await b.newContext({...devices['iPhone 14']});const p=await c.newPage();
await p.route(/gc\.zgo\.at|goatcounter/,r=>r.abort());
await p.addInitScript(()=>{window.__u='';navigator.share=d=>{window.__u=d.url||d.text||'';return Promise.resolve()};try{Object.defineProperty(navigator,'clipboard',{value:undefined})}catch(e){}});
const log=[];p.on('pageerror',e=>log.push('JS: '+e.message));
const shot=async n=>{await p.waitForTimeout(1000);await p.screenshot({path:'_t/'+n+'.png'})};
const step=async(n,f)=>{try{await f();await shot(n)}catch(e){log.push(n+': '+e.message.split('\n')[0])}};
await p.goto('http://localhost:8000/index.html');await p.waitForTimeout(2500);
await step('visit',async()=>{await p.evaluate(()=>document.getElementById('list').scrollIntoView());await p.locator('#list .star').nth(0).click();await p.locator('#list .star').nth(1).click();await p.waitForTimeout(500);await p.locator('#dockBtn').click({timeout:5000})});
await step('share',async()=>{await p.locator('#shareList').click({timeout:5000})});
log.push('url='+await p.evaluate(()=>window.__u));
await step('copy',async()=>{await p.locator('#copyList').click({timeout:5000})});
const u=await p.evaluate(()=>window.__u);const m=u.match(/https?:\/\/\S+/);
if(m){const h=m[0].split('#')[1]||'';const p2=await c.newPage();await p2.route(/gc\.zgo\.at/,r=>r.abort());await p2.goto('http://localhost:8000/index.html#'+h);await p2.waitForTimeout(2500);await p2.screenshot({path:'_t/received.png'})}
require('fs').writeFileSync('_t/errors.txt',log.join('\n')||'none');
await b.close()})();
