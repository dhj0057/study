from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE / "deps"))
import markdown

SOURCE = BASE / "source_snapshot_20261028.json"
TARGET_PROJECT_URL = "https://linear.app/dhj00570-helpdesk/project/3903fba1-33a6-4627-a25e-4481d65f7d35"
OLD_WORKSPACE_URL = "https://linear.app/ade0033"
NEW_WORKSPACE_URL = "https://linear.app/dhj00570-helpdesk"
DOCUMENT_ORDER = [
    "91e3644f-a8b7-471d-a235-8076366471fb",
    "832e0c42-8bf7-4fd6-ad30-b7a51ea89531",
    "09fbfb8e-99a4-4314-a1f2-143912a2d638",
    "34e9641c-e66d-44f4-88df-1440875b0d3f",
    "bfefc2ca-3156-4b72-91b8-ed4e57433592",
    "d271d6ca-4612-45ee-8e99-ea41f97a383b",
]


def convert_links(content: str) -> str:
    updated = re.sub(
        r"\[([^\]]+)\]\(<?https://linear\.app/ade0033/document/[^)\r\n>]+>?\)",
        lambda match: match.group(1),
        content,
    )
    updated = re.sub(
        r"https://linear\.app/ade0033/project/[^\s<>)]+",
        TARGET_PROJECT_URL,
        updated,
    )
    updated = updated.replace(OLD_WORKSPACE_URL + "/", NEW_WORKSPACE_URL + "/")
    assert "https://linear.app/dhj00570-helpdesk/document/" not in updated, "Unresolved source document link"
    assert OLD_WORKSPACE_URL not in updated, "Unconverted source workspace URL"
    assert content.count("\n") == updated.count("\n"), "Content line structure changed"
    return updated


def render(content: str) -> str:
    return markdown.markdown(
        content,
        extensions=["tables", "fenced_code", "sane_lists", "nl2br"],
        output_format="html",
    )


def document_payloads(snapshot: dict) -> None:
    lookup = {item["id"]: item for item in snapshot["documents"]}
    payloads = []
    validation = []
    for document_id in DOCUMENT_ORDER:
        item = lookup[document_id]
        body = convert_links(item["content"])
        html = render(body)
        payloads.append({"sourceId": document_id, "title": item["title"], "markdown": body, "html": html})
        validation.append({
            "sourceId": document_id,
            "title": item["title"],
            "sourceCharacters": len(item["content"]),
            "markdownCharacters": len(body),
            "htmlCharacters": len(html),
            "tableCount": html.count("<table>"),
            "codeBlockCount": html.count("<pre>"),
            "listCount": html.count("<ul>") + html.count("<ol>"),
            "lineCountPreserved": True,
        })
    assert len(payloads) == 6
    output = BASE / "document_transfer_payloads.json"
    output.write_text(json.dumps(payloads, ensure_ascii=False, indent=2), encoding="utf-8")
    check = json.loads(output.read_text(encoding="utf-8"))
    assert [item["sourceId"] for item in check] == DOCUMENT_ORDER
    assert all(isinstance(item["html"], str) and item["html"] for item in check)
    report = {"renderer": "Python-Markdown", "version": markdown.__version__, "count": 6, "documents": validation}
    (BASE / "document_transfer_validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"path": str(output), "count": len(payloads), "renderer": "Python-Markdown " + markdown.__version__, "validation": validation}, ensure_ascii=False))


def issue_payloads(snapshot: dict) -> None:
    ordered = sorted(snapshot["issues"], key=lambda item: int(item["id"].split("-")[-1]))
    assert [item["id"] for item in ordered] == [f"NONONO-{number}" for number in range(1, 27)]
    source_ids = {item["id"] for item in ordered}
    payloads = []
    validation = []
    outside_relations = []
    for item in ordered:
        source_content = item.get("description") or ""
        body = convert_links(source_content)
        html = render(body)
        relations = item.get("relations")
        payloads.append({
            "sourceId": item["id"],
            "sourceUuid": item["uuid"],
            "title": item["title"],
            "markdown": body,
            "html": html,
            "dueDate": item.get("dueDate"),
            "status": item.get("status"),
            "priority": item.get("priority"),
            "assigneeId": item.get("assigneeId"),
            "parentId": item.get("parentId"),
            "relations": relations,
            "milestone": item.get("projectMilestone"),
        })
        if item.get("parentId"):
            assert item["parentId"] in source_ids, f"Unknown parent for {item['id']}"
        for relation_type, relation_value in (relations or {}).items():
            linked = relation_value if isinstance(relation_value, list) else ([relation_value] if relation_value else [])
            for entry in linked:
                linked_id = entry.get("id") if isinstance(entry, dict) else entry
                if linked_id and linked_id not in source_ids:
                    outside_relations.append({"sourceId": item["id"], "type": relation_type, "target": linked_id})
        validation.append({
            "sourceId": item["id"],
            "sourceCharacters": len(source_content),
            "markdownCharacters": len(body),
            "htmlCharacters": len(html),
            "lineCountPreserved": True,
            "parentId": item.get("parentId"),
            "metadataMatchesSource": True,
        })
    output = BASE / "issue_transfer_payloads.json"
    output.write_text(json.dumps(payloads, ensure_ascii=False, indent=2), encoding="utf-8")
    check = json.loads(output.read_text(encoding="utf-8"))
    assert len(check) == 26
    assert [item["sourceId"] for item in check] == [f"NONONO-{number}" for number in range(1, 27)]
    for prepared, source in zip(check, ordered):
        assert prepared["title"] == source["title"]
        for field in ["dueDate", "status", "priority", "assigneeId", "parentId", "relations"]:
            assert prepared[field] == source.get(field), f"Metadata changed: {source['id']} / {field}"
        assert prepared["milestone"] == source.get("projectMilestone")
        assert isinstance(prepared["html"], str) and prepared["html"]
    report = {
        "renderer": "Python-Markdown",
        "version": markdown.__version__,
        "count": len(check),
        "sourceIdOrder": [item["sourceId"] for item in check],
        "outsideRelations": outside_relations,
        "note": "sourceUuid, assigneeId and milestone.id remain source-workspace identifiers and require destination mapping where applicable.",
        "issues": validation,
    }
    (BASE / "issue_transfer_validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"path": str(output), "count": len(check), "sourceIdOrder": report["sourceIdOrder"], "outsideRelations": outside_relations}, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--documents", action="store_true")
    parser.add_argument("--issues", action="store_true")
    arguments = parser.parse_args()
    snapshot = json.loads(SOURCE.read_text(encoding="utf-8-sig"))
    if arguments.documents:
        document_payloads(snapshot)
    if arguments.issues:
        issue_payloads(snapshot)
