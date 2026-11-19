import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {chromium} from "playwright";

const stage=path.dirname(fileURLToPath(import.meta.url));
const origin=process.argv[2]||"http://127.0.0.1:17874";
const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--no-proxy-server"]});
const input=(page,t)=>page.locator("label").filter({has:page.getByText(t,{exact:true})}).locator("input,textarea").first();
const button=(page,t)=>page.getByRole("button",{name:t,exact:true}).and(page.locator("button:not([tabindex='-1'])")).first();
const view=async (p,t)=>p.getByRole("tab",{name:t,exact:true}).click();
const output=path.join(stage,"..","visual-output");
await fs.mkdir(output,{recursive:true});
async function layout(p,name) {
 const dims=await p.evaluate(()=>({width:window.innerWidth,body:document.documentElement.scrollWidth}));
 assert(dims.body<=dims.width+2,name+" overflow "+JSON.stringify(dims));
}
async function fillSubmit(p,q,label) {
 const previous=await input(p,"접수번호").inputValue();
 await input(p,"가상 문의").fill(q);
 await p.locator("#desk-send").click();
 await p.locator("#desk-receipt-summary").getByText(label,{exact:false}).first().waitFor({timeout:20000});
 const receipt=await input(p,"접수번호").inputValue();
 assert(receipt && receipt!==previous);
 return receipt;
}
try {
 const desktop=await b.newContext({viewport:{width:1440,height:1000},colorScheme:"light"});
 const p=await desktop.newPage();
 await p.goto(origin+"/?__theme=light");
 await p.getByRole("heading",{name:"무엇을 도와드릴까요?"}).waitFor();
 await p.locator("#desk-send").waitFor();
 await p.getByText("가상 문의 예시",{exact:true}).click();
 await p.getByText("수강 정정 기간이 언제인가요?",{exact:true}).last().waitFor();
 await p.getByText("가상 문의 예시",{exact:true}).click();
 await p.screenshot({path:path.join(output,"desk-user.png"),fullPage:true});
 await layout(p,"desktop");
 const first=await fillSubmit(p,"수강 정정 기간이 언제인가요?","FAQ-A01");
 const high=await fillSubmit(p,"수강 정정이 오늘 마감인데 포털에서 변경 버튼이 작동하지 않아요.","우선 확인");
 await p.screenshot({path:path.join(output,"desk-result.png"),fullPage:true});
 await view(p,"관리자 조회");
 await button(p,"접수 목록 새로고침").click();
 const table=p.locator("#desk-admin-table");
 await table.getByText(high,{exact:true}).last().waitFor();
 await table.getByText(high,{exact:true}).last().click();
 await p.waitForFunction(([receipt])=>{
   const field=Array.from(document.querySelectorAll("label")).find(e=>e.textContent.includes("조회할 접수번호"))?.querySelector("input,textarea");
   return field?.value===receipt;
 },[high],{timeout:9000});
 const details=input(p,"접수 원문과 결과");
 await p.waitForFunction(receipt=>document.querySelector("#desk-lookup-details textarea")?.value.includes(receipt),high);
 assert((await details.inputValue()).includes("수강 정정이 오늘 마감"));
 const status=p.getByRole("combobox",{name:"처리 상태",exact:true});
 await status.focus();
 await status.press("ArrowDown");
 await p.locator('[role=option][aria-label="검토 중"]').click();
 await input(p,"사용자에게 보일 답변").fill("학사 담당자가 확인 중입니다.");
 await button(p,"처리 내용 저장").click();
 await p.waitForFunction(()=>document.querySelector("#desk-lookup-details textarea")?.value.includes("학사 담당자가 확인 중입니다."));
 await table.getByText("검토 중",{exact:true}).last().waitFor();
 await p.screenshot({path:path.join(output,"desk-admin.png"),fullPage:true});
 await layout(p,"admin");
 await view(p,"문의 접수");
 await input(p,"접수번호").fill(high);
 await button(p,"접수 결과 새로고침").click();
 await p.locator("#desk-receipt-summary").getByText("학사 담당자가 확인 중입니다.",{exact:true}).waitFor();
 const mobile=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,colorScheme:"light"});
 const m=await mobile.newPage();
 await m.goto(origin+"/?__theme=light");
 await m.locator("#desk-send").waitFor();
 await layout(m,"mobile");
 await m.screenshot({path:path.join(output,"desk-mobile.png"),fullPage:true});
 await view(m,"관리자 조회");
 await button(m,"접수 목록 새로고침").click();
 await table.first().count();
 await layout(m,"mobile admin");
 const dark=await b.newContext({viewport:{width:1440,height:1000},colorScheme:"dark"});
 const d=await dark.newPage();
 await d.goto(origin+"/?__theme=dark");
 await d.locator("#desk-send").waitFor();
 await d.screenshot({path:path.join(output,"desk-dark.png"),fullPage:true});
 const data={first,high,desktop:true,mobile:true,dark:true,rowSelect:true,adminEdit:true,userRefresh:true};
 await fs.writeFile(path.join(output,"check.json"),JSON.stringify(data,null,2)+"\n");
 console.log(JSON.stringify(data));
}finally{await b.close();}
