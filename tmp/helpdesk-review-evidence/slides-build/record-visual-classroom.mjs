import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {chromium,request} from "playwright";

const stage=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(stage,"visual-release");
await fs.mkdir(out,{recursive:true});
const url="http://127.0.0.1:7860";
const storageState=undefined;
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--no-proxy-server"]});
const context=await browser.newContext({storageState,viewport:{width:1440,height:1000},recordVideo:{dir:out,size:{width:1440,height:1000}}});
const page=await context.newPage();
const video=page.video();
page.setDefaultTimeout(35000);
const input=t=>page.locator("label").filter({has:page.getByText(t,{exact:true})}).locator("input,textarea").first();
const btn=t=>page.getByRole("button",{name:t,exact:true}).and(page.locator("button:not([tabindex='-1'])")).first();
const tab=t=>page.getByRole("tab",{name:t,exact:true}).click();
const receiptCard=page.locator("#desk-receipt-summary");
const table=page.locator("#desk-admin-table");
let submits=0;
page.on("request",req=>{
 const u=new URL(req.url());
 if(!u.pathname.endsWith("/queue/join")) return;
 try {
  const payload=req.postDataJSON();
  if (typeof payload?.data?.[0]==="string" && payload.data[0].startsWith("성적 좋으면 장학금")) submits++;
 if (typeof payload?.data?.[0]==="string" && payload.data[0].length>32) console.log("Queued",payload.data[0].slice(0,68));
 } catch {}
});
async function submit(message,expected,twice=false) {
 const previous=await input("접수번호").inputValue();
 await input("가상 문의").fill(message);
 await page.waitForTimeout(520);
 if(twice) await page.locator("#desk-send").dblclick({delay:70});
 else await page.locator("#desk-send").click();
 await page.waitForFunction(previous=>Array.from(document.querySelectorAll("label")).some(label=>Array.from(label.children).some(c=>c.textContent.trim()==="접수번호")&&((label.querySelector("input,textarea")?.value||"").length===32)&&label.querySelector("input,textarea").value!==previous),previous);
 await receiptCard.getByText(expected,{exact:false}).first().waitFor();
 const id=await input("접수번호").inputValue();
 assert(id.length===32&&id!==previous,"Missing or reused receipt");
 await page.waitForTimeout(900);
 return id;
}
async function selectStatus(value) {
 const box=page.getByRole("combobox",{name:"처리 상태",exact:true});
 await box.focus();
 await box.press("ArrowDown");
 await page.getByRole("option",{name:value,exact:true}).click();
}
async function detailsInclude(value) {
 await page.waitForFunction(expected=>document.querySelector("#desk-lookup-details textarea")?.value.includes(expected),value);
}
try {
 await page.goto(url+"/?__theme=light",{waitUntil:"domcontentloaded"});
 await page.getByRole("heading",{name:"무엇을 도와드릴까요?"}).waitFor();
 const faq=await submit("성적 좋으면 장학금 신청서를 내야 하나요, 아니면 그냥 주나요?","FAQ-S01",true); console.log("FAQ verified");
 const high=await submit("장학금 신청 마감이 오늘 6시인데 포털 장학 메뉴가 계속 오류 나요.","우선 확인"); console.log("HIGH verified");
 const query="제가 낸 휴학 신청이 승인됐나요?";
 const personal=await submit(query,"학사 담당"); console.log("Personal review verified");
 await page.screenshot({path:path.join(out,"release-user.png"),fullPage:false});
 await tab("관리자 조회");
 await btn("접수 목록 새로고침").click();
 await table.getByText(personal,{exact:true}).last().click(); console.log("Admin row opened");
 await detailsInclude(personal);
 await detailsInclude(query);
 await selectStatus("검토 중");
 await input("사용자에게 보일 답변").fill("학사 담당자가 가상 문의를 확인 중입니다.");
 await btn("처리 내용 저장").click();
 await detailsInclude("가상 문의를 확인 중입니다.");
 await selectStatus("완료");
 await input("사용자에게 보일 답변").fill("");
 await btn("처리 내용 저장").click();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll("textarea,input")).some(el=>el.getClientRects().length&&el.value.includes("최종 답변 또는 처리 메모"))); console.log("Blank completion rejected");
 assert.equal(await input("조회할 접수번호").inputValue(),personal);
 await page.waitForTimeout(650);
 const answer="가상 문의의 확인 절차를 안내했습니다.";
 await input("사용자에게 보일 답변").fill(answer);
 await btn("처리 내용 저장").click();
 await detailsInclude(answer);
 await table.getByText("완료",{exact:true}).last().waitFor();
 await page.screenshot({path:path.join(out,"release-admin.png"),fullPage:false});
 await page.waitForTimeout(1200);
 await tab("문의 접수");
 await btn("접수 결과 새로고침").click();
 await receiptCard.getByText(answer,{exact:true}).waitFor();
 assert.equal(await input("접수번호").inputValue(),personal);
 console.log("Physical double-click requests:",submits);
 await page.waitForTimeout(1200);
 const raw=await video.path();
 await context.close();
 const filename="AI_Smart_Help_Desk_5046d68_오프라인시연.webm";
 await fs.rename(raw,path.join(out,filename));
 const evidence={code:"5046d68",tested:"2557152 (same app as 5046d68)",route:"Local classroom app in a fresh Chrome browser context",faq,high,personal,sameButtonSubmitRequests:submits,physicalDoubleClick:true,adminRowSelect:true,blankFinishRejected:true,sameReceiptOnRefresh:true,video:filename};
 await fs.writeFile(path.join(out,"browser.json"),JSON.stringify(evidence,null,2)+"\n");
 console.log(JSON.stringify(evidence));
} catch (error) {
 console.log("Current result:",(await receiptCard.textContent().catch(()=>"")).trim());
 await page.screenshot({path:path.join(out,"verification-error.png")}).catch(()=>{});
 throw error;
} finally {await browser.close();}

