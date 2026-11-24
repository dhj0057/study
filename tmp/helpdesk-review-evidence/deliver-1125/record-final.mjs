
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright/index.mjs";

const output = "D:/study/tmp/helpdesk-review-evidence/deliver-1125";
const url = "http://127.0.0.1:17879/";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--no-proxy-server"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 }, recordVideo: { dir: output, size: { width: 1440, height: 900 } },
});
const p = await context.newPage();
p.setDefaultTimeout(25000);
const card = p.locator("#desk-receipt-summary");
const receipt = p.locator("#desk-receipt-id textarea, #desk-receipt-id input").first();
const tab = name => p.getByRole("tab", { name, exact: true }).click();
const button = name => p.getByRole("button", { name, exact: true }).first();
const title = name => p.getByRole("heading", { name, exact: true });
const field = label => p.locator("label").filter({ has: p.getByText(label, { exact: true }) }).locator("input,textarea").first();

async function caption(text) {
  await p.evaluate(text => {
    let el = document.getElementById("demo-caption");
    if (!el) {
      el = document.createElement("div");
      el.id = "demo-caption";
      el.style.cssText = "position:fixed;right:27px;bottom:22px;z-index:9999;max-width:calc(100vw - 54px);border:1px solid #cee5d6;border-left:5px solid #197446;border-radius:10px;background:#fff;color:#152922;padding:13px 19px;pointer-events:none;font:700 17px/1.45 Malgun Gothic, sans-serif;box-shadow:0 4px 18px #162e2320;";
      document.body.append(el);
    }
    el.textContent = text;
  }, text);
}

async function capture(name) {
  const label = p.locator("#demo-caption");
  if (await label.count()) await label.evaluate(el => { el.hidden = true; });
  await p.screenshot({ path: output + "/" + name + ".png", fullPage: false });
  if (await label.count()) await label.evaluate(el => { el.hidden = false; });
}

async function submit(message, expected) {
  const previous = await receipt.inputValue();
  await p.locator("#desk-inquiry textarea").fill(message);
  await p.waitForTimeout(850);
  await p.locator("#desk-send").click();
  await p.waitForFunction(previous => {
    const el = document.querySelector("#desk-receipt-id textarea, #desk-receipt-id input");
    return el?.value && el.value !== previous;
  }, previous);
  const target = card.getByText(expected, { exact: false }).first();
  const failed = card.getByText(/^(답변|분류) 호출 실패$/).first();
  await target.or(failed).first().waitFor();
  if (await failed.isVisible()) {
    await caption("잠시 연결이 지연되면 같은 번호로 AI 처리를 다시 시도합니다.");
    await p.locator("#desk-retry").click();
    await target.waitFor();
  }
  const id = await receipt.inputValue();
  assert.match(id, /^[a-f0-9]{32}$/);
  return id;
}

async function status(value) {
  await p.getByRole("combobox", { name: "처리 상태", exact: true }).click();
  await p.getByRole("option", { name: value, exact: true }).first().click();
}
async function details(expected) {
  await p.waitForFunction(value => document.querySelector("#desk-lookup-details textarea")?.value.includes(value), expected);
}

try {
  await p.goto(url);
  await title("캠퍼스 도움말").waitFor();
  await caption("AI Smart Help Desk · 최종 화면 / 가상 대학 문의");
  await capture("home");
  await p.waitForTimeout(1700);
  await caption("도움말 검색과 FAQ 원문 열람");
  await button("수강 정정").click();
  await p.locator("#desk-help-results").getByText("검색 결과 1건").waitFor();
  await p.locator("#desk-help-results summary").filter({ hasText: "수강 정정" }).click();
  await p.locator("#desk-help-results").getByText("FAQ-A01", { exact: true }).waitFor();
  await capture("help-faq");
  await p.waitForTimeout(2900);

  await button("문의 접수로 이동").click();
  await title("대학 문의 센터").waitFor();
  await caption("일반 문의 · Gemini가 FAQ 번호를 고르고 앱이 원문을 표시");
  const faq = await submit("이번 학기 성적장학금 신청은 따로 해야 하나요?", "FAQ-S01");
  await capture("faq-receipt");
  await p.waitForTimeout(3300);

  await caption("당일 마감 문의 · 우선 확인 표시");
  const urgent = await submit("장학금 신청 마감이 오늘 6시인데 포털 장학 메뉴가 계속 오류 나요.", "우선 확인");
  await capture("urgent-receipt");
  await p.waitForTimeout(2600);
  const message = "제가 낸 휴학 신청이 승인됐나요?";
  await caption("개인별 결과 문의 · 담당자가 확인하도록 접수");
  const personal = await submit(message, "담당자 확인이 필요한 문의");
  await capture("review-receipt");
  await p.waitForTimeout(2600);

  await tab("관리자 조회");
  await caption("관리자 문의함 · 같은 접수번호로 원문 조회");
  await button("접수 목록 새로고침").click();
  await p.locator("#desk-admin-table").getByText(personal, { exact: true }).last().click();
  await details(personal);
  await details(message);
  await capture("admin-open");
  await p.waitForTimeout(2600);

  await caption("담당자가 검토 상태를 저장하고 답변을 남깁니다.");
  await status("검토 중");
  await p.locator("#desk-save").click();
  await details("상태  검토 중");
  await status("완료");
  const answer = "가상 문의의 확인 절차를 안내했습니다.";
  await field("사용자에게 보일 답변").fill(answer);
  await p.locator("#desk-save").click();
  await details("상태  완료");
  await p.locator("#desk-admin-table").getByText("완료", { exact: true }).last().waitFor();
  await p.evaluate(() => window.scrollTo({ top: 0 }));
  await capture("admin-done");
  await p.waitForTimeout(2500);

  await tab("문의 접수");
  await p.evaluate(() => window.scrollTo({ top: 0 }));
  assert.equal(await receipt.inputValue(), personal);
  await p.locator("#desk-refresh-receipt").click();
  await card.getByRole("heading", { name: "처리 완료" }).waitFor();
  await card.getByText(answer, { exact: true }).waitFor();
  await capture("student-done");
  await caption("학생 결과 확인 · 같은 번호의 완료 상태와 답변");
  await p.waitForTimeout(4150);
  const raw = await p.video().path();
  await context.close();
  const videoName = "AI_Smart_Help_Desk_1a41fc5_시연영상.webm";
  const file = output + "/" + videoName;
  await fs.copyFile(raw, file);
  await fs.writeFile(output + "/recording-evidence.json", JSON.stringify({
    commit: "1a41fc5", mode: "real Kev-4B + Gemini", faq, urgent, personal,
    sameReceiptCompleted: true, video: videoName, bytes: (await fs.stat(file)).size,
  }, null, 2));
  console.log(JSON.stringify({ ok:true, file, bytes:(await fs.stat(file)).size }));
} catch (error) {
  console.error(error);
  await p.screenshot({path: output+"/recording-error.png",fullPage:true}).catch(()=>{});
  process.exitCode=1;
} finally { await browser.close(); }