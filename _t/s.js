const {webkit,devices}=require('playwright');(async()=>{const b=await webkit.launch();
const c=await b.newContext({...devices['iPhone 14']});const p=await c.newPage();
await p.route(/gc\.zgo\.at|goatcounter/,r=>r.abort());
const errs=[];p.on('pageerror',e=>errs.push(e.message));
const shot=async n=>{await p.waitForTimeout(900);await p.screenshot({path:'_t/'+n+'.png'})};
await p.goto('http://localhost:8000/index.html');await p.waitForTimeout(2500);
const H=await p.evaluate(()=>{const h=document.documentElement.scrollHeight;return h});
let k=0;for(let y=0;y<H;y+=760){await p.evaluate(y=>scrollTo(0,y),y);await shot('home-'+String(k++).padStart(2,'0'))}
const ids=await p.evaluate(()=>H.map(h=>h.id));
for(const id of ids){await p.evaluate(id=>openHall(id),id);await shot('hall-'+id);await p.evaluate(()=>closeMap())}
await p.evaluate(()=>openMap(0));await shot('lib-0');await p.evaluate(()=>closeMap());
await p.evaluate(()=>openMap(P.length-1));await shot('lib-last');await p.evaluate(()=>closeMap());
await p.evaluate(()=>{toggleVisit(0);toggleVisit(5);openVisit()});await shot('visit');await p.evaluate(()=>closeVisit());
await p.evaluate(()=>{addBook('كتاب تجربة','مؤلف','');openBooks()});await shot('books');await p.evaluate(()=>closeBooks());
await p.evaluate(()=>copyText.length&&showModal('<h3>انسخ النص</h3>تجربة'));await shot('modal');
await p.evaluate(()=>{const m=document.getElementById('modal');if(m)m.click()});
await p.evaluate(()=>{document.body.classList.add('hc');scrollTo(0,0)});await shot('hc-top');
await p.evaluate(()=>scrollTo(0,1500));await shot('hc-mid');
require('fs').writeFileSync('_t/errors.txt',errs.join('\n')||'none');
await b.close()})();
