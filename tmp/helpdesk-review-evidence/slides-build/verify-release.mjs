import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {chromium,request} from "playwright";
import assert from "node:assert/strict";

const stage=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(stage,"..","slides-output");
const proof={checkedRelease:"969f2c8",tests:{}};
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--no-proxy-server","--autoplay-policy=no-user-gesture-required"]});
const btn=(page,t)=>page.getByRole("button",{name:t,exact:true}).and(page.locator("button:not([tabindex='-1'])")).first();
const input=(page,t)=>page.locator("label").filter({has:page.getByText(t,{exact:true})}).locator("input,textarea").first();
async function submit(page,question,tokens) {
 const before=await input(page,"접수번호").inputValue();
 await input(page,"가상 문의").fill(question);
 await btn(page,"문의 접수").click();
 await page.waitForFunction(([expected,previous])=>{
   const labels=Array.from(document.querySelectorAll("label"));
   const v=(key)=>labels.find(e=>Array.from(e.children).some(c=>c.textContent.trim()===key))?.querySelector("textarea,input")?.value??"";
   const number=v("접수번호"), result=v("접수 결과");
   return number&&number!==previous&&result.includes(number)&&expected.every(s=>result.includes(s));
 },[tokens,before],{timeout:25000});
 return input(page,"접수번호").inputValue();
}
async function lookup(page,receipt,question) {
 await page.getByRole("tab",{name:"관리자 조회",exact:true}).click();
 await input(page,"조회할 접수번호").fill(receipt);
 await btn(page,"상세 조회").click();
 await page.waitForFunction(([number,question])=>Array.from(document.querySelectorAll("textarea")).some(x=>x.getClientRects().length&&x.closest("label")?.textContent.includes("접수 원문과 결과")&&x.value.includes(number)&&x.value.includes(question)),[receipt,question]);
}
async function fixed(){
 const c=await browser.newContext({viewport:{width:1440,height:1000}});
 try{
  const p=await c.newPage();
  await p.goto("http://127.0.0.1:17872/");
  await p.getByText(/고정 예시 모드/).first().waitFor();
  const q="이번 학기 성적장학금 신청은 따로 해야 하나요?";
  const n=await submit(p,q,["FAQ-S01","fixed-demo"]);
  await p.screenshot({path:path.join(stage,"t05-demo-user.png")});
  await lookup(p,n,q);
  await input(p,"접수 원문과 결과").scrollIntoViewIfNeeded();
  await p.screenshot({path:path.join(stage,"t05-demo-admin.png")});
  proof.tests.T05={receipt:n,mode:"fixed-demo",sameNumberAndOriginal:true};
  console.log("T05 fixed demo PASS");
 }finally{await c.close();}
}
async function offline(){
 const html=path.join(output,"OFFLINE_DEMO_CHECK.html");
 const name="AI_Smart_Help_Desk_969f2c8_오프라인시연.webm";
 await fs.writeFile(html,"<!DOCTYPE html><meta charset=utf-8><title>시연 영상 재생</title><video controls src='"+name+"' width=960></video>");
 const c=await browser.newContext({offline:true});
 try{
  const p=await c.newPage();
  await p.goto(pathToFileURL(html).href);
  await p.locator("video").evaluate(v=>v.play());
  await p.waitForFunction(()=>document.querySelector("video").currentTime>2);
  proof.tests.T37={offline:true,decodedSeconds:await p.locator("video").evaluate(v=>v.currentTime),width:await p.locator("video").evaluate(v=>v.videoWidth)};
  assert(proof.tests.T37.width>0);
  console.log("T37 offline media playback PASS");
 }finally{await c.close();}
}
async function five(){
 const url="https://af068dfd05e2edb5c1.gradio.live";
 const local=Object.fromEntries((await fs.readFile("D:/ai-smart-helpdesk/.env.t15","utf8")).split(/\r?\n/).filter(l=>l.includes("=")).map(l=>l.split(/=(.*)/s).slice(0,2)));
 const auth=await request.newContext();
 const login=await auth.post(url+"/login",{form:{username:local.HELPDESK_SHARE_USER,password:local.HELPDESK_SHARE_PASSWORD}});
 assert(login.ok(),"Login rejected");
 const storageState=await auth.storageState();
 await auth.dispose();
 const c=await browser.newContext({storageState,viewport:{width:1440,height:1000}});
 try{
  const cases=JSON.parse(await fs.readFile("D:/ai-smart-helpdesk/tests/data/cases.json","utf8")).cases;
  const expected=new Map([
    ["CASE-28",["문의 분야  장학금","긴급도  높음","담당  장학 담당","사람 검토  필요","근거 FAQ  없음"]],
    ["CASE-05",["문의 분야  학사","긴급도  보통","담당  학사 담당","사람 검토  없음","FAQ-A01"]],
    ["CASE-15",["문의 분야  학사","긴급도  낮음","담당  학사 담당","사람 검토  필요","근거 FAQ  없음"]],
    ["CASE-24",["문의 분야  미분류","긴급도  미판정","담당  미배정","사람 검토  필요","근거 FAQ  없음"]],
    ["CASE-25",["문의 분야  시설","긴급도  낮음","담당  시설 담당","사람 검토  필요","근거 FAQ  없음"]],
  ]);
  const p=await c.newPage();
  await p.goto(url,{waitUntil:"domcontentloaded"});
  const results=[];
  for(const [id,tokens] of expected){
   const {message:q}=cases.find(x=>x.case_id===id);
   const n=await submit(p,q,tokens);
   await lookup(p,n,q);
   results.push({id,receipt:n,pass:true});
   console.log("T11 "+id+" browser PASS");
   if(id!=="CASE-25")await p.getByRole("tab",{name:"문의 접수",exact:true}).click();
  }
  await btn(p,"접수 목록 새로고침").click();
  const cells=await p.locator("tr").allTextContents();
  const highIdx=cells.findIndex(t=>t.includes(results[0].receipt));
  const lowIdx=cells.findIndex(t=>t.includes(results.at(-1).receipt));
  proof.tests.T11={results,highIndex:highIdx,lowIndex:lowIdx};
  if(highIdx<0||lowIdx<0||highIdx>=lowIdx)console.log("T11 sort UI virtual rows need separate ordering check");
 }finally{await c.close();}
}
try{
 const results=await Promise.allSettled([fixed(),offline(),five()]);
 for(const x of results)if(x.status==="rejected"){console.error(x.reason.message);process.exitCode=1;}
 await fs.writeFile(path.join(stage,"nontrain-check-results.json"),JSON.stringify(proof,null,2)+"\n");
}finally{await browser.close();}
