
import fs from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";
const base="D:/study/tmp/helpdesk-review-evidence/deliver-1125-short";
const skill="C:/Users/AISW-510-125/.codex/plugins/cache/openai-primary-runtime/presentations/26.1119.11507/skills/presentations";
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,"container_tools/artifact_tool_utils.mjs")).href);
await fs.mkdir(path.join(base,"validated"),{recursive:true});
await finalizePresentation({
 workspaceDir:base,candidatePath:path.join(base,"with-video.pptx"),
 finalPath:path.join(base,"validated","20261125_문의하지마세요_팀프로젝트.pptx"),
 pythonExecutable:"C:\\Program Files\\WindowsApps\\OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt\\dependencies\\python\\python.exe", 
 integrityValidatorPath:path.join(base,"media-integrity.py"),
 layoutValidatorPath:path.join(skill,"container_tools/inspect_presentation_layout_geometry.py"),
 layoutArgs:["--expected-slide-size-emu","12192000,6858000","--validate-heading-fit"],
 explicitTotalSlideCount:7,verifyArtifactToolImport:true,
 fontPolicy:{basis:"design",families:["Malgun Gothic"]},receiptPath:path.join(base,"finalization.json")
});