import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium,request} from "playwright";

const stage=path.dirname(fileURLToPath(import.meta.url)), output=path.join(stage,"..","slides-output");
const url="https://af068dfd05e2edb5c1.gradio.live";
const env=Object.fromEntries((await fs.readFile("D:/ai-smart-helpdesk/.env.t15","utf8")).split(/\r?\n/).filter(l=>l.includes("=")).map(l=>l.split(/=(.*)/s).slice(0,2)));
const auth=await request.newContext();
const login=await auth.post(url+"/login",{form:{username:env.HELPDESK_SHARE_USER,password:env.HELPDESK_SHARE_PASSWORD}});
if(!login.ok())throw Error("Candidate sign-in failed ("+login.status()+")");
const storageState=await auth.storageState();
await auth.dispose();
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--no-proxy-server"]});
const context=await browser.newContext({storageState,viewport:{width:1440,height:1000},recordVideo:{dir:stage,size:{width:1440,height:1000}}});
const page=await context.newPage();
const video=page.video();
page.setDefaultTimeout(22000);
const input=(t)=>page.locator("label").filter({has:page.getByText(t,{exact:true})}).locator("input,textarea").first();
const btn=(t)=>page.getByRole("button",{name:t,exact:true}).and(page.locator("button:not([tabindex='-1'])")).first();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const awaitValue=async (label,part)=>{await input(label).waitFor({state:"visible"});await page.waitForFunction(([selector,part])=>Array.from(document.querySelectorAll("textarea,input")).some(e=>e.getClientRects().length && e.value.includes(part)&&e.closest("label")?.textContent.includes(selector)),[label,part]);};
async function submit(message,verify){
 await input("가상 문의").fill(message);
 const before=await input("접수번호").inputValue();
 await pause(480);
 await btn("문의 접수").click();
 await page.waitForFunction(([expected,previous])=>{
   const labels=Array.from(document.querySelectorAll("label"));
   const match=(key)=>labels.find(e=>Array.from(e.children).some(c=>c.textContent.trim()===key))?.querySelector("textarea,input")?.value??"";
   const receipt=match("접수번호"), result=match("접수 결과");
   return receipt&&receipt!==previous&&result.includes(receipt)&&result.includes(expected);
 },[verify,before]);
 const receipt=await input("접수번호").inputValue();
 if(!receipt)throw Error("Missing receipt");
 await pause(1600);
 return receipt;
}
async function selectStatus(label) {
 await page.waitForFunction(()=>{const x=document.querySelector('[role=combobox][aria-label="처리 상태"]');return x&&!x.disabled;});
 const box=page.locator('[role=combobox][aria-label="처리 상태"]');
 await box.focus();
 await box.press("ArrowDown");
 await page.locator('[role=option][aria-label="'+label+'"]').click();
}
try{
 await page.goto(url,{waitUntil:"domcontentloaded"});
 await input("가상 문의").waitFor();
 await pause(750);
 const faq=await submit("이번 학기 성적장학금 신청은 따로 해야 하나요?","FAQ-S01");
 const high=await submit("수강 정정이 오늘 마감인데 포털에서 변경 버튼이 작동하지 않아요.","높음");
 const personal=await submit("제가 낸 휴학 신청이 승인됐나요?","사람 검토  필요");
 await page.getByRole("tab",{name:"관리자 조회",exact:true}).click();
 await input("조회할 접수번호").fill(personal);
 await btn("상세 조회").click();
 await awaitValue("접수 원문과 결과",personal);
 await selectStatus("검토 중");
 await input("사용자에게 보일 답변").fill("학사 담당자가 가상 문의를 확인 중입니다.");
 await btn("처리 내용 저장").click();
 await awaitValue("접수 원문과 결과","확인 중입니다.");
 await pause(1100);
 await selectStatus("완료");
 await input("사용자에게 보일 답변").fill("");
 await btn("처리 내용 저장").click();
 await awaitValue("저장 안내","최종 답변 또는 처리 메모");
 await pause(1500);
 await input("사용자에게 보일 답변").fill("가상 문의의 확인 절차를 안내했습니다.");
 await btn("처리 내용 저장").click();
 await awaitValue("접수 원문과 결과","확인 절차를 안내했습니다.");
 await pause(1200);
 await page.getByRole("tab",{name:"문의 접수",exact:true}).click();
 await btn("접수 결과 새로고침").click();
 await awaitValue("접수 결과","확인 절차를 안내했습니다.");
 const after=await input("접수번호").inputValue();
 if(after!==personal)throw Error("User receipt changed after completion");
 await pause(1700);
 await context.close();
 await video.saveAs(path.join(output,"AI_Smart_Help_Desk_969f2c8_오프라인시연.webm"));
 const evidence={tested_release:"969f2c8",mode:"shared HTTPS real Kev/Gemini",faq,high,personal,same_receipt_after_completion:true,empty_completion_rejected:true,model_training_executed:false};
 await fs.writeFile(path.join(stage,"demo-evidence.json"),JSON.stringify(evidence,null,2)+"\n");
 console.log(JSON.stringify(evidence));
} finally{
 await browser.close();
}
