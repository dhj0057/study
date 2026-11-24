
import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const base = "D:/study/tmp/helpdesk-review-evidence/deliver-1125";
const target = path.join(base, "20261125_문의하지마세요_팀프로젝트.pptx");
const evidence = JSON.parse(await fs.readFile(path.join(base, "recording-evidence.json"), "utf8"));
const p = Presentation.create({ slideSize: {width:1280,height:720} });
const C = { white:"#FFFFFF", ink:"#172B23", mute:"#4F6259", green:"#197446", line:"#D9E5DF", pale:"#EBF6EF", quiet:"#F5F8F6", amber:"#774B0D", amberPale:"#FFF3D7" };
const github="https://github.com/dhj0057/ai-smart-helpdesk";
const tag=github+"/tree/demo-2026-11-25-final";
const verify=github+"/blob/demo-2026-11-25-final/docs/validation/2026-11-19-presentation-release.md";
const train=github+"/blob/demo-2026-11-25-final/docs/validation/2026-11-19-kev-training.md";
const t20="https://linear.app/dhj00570-helpdesk/issue/NONONO-31";
const t21="https://linear.app/dhj00570-helpdesk/issue/NONONO-17";
const history="https://linear.app/dhj00570-helpdesk/document/8759cf49-41d0-4231-aa52-b2181873adf2";
const receipt=evidence.personal.slice(0,8)+"…"+evidence.personal.slice(-6);
const font="Malgun Gothic";

function text(s,words,x,y,w,h,o={}){
  const sh=s.shapes.add({name:String(o.name||words).slice(0,46),geometry:"textbox",
    position:{left:x,top:y,width:w,height:h},fill:"none",line:{fill:"none",width:0}});
  sh.text=words;
  sh.text.style={typeface:font,fontSize:o.size||26,bold:o.bold||false,color:o.color||C.ink,
    alignment:o.align||"left",verticalAlignment:"top",wrap:"wrap",insets:0};
  return sh;
}
function rect(s,name,x,y,w,h,fill=C.pale,border="none",geometry="rect"){
  return s.shapes.add({name,geometry,position:{left:x,top:y,width:w,height:h},fill,line:{fill:border,width:border==="none"?0:1}});
}
function line(s,x,y,w){ rect(s,"구획선",x,y,w,1,C.line); }
function slide(title,notes,small){
  const s=p.slides.add(); s.background.fill=C.white; s.speakerNotes.text=notes;
  text(s,title,70,55,1140,70,{size:46,bold:true});
  if(small) text(s,small,71,131,1130,39,{size:21,color:C.mute});
  return s;
}
function speaker(name,time,body,src=[]){
  return name+" · "+time+"\n\n"+body+(src.length?"\n\n근거\n"+src.join("\n"):"");
}
async function image(s,name,x,y,w,h,alt){
  rect(s,"화면 테두리",x-1,y-1,w+2,h+2,C.white,C.line);
  s.images.add({blob:await fs.readFile(path.join(base,name+".png")),contentType:"image/png",fit:"contain",
    position:{left:x,top:y,width:w,height:h},alt});
}
function field(s,label,description,x,y,w){
  text(s,label,x,y,w,41,{size:28,bold:true,color:C.green});
  text(s,description,x,y+52,w,78,{size:23,color:C.mute});
}

{
  const s=p.slides.add(); s.background.fill=C.white;
  s.speakerNotes.text=speaker("시후","0:00–0:35","안녕하세요, 팀 문의하지마세요의 시후입니다. 저희는 교내 문의를 한 곳에서 받는 AI Smart Help Desk를 만들었습니다. 학생이 일반적인 절차를 물으면 근거가 있는 안내를 바로 보고, 사람의 확인이 필요한 문의는 담당자가 처리합니다. 같은 접수번호로 끝까지 확인할 수 있습니다. 문제와 구조는 팀장 형준이 설명하겠습니다.",[tag]);
  text(s,"인공지능플랫폼실습 기말 프로젝트",70,112,560,40,{size:23,color:C.green,bold:true});
  text(s,"AI Smart\nHelp Desk",66,177,568,184,{size:78,bold:true});
  text(s,"대학 문의 접수와 담당자 연결",72,393,510,53,{size:29,bold:true,color:C.mute});
  line(s,72,514,490);
  text(s,"팀 문의하지마세요   ·   2026.11.25",72,543,510,48,{size:21,bold:true});
  await image(s,"home",628,167,572,357,"최종 캠퍼스 도움말 첫 화면");
}
{
  const s=slide("어디에 물어봐야 할지부터 막힙니다",
    speaker("도형준","0:35–1:50","학생 입장에서는 질문의 내용은 알아도 어느 부서에 연락할지 알기 어렵습니다. 장학금 신청처럼 일반 절차를 묻는 사람과 본인의 휴학 처리 결과를 기다리는 사람은 필요한 답이 다릅니다. 담당자 쪽에서는 당일 마감인 문의를 먼저 확인할 수 있어야 하고, 학생이 다시 전화하지 않아도 지금 상태를 볼 수 있어야 합니다. 그래서 문제를 한 곳에서 받기, 성격에 맞게 분기하기, 같은 번호로 끝까지 확인하기로 정리했습니다.",[history]),
    "대학 안내, 개인별 결과 확인, 당일 마감 문의는 처리 방식이 다릅니다.");
  rect(s,"학생의 질문 영역",70,225,503,293,C.pale);
  text(s,"“제가 낸 휴학 신청이\n승인됐나요?”",101,269,431,120,{size:43,bold:true});
  text(s,"학생은 결과와 처리 상태가 궁금합니다.",102,428,425,60,{size:21,color:C.mute});
  const items=[
    ["한 곳에서 접수","학생이 부서를 선택하는 부담을 줄입니다."],
    ["문의에 맞춰 분기","절차 안내, 개인별 확인, 긴급 문의를 구분합니다."],
    ["같은 번호로 추적","담당자 답변과 상태를 한 번호에 남깁니다."],
  ];
  items.forEach(([a,b],i)=>{const y=224+i*106;text(s,a,637,y,533,40,{size:29,bold:true,color:C.green});text(s,b,637,y+43,521,55,{size:22,color:C.mute});});
}
{
  const s=slide("한 번 접수하고 같은 번호로 확인합니다",
    speaker("도형준","1:50–3:15","Gradio에서 학생의 문의를 받고, 서비스가 접수번호와 원문을 저장합니다. 로컬 Kev가 문의를 분류하면 앱 규칙이 부서와 처리 분기를 정합니다. 일반 문의는 Gemini로 기존 FAQ 번호를 선택하고, 긴급·개인 문의는 관리자에게 전달합니다. 관리자는 원문과 AI 판단을 보고 답변을 저장합니다. 학생은 같은 번호로 진행 상태와 최종 답변을 확인합니다. 이 구조에서 제가 공통 접수 데이터, 상태 전이, 통합을 맡았습니다. 이어서 성윤이 구조화된 분류를 설명합니다.",[tag,"https://linear.app/dhj00570-helpdesk/issue/NONONO-13"]));
  const cards=[
    ["입력","Gradio 학생 화면","문의와 접수번호"],
    ["판단","로컬 Kev-4B","분야·긴급도·검토"],
    ["분기","FAQ / 담당자","원문 안내 또는 검토"],
    ["출력","Gradio 관리자·학생","같은 번호로 상태 조회"],
  ];
  cards.forEach(([a,b,c],i)=>{const x=70+i*291;rect(s,"단계 "+a,x,229,260,187,i===2?C.pale:C.quiet,C.line);text(s,a,x+18,254,223,30,{size:20,bold:true,color:C.green});text(s,b,x+18,303,226,42,{size:25,bold:true});text(s,c,x+18,362,228,42,{size:20,color:C.mute});if(i<3)text(s,"→",x+265,302,26,42,{size:26,bold:true,color:C.green});});
  line(s,70,493,1134);
  text(s,"배운 기술의 결합",70,529,312,47,{size:27,bold:true,color:C.green});
  text(s,"Hugging Face 공개 모델  ·  Gradio 웹 데모  ·  Gemini API",367,530,825,52,{size:27,bold:true});
}
{
  const s=slide("Kev가 내리는 세 가지 판단",
    speaker("이성윤","3:15–4:45","Kev-4B는 Hugging Face에서 받은 모델을 RTX 3080에서 로컬 실행했습니다. 문의가 들어오면 분야, 긴급도, 사람 검토 필요 여부를 구조화해 반환합니다. 담당 부서는 프로그램의 매핑 규칙으로 고릅니다. 예를 들어 당일 마감과 포털 오류가 함께 나타나면 우선 확인 대상으로 보내며, 개인별 승인 여부를 묻는 문장은 관리자 검토로 넘깁니다. 앱에 들어가는 최종 상태는 모델 결과와 서비스 규칙이 함께 결정합니다.",["https://linear.app/dhj00570-helpdesk/issue/NONONO-18","https://linear.app/dhj00570-helpdesk/issue/NONONO-19",tag]),
    "모델은 구조화된 신호를 주고, 앱은 그 신호를 서비스 처리 규칙에 연결합니다.");
  const signals=[["문의 분야","장학금 · 학사 · 시설"],["긴급도","낮음 · 보통 · 높음"],["사람 검토","개인별 결과·긴급 사안"]];
  signals.forEach(([a,b],i)=>{const x=70+i*387;field(s,a,b,x,222,350);line(s,x,306,350);});
  rect(s,"당일 마감 사례",70,372,1138,188,C.pale);
  text(s,"“오늘 장학금 신청 마감인데 포털이 오류 나요.”",100,407,1060,53,{size:32,bold:true});
  text(s,"장학 담당  →  우선 확인  →  담당자가 직접 검토",102,486,1060,48,{size:27,color:C.green,bold:true});
}
{
  const s=slide("추가 학습 전후 전체 일치 14건 → 25건",
    speaker("이성윤","4:45–6:10","가상 문의 100건으로 공개 Kev 모델을 LoRA 추가 학습했습니다. 실험 후보는 같은 데이터로 비교해 검토 누락이 적은 쪽을 골랐습니다. 선택에 사용하지 않은 별도 32건에서 분야, 긴급도와 검토 필요 여부를 모두 맞힌 건수가 14개에서 25개로 늘었습니다. 이 수치는 가상 문의에서 모델의 세 판단을 비교한 결과입니다. 최종 라이브는 통합 검증을 마친 기본 Kev 모델을 사용합니다. 이어서 민석이 FAQ 흐름을 설명합니다.",[train,tag]),
    "RTX 3080 / 가상 문의 100건 LoRA 학습 / 별도 32건 평가");
  const scores=[["기본 Kev-4B",14,246],["추가 학습",25,374]];
  scores.forEach(([a,b,y],i)=>{
    text(s,a,70,y,253,47,{size:27,bold:true});
    rect(s,"평가 전체",334,y+7,571,36,C.quiet);
    rect(s,"세 항목 일치",334,y+7,571*b/32,36,i?C.green:"#9CCCAC");
    text(s,b+" / 32",944,y-10,257,64,{size:46,bold:true,color:i?C.green:C.ink});
  });
  line(s,70,497,1138);
  text(s,"긴급 감지   5/8 → 7/8",72,528,520,50,{size:25,bold:true});
  text(s,"필수 검토 감지   9/18 → 17/18",638,528,550,50,{size:25,bold:true});
  text(s,"발표 시연은 통합 검증을 마친 기본 Kev-4B로 진행합니다.",72,606,1115,38,{size:20,color:C.mute});
}
{
  const s=slide("FAQ 근거가 있으면 등록 원문을 안내합니다",
    speaker("김민석","6:10–7:40","FAQ 데이터에 장학금·학사·시설 가상 안내를 네 건씩 넣고 각 항목에 번호를 붙였습니다. 일반 문의에서 Gemini는 분류된 분야의 후보만 보고 번호를 고릅니다. 이 예시에서는 성적장학금 신청 절차를 묻자 FAQ-S01이 선택됐고, 앱이 저장된 답변 원문을 보여줬습니다. 관련 항목이 없거나 개인별 결과를 확인해야 하면 검토 안내와 접수번호를 남깁니다. 제가 준비한 FAQ와 분기 검증을 이 화면에서 확인할 수 있습니다. 동현이 이어서 실제 서비스를 시연하겠습니다.",["https://linear.app/dhj00570-helpdesk/issue/NONONO-35",verify]),
    "12개 가상 FAQ · 장학금 4건, 학사 4건, 시설 4건");
  field(s,"일반 절차 문의","“성적장학금은 따로 신청하나요?”\nGemini 선택: FAQ-S01",72,216,461);
  line(s,72,366,436);
  field(s,"담당자 검토","개인별 결과 또는 적합한 FAQ가 없는 경우에는 원문과 번호를 보존합니다.",72,408,445);
  await image(s,"faq-receipt",566,211,637,398,"실제 시연 화면에서 FAQ-S01 원문을 표시한 학생 접수 결과");
}
{
  const s=slide("라이브 시연   도움말에서 문의 접수까지",
    speaker("김동현","7:40–9:30 (시연 전반)","먼저 캠퍼스 도움말에서 수강 정정을 검색해 답변 원문을 열겠습니다. 다음으로 성적장학금 문의를 접수하고, 답변과 근거 번호 FAQ-S01을 보여드리겠습니다. 오늘 마감인데 포털이 멈췄다는 문의는 우선 확인으로 표시됩니다. 휴학 승인 여부 문의는 담당자 확인이 필요한 예시입니다. 마지막에 받은 접수번호를 그대로 관리자 화면에서 열겠습니다. 시연이 멈추면 같은 버전으로 녹화한 파일을 재생합니다.",[tag]),
    "그대로 따라 할 수 있는 가상 문의 시나리오");
  await image(s,"help-faq",70,211,706,441,"최종 도움말 화면에서 수강 정정 FAQ를 검색해 원문을 연 모습");
  const demos=[["도움말","수강 정정 검색"],["일반 문의","성적장학금 → FAQ-S01"],["당일 마감","포털 오류 → 우선 확인"]];
  demos.forEach(([a,b],i)=>{const y=230+i*107;text(s,a,823,y,353,38,{size:25,bold:true,color:C.green});text(s,b,824,y+43,345,51,{size:22});});
}
{
  const s=slide("라이브 시연   같은 번호로 처리 완료",
    speaker("김동현","9:30–11:10 (시연 후반)","관리자 문의함에서 방금 접수한 휴학 승인 문의를 엽니다. 오른쪽에서 원문과 같은 번호를 확인하고 상태를 검토 중으로 바꾼 뒤 저장합니다. 사용자에게 보일 답변을 적고 완료로 저장합니다. 학생 탭에서 같은 번호의 결과를 새로고침하면 처리 완료와 답변이 나타납니다. 이처럼 문의가 들어온 뒤 실제 처리와 조회까지 이어집니다. 이제 시후가 문제와 검증 결과를 정리하겠습니다.",[tag,t20]),
    "개인별 휴학 승인 문의의 등록·관리자 처리·학생 조회");
  await image(s,"admin-done",70,203,710,444,"최종 관리자 화면에 동일 접수번호와 완료 상태가 나타난 모습");
  text(s,"같은 접수번호",819,231,360,44,{size:25,bold:true,color:C.green});
  text(s,receipt,819,281,383,50,{size:29,bold:true});
  text(s,"관리자가 원문과 상태를 확인하고\n답변을 저장합니다.",819,377,378,84,{size:22});
  text(s,"학생은 새로고침해 같은 번호의\n완료 상태와 답변을 봅니다.",819,485,379,89,{size:22});
}
{
  const s=slide("오류가 생겨도 문의를 이어서 처리합니다",
    speaker("시후","11:10–12:20","리허설에서 Kev가 CPU로 실행되어 분류 요청이 시간 초과된 적이 있었습니다. 이때도 원문과 접수번호는 저장됐습니다. RTX 3080에 모델을 연결한 뒤 그대로 다시 처리해서 같은 번호로 분류와 답변을 확인했습니다. 또 관리자 화면에서 답변과 처리 메모를 둘 다 비우고 완료할 때는 저장을 막고 이유를 표시했습니다. 인터넷이나 Gemini 한도 문제에 대비해 동일 발표 버전의 영상과 화면을 준비했습니다.",[t20,verify]),
    "리허설과 실제 브라우저 점검에서 발견한 문제와 대응");
  const rows=[
    ["모델 분류가 시간 초과","번호와 원문은 저장하고 검토로 보냅니다.","GPU 연결 후 같은 번호로 재시도"],
    ["답변 없이 완료를 누름","완료 저장을 막고 이유를 표시합니다.","답변이나 처리 메모를 적어 완료"],
    ["당일 인터넷·한도 문제","같은 화면을 오프라인 영상으로 보여줍니다.","가상 문의만 사용한 녹화 준비"],
  ];
  rows.forEach(([a,b,c],i)=>{const y=213+i*118;line(s,70,y,1140);text(s,a,72,y+21,345,61,{size:24,bold:true});text(s,b,431,y+21,388,72,{size:21,color:C.mute});text(s,c,839,y+21,363,72,{size:21,bold:true,color:C.green});});
}
{
  const s=slide("필수 검토와 긴급 문의를 우선 확인했습니다",
    speaker("시후","12:20–13:45","11월 19일 기준판에서 가상 개발 문의 30건으로 분야, 부서, 긴급도, 검토 여부, FAQ 등 예상 항목을 대조했습니다. 모든 항목이 일치한 건은 19건입니다. 필수 검토 18건과 높은 긴급도 6건을 모두 맞혔고, 접수번호와 원문은 30건 모두 일치했습니다. 11건에서 분류나 FAQ 분기의 차이가 있어 개선 여지가 남습니다. 최종 흰색 화면은 기존 자동 테스트 38개와 실제 브라우저 대표 흐름을 따로 점검했습니다. 앞에서 말씀드린 25/32는 추가 학습 모델의 별도 평가입니다.",[verify,train,t21]),
    "11/19 기본 Kev 서비스 기준판 · 가상 개발 문의 30건");
  const data=[["전체 기대값 일치","19 / 30"],["필수 검토","18 / 18"],["높은 긴급도","6 / 6"],["접수번호와 원문","30 / 30"]];
  data.forEach(([a,b],i)=>{const x=70+i*285;rect(s,a,x,235,265,191,i===0?C.pale:C.quiet,C.line);text(s,b,x+17,265,231,72,{size:50,bold:true,color:C.green});text(s,a,x+18,358,230,50,{size:22,bold:true});});
  text(s,"최종 흰색판",73,486,250,45,{size:27,bold:true,color:C.green});
  text(s,"자동 테스트 38개와 브라우저 대표 흐름 확인",328,488,858,48,{size:27,bold:true});
  text(s,"일반 FAQ 일치 9/12. 남은 차이는 분야·긴급도·FAQ 분기에 있습니다.",74,586,1100,48,{size:22,color:C.mute});
}
{
  const s=slide("팀별 기여와 남은 개선점",
    speaker("시후","13:45–14:30 (+ 전환 여유 30초)","팀원 다섯 명이 설계부터 시연까지 역할을 맡았습니다. 제 역할은 가상 문의 검증 기준과 결과를 정리하고 발표를 진행하는 것입니다. 이번에는 가상 데이터로 검증했고, 서비스는 앱 재시작 시 메모리의 시연 문의가 초기화됩니다. 다음 단계에서는 분야와 FAQ가 엇갈린 문의를 늘려 검증하고, 티켓을 영구 저장하도록 보완하고 싶습니다. 질문 받겠습니다. 질의응답은 수업 안내에 따라 10분입니다.",[history,verify,tag]));
  const names=[["도형준","기획·공통 접수번호·서비스 통합"],["이성윤","Kev 분류·담당자 검토 분기·추가 학습"],["김민석","FAQ 데이터·Gemini 원문 근거 검증"],["김동현","화면·관리자 문의함·시연과 백업"],["시후","가상 문의 평가·발표 진행"]];
  names.forEach(([a,b],i)=>{const y=171+i*70;line(s,70,y,693);text(s,a,72,y+16,170,35,{size:23,bold:true,color:C.green});text(s,b,251,y+15,498,47,{size:22});});
  rect(s,"향후 개선",821,184,382,320,C.pale);
  text(s,"다음으로 남은 일",846,218,334,54,{size:27,bold:true});
  text(s,"분류·긴급도·FAQ 차이 사례 추가 검증",846,303,320,72,{size:22,color:C.mute});
  text(s,"재시작 후에도 문의가 남도록 저장 개선",846,411,320,72,{size:22,color:C.mute});
}
{
  const s=slide("질의응답 참고   수업 안내와 제출 점검",
    speaker("시후·팀원","질의응답 10분 · 필요 시 표시","수업 안내자료는 수업 기술 두 가지 이상, 실제 동작하는 화면, 학생 결제 0원, 결제 계정 연결 금지, 키 및 개인정보 미노출을 요구합니다. 팀 구성과 역할은 본문에서 설명합니다. (1) 실제 학습 결과 25/32는 별도 가상 평가입니다. (2) AI의 상담 답변은 실제 FAQ 원문을 사용합니다. (3) 모델이나 네트워크 오류에도 원문과 번호를 보존합니다. 수업에서 요구한 Teams 제출과 계정 결제 미연결 여부는 팀장이 직접 확인합니다.",["팀프로젝트_안내.pptx 1–4장",t21,tag]),
    "발표 15분 · 질의 10분 · 팀원 5명 모두 담당 부분 설명");
  const decisions=[
    ["수업 기술","Hugging Face 공개 모델 · Gradio · Gemini API"],
    ["시연·백업","최종 흰색 화면 라이브 · 동일 버전 녹화"],
    ["데이터와 키","가상 문의만 사용 · 시연 화면에는 키 입력란 없음"],
    ["팀장 최종 확인","결제 계정 연결 여부 · Teams 실제 과제 공지와 제출 접수"],
  ];
  decisions.forEach(([a,b],i)=>{const y=185+i*80;line(s,70,y,1139);text(s,a,73,y+18,268,52,{size:26,bold:true,color:C.green});text(s,b,354,y+19,812,52,{size:23});});
  text(s,"11/25 수업 기준 안내자료 마감: 11/24 23:59 · Teams에 팀장이 1회 제출",72,561,1139,42,{size:22,bold:true});
  text(s,"20261125_문의하지마세요_팀프로젝트.pptx",72,619,1120,42,{size:20,color:C.mute});
}

const deck=await PresentationFile.exportPptx(p);
await deck.save(target);
console.log(JSON.stringify({target, slides:p.slides.items.length, receipt}));