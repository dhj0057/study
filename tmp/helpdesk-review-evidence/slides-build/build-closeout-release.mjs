import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const stage = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.dirname(stage);
const output = path.join(stage,"handoff-1125","AI_Smart_Help_Desk_1125_발표자료.pptx");
const p = Presentation.create({slideSize:{width:1280,height:720}});
const C={paper:"#F6F4EE",ink:"#13252B",sub:"#4A6065",accent:"#14614F",white:"#FFFFFF",soft:"#C2E0D8",dark:"#123C39"};
function txt(s,text,x,y,w,h,size=28,opt={}){
 const box=s.shapes.add({name:opt.name||text.slice(0,24),geometry:"textbox",position:{left:x,top:y,width:w,height:h},fill:"none",line:{fill:"none",width:0}});
 box.text=text;
 box.text.style={typeface:"Malgun Gothic",fontSize:size,bold:opt.bold||false,color:opt.color||C.ink,verticalAlignment:"top",wrap:"wrap",insets:0};
 return box;
}
function page(title,notes){
 const s=p.slides.add();
 s.background.fill=C.paper;
 const idx=p.slides.items.length;
 txt(s,title,68,55,1132,78,48,{bold:true});
 txt(s,"문의하지마세요",68,666,280,28,18,{color:C.sub});
 txt(s,String(idx).padStart(2,"0"),1162,665,64,30,19,{color:C.sub});
 s.speakerNotes.text=notes;
 return s;
}
const issue=i=>"https://linear.app/dhj00570-helpdesk/issue/NONONO-"+i;
const evalSource="https://github.com/dhj0057/ai-smart-helpdesk/blob/codex/t07-helpdesk-demo/docs/validation/2026-11-19-presentation-release.md";

{
 const s=p.slides.add();s.background.fill=C.dark;
 txt(s,"AI Smart Help Desk",72,200,1136,109,83,{bold:true,color:C.white});
 txt(s,"대학 문의 접수와 담당자 연결",76,325,1100,72,43,{color:C.soft});
 txt(s,"팀 문의하지마세요   2026.11.25",76,586,1000,52,28,{color:C.white});
 s.speakerNotes.text="형준. 문의가 도착했을 때 어떤 담당자가 어떤 순서로 처리할지 정하고, 같은 접수번호로 끝까지 확인할 수 있는 교내 문의 시스템입니다. 시연 기준은 5046d68입니다.";
}
{
 const s=page("문의 접수부터 처리 완료까지","형준. 같은 문의에 대해 안내 또는 검토가 분기됩니다. 답변이 어려운 경우 검토가 필요하다고 알립니다. 관리자 수정은 같은 접수번호에 반영됩니다.\n"+issue(13)+"\n"+issue(14));
 [
 ["01","접수","학생이 가상 문의를 입력하고 접수번호를 받습니다."],
 ["02","판단","Kev가 분야·긴급도·검토 필요 여부를 구조화합니다."],
 ["03","안내 또는 검토","일반 문의는 FAQ를 안내합니다. 담당자 확인이 필요한 문의는 검토로 보냅니다."],
 ["04","관리자 처리","같은 번호로 원문을 조회하고 답변을 저장하거나 완료합니다."],
 ].forEach(([n,t,b],i)=>{const y=158+i*114;txt(s,n,70,y,86,57,41,{bold:true,color:C.accent});txt(s,t,168,y+2,278,52,32,{bold:true});txt(s,b,455,y+6,741,71,25);});
}
{
 const s=page("Kev와 서비스 규칙","성윤. 모델은 구조화된 판단 신호를 반환합니다. 실제 예시에서 임박한 개인별 업무 결정의 원본 MEDIUM을 서버가 HIGH로 보완합니다.\nRTX 3080에서 최대 학습률 2e-5로 가상 문의 100건을 1 epoch 학습했습니다. 별도 32건의 분야·긴급도·검토 여부 모두 일치는 기본 Kev 14건, 추가 학습 모델 25건입니다. 학습 결과는 별도 검증이며 라이브는 고정한 기본 Kev-4B로 시연합니다.\nhttps://github.com/dhj0057/ai-smart-helpdesk/blob/799e9cf/docs/validation/2026-11-19-kev-training.md\n"+issue(19)+"\n"+issue(33)+"\n"+issue(38));
 txt(s,"Kev-4B",70,168,530,70,53,{bold:true,color:C.accent});
 txt(s,"분야와 긴급도를 분류하고\n검토가 필요한지 판단합니다.",70,259,550,115,32);
 txt(s,"서비스 규칙",660,168,530,70,53,{bold:true,color:C.accent});
 txt(s,"담당 부서를 연결하고 긴급·개인별\n문의는 관리자 검토로 보냅니다.",660,259,548,120,30);
 txt(s,"추가 학습 결과",70,478,360,49,30,{bold:true});
 txt(s,"RTX 3080에서 가상 문의 100건을 추가 학습했습니다. 별도 32건에서 전체 일치 14건 → 25건.\n라이브 시연은 고정된 기본 Kev-4B를 사용합니다.",70,536,1136,85,24,{color:C.sub});
}
{
 const s=page("Gemini의 FAQ 근거 선택","민석. Gemini는 같은 분야의 가상 FAQ 중 적합한 근거 번호를 선택합니다. 서비스는 해당 FAQ 원문을 표시합니다. 도서관 등 관련 문의의 분류 격차는 현재 남아 있습니다.\n"+issue(22)+"\n"+evalSource);
 txt(s,"FAQ가 있는 일반 문의",70,174,620,52,38,{bold:true,color:C.accent});
 txt(s,"“이번 학기 성적장학금 신청은 따로 해야 하나요?”",70,247,1120,55,34,{bold:true});
 txt(s,"Gemini가 FAQ-S01을 선택하고 서비스가 해당 항목의 원문을 표시합니다.",70,332,1100,90,30);
 txt(s,"근거가 없거나 개인 결과를 묻는 경우",70,480,1100,52,34,{bold:true,color:C.accent});
 txt(s,"담당자 검토 안내를 표시하고 원문과 접수번호를 남깁니다.",70,550,1100,62,28);
}
for (const [title,image,lead,body,notes] of [
 ["사용자 화면","release-user.png","가상 휴학 승인 문의","개인별 결과 문의는 검토 필요로 표시됩니다.\n사용자는 발급된 번호로 처리 결과를 조회할 수 있습니다.","동현. 라이브 시연은 일반 FAQ, 당일 마감 HIGH, 개인 문의 순서로 진행합니다. 오프라인에서는 이 실제 캡처의 접수번호를 다음 장과 대조합니다."],
 ["관리자 처리 화면","release-admin.png","같은 접수번호로 완료","원문과 상태를 확인하고 답변을 저장합니다.\n완료한 뒤에는 내용을 다시 편집할 수 없습니다.","동현. 저장 오류가 나면 이유를 표시하며 입력을 보존합니다. 정상 완료 뒤 사용자 탭을 새로고침해 같은 번호의 최종 답변을 확인합니다."],
]){
 const s=page(title,notes+"\n후보 5046d68 실제 브라우저 캡처.\n"+issue(37));
 const img=await fs.readFile(path.join(stage,"visual-release",image));
 s.images.add({blob:img,contentType:"image/png",fit:"contain",alt:title+"의 실제 후보판",position:{left:64,top:148,width:690,height:480}});
 txt(s,lead,790,185,408,100,36,{bold:true,color:C.accent});
 txt(s,body,790,297,415,184,26);
 txt(s,"같은 가상 문의 · 후보 5046d68",790,556,405,54,20,{color:C.sub});
}
{
 const s=page("가상 문의 30건 검증","시후. 11월 19일 발표 후보 5046d68에서 기본 Kev와 Gemini로 시험했습니다. 3장의 추가 학습 전후 비교는 별도 32건입니다. 가상 개발 검증 세트입니다. 11건의 분야·긴급도·FAQ 차이가 남았습니다. 공유 링크에서는 일부 요청이 지연됐습니다. 발표는 교실 PC의 로컬 주소부터 열고 장애가 나면 영상으로 전환합니다.\n"+evalSource);
 const rows=[["전체 기대값 일치","19 / 30"],["분야와 담당 부서 동시 일치","25 / 30"],["필수 검토 문의","18 / 18"],["HIGH 문의","6 / 6"],["일반 FAQ 근거 일치","9 / 12"],["같은 번호와 원문 조회","30 / 30"]];
 rows.forEach(([a,b],i)=>{const y=145+i*73;txt(s,a,75,y+6,790,50,33);txt(s,b,921,y,280,59,43,{bold:true,color:C.accent});});
 txt(s,"남은 11건은 분야·긴급도·FAQ 분기 차이를 재검증합니다.",75,599,1124,46,25,{color:C.sub});
}
{
 const s=page("팀 작업과 발표 순서","형준. 각 팀원이 실제 맡은 산출물 한 가지와 발견·해결한 문제 한 가지를 설명합니다. 시연 연결이 끊기면 저장한 화면과 녹화로 설명합니다. 질문에는 근거 링크와 검증 범위를 기준으로 답합니다.\n"+issue(29)+"\n"+issue(31));
 [
 ["도형준","문제·구조·관리자 통합"],
 ["이성윤","Kev 분류와 학습 실행 근거"],
 ["김민석","FAQ 사례와 근거 검증"],
 ["김동현","사용자·관리자 시연과 백업"],
 ["시후","평가 기준과 실제 검증 결과"],
 ].forEach(([a,b],i)=>{const y=156+i*81;txt(s,a,76,y,282,55,36,{bold:true,color:C.accent});txt(s,b,360,y+4,800,54,30);});
 txt(s,"라이브 시연이 끊기면 같은 버전의 오프라인 화면으로 이어갑니다.",75,600,1110,49,25,{color:C.sub});
}

await fs.mkdir(path.dirname(output),{recursive:true});
for(const [i,s] of p.slides.items.entries()){
 const png=await p.export({slide:s,format:"png",scale:0.7});
 await fs.writeFile(path.join(stage,"handoff-1125","slide-"+(i+1)+".png"),new Uint8Array(await png.arrayBuffer()));
}
const draft=path.join(stage,"handoff-1125","candidate.pptx");
await (await PresentationFile.exportPptx(p)).save(draft);
const skill="C:/Users/AISW-510-125/.codex/plugins/cache/openai-primary-runtime/presentations/26.1118.11504/skills/presentations";
const runtime="C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1118-904-0_26.1118.904.0_x64__3k8sg7r9htsxt/dependencies";
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,"container_tools/artifact_tool_utils.mjs")).href);
await finalizePresentation({
 workspaceDir:workspace,candidatePath:draft,finalPath:output,
 pythonExecutable:path.join(runtime,"python/python.exe"),
 integrityValidatorPath:path.join(skill,"container_tools/inspect_presentation_package_integrity.py"),
 layoutValidatorPath:path.join(skill,"container_tools/inspect_presentation_layout_geometry.py"),
 layoutArgs:["--expected-slide-size-emu","12192000,6858000","--validate-heading-fit"],
 explicitTotalSlideCount:8,verifyArtifactToolImport:true,
 fontPolicy:{basis:"design",families:["Malgun Gothic"]},
 receiptPath:path.join(stage,"handoff-1125-finalization.json"),
});
console.log(output);
