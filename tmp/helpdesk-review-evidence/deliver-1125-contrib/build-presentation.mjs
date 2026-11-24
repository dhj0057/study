
import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "file:///C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const dir="D:/study/tmp/helpdesk-review-evidence/deliver-1125-contrib";
const images="D:/study/tmp/helpdesk-review-evidence/deliver-1125";
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={white:"#FFFFFF",ink:"#172B23",mute:"#4F6259",green:"#197446",pale:"#EBF6EF",quiet:"#F5F8F6",line:"#D9E5DF"};
const git="https://github.com/dhj0057/ai-smart-helpdesk";
const tag=git+"/tree/demo-2026-11-25-final";
const app=git+"/blob/demo-2026-11-25-final/docs/validation/2026-11-19-presentation-release.md";
const training=git+"/blob/demo-2026-11-25-final/docs/validation/2026-11-19-kev-training.md";
const linear="https://linear.app/dhj00570-helpdesk";
const t20=linear+"/issue/NONONO-31",t21=linear+"/issue/NONONO-17";
const teamLog=linear+"/document/8759cf49-41d0-4231-aa52-b2181873adf2";

function txt(s,content,x,y,w,h,{size=26,bold=false,color=C.ink,name=content}={}){
 const a=s.shapes.add({name:name.slice(0,55),geometry:"textbox",position:{left:x,top:y,width:w,height:h},fill:"none",line:{fill:"none",width:0}});
 a.text=content;
 a.text.style={typeface:"Malgun Gothic",fontSize:size,bold,color,verticalAlignment:"top",wrap:"wrap",insets:0};
 return a;
}
function box(s,name,x,y,w,h,fill=C.quiet,border="none"){
 return s.shapes.add({name,geometry:"rect",position:{left:x,top:y,width:w,height:h},fill,line:{fill:border,width:border==="none"?0:1}});
}
function rule(s,x,y,w){box(s,"구분선",x,y,w,1,C.line);}
function page(title,sub,notes,sources){
 const s=p.slides.add();s.background.fill=C.white;
 s.speakerNotes.text=notes.join("\n\n")+"\n\n근거\n"+sources.join("\n");
 if(title)txt(s,title,70,56,1140,68,{size:46,bold:true});
 if(sub)txt(s,sub,71,132,1135,37,{size:22,color:C.mute});
 return s;
}
async function shot(s,file,x,y,w,h,alt){
 box(s,"화면 테두리",x-1,y-1,w+2,h+2,C.white,C.line);
 s.images.add({blob:await fs.readFile(path.join(images,file)),contentType:"image/png",fit:"contain",position:{left:x,top:y,width:w,height:h},alt});
}
{
 const s=page("","",[
   "0:00–0:40 · 시후\n안녕하세요, 팀 문의하지마세요의 시후입니다. 학생이 대학에 문의할 때 어떤 문의는 바로 안내할 수 있고, 어떤 문의는 실제로 담당자가 확인해야 합니다. 저희는 이 두 흐름을 한 화면에서 이어 주는 AI Smart Help Desk를 만들었습니다.",
   "0:40–1:50 · 도형준\n예를 들어 오늘 장학금 마감인데 신청 메뉴가 작동하지 않으면 학생은 어느 부서에 연락할지부터 찾아야 합니다. 성적장학금 일반 절차는 등록 안내로 충분할 수 있고, 제 휴학 승인 여부는 학교 담당자가 직접 확인해야 합니다. 그래서 문의를 한 곳에 모으고 문의별로 분기한 뒤, 같은 접수번호로 학생과 담당자가 처리 결과를 보게 했습니다. 이어서 기술 흐름을 설명하겠습니다."
 ],[tag,teamLog]);
 txt(s,"인공지능플랫폼실습 기말 프로젝트",70,112,539,39,{size:23,color:C.green,bold:true});
 txt(s,"AI Smart\nHelp Desk",66,169,525,180,{size:77,bold:true});
 txt(s,"교내 문의를 한 곳에서 받고\n같은 번호로 결과를 확인합니다.",71,391,500,103,{size:28,bold:true,color:C.mute});
 rule(s,72,544,479);
 txt(s,"팀 문의하지마세요   ·   2026.11.25",72,570,508,44,{size:21,bold:true});
 await shot(s,"home.png",601,156,602,376,"최종 캠퍼스 도움말 화면");
}
{
 const s=page("문의는 한 번 접수하고 처리 흐름은 두 갈래로","Gradio 웹 화면 · Hugging Face 공개 Kev-4B · Gemini API",[
  "1:50–3:05 · 도형준\n제가 접수부터 관리자 처리까지 전체 흐름을 설계하고 통합했습니다. 문의 원문과 접수번호를 저장한 뒤 성윤의 분류와 민석의 FAQ 결과를 같은 번호에 연결했습니다. 관리자 답변, 상태 변경, AI 오류 시 재시도도 같은 요청에서 처리합니다. 성윤이 첫 판단 단계를 보여드리겠습니다.",
  "3:05–4:20 · 이성윤\n제가 연결한 로컬 Kev-4B는 문의 분야, 긴급도, 검토 필요 여부를 돌려줍니다. 앱은 그 분류를 담당 부서와 연결하고, 마감이 임박했거나 개인별 결과를 확인할 문의를 사람 검토로 보냅니다. 일반 질문의 답변은 민석이 설명하겠습니다.",
  "4:20–5:50 · 김민석\n제가 작성한 FAQ는 장학금·학사·시설 각 네 건으로 총 12건입니다. 일반 문의라면 Gemini가 해당 분야의 FAQ 번호를 고르고 앱이 등록된 원문을 표시합니다. 성적장학금 절차에는 FAQ-S01이 나옵니다. 적용할 근거가 부족하거나 개인별 결과를 물으면 담당자에게 전달합니다. 저는 관리자 상태 변경과 같은 번호 재시도도 별도 환경에서 확인했습니다. 동현이 실제 화면에서 이 흐름을 보여드리겠습니다."
 ],[tag,linear+"/issue/NONONO-13",linear+"/issue/NONONO-19",linear+"/issue/NONONO-35"]);
 const cells=[["접수","Gradio","문의 원문·접수번호"],["판단","Kev-4B","분야·긴급도·검토 여부"],["분기","FAQ / 담당자","원문 안내 또는 검토"],["조회","같은 접수번호","학생·관리자 결과 확인"]];
 cells.forEach(([a,b,c],i)=>{
   const x=70+i*291; box(s,a,x,230,259,190,i===2?C.pale:C.quiet,C.line);
   txt(s,a,x+18,252,221,33,{size:20,bold:true,color:C.green});
   txt(s,b,x+18,304,224,47,{size:27,bold:true});
   txt(s,c,x+18,367,225,33,{size:19,color:C.mute});
   if(i<3)txt(s,"→",x+264,305,25,40,{size:25,bold:true,color:C.green});
 });
 rule(s,70,488,1132);
 txt(s,"일반 절차",72,521,241,42,{size:23,bold:true,color:C.green});
 txt(s,"Gemini가 FAQ 번호를 선택하고 앱이 원문을 표시",72,562,553,72,{size:22});
 txt(s,"긴급·개인별 문의",664,521,453,42,{size:23,bold:true,color:C.green});
 txt(s,"담당자가 같은 접수번호에서 원문과 상태를 확인",664,562,522,72,{size:22});
}
{
 const s=page("시연 영상과 현장 확인","최종 흰색 UI · 실제 Kev-4B와 Gemini · 가상 문의",[
  "5:50–8:45 · 김동현\n지금부터 일반 문의와 담당자 확인이 필요한 문의가 실제 화면에서 어떻게 처리되는지 보여드리겠습니다. [이 멘트 뒤 3장의 영상 화면을 클릭해 55.8초 MP4를 재생합니다.] 영상 뒤에 제가 구현한 관리자 목록과 필터를 이용해 같은 번호의 문의를 열어 보겠습니다.",
  "영상이 끝나면 미리 연 앱에서 가상 문의 ‘제가 낸 휴학 신청이 승인됐나요?’ 한 건을 접수합니다. 접수번호를 보여주고 관리자 문의함에서 같은 번호와 원문을 열어 실제 앱이 응답하는지 확인합니다. 시간이 남으면 검토 중으로 저장하고 시연용 답변을 남긴 뒤 학생 탭을 새로고침합니다.",
  "발표 전에 동현이 교실 장비에서 화면과 소리를 5–10초 확인하고 1장으로 돌아간다. 본 발표는 1장에서 시작한다. 3장에서 내장 영상이 바로 열리지 않으면 미리 열어 둔 MP4 또는 같은 폴더의 오프라인_시연_재생.html을 사용한다. 라이브 앱이 응답하지 않으면 영상의 마지막 같은 번호 완료 장면을 짚고 4장으로 넘어간다. 저장소 설정과 API 키 입력 화면은 공유하지 않는다."
 ],[tag,t20,t21,"팀 제작 영상 helpdesk_promo_final_1a41fc5최종본.mp4"]);
 box(s,"내장 MP4 자리",70,197,752,423,C.quiet,C.line);
 txt(s,"영상 재생 후 라이브 1건",865,241,329,67,{size:27,bold:true,color:C.green});
 txt(s,"휴학 승인 문의를 접수해\n번호를 확인합니다.",866,333,326,83,{size:23});
 txt(s,"관리자 문의함에서 같은 번호와\n원문을 열어 봅니다.",866,456,332,104,{size:23});
}
{
 const s=page("추가 학습과 실제 서비스 검증","학습 평가는 모델의 판단을, 서비스 검증은 앱 전체 흐름을 확인했습니다.",[
  "8:45–10:00 · 이성윤\n저는 Kev 분류를 연결하고 LoRA 학습 설정과 초기 실행을 검증했습니다. 이 설정을 바탕으로 형준이 RTX 3080에서 가상 문의 100건으로 본학습을 실행했습니다. 형준이 별도 32건을 비교한 결과, 분야·긴급도·검토 여부를 모두 맞힌 건은 기본 모델 14건, 추가 학습 모델 25건입니다. 현재 시연은 서비스 통합 검증을 마친 기본 Kev 모델로 진행합니다. 발표 전에 동작을 확인할 때는 대표 가상 문의 1건의 분류 결과까지 확인합니다.",
  "10:00–11:20 · 시후\n제가 가상 문의 30건의 정답 기준을 만들었고, 형준이 그 기준으로 11월 19일 서비스 기준판을 검증했습니다. 분야, 부서, 긴급도, 검토 여부, FAQ가 모두 맞은 건은 30건 중 19건이었습니다. 필수 검토 18건과 높은 긴급도 6건은 모두 감지됐고, 접수번호와 원문도 30건 모두 확인했습니다. 최신 흰색판은 자동 테스트 38개와 브라우저 대표 시나리오를 따로 확인했습니다. 25/32는 추가 학습 비교이고 19/30은 서비스 전체 검증입니다."
 ],[training,app,t21]);
 box(s,"분리된 모델 평가",70,215,549,316,C.pale,C.line);
 box(s,"서비스 개발 검증",646,215,557,316,C.quiet,C.line);
 txt(s,"Kev 추가 학습",94,247,484,48,{size:27,bold:true,color:C.green});
 txt(s,"14/32 → 25/32",93,324,497,76,{size:49,bold:true,color:C.green});
 txt(s,"100건 추가 학습 · 별도 가상 문의 32건",94,435,492,58,{size:21});
 txt(s,"11/19 서비스 검증",671,247,504,48,{size:27,bold:true,color:C.green});
 txt(s,"19 / 30",669,324,505,76,{size:49,bold:true,color:C.green});
 txt(s,"필수 검토 18/18 · 높은 긴급도 6/6",671,435,501,58,{size:21});
 txt(s,"최종 흰색판은 기본 Kev로 시연합니다. 자동 테스트 38개와 브라우저 대표 흐름을 통과했습니다.",72,590,1136,62,{size:21,color:C.mute});
}
{
 const s=page("오류가 나도 같은 번호로 이어갑니다","리허설과 실제 브라우저에서 확인한 세 가지 대응",[
  "11:20–12:50 · 시후\n처음 리허설에서 Kev가 GPU 대신 CPU로 실행돼 분류가 시간 초과됐습니다. 앱은 가상 문의 원문과 접수번호를 먼저 저장해 두었기 때문에 GPU를 다시 연결한 뒤 같은 번호로 AI 처리를 재시도할 수 있었습니다. 관리자 화면에서는 답변과 처리 메모를 비우면 완료 저장을 막고 안내를 표시합니다. 인터넷이나 API 한도가 막히는 경우에 대비해 동일한 화면을 담은 56초 MP4를 오프라인에서 재생할 수 있게 준비했습니다."
 ],[t20,app,tag]);
 const items=[
  ["모델 호출 시간 초과","원문·접수번호를 보존하고 GPU 연결 후 같은 번호로 재시도"],
  ["답변 없이 완료 저장","저장을 막고 답변 또는 처리 메모를 입력하도록 안내"],
  ["인터넷·API 한도 문제","같은 버전의 MP4를 슬라이드에서 바로 재생"],
 ];
 items.forEach(([a,b],i)=>{
   const y=215+i*116; rule(s,72,y,1127);
   txt(s,a,73,y+24,337,56,{size:25,bold:true,color:C.green});
   txt(s,b,425,y+24,759,63,{size:24});
 });
}
{
 const s=page("다섯 명의 기여와 개선점","팀 업무일지에 기록된 구현·검증 범위",[
  "12:50–14:30 · 시후\n형준은 서비스 구조를 설계하고 접수·관리자 처리·오류 재시도를 구현해 연결했습니다. 가상 문의 100건의 본학습과 32건의 학습 비교, 서비스 최종 검증도 실행했습니다. 민석은 FAQ 12건을 작성하고 Gemini 답변 근거를 검사했으며, 관리자 상태 변경과 재시도를 별도 환경에서 재현했습니다. 성윤은 Kev 분류 연동과 학습 설정·초기 검증, 동현은 문의 목록·필터와 실행 재현을 맡았습니다. 저는 가상 문의 30건의 정답 기준과 발표 진행을 맡았습니다. 서비스 검증에서는 모든 예상 항목을 충족하지 못한 11건이 남아 있어서 분야, 긴급도, FAQ 분기를 더 넓은 문의로 확인해야 합니다. 현재 저장은 시연용 메모리이므로 실제 운영을 위해서는 재시작 후에도 남는 저장을 추가해야 합니다. 질문 받겠습니다.",
  "14:30–15:00 · 화면 전환과 여유 시간\n15:00–25:00 · 질의응답 10분. 시후가 질문을 받고 담당자가 자기 파트를 보충한다. 필요하면 7장 부록을 연다."
 ],[teamLog,t21,app]);
 box(s,"도형준 구현 내역",72,188,690,102,C.pale,C.line);
 txt(s,"도형준   설계·통합·최종 검증",90,206,650,39,{size:25,bold:true,color:C.green});
 txt(s,"접수·관리자 처리·재시도 구현, 본학습·최종 검증 실행",90,253,651,30,{size:20});
 box(s,"김민석 구현과 검증 내역",72,302,690,102,C.quiet,C.line);
 txt(s,"김민석   FAQ·Gemini·독립 검증",90,320,650,39,{size:25,bold:true,color:C.green});
 txt(s,"FAQ 12건, 답변 근거 검사, 관리자 처리·재시도 재현",90,367,651,30,{size:20});
 const members=[["이성윤","Kev 분류 연동·학습 설정과 초기 검증"],["김동현","문의 목록·필터 구현·실행 재현"],["시후","가상 문의 30건 정답 기준·발표 진행"]];
 members.forEach(([name,task],i)=>{
   const y=435+i*56;rule(s,72,y,690);txt(s,name,74,y+15,115,35,{size:22,bold:true,color:C.green});txt(s,task,196,y+15,555,36,{size:21});
 });
 box(s,"한계와 개선",795,193,405,364,C.pale);
 txt(s,"다음 개선",824,228,340,58,{size:29,bold:true});
 txt(s,"분야·긴급도·FAQ가 엇갈린 문의를 더 검증합니다.",825,317,323,91,{size:23,color:C.mute});
 txt(s,"재시작 후에도 문의가 남도록 저장을 개선합니다.",825,433,323,91,{size:23,color:C.mute});
}
{
 const s=page("질의응답 참고   수치와 제출 조건","발표 15분 · 질의응답 10분 · 팀원 다섯 명 직접 설명",[
  "질의응답용 부록 · 시후 및 각 담당자\n추가 학습 25/32는 별도 가상 데이터에서 세 판단이 모두 일치한 수치입니다. 19/30은 기준 서비스의 모든 기대 항목이 맞은 수치입니다. 모델이 맞는 FAQ를 고르면 원문이 표시됩니다. FAQ가 없거나 사람이 확인해야 하는 문의는 번호와 함께 담당자에게 넘어갑니다. 저장은 메모리 기반 시연 범위입니다.",
  "형준 제출 점검\n11/25 수업 기준 안내자료는 11/24 23:59까지 팀장이 Teams에 PPTX를 한 번 제출하도록 요구합니다. 현재 Gemini 프로젝트의 무결제·미연결 상태, Teams 실제 과제 공지, 제출 접수, 전체 리허설을 확인합니다."
 ],["팀프로젝트_안내.pptx 1–4장",training,app,t21]);
 const rows=[
  ["평가 범위","학습 32건과 서비스 30건은 서로 다른 가상 문의 평가입니다."],
  ["수업 기술","Hugging Face 공개 모델 · Gradio · Gemini API"],
  ["시연·보안","실제 화면, 오프라인 MP4, 가상 문의, 키 미노출"],
  ["팀장 최종 확인","발표용 Gemini 결제 미연결과 Teams 실제 공지·제출 접수"],
 ];
 rows.forEach(([a,b],i)=>{const y=190+i*81;rule(s,72,y,1134);txt(s,a,73,y+17,303,53,{size:25,bold:true,color:C.green});txt(s,b,380,y+17,799,56,{size:22});});
 txt(s,"11/25 수업 기준 안내 마감   11/24 23:59 · Teams 팀장 1회 제출",72,562,1135,44,{size:22,bold:true});
 txt(s,"20261125_문의하지마세요_팀프로젝트.pptx",72,622,1112,39,{size:20,color:C.mute});
}
await (await PresentationFile.exportPptx(p)).save(path.join(dir,"short-draft.pptx"));
console.log(JSON.stringify({slides:p.slides.items.length}));