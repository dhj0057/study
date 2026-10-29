from __future__ import annotations

import hashlib
import importlib.util
import json
import re
from pathlib import Path
from urllib.parse import unquote

BASE = Path(__file__).resolve().parent
SOURCE = BASE / "source_snapshot_20261028.json"
snapshot = json.loads(SOURCE.read_text(encoding="utf-8-sig"))
spec = importlib.util.spec_from_file_location("existing_transfer_renderer", BASE / "build_transfer_payloads.py")
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)

PROJECT_NAME = "AI Smart Help Desk · 문의하지마세요 · 10/29 시작"
DOC_KEYS = {
    "91e3644f-a8b7-471d-a235-8076366471fb": "START",
    "832e0c42-8bf7-4fd6-ad30-b7a51ea89531": "PLAN",
    "09fbfb8e-99a4-4314-a1f2-143912a2d638": "CONTRACT",
    "34e9641c-e66d-44f4-88df-1440875b0d3f": "ASSIGNMENT",
    "bfefc2ca-3156-4b72-91b8-ed4e57433592": "OPERATIONS",
    "d271d6ca-4612-45ee-8e99-ea41f97a383b": "MEETINGS",
}
documents_by_id = {item["id"]: item for item in snapshot["documents"]}
issue_key = {}
for issue in snapshot["issues"]:
    match = re.match(r"^(T\d{2})\b", issue["title"])
    if not match:
        match = re.match(r"^\[([A-E])(?:·|\])", issue["title"])
    assert match, issue["title"]
    issue_key[issue["id"]] = match.group(1)
assert set(issue_key.values()) == set("ABCDE") | {f"T{number:02}" for number in range(1, 22)}
milestone_key = {item["id"]: f"W{index}" for index, item in enumerate(snapshot["milestones"], 1)}


def doc_ref(url: str) -> str:
    decoded = unquote(url).rstrip(">")
    for document_id, key in DOC_KEYS.items():
        item = documents_by_id[document_id]
        if decoded == unquote(item["url"]) or decoded.endswith(item["slugId"]):
            return "{{document." + key + ".url}}"
    raise ValueError("Unknown source document URL: " + url)


def convert_url(match: re.Match) -> str:
    url = match.group(0)
    if "/document/" in url:
        return doc_ref(url)
    if "/project/" in url:
        return "{{project.url}}"
    if "/issue/" in url:
        match_id = re.search(r"/issue/((?:NONONO|ADE)-\d+)", url)
        assert match_id and match_id.group(1) in issue_key, url
        return "{{issue." + issue_key[match_id.group(1)] + ".url}}"
    return "{{workspace.url}}"


def clean_body(body: str, own_key: str | None = None) -> str:
    # Only replace instance-specific links/identifiers and the confirmed dates.
    body = body.replace(snapshot["project"]["name"], PROJECT_NAME)
    body = re.sub(r"https://linear\.app/ade0033(?:/[^\s<>)]+)?", convert_url, body)
    body = re.sub(r"https://linear\.app/dhj00570-helpdesk/project/[^\s<>)]+", "{{project.url}}", body)
    if own_key and own_key.startswith("T"):
        body = re.sub(
            r"내게 배정된\s+(?:NONONO|ADE)-\d+\s*\(" + re.escape(own_key) + r"\)",
            "현재 열어둔 이 이슈(" + own_key + ")",
            body,
        )
    def replace_identifier(match: re.Match) -> str:
        identifier = match.group(0)
        assert identifier in issue_key, identifier
        return issue_key[identifier]
    body = re.sub(r"\b(?:NONONO|ADE)-\d+\b", replace_identifier, body)
    body = body.replace("Linear의 AI Smart Help Desk 프로젝트에서", "현재 새 프로젝트(" + PROJECT_NAME + ")에서")
    body = body.replace("작성 기준  2026년 10월 28일", "작성 기준  2026년 10월 29일")
    body = body.replace("작성 기준 2026년 10월 28일", "작성 기준 2026년 10월 29일")
    body = body.replace("10월 28일부터 5주", "10월 29일부터 5주")
    body = body.replace("1주차 10/28\\~11/3", "1주차 10/29\\~11/3")
    body = body.replace("1주차 10/28~11/3", "1주차 10/29~11/3")
    lines = []
    for line in body.splitlines(keepends=True):
        if "T01" in line and "2026-10-28" in line:
            line = line.replace("2026-10-28", "2026-10-29")
        if "T01" in line and "10/28" in line:
            line = line.replace("10/28", "10/29")
        lines.append(line)
    body = "".join(lines)
    if own_key == "T01":
        body = body.replace("2026-10-28", "2026-10-29")
    assert not re.search(r"\b(?:NONONO|ADE)-\d+\b", body)
    assert "linear.app/ade0033" not in body
    assert "4eb37e9b9973" not in body
    return body


def section(body: str, heading: str) -> str:
    found = re.search(r"^## " + re.escape(heading) + r"\s*\n(.*?)(?=^## |\Z)", body, re.M | re.S)
    return found.group(1).strip() if found else ""


def checklist(body: str, heading: str) -> list[str]:
    return [re.sub(r"^\s*[-*]\s+(?:\[[ xX]\]\s*)?", "", line).strip()
            for line in section(body, heading).splitlines()
            if re.match(r"^\s*[-*]\s+", line)]


def relations_for(issue: dict) -> dict:
    result = {}
    for kind, value in (issue.get("relations") or {}).items():
        if isinstance(value, list):
            result[kind] = [issue_key[item["id"]] for item in value]
        elif value:
            result[kind] = issue_key[value["id"] if isinstance(value, dict) else value]
        else:
            result[kind] = None if kind == "duplicateOf" else []
    return result


docs = []
for source_id, key in DOC_KEYS.items():
    source = documents_by_id[source_id]
    body = clean_body(source["content"])
    title = source["title"].replace("2026-10-28", "2026-10-29")
    docs.append({"key": key, "sourceId": source_id, "title": title,
                 "urlRef": "{{document." + key + ".url}}", "markdown": body, "html": renderer.render(body)})

issues = []
for source in snapshot["issues"]:
    key = issue_key[source["id"]]
    body = clean_body(source.get("description") or "", key)
    relations = relations_for(source)
    role = key if key in "ABCDE" else issue_key[source["parentId"]]
    due_date = "2026-10-29" if key == "T01" else source.get("dueDate")
    prompts = re.findall(r"### AI에게 그대로 복사할 요청\s*\n```(?:text)?\n(.*?)\n```", body, re.S)
    entry = {
        "key": key, "sourceId": source["id"], "sourceUuid": source["uuid"],
        "title": source["title"], "kind": "role" if key in "ABCDE" else "task",
        "urlRef": "{{issue." + key + ".url}}", "role": role,
        "goal": section(body, "목표"), "todos": checklist(body, "할 일"),
        "acceptance": checklist(body, "완료 기준"), "aiPrompts": prompts,
        "markdown": body, "html": renderer.render(body), "dueDate": due_date,
        "status": source.get("status"), "priority": source.get("priority"),
        "assigneeRef": "{{member.A.id}}" if role == "A" else None,
        "sourceAssigneeId": source.get("assigneeId"),
        "parentId": issue_key[source["parentId"]] if source.get("parentId") else None,
        "blockedBy": relations.get("blockedBy", []), "relations": relations,
        "milestone": milestone_key[source["projectMilestone"]["id"]] if source.get("projectMilestone") else None,
    }
    if key == "T01":
        entry["scheduleChange"] = {"originalDueDate": source.get("dueDate"), "dueDate": due_date,
                                   "status": "confirmed", "reason": "사용자 확정 시작일 2026-10-29에 맞춰 착수 작업 기한만 변경"}
    if entry["kind"] == "task":
        assert entry["goal"] and entry["todos"] and entry["acceptance"], key
        assert prompts and all("현재 열어둔 이 이슈" in prompt for prompt in prompts), key
    issues.append(entry)
roles = sorted([entry for entry in issues if entry["kind"] == "role"], key=lambda item: item["key"])
tasks = sorted([entry for entry in issues if entry["kind"] == "task"], key=lambda item: item["key"])
issues = roles + tasks

milestones = []
week_starts = ["2026-10-29", "2026-11-04", "2026-11-11", "2026-11-18", "2026-11-25"]
for index, source in enumerate(snapshot["milestones"], 1):
    body = clean_body(source.get("description") or "")
    if index == 1:
        body = body.replace("10/28\\~11/3", "10/29\\~11/3").replace("10/28~11/3", "10/29~11/3")
    milestones.append({"key": f"W{index}", "sourceId": source["id"], "name": source["name"],
                       "description": body, "startDate": week_starts[index-1],
                       "targetDate": source["targetDate"], "urlRef": "{{milestone.W" + str(index) + ".url}}"})

blueprint = {
    "schemaVersion": 1, "preparedDate": "2026-10-29", "status": "local_blueprint_no_remote_changes",
    "project": {"name": PROJECT_NAME, "summary": clean_body(snapshot["project"].get("summary") or ""),
                "markdown": clean_body(snapshot["project"].get("description") or ""),
                "workspace": "dhj00570-helpdesk", "workspaceUrl": "https://linear.app/dhj00570-helpdesk",
                "teamName": "문의하지마세요", "teamRef": "{{team.id}}", "projectRef": "{{project.id}}",
                "urlRef": "{{project.url}}", "leadName": "도형준", "leadRef": "{{member.A.id}}",
                "teamSize": 5, "startDate": "2026-10-29", "targetDate": "2026-12-02",
                "internalDeadline": "2026-12-01T21:00:00+09:00", "featureFreezeDate": "2026-11-24",
                "locationDecision": "기존 도형준 독립 공간에 새 프로젝트 추가", "unassignedRoles": ["B", "C", "D", "E"]},
    "placeholderPolicy": {"project": "{{project.id}}, {{project.url}}, {{project.name}}",
                          "documents": "{{document.START.url}} 등 문서 key 기준",
                          "issues": "{{issue.A.url}}, {{issue.T01.url}} 등 안정 식별자 기준",
                          "members": "A=도형준의 대상 공간 계정, B~E 미배정",
                          "sourceMetadata": "sourceId/sourceUuid/sourceAssigneeId는 매핑용 원본 식별자이며 새 객체에 직접 적용하지 않음"},
    "documents": docs, "roles": roles, "tasks": tasks, "milestones": milestones,
    "confirmationNeeded": ["정확한 외부 제출 시각·제출 위치·발표일은 Teams 공지 확인", "B~E 담당자는 실제 팀원 합류 후 배정"],
    "contentChanges": ["기존 인스턴스 링크는 새 객체 placeholder로 변경", "실제 이슈 번호는 A~E/T01~T21로 정규화",
                       "AI 요청은 현재 열어둔 이 이슈를 지칭", "사용자 확정 시작일·T01 기한 2026-10-29 반영",
                       "원안 작성 기준과 제목의 버전 날짜를 2026-10-29로 갱신"],
    "validation": {"documents": len(docs), "roles": len(roles), "tasks": len(tasks), "milestones": len(milestones),
                   "sourceFileSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(), "remoteChanges": 0},
}
assert (len(docs), len(roles), len(tasks), len(milestones)) == (6, 5, 21, 5)
for entry in docs + issues:
    assert not re.search(r"\b(?:ADE|NONONO)-\d+\b", entry["markdown"])
    assert "linear.app/ade0033" not in entry["markdown"]
for task in tasks:
    assert task["parentId"] in set("ABCDE")
    assert all(key in {item["key"] for item in tasks} for key in task["blockedBy"])
blueprint_path = BASE / "fresh_project_blueprint_20261029.json"
blueprint_path.write_text(json.dumps(blueprint, ensure_ascii=False, indent=2), encoding="utf-8")
ui_path = BASE / "fresh_project_ui_payloads_20261029.json"
ui_path.write_text(json.dumps({"project": blueprint["project"], "milestones": milestones, "docs": docs, "issues": issues}, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({"blueprint": str(blueprint_path), "uiPayloads": str(ui_path), "counts": blueprint["validation"],
                  "taskT01DueDate": tasks[0]["dueDate"], "issueOrder": [entry["key"] for entry in issues]}, ensure_ascii=True))
