import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {chromium,request} from "playwright";

const stage=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(stage,"visual-release");
await fs.mkdir(out,{recursive:true});
const url=process.argv[2] || "http://127.0.0.1:17875";
const env=Object.fromEntries((await fs.readFile("D:/ai-smart-helpdesk/.env.t15","utf8")).split(/\r?\n/).filter(l=>l.includes("=")).map(l=>l.split(/=(.*)/s).slice(0,2)));
const auth=await request.newContext();
assert.equal((await auth.get(url+"/gradio_api/info")).status(),401);
const login=await auth.post(url+"/login",{form:{username:env.HELPDESK_SHARE_USER,password:env.HELPDESK_SHARE_PASSWORD}});
assert(login.ok(),"Team sign-in failed");
const storageState=await auth.storageState();
await auth.dispose();
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
 } catch {}
});
async function submit(message,expected,twice=false) {
 const previous=await input("접수번호").inputValue();
 await input("가상 문의").fill(message);
 if(twice) await page.locator("#desk-send").evaluate(el=>{el.click();el.click();});
 else await page.locator("#desk-send").click();
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
 const faq=await submit("성적 좋으면 장학금 신청서를 내야 하나요, 아니면 그냥 주나요?","FAQ-S01",true);
 const high=await submit("수강 정정이 오늘 마감인데 포털에서 변경 버튼이 작동하지 않아요.","우선 확인");
 const query="제가 낸 휴학 신청이 승인됐나요?";
 const personal=await submit(query,"담당자 확인이 필요한 문의입니다");
 await page.screenshot({path:path.join(out,"release-user.png"),fullPage:false});
 await tab("관리자 조회");
 await btn("접수 목록 새로고침").click();
 await table.getByText(personal,{exact:true}).last().click();
 await detailsInclude(personal);
 await detailsInclude(query);
 await selectStatus("검토 중");
 await input("사용자에게 보일 답변").fill("학사 담당자가 가상 문의를 확인 중입니다.");
 await btn("처리 내용 저장").click();
 await detailsInclude("가상 문의를 확인 중입니다.");
 await selectStatus("완료");
 await input("사용자에게 보일 답변").fill("");
 await btn("처리 내용 저장").click();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll("textarea,input")).some(el=>el.getClientRects().length&&el.value.includes("최종 답변 또는 처리 메모")));
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
 assert(submits===1,"Same-button repeat sent "+submits+" requests");
 await page.waitForTimeout(1200);
 const raw=await video.path();
 await context.close();
 const filename="AI_Smart_Help_Desk_5046d68_오프라인시연.webm";
 await fs.rename(raw,path.join(out,filename));
 const evidence={code:"5046d68",tested:"9c38a79 (identical app tree)",route:url.startsWith("http:")?"Authenticated local app in a fresh Chrome browser context":"Host PC via authenticated public HTTPS in a fresh Chrome browser context",faq,high,personal,unauthorizedStatus:401,sameButtonSubmitRequests:submits,adminRowSelect:true,blankFinishRejected:true,sameReceiptOnRefresh:true,video:filename};
 await fs.writeFile(path.join(out,"browser.json"),JSON.stringify(evidence,null,2)+"\n");
 console.log(JSON.stringify(evidence));
} finally {await browser.close();}

