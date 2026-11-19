import hashlib
import json
import sys
from datetime import datetime
from pathlib import Path

from dotenv import dotenv_values
from gradio_client import Client

repo = Path(r"D:\ai-smart-helpdesk")
sys.path.insert(0, str(repo))
from app import CATEGORIES, STATUSES, URGENCIES

url = sys.argv[1]
out = Path(__file__).with_name("t16-public-results.json")
settings = dotenv_values(repo / ".env.t15")
auth = (settings["HELPDESK_SHARE_USER"], settings["HELPDESK_SHARE_PASSWORD"])
client = Client(url, auth=auth, verbose=False)
case_path = repo / "tests" / "data" / "cases.json"
cases = json.loads(case_path.read_text(encoding="utf-8"))["cases"]
faq_answer = {f["faq_id"]: f["answer"] for f in json.loads((repo / "faqs.json").read_text(encoding="utf-8"))}
category_key = {label: key for key, label in CATEGORIES.items()}
urgency_key = {label: key for key, label in URGENCIES.items()}
status_key = {label: key for key, label in STATUSES.items()}
report = {
    "executed_at": datetime.now().astimezone().isoformat(timespec="seconds"),
    "release": "c7a4994",
    "transport": "Authenticated Gradio HTTPS relay from the host PC",
    "engine": "Kev-4B Q4_K_M and Gemini FAQ selector",
    "dataset_sha256": hashlib.sha256(case_path.read_bytes()).hexdigest(),
    "cases": [],
}
for case in cases:
    row = {"case_id": case["case_id"], "message": case["message"], "expected": case["expected"], "accept": case.get("accept", {})}
    try:
        receipt, shown = client.predict(case["message"], api_name="/submit_ticket")
        stored = client.predict(receipt, api_name="/get_ticket")
        header, answer = shown.split("\n\n", 1)
        values = dict(line.split("  ", 1) for line in header.splitlines())
        faq_ids = [] if values["근거 FAQ"] == "없음" else values["근거 FAQ"].split(", ")
        actual = {
            "category": category_key[values["문의 분야"]],
            "department": "UNASSIGNED" if values["담당"] == "미배정" else values["담당"],
            "urgency": urgency_key[values["긴급도"]],
            "review_required": values["사람 검토"] == "필요",
            "faq_ids": faq_ids,
            "status": status_key[values["상태"]],
        }
        expected, accept = row["expected"], row["accept"]
        checks = {key: actual[key] == value or actual[key] in accept.get(key, []) for key, value in expected.items()}
        if "pairs" in accept:
            checks["category"] = checks["department"] = [actual["category"], actual["department"]] in accept["pairs"]
        checks["same_receipt_original"] = values["접수번호"] == receipt and stored == "원문\n" + case["message"] + "\n\n" + shown
        checks["verbatim_faq_when_shown"] = not faq_ids or (len(faq_ids) == 1 and answer == faq_answer.get(faq_ids[0]))
        checks["actual_engine"] = values["처리 방식"] == "Kev-4B / Gemini"
        row.update(receipt=receipt, actual=actual, answer=answer, checks=checks)
    except Exception as error:
        row["call_error"] = type(error).__name__
    report["cases"].append(row)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(case["case_id"], "MATCH" if row.get("checks") and all(row["checks"].values()) else "DIFF", flush=True)
rows = [r for r in report["cases"] if "checks" in r]
summary = {
    "executed": len(rows),
    "all_match": sum(all(r["checks"].values()) for r in rows),
    "fields": {k: sum(r["checks"][k] for r in rows) for k in rows[0]["checks"]} if rows else {},
    "required_review": sum(r["actual"]["review_required"] for r in rows if r["expected"]["review_required"]),
    "high": sum(r["actual"]["urgency"] == "HIGH" for r in rows if r["expected"]["urgency"] == "HIGH"),
    "faq_match_on_normal_12": sum(r["checks"]["faq_ids"] for r in rows if r["expected"]["faq_ids"]),
    "failed_ids": [r["case_id"] for r in rows if not all(r["checks"].values())],
    "call_errors": [r["case_id"] for r in report["cases"] if "call_error" in r],
}
report["summary"] = summary
out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(summary), flush=True)
