
import assert from "node:assert/strict";
import {pathToFileURL} from "node:url";
import {chromium} from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright/index.mjs";
const dir = "D:/study/tmp/helpdesk-review-evidence/deliver-1125-short";
const browser = await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--autoplay-policy=no-user-gesture-required"]});
try{
 const page = await (await browser.newContext({offline:true,viewport:{width:1440,height:900}})).newPage();
 await page.goto(pathToFileURL(dir+"/오프라인_시연_재생.html").href);
 await page.locator("video").evaluate(async v=>{v.playbackRate=6;await v.play();});
 await page.waitForFunction(()=>document.querySelector("video")?.ended,{},{timeout:22000});
 const r=await page.locator("video").evaluate(v=>({seconds:v.currentTime,width:v.videoWidth,height:v.videoHeight,ended:v.ended,error:v.error?.code??null}));
 assert(r.ended&&r.width===1920&&r.seconds>55&&r.error===null);
 console.log(JSON.stringify(r));
} finally { await browser.close(); }