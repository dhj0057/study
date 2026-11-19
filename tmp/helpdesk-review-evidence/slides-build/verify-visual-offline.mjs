import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--autoplay-policy=no-user-gesture-required"]});
try {
 const c=await b.newContext({offline:true});
 const p=await c.newPage();
 await p.goto(pathToFileURL("D:/study/tmp/helpdesk-review-evidence/slides-build/visual-release/오프라인_시연_재생.html").href);
 await p.locator("video").evaluate(v=>{v.playbackRate=8;return v.play();});
 await p.waitForFunction(()=>document.querySelector('video').ended,null,{timeout:25000});
 const r=await p.locator("video").evaluate(v=>({seconds:v.currentTime,width:v.videoWidth,ended:v.ended,videoError:v.error?.code??null}));
 assert(r.seconds>10&&r.width===1440&&r.ended&&r.videoError===null);
 console.log(JSON.stringify(r));
} finally {await b.close();}
