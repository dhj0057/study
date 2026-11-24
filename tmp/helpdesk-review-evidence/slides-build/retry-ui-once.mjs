import assert from "node:assert/strict";
import {chromium} from "playwright";
const url="http://127.0.0.1:17876";
const b=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--no-proxy-server"]});
const p=await b.newPage({viewport:{width:1360,height:900}});
p.setDefaultTimeout(14500);
const button=(t)=>p.getByRole("button",{name:t,exact:true}).and(p.locator("button:not([tabindex='-1'])")).first();
const field=(t)=>p.locator("label").filter({has:p.getByText(t,{exact:true})}).locator("input,textarea").first();
const card=p.locator("#desk-receipt-summary");
const query="이번 학기 성적장학금 신청은 따로 해야 하나요?";
try {
  await p.goto(url);
  await field("가상 문의").fill(query);
  await p.waitForTimeout(440);
  await button("문의 접수").click();
  await card.getByText("분류 호출 실패",{exact:true}).waitFor();
  const receipt=await field("접수번호").inputValue();
  assert.match(receipt,/^[0-9a-f]{32}$/);
  assert.equal(await button("AI 처리 재시도").isEnabled(),true);
  await button("AI 처리 재시도").click();
  await card.getByText("근거 FAQ FAQ-S01",{exact:true}).waitFor();
  assert.equal(await field("접수번호").inputValue(),receipt);
  assert.equal(await card.getByText("분류 호출 실패",{exact:true}).count(),0);
  assert.equal(await button("AI 처리 재시도").isEnabled(),false);
  await p.getByRole("tab",{name:"관리자 조회",exact:true}).click();
  await button("접수 목록 새로고침").click();
  await p.locator("#desk-admin-table").getByText(receipt,{exact:true}).last().click();
  await p.waitForFunction(([receipt,query])=>{const value=document.querySelector("#desk-lookup-details textarea")?.value??"";return value.includes(receipt)&&value.includes(query)&&value.includes("FAQ-S01");},[receipt,query]);
  console.log(JSON.stringify({receipt,query,visibleInitialError:true,retryButtonRecoveredFaq:true,sameNumber:true,originalInAdmin:true,errorCleared:true,retryDisabledAfterRecovery:true,faq:"FAQ-S01"}));
} finally {await b.close();}

