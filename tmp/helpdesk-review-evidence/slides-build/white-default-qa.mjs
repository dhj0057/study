
import assert from "node:assert/strict";
import { chromium } from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright/index.mjs";
const url=process.argv[2]||"http://127.0.0.1:17878/";
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
const white="rgb(255, 255, 255)";
async function verify(p, section, heading) {
  await p.getByRole("heading",{name:heading,exact:true}).waitFor();
  await p.waitForFunction(() => !document.body.classList.contains("dark"), null, {timeout:5000});
  const palette=await p.locator(section).evaluateAll(els=>[getComputedStyle(document.body).backgroundColor,...els.map(el=>getComputedStyle(el).backgroundColor)]);
  assert(palette.length >= 2 && palette.every(color=>color===white), JSON.stringify(palette));
}
try {
  for(const mode of ["light","dark"]) {
    const p=await browser.newPage({colorScheme:mode,viewport:{width:1366,height:900}});
    await p.goto(url);
    await verify(p,".desk-help-hero","캠퍼스 도움말");
    await p.emulateMedia({colorScheme:mode==="dark"?"light":"dark"});
    await verify(p,".desk-help-hero","캠퍼스 도움말");
    if(mode==="dark"){
      await p.screenshot({path:"D:/study/tmp/helpdesk-review-evidence/white-green/white-default.png",fullPage:true});
      await p.getByRole("button",{name:"휴학 신청",exact:true}).click();
      await p.locator("#desk-help-results").getByText("검색 결과 1건").waitFor();
      await p.getByRole("button",{name:"문의 접수로 이동",exact:true}).click();
      await verify(p,".desk-hero","대학 문의 센터");
      await p.getByRole("tab",{name:"관리자 조회",exact:true}).click();
      await verify(p,".desk-admin-grid .desk-panel","관리자 문의함");
    }
    await p.close();
  }
  const p=await browser.newPage({colorScheme:"dark"});
  await p.goto(url+"?__theme=dark");
  await verify(p,".desk-help-hero","캠퍼스 도움말");
  console.log(JSON.stringify({url, desktop:["light","dark","system changed","explicit dark"],screens:["help","request","admin"],faqSearch:true}));
}finally{await browser.close();}