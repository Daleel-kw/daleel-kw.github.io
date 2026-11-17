const {webkit,devices}=require('playwright');(async()=>{const b=await webkit.launch();
const c=await b.newContext({...devices['iPhone 14']});const p=await c.newPage();
await p.route(/gc\.zgo\.at|goatcounter/,r=>r.abort());
const log=[];p.on('pageerror',e=>log.push('JS: '+e.message));
const shot=async n=>{await p.waitForTimeout(1000);await p.screenshot({path:'_t/'+n+'.png'})};
const step=async(n,f)=>{try{await f();await shot(n)}catch(e){log.push(n+': '+e.message.split('\n')[0])}};
const clk=async s=>{await p.locator(s).first().click({timeout:5000})};
const close=async()=>{for(const s of ['#mapClose','#visitClose','#booksClose','[data-close]']){const l=p.locator(s+':visible');if(await l.count())await l.first().click().catch(()=>{})}};
await p.goto('http://localhost:8000/index.html');await p.waitForTimeout(2500);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
let k=0;for(let y=0;y<H;y+=760){await p.evaluate(y=>scrollTo(0,y),y);await shot('home-'+String(k++).padStart(2,'0'))}
for(const id of ['h5','h6','h7','kids']){await step('hall-'+id,async()=>{await p.evaluate(()=>scrollTo(0,0));await clk(`#halls [data-hall="${id}"]`)});await close()}
await step('search',async()=>{await p.evaluate(()=>scrollTo(0,0));await p.fill('#q','مكتبة');await p.locator('#q').press('Enter');await p.locator('#list .item').first().scrollIntoViewIfNeeded()});
await step('lib',async()=>{await clk('#list .item')});
await step('way',async()=>{await clk('#wayBtn')});
await close();
await step('discover',async()=>{await p.evaluate(()=>scrollTo(0,0));await clk('#rnd')});
await close();
await step('visit',async()=>{await clk('#dockBtn')});await close();
await step('books',async()=>{await clk('#booksDock')});await close();
await step('hc-top',async()=>{await p.evaluate(()=>scrollTo(0,0));await clk('#hcBtn')});
await step('hc-mid',async()=>{await p.evaluate(()=>scrollTo(0,1600))});
require('fs').writeFileSync('_t/errors.txt',log.join('\n')||'none');
await b.close()})();
