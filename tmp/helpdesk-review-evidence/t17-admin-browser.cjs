const {spawn}=require("node:child_process");
const {setTimeout:delay}=require("node:timers/promises");
const assert=require("node:assert/strict");
const chrome=spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",[
  "--headless","--disable-gpu","--no-first-run","--no-default-browser-check","--no-proxy-server",
  "--user-data-dir=D:\\study\\tmp\\helpdesk-review-evidence\\t17-browser-profile",
  "--remote-debugging-port=19224","about:blank"
],{windowsHide:true,stdio:"ignore"});
let socket;
async function waitFor(fn, label){
  for(let i=0;i<160;i++){try{const r=await fn(); if(r)return r;}catch(e){if(i===159)throw e;}await delay(200);}
  throw Error("Timed out: "+label);
}
async function run(){
  const tab=await waitFor(async()=>(await (await fetch("http://127.0.0.1:19224/json/list")).json()).find(t=>t.type==="page"),"Chrome");
  socket=new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  let id=0;
  const pending=new Map();
  socket.onmessage=e=>{const r=JSON.parse(e.data);const p=pending.get(r.id);if(p){pending.delete(r.id);r.error?p.reject(r.error):p.resolve(r.result);}
    if(r.method==="Network.requestWillBeSent" && /queue|api/.test(r.params.request.url))console.error(r.params.request.method,r.params.request.url);
    if(r.method==="Network.requestWillBeSent" && r.params.request.url.includes("/queue/join"))console.error("JOIN",r.params.request.postData);
    if(r.method==="Network.responseReceived" && /queue|api/.test(r.params.response.url))console.error("RESPONSE",r.params.response.status,r.params.response.url,r.params.response.mimeType);
    if(r.method==="Runtime.consoleAPICalled")console.error("BROWSER",r.params.args.map(x=>x.value??x.description));
    if(r.method==="Runtime.exceptionThrown")console.error(r.params.exceptionDetails.exception?.description);
    if(r.method==="Network.loadingFailed")console.error(r.params.errorText);
  };
  function call(method,params={}){
    return new Promise((resolve,reject)=>{const request={id:++id,method,params};pending.set(id,{resolve,reject});socket.send(JSON.stringify(request));});
  }
  const helpers=()=>{
    const visible=e=>e.getClientRects().length>0;
    const find=(text,tag="button:not([role=tab]):not([tabindex='-1'])")=>[...document.querySelectorAll(tag)].find(e=>visible(e)&&e.textContent.trim()===text);
    const entry=text=>[...document.querySelectorAll("label")].filter(visible).find(e=>[...e.children].some(c=>c.textContent.trim()===text))?.querySelector("textarea,input");
    const click=(text,tag)=>{const e=find(text,tag);if(!e||e.disabled)return false;e.click();return true;};
    const type=(text,value)=>{const e=entry(text);if(!e||e.disabled)return false;Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e),"value").set.call(e,value);e.dispatchEvent(new Event("input",{bubbles:true}));return true;};
    return {visible,find,entry,click,type};
  };
  async function page(code){
    const r=await call("Runtime.evaluate",{expression:"(()=>{const h=("+helpers.toString()+")();return "+code+"})()",returnByValue:true});
    if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
  async function press(text,tag="button:not([role=tab]):not([tabindex='-1'])"){
    const position=await page('(()=>{const e=h.find('+JSON.stringify(text)+','+JSON.stringify(tag)+');if(!e||e.disabled)return null;e.scrollIntoView({block:"center"});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()');
    if(!position)return false;
    await call("Input.dispatchMouseEvent",{type:"mousePressed",...position,button:"left",clickCount:1});
    await call("Input.dispatchMouseEvent",{type:"mouseReleased",...position,button:"left",clickCount:1});
    return true;
  }
  await call("Network.enable");
  await call("Runtime.enable");
  await call("Page.bringToFront");
  await call("Emulation.setFocusEmulationEnabled",{enabled:true});
  const origin = "https://af068dfd05e2edb5c1.gradio.live";
  const creds = Object.fromEntries(require("node:fs").readFileSync("D:\\ai-smart-helpdesk\\.env.t15", "utf8").split(/\r?\n/).filter(x=>x.includes("=")).map(x=>x.split(/=(.*)/s).slice(0,2)));
  const login = await fetch(origin + "/login", {method:"POST",body:new URLSearchParams({username:creds.HELPDESK_SHARE_USER,password:creds.HELPDESK_SHARE_PASSWORD})});
  assert.equal(login.status,200);
  for(const raw of login.headers.getSetCookie()) {
    const pair=raw.split(";")[0];
    const sep=pair.indexOf("=");
    await call("Network.setCookie",{name:pair.slice(0,sep),value:pair.slice(sep+1),url:origin,secure:true,httpOnly:true});
  }
  await call("Page.navigate",{url:origin});
  await waitFor(()=>page('Boolean(h.entry("가상 문의"))'),"inquiry input");
  await delay(1200);
  console.error(await page('({hidden:document.hidden,visibility:document.visibilityState,focus:document.hasFocus()})'));
  await page('document.addEventListener("click",e=>console.log("clickTarget",e.target.closest("button")?.outerHTML.slice(0,250)),true)');
  await page('h.entry("가상 문의").focus()');
  await call("Input.insertText",{text:"제가 낸 휴학 신청이 승인됐나요?"});
  assert(await press("문의 접수"));
  console.error(await page('h.find("문의 접수")?.outerHTML'));
  const receipt=await waitFor(()=>page('h.entry("접수번호")?.value'),"receipt").catch(async err=>{
    console.error(await page('[...document.querySelectorAll("textarea,[role=alert]")].filter(h.visible).map(e=>({value:e.value,text:e.parentElement.textContent.slice(0,220),id:e.id}))'));
    throw err;
  });
  assert(await page('h.click("관리자 조회","[role=tab]")'));
  await waitFor(()=>page('h.type("조회할 접수번호",'+JSON.stringify(receipt)+')'),"admin lookup");
  assert(await page('h.click("상세 조회")'));
  await waitFor(()=>page('h.find("처리 내용 저장")&&!h.find("처리 내용 저장").disabled'),"editable form");
  async function status(value){
    const open=await page('(()=>{const label=[...document.querySelectorAll("span,label")].find(e=>h.visible(e)&&e.textContent.trim()==="처리 상태");const root=label?.closest(".block")??label?.parentElement;const e=root?.querySelector("input,[role=combobox]");if(!e)return false;e.focus();return true})()');
    if(!open)console.error(await page('[...document.querySelectorAll("span,label")].filter(e=>h.visible(e)&&e.textContent.trim()==="처리 상태").map(e=>e.parentElement.outerHTML.slice(0,1800))'));
    assert(open);
    await call("Input.dispatchKeyEvent",{type:"keyDown",key:"ArrowDown",code:"ArrowDown",windowsVirtualKeyCode:40});
    await call("Input.dispatchKeyEvent",{type:"keyUp",key:"ArrowDown",code:"ArrowDown",windowsVirtualKeyCode:40});
    const point=await waitFor(()=>page('(()=>{const e=[...document.querySelectorAll("[role=option]")].find(e=>h.visible(e)&&e.getAttribute("aria-label")==='+JSON.stringify(value)+');if(!e)return null;e.scrollIntoView({block:"nearest"});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()'),"status "+value);
    await call("Input.dispatchMouseEvent",{type:"mousePressed",...point,button:"left",clickCount:1});
    await call("Input.dispatchMouseEvent",{type:"mouseReleased",...point,button:"left",clickCount:1});
    await waitFor(()=>page('document.querySelector(\'[role=combobox][aria-label="처리 상태"]\')?.value==='+JSON.stringify(value)),"selected "+value);
  }
  await status("검토 중");
  assert(await page('h.type("사용자에게 보일 답변","기존 저장 답변")'));
  assert(await page('h.click("처리 내용 저장")'));
  await waitFor(()=>page('h.entry("접수 원문과 결과")?.value.includes("기존 저장 답변")'),"initial save");
  await status("완료");
  assert(await page('h.type("사용자에게 보일 답변","")'));
  assert(await page('h.click("처리 내용 저장")'));
  const reason=await waitFor(()=>page('h.entry("저장 안내")?.value'),"rejection reason");
  assert.match(reason,/최종 답변 또는 처리 메모/);
  assert.equal(await page('h.entry("사용자에게 보일 답변").value'),"");
  assert.equal(await page('h.entry("조회할 접수번호").value'),receipt);
  assert(await page('h.entry("접수 원문과 결과")?.value.includes("기존 저장 답변")'));
  assert(await page('h.type("사용자에게 보일 답변","최종 확인 답변")'));
  assert(await page('h.click("처리 내용 저장")'));
  await waitFor(()=>page('h.entry("접수 원문과 결과")?.value.includes("최종 확인 답변")&&h.find("처리 내용 저장").disabled'),"completion");
  assert.equal(await page('Boolean(h.entry("저장 안내"))'),false);
  assert(await page('h.click("문의 접수","[role=tab]")'));
  await waitFor(()=>page('h.click("접수 결과 새로고침")'),"user refresh");
  await waitFor(()=>page('h.entry("접수 결과")?.value.includes("최종 확인 답변")'),"same receipt user result");
  console.log(JSON.stringify({receipt,checks:["normal save","empty completion rejected with visible reason","draft, detail and receipt retained","normal completion and lock","same receipt user refresh"]}));
  await call("Browser.close").catch(()=>{});
}
run().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{socket?.close();chrome.kill();});


