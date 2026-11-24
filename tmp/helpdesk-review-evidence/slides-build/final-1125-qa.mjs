
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright/index.mjs";

const origin = "http://127.0.0.1:17879/?__theme=light";
const output = "D:/study/tmp/helpdesk-review-evidence/final-1125";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-proxy-server"]
});
const steps = [];
const input = (page, label) =>
  page.locator("label").filter({ has: page.getByText(label, { exact: true }) }).locator("input,textarea").first();
const button = (page, label) => page.getByRole("button", { name: label, exact: true }).first();
const summary = (page) => page.locator("#desk-receipt-summary");
const receipt = (page) => page.locator("#desk-receipt-id textarea, #desk-receipt-id input").first();
const status = (page) => page.getByRole("combobox", { name: "처리 상태", exact: true });
const save = (page) => page.locator("#desk-save");
const details = (page) => page.locator("#desk-lookup-details textarea");
const table = (page) => page.locator("#desk-admin-table");

async function noOverflow(page, label) {
  const { width, scrollWidth } = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  assert(scrollWidth <= width + 2, label + " content escapes viewport: " + scrollWidth + " / " + width);
}

async function waitValue(locator, substring) {
  const handle = await locator.elementHandle();
  await locator.page().waitForFunction(([element, substring]) => element.value.includes(substring), [handle, substring]);
}

async function submit(page, question, expected) {
  const previous = await receipt(page).inputValue();
  await page.locator("#desk-inquiry textarea").fill(question);
  await page.locator("#desk-send").click();
  await page.waitForFunction((number) => {
    const field = document.querySelector("#desk-receipt-id textarea, #desk-receipt-id input");
    return field?.value && field.value !== number;
  }, previous);
  const ticket = await receipt(page).inputValue();
  const target = summary(page).getByText(expected, { exact: false }).first();
  const retryable = summary(page).getByText(/^(답변|분류) 호출 실패$/).first();
  if (expected.includes("실패")) {
    await target.waitFor({ timeout: 25000 });
  } else {
    await target.or(retryable).first().waitFor({ timeout: 25000 });
    if (await retryable.isVisible()) {
      await page.locator("#desk-retry").click();
      await target.waitFor({ timeout: 25000 });
      assert.equal(await receipt(page).inputValue(), ticket);
    }
  }
  assert(/^[a-f0-9]{32}$/.test(ticket) && ticket !== previous);
  return ticket;
}

async function choose(page, field, choice) {
  await field.click();
  await page.getByRole("option", { name: choice, exact: true }).first().click();
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1366, height: 768 }, permissions: ["clipboard-read", "clipboard-write"] });
  const p = await desktop.newPage();
  await p.goto(origin);
  await p.getByRole("tab", { name: "문의 접수", exact: true }).click();
  await p.getByRole("heading", { name: "대학 문의 센터" }).waitFor();
  await noOverflow(p, "desktop user");
  const action = await p.locator("#desk-send").boundingBox();
  assert(action && action.y + action.height <= 768, "primary action below the viewport");
  await p.getByText("가상 문의 예시", { exact: true }).click();
  const example = p.getByText("수강 정정 기간이 언제인가요?", { exact: true }).last();
  await example.click();
  await waitValue(p.locator("#desk-inquiry textarea"), "수강 정정");
  await p.getByText("가상 문의 예시", { exact: true }).click();
  await p.locator("#desk-inquiry textarea").fill("");
  await p.screenshot({ path: output + "/student-start.png", fullPage: true });
  steps.push("example chooser");

  await submit(p, "이번 학기 성적장학금 신청은 따로 해야 하나요?", "FAQ-S01");
  const faqCard = await summary(p).innerText();
  assert(faqCard.includes("별도 신청이 필요 없습니다") && faqCard.includes("접수 완료"));
  await p.screenshot({ path: output + "/student-faq.png", fullPage: true });
  steps.push("live FAQ and source");

  const urgent = await submit(p, "장학금 신청 마감이 오늘 6시인데 포털 장학 메뉴가 계속 오류 나요.", "우선 확인");
  steps.push("urgent priority");
  const personal = await submit(p, "제가 낸 휴학 신청이 승인됐나요?", "담당자 확인");
  assert((await summary(p).innerText()).includes("사람 검토"));
  const copy = p.locator("#desk-receipt-id").getByRole("button", { name: /copy|복사/i });
  await copy.click();
  assert.equal(await p.evaluate(() => navigator.clipboard.readText()), personal);
  steps.push("personal review and receipt copy");


  await p.getByRole("tab", { name: "관리자 조회", exact: true }).click();
  await noOverflow(p, "desktop admin");
  await button(p, "접수 목록 새로고침").click();
  await table(p).getByText(urgent, { exact: true }).last().waitFor();
  const urgencyFilter = p.getByRole("combobox", { name: "긴급도 필터", exact: true });
  await choose(p, urgencyFilter, "높음 · 우선 확인");
  await table(p).getByText(personal, { exact: true }).last().waitFor({ state: "hidden" });
  await table(p).getByText(urgent, { exact: true }).last().waitFor();
  await choose(p, urgencyFilter, "전체");
  const personalCell = table(p).getByText(personal, { exact: true }).last();
  await personalCell.waitFor();
  await personalCell.click();
  await waitValue(details(p), "제가 낸 휴학 신청이 승인됐나요?");
  await waitValue(details(p), personal);
  steps.push("admin filters and row lookup");

  await choose(p, status(p), "검토 중");
  await save(p).click();
  await waitValue(details(p), "상태  검토 중");
  await table(p).getByText("검토 중", { exact: true }).last().waitFor();
  await choose(p, status(p), "완료");
  const reply = input(p, "사용자에게 보일 답변");
  await reply.fill("");
  await input(p, "관리자 처리 메모").fill("");
  await save(p).click();
  await waitValue(input(p, "저장 안내"), "완료하려면 최종 답변 또는 처리 메모를 입력해 주세요.");
  assert((await details(p).inputValue()).includes("상태  검토 중"));
  await reply.fill("가상 문의의 확인 절차를 안내했습니다.");
  await save(p).click();
  await waitValue(details(p), "상태  완료");
  await waitValue(details(p), personal);
  await table(p).getByText("완료", { exact: true }).last().waitFor();
  await p.screenshot({ path: output + "/admin.png", fullPage: true });
  steps.push("empty completion guard and normal completion");

  await p.getByRole("tab", { name: "문의 접수", exact: true }).click();
  await receipt(p).fill(personal);
  await p.locator("#desk-inquiry textarea").fill("제가 낸 휴학 신청이 승인됐나요?");
  await p.locator("#desk-refresh-receipt").click();
  await summary(p).getByRole("heading", { name: "처리 완료" }).waitFor();
  assert((await summary(p).innerText()).includes("가상 문의의 확인 절차를 안내했습니다."));
  assert.equal(await receipt(p).inputValue(), personal);
  await p.screenshot({ path: output + "/student-complete.png", fullPage: true });
  steps.push("student sees answer under the same receipt");

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const m = await mobile.newPage();
  await m.goto(origin);
  await m.getByRole("tab", { name: "문의 접수", exact: true }).click();
  await m.getByRole("heading", { name: "대학 문의 센터" }).waitFor();
  await noOverflow(m, "mobile user");
  await receipt(m).fill(personal);
  await m.locator("#desk-refresh-receipt").click();
  await summary(m).getByRole("heading", { name: "처리 완료" }).waitFor();
  await m.screenshot({ path: output + "/mobile.png", fullPage: true });
  await m.getByRole("tab", { name: "관리자 조회", exact: true }).click();
  await noOverflow(m, "mobile admin");
  const dark = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
  await dark.goto("http://127.0.0.1:17879/?__theme=dark");
  await dark.getByRole("tab", { name: "문의 접수", exact: true }).click();
  await dark.getByRole("heading", { name: "대학 문의 센터" }).waitFor();
  await dark.waitForFunction(() => !document.body.classList.contains("dark"));
  await dark.screenshot({ path: output + "/dark.png", fullPage: true });
  steps.push("1366px, 390px, and dark mode");
  console.log(JSON.stringify({ ok: true, steps }));
} catch (error) {
  console.error(error);
  console.error(JSON.stringify({ steps }));
  await browser.contexts()[0]?.pages()[0]?.screenshot({ path: output + "/qa-error.png", fullPage: true });
  process.exitCode = 1;
} finally {
  await browser.close();
}
