const { spawn } = require("node:child_process");
const { readFileSync, writeFileSync } = require("node:fs");
const { setTimeout: delay } = require("node:timers/promises");
const assert = require("node:assert/strict");
const origin = "https://ea794558ee7fab65d2.gradio.live";
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless", "--disable-gpu", "--no-first-run", "--no-proxy-server",
  "--user-data-dir=D:\\study\\tmp\\helpdesk-review-evidence\\t16-browser-profile",
  "--remote-debugging-port=19223","about:blank",
], { windowsHide: true, stdio: "ignore" });
let ws;
async function waitFor(label, test) {
  for (let tries = 0; tries < 160; tries++) {
    try { const value = await test(); if (value) return value; }
    catch(e) { if (tries === 159) throw e; }
    await delay(250);
  }
  throw new Error("Timed out: " + label);
}
async function run() {
  const credentials = Object.fromEntries(readFileSync("D:\\ai-smart-helpdesk\\.env.t15", "utf8")
    .split(/\r?\n/).filter(s => s.includes("=")).map(s => s.split(/=(.*)/s).slice(0, 2)));
  const login = await fetch(origin + "/login", { method: "POST", body: new URLSearchParams({
    username: credentials.HELPDESK_SHARE_USER, password: credentials.HELPDESK_SHARE_PASSWORD,
  })});
  assert.equal(login.status, 200);
  const tab = await waitFor("browser", async () => (await (await fetch("http://127.0.0.1:19223/json/list")).json()).find(x=>x.type==="page"));
  ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject) => { ws.onopen=resolve; ws.onerror=reject; });
  const awaits = new Map();
  let id = 0;
  let submits = 0;
  const message = "신청 기간이 언제예요? (가상 연속 접수 검증 " + Date.now() + ")";
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (awaits.has(m.id)) {
      const {resolve,reject}=awaits.get(m.id);
      awaits.delete(m.id);
      m.error ? reject(m.error) : resolve(m.result);
    }
    if (m.method==="Network.requestWillBeSent" && m.params.request.url.includes("/queue/join")) {
      try { if (JSON.parse(m.params.request.postData).data[0]===message) submits++; } catch {}
    }
  };
  function call(method, params={}) { return new Promise((resolve,reject) => {
    awaits.set(++id,{resolve,reject}); ws.send(JSON.stringify({id,method,params}));
  }); }
  function helper() {
    const vis=e=>e.getClientRects().length>0;
    const entry=t=>[...document.querySelectorAll("label")].filter(vis).find(e=>[...e.children].some(c=>c.textContent.trim()===t))?.querySelector("textarea,input");
    const button=(t,tag="button:not([role=tab]):not([tabindex='-1'])")=>[...document.querySelectorAll(tag)].find(e=>vis(e)&&e.textContent.trim()===t);
    return { entry, button };
  }
  const page = async expression => {
    const r = await call("Runtime.evaluate",{expression:"(()=>{const h=("+helper.toString()+")();return "+expression+"})()",returnByValue:true});
    if (r.exceptionDetails) throw new Error("Page evaluation failed: "+expression+" "+r.exceptionDetails.exception?.description);
    return r.result.value;
  };
  await call("Network.enable");
  for(const raw of login.headers.getSetCookie()) {
    const pair=raw.split(";")[0];
    const split=pair.indexOf("=");
    await call("Network.setCookie",{name:pair.slice(0,split),value:pair.slice(split+1),url:origin,secure:true,httpOnly:true});
  }
  await call("Page.bringToFront");
  await call("Page.navigate",{url:origin});
  await waitFor("app input",()=>page('Boolean(h.entry("가상 문의"))'));
  await waitFor("submit button",()=>page('Boolean(h.button("문의 접수"))')).catch(async err=>{
    console.error(await page('[...document.querySelectorAll("button")].filter(x=>x.textContent.includes("문의 접수")).map(x=>x.outerHTML)'));
    throw err;
  });
  await page('h.entry("가상 문의").focus()');
  await call("Input.insertText",{text:message});
  const point=await page('(()=>{const e=h.button("문의 접수");e.scrollIntoView({block:"center"});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
  for (let clicks = 1; clicks <= 2; clicks++) {
    for (const type of ["mousePressed", "mouseReleased"]) {
      await call("Input.dispatchMouseEvent",{type,...point,button:"left",clickCount:clicks});
    }
  }
  const receipt=await waitFor("receipt",()=>page('h.entry("접수번호")?.value'));
  await delay(700);
  assert.equal(submits,1,"Only one submission request during two clicks");
  await page('h.button("관리자 조회","[role=tab]").click()');
  await waitFor("admin input",()=>page('Boolean(h.entry("조회할 접수번호"))'));
  await page('h.entry("조회할 접수번호").focus()');
  await call("Input.insertText",{text:receipt});
  await page('h.button("상세 조회").click()');
  await waitFor("stored original and receipt",()=>page('h.entry("접수 원문과 결과")?.value.includes('+JSON.stringify(message)+')&&h.entry("접수 원문과 결과")?.value.includes('+JSON.stringify(receipt)+')'));
  const result={environment:"deployed HTTPS browser",release:"c7a4994",clicks:2,submission_requests:submits,receipt,same_receipt_and_original:true};
  writeFileSync("D:\\study\\tmp\\helpdesk-review-evidence\\t16-browser-duplicate.json",JSON.stringify(result,null,2)+"\n");
  console.log(JSON.stringify(result));
  await call("Browser.close").catch(()=>{});
}
run().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>{ws?.close();chrome.kill();});

