
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright/index.mjs";

const output = "D:/study/tmp/helpdesk-review-evidence/faq-home";
const url = "http://127.0.0.1:17876/";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const outcomes = [];
const results = p => p.locator("#desk-help-results");
const field = p => p.locator("#desk-help-query").getByRole("textbox");
const button = (p, name) => p.getByRole("button", { name, exact: true });

async function dimensions(p) {
  const d = await p.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  assert(d.document <= d.viewport + 2, JSON.stringify(d));
}

try {
  const p = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await p.goto(url + "?__theme=light");
  await p.getByRole("heading", { name: "캠퍼스 도움말" }).waitFor();
  assert.equal(await results(p).locator("details").count(), 12);
  await dimensions(p);
  await p.screenshot({ path: output + "/help-center.png", fullPage: true });

  const query = field(p);
  await query.fill("수강정정");
  await query.press("Enter");
  await results(p).getByText("검색 결과 1건", { exact: true }).waitFor();
  const card = results(p).locator("summary").filter({ hasText: "수강 정정" });
  await card.click();
  await results(p).getByText("FAQ-A01", { exact: true }).waitFor();
  assert(await results(p).locator("details[open] p").isVisible());
  outcomes.push("search Enter and open answer");

  await query.fill("");
  await button(p, "검색").click();
  await results(p).locator("details").nth(11).waitFor();
  await p.locator("#desk-help-topics label").filter({ has: p.getByRole("radio", {name:"시설",exact:true}) }).click();
  await results(p).locator("summary").filter({ hasText: "열람실" }).waitFor();
  await p.waitForFunction(() => document.querySelectorAll("#desk-help-results details").length === 4);
  assert.equal(await results(p).locator("summary").filter({ hasText: "국가장학금" }).count(), 0);
  outcomes.push("category filter");

  await button(p, "휴학 신청").click();
  await results(p).getByText("검색 결과 1건", { exact: true }).waitFor();
  assert.equal(await query.inputValue(), "휴학 신청");
  await results(p).locator("summary").filter({ hasText: "휴학 신청" }).click();
  await results(p).getByText("FAQ-A02", { exact: true }).waitFor();
  await p.screenshot({ path: output + "/faq-answer.png", fullPage: true });
  outcomes.push("recommended query");

  await query.fill("없는도움말xyz");
  await button(p, "검색").click();
  await results(p).getByText("일치하는 도움말이 없어요.", { exact: true }).waitFor();
  assert.equal(await results(p).locator("details").count(), 0);
  await button(p, "문의 접수로 이동").click();
  await p.getByRole("heading", { name: "대학 문의 센터" }).waitFor();
  assert.equal(await p.getByRole("tab", { name: "문의 접수", exact: true }).getAttribute("aria-selected"), "true");
  outcomes.push("no-result guidance and route to inquiry");

  const admin = p.getByRole("tab", { name: "관리자 조회", exact: true });
  await admin.click();
  await p.getByRole("heading", { name: "관리자 문의함" }).waitFor();
  await button(p, "접수 목록 새로고침").click();
  const table = p.locator("#desk-admin-table");
  await table.getByText("접수번호", { exact: true }).first().waitFor();
  assert(!/[a-f0-9]{32}/.test(await table.innerText()));
  outcomes.push("FAQ browsing creates no ticket");

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await mobile.newPage();
  await m.goto(url + "?__theme=light");
  await m.getByRole("heading", { name: "캠퍼스 도움말" }).waitFor();
  await dimensions(m);
  await m.screenshot({ path: output + "/help-center-mobile.png" });
  outcomes.push("mobile layout");
  const dark = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: "dark" });
  await dark.goto(url + "?__theme=dark");
  await dark.getByRole("heading", { name: "캠퍼스 도움말" }).waitFor();
  assert(await dark.locator("body").evaluate(el => el.classList.contains("dark")));
  await dimensions(dark);
  outcomes.push("dark layout");
  console.log(JSON.stringify(outcomes));
} catch (e) {
  console.error(e);
  console.error(JSON.stringify(outcomes));
  await browser.contexts()[0]?.pages()[0]?.screenshot({ path: output + "/error.png", fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
