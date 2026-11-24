
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium } from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright/index.mjs";
const source = "C:/Users/AISW-510-125/Downloads/helpdesk_AIPLAFROM시연영상55초 (1).mp4";
const target = "D:/study/tmp/helpdesk-review-evidence/old-video-review";
await fs.mkdir(target, {recursive:true});
const browser = await chromium.launch({
 executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,
});
try {
 const page = await browser.newPage({viewport:{width:1280,height:720}});
 await page.goto(pathToFileURL(source).href);
 await page.waitForFunction(()=>document.querySelector("video")?.readyState>=2);
 const video=page.locator("video");
 const meta=await video.evaluate(v=>{
  v.pause(); v.controls=false; v.muted=true;
  document.body.style.cssText="margin:0;background:#111";
  v.style.cssText="display:block;position:fixed;inset:0;width:100vw;height:100vh;object-fit:contain";
  return {duration:v.duration,width:v.videoWidth,height:v.videoHeight};
 });
 const samples=[0.4,2.7,5.5,8.5,11.5,14.5,17.5,20.5,23.5,26.5,29.5,32.5,35.5,38.5,41.5,44.5,47.5,50.5,53.5].filter(t=>t<meta.duration);
 for (const sec of samples) {
  await video.evaluate((v,sec)=>new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error("seek timeout")),3000);
    v.addEventListener("seeked",()=>{clearTimeout(timer);requestAnimationFrame(()=>requestAnimationFrame(resolve));},{once:true});
    v.currentTime=sec;
  }),sec);
  await page.screenshot({path:target+"/frame-"+String(Math.round(sec*10)).padStart(4,"0")+".jpg",type:"jpeg",quality:89});
 }
 console.log(JSON.stringify({meta,samples}));
} finally {await browser.close();}