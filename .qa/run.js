const pw=require('playwright');const fs=require('fs');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const D=pw.devices;
const CFG={
 mac:[['webkit',null,'iPhone SE','safari-iphone-se'],['webkit',null,'iPhone 14 Pro Max','safari-iphone-promax'],['webkit',null,'iPad Pro 11','safari-ipad'],['webkit',null,'Desktop Safari','safari-mac'],
      ['chromium',null,'Pixel 7','chrome-android-pixel'],['chromium',null,'Galaxy S9+','chrome-android-galaxy'],['chromium','chrome','Desktop Chrome','chrome-mac'],['firefox',null,'Desktop Firefox','firefox-mac'],['firefox',null,{viewport:{width:390,height:844},deviceScaleFactor:2},'firefox-phone']],
 win:[['chromium','chrome','Desktop Chrome','chrome-windows'],['chromium','msedge','Desktop Edge','edge-windows'],['firefox',null,'Desktop Firefox','firefox-windows'],['chromium','chrome',{viewport:{width:360,height:740},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 14; SM-A146P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'},'chrome-android-small']]
}[process.argv[3]];
const SHARE='#s-eyJ2IjpbImg1fEEtNDMiLCJoNXxBLTQ0Il0sImIiOltdfQ';
(async()=>{const report={};
for(const [eng,channel,dev,name] of CFG){const R={errors:[],failed:[],overflow:[],fonts:'',steps:[]};report[name]=R;
 let b;try{b=await pw[eng].launch(channel?{channel}:{})}catch(e){R.errors.push('launch: '+e.message.split('\n')[0]);continue}
 let opt=typeof dev==='string'?{...D[dev]}:{...dev};if(eng==='firefox'){delete opt.isMobile}
 const c=await b.newContext(opt);const p=await c.newPage();
 await p.route(/gc\.zgo\.at|goatcounter/,r=>r.abort());
 p.on('pageerror',e=>R.errors.push(e.message.split('\n')[0]));
 p.on('requestfailed',r=>{if(!/zgo|goatcounter/.test(r.url()))R.failed.push(r.url())});
 let n=0;const shot=async t=>{await p.waitForTimeout(900);const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ov>1)R.overflow.push(t+':'+ov);await p.screenshot({path:`${OUT}/${name}__${String(n++).padStart(2,'0')}-${t}.png`})};
 const step=async(t,f)=>{try{await f();await shot(t);R.steps.push(t+':ok')}catch(e){R.steps.push(t+':FAIL '+e.message.split('\n')[0])}};
 const close=async()=>{for(const s of ['#mapClose','#visitClose','#booksClose','[data-close]']){const l=p.locator(s+':visible');if(await l.count())await l.first().click().catch(()=>{})}await p.waitForTimeout(400)};
 const top=()=>p.evaluate(()=>scrollTo(0,0));
 try{
 await p.goto('http://localhost:8000/index.html');await p.waitForTimeout(3000);
 R.fonts=await p.evaluate(async()=>{await document.fonts.ready;return [...document.fonts].map(f=>f.family.replace(/"/g,'')+'/'+f.weight+':'+f.status).join(' ')});
 await step('home',async()=>{});
 await step('halls',async()=>{await p.locator('#halls').scrollIntoViewIfNeeded()});
 await step('list',async()=>{await p.locator('#q').scrollIntoViewIfNeeded();await p.evaluate(()=>scrollBy(0,-20))});
 await step('footer',async()=>{await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight))});
 for(const id of ['h5','h6','h7','kids']){await step('hall-'+id,async()=>{await top();await p.locator(`#halls [data-hall="${id}"]`).first().click({timeout:6000})});await close()}
 await step('search',async()=>{await top();await p.fill('#q','جرير');await p.locator('#q').press('Enter');await p.waitForTimeout(600);await p.locator('#list .item').first().scrollIntoViewIfNeeded()});
 await step('library',async()=>{await p.locator('#list .item').first().click({timeout:6000})});
 await step('way',async()=>{await p.locator('#wayBtn').click({timeout:6000})});
 await close();
 await step('discover',async()=>{await top();await p.locator('#rnd').click({timeout:6000})});await close();
 await step('visit',async()=>{await p.fill('#q','');await p.locator('#q').press('Enter');await p.waitForTimeout(500);await p.locator('#list .star').nth(0).click();await p.locator('#list .star').nth(1).click();await p.waitForTimeout(400);await p.locator('#dockBtn').click({timeout:6000})});await close();
 await step('books',async()=>{await p.locator('#booksDock').click({timeout:6000});await p.fill('#bTitle','ثلاثية غرناطة');await p.locator('#bookForm button[type=submit], #bookForm button').first().click()});await close();
 await step('bigfont',async()=>{await top();await p.locator('#fsBtn').click();await p.locator('#fsBtn').click()});
 await step('bigfont-list',async()=>{await p.locator('#q').scrollIntoViewIfNeeded()});
 await p.locator('#fsBtn').click().catch(()=>{});
 await step('contrast',async()=>{await top();await p.locator('#hcBtn').click()});
 await p.locator('#hcBtn').click().catch(()=>{});
 const p2=await c.newPage();await p2.route(/gc\.zgo\.at/,r=>r.abort());await p2.goto('http://localhost:8000/index.html'+SHARE);await p2.waitForTimeout(2500);await p2.screenshot({path:`${OUT}/${name}__${String(n++).padStart(2,'0')}-received.png`});
 }catch(e){R.errors.push('flow: '+e.message.split('\n')[0])}
 await b.close()}
fs.writeFileSync(OUT+'/report.json',JSON.stringify(report,null,1))})();
