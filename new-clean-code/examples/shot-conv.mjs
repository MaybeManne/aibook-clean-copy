import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless:"new", args:["--no-sandbox","--disable-setuid-sandbox","--disable-gpu","--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows"] });
const p = await b.newPage(); await p.setViewport({width:1280,height:820}); await p.bringToFront();
const errs=[]; p.on("pageerror",e=>errs.push(String(e).split("\n")[0]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clickText=re=>p.evaluate(s=>{const e=[...document.querySelectorAll("button")].find(b=>new RegExp(s,"i").test(b.textContent||""));if(e){e.click();return true}return false}, re.source);
const setSlider=v=>p.evaluate(val=>{
  const inp=document.querySelector('input[type="range"]'); if(!inp) return false;
  const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  set.call(inp,String(val)); inp.dispatchEvent(new Event('input',{bubbles:true})); return true;
}, v);

await p.goto("http://localhost:5178/",{waitUntil:"networkidle0"}); await sleep(700);
await p.screenshot({path:"/tmp/ls-conv-01-intro.png"});
console.log("start:", await clickText(/start/)); await sleep(500);
await p.screenshot({path:"/tmp/ls-conv-02-shift0.png"});
console.log("slider→2:", await setSlider(2)); await sleep(400);
await p.screenshot({path:"/tmp/ls-conv-03-shift2.png"});
console.log("slider→5:", await setSlider(5)); await sleep(400);
await p.screenshot({path:"/tmp/ls-conv-04-shift5.png"});
console.log("pageerrors:", errs.slice(0,6));
await b.close();
