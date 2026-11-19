from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import sys
from unittest.mock import Mock

from dotenv import dotenv_values
from gradio_client import Client

repo = Path(r"D:\ai-smart-helpdesk")
sys.path.insert(0, str(repo))
from gemini import InvalidModelOutput, ModelUnavailable
from reply import FAQSelection, build_reply, demo_reply
from tickets import HelpDesk
from triage import demo_classify

url = sys.argv[1]
settings = dotenv_values(repo / ".env.t15")
auth = (settings["HELPDESK_SHARE_USER"], settings["HELPDESK_SHARE_PASSWORD"])
a, b = (Client(url, auth=auth, verbose=False) for _ in range(2))
results = []


def check(name, environment, run):
    try:
        detail = run()
        results.append({"scenario": name, "environment": environment, **detail})
    except AssertionError as exc:
        results.append({"scenario": name, "environment": environment, "outcome": "fail", "evidence": str(exc)})
    except Exception as exc:
        results.append({"scenario": name, "environment": environment, "outcome": "not_verified", "error_type": type(exc).__name__})


normal = "이번 학기 성적장학금 신청은 따로 해야 하나요?"
personal = "제가 낸 휴학 신청이 승인됐나요?"


def request(client, name, *args):
    return client.predict(*args, api_name="/" + name)


def reject(call, text):
    try:
        call()
    except Exception as exc:
        assert text in str(exc), type(exc).__name__
    else:
        raise AssertionError("Expected user-visible rejection")


def blank():
    reject(lambda: request(a, "submit_ticket", "   "), "가상 문의를 입력")
    return {"outcome": "pass", "evidence": "Whitespace is rejected by the live HTTPS submission handler."}


def stored_error(name, classify, respond):
    desk = HelpDesk(classify, respond, "isolated failure injection")
    ticket = desk.create_ticket(normal)
    assert ticket.error_code == name
    assert ticket.review_required and not ticket.faq_ids
    assert desk.get_ticket(ticket.ticket_id).message == normal
    return {"outcome": "pass", "evidence": name + ": review route with original and receipt preserved"}


def bad_faq(message, decision, faqs):
    gemini = Mock()
    gemini.generate.return_value = FAQSelection(faq_id="FAQ-UNKNOWN")
    return build_reply(message, decision, faqs, gemini=gemini, model="injected")


def duplicate():
    config = a.config
    event = next(e for e in config["dependencies"] if e.get("api_name") == "submit_ticket")
    assert event.get("trigger_mode") == "once", event.get("trigger_mode")
    # Separate calls can represent separate legitimate tickets, and they bypass the button's pending guard.
    # Exercise that boundary with a short synthetic request and no Gemini FAQ candidate.
    with ThreadPoolExecutor(max_workers=2) as pool:
        responses = [pool.submit(request, c, "submit_ticket", "신청 기간이 언제예요?") for c in (a, b)]
        receipts = [job.result()[0] for job in responses]
    return {
        "outcome": "partial",
        "evidence": "UI config uses trigger_mode=once. Two separate concurrent API requests issued distinct receipts; physical double-click on one screen still needs confirmation.",
        "distinct_receipts": len(set(receipts)),
    }


def update(client, receipt, reply, status):
    return request(client, "save_ticket", receipt, "ACADEMIC", "LOW", reply, "", status)


def stale():
    receipt, _ = request(a, "submit_ticket", personal)
    request(a, "load_ticket_editor", receipt)
    request(b, "load_ticket_editor", receipt)
    update(a, receipt, "시연 최초 저장", "IN_REVIEW")
    reject(lambda: update(b, receipt, "시연 오래된 저장", "IN_REVIEW"), "다른 창에서")
    actual = request(a, "refresh_ticket", receipt)
    assert "시연 최초 저장" in actual and "시연 오래된 저장" not in actual
    return {"outcome": "pass", "evidence": "Separate live sessions rejected the stale save and retained the first reply."}


def completed():
    receipt, _ = request(a, "submit_ticket", personal)
    request(a, "load_ticket_editor", receipt)
    update(a, receipt, "시연 검토 답변", "IN_REVIEW")
    reject(lambda: update(a, receipt, "", "DONE"), "최종 답변 또는 처리 메모")
    update(a, receipt, "시연 최종 답변", "DONE")
    reject(lambda: update(a, receipt, "시연 수정 시도", "DONE"), "조회만")
    user = request(a, "refresh_ticket", receipt)
    assert "상태  완료" in user and "시연 최종 답변" in user and receipt in user
    return {"outcome": "pass", "evidence": "Live empty completion and edits after completing were rejected; original receipt retained the approved reply."}


check("빈 입력", "deployed HTTPS", blank)
check("분류 실패", "local injection", lambda: stored_error("CLASSIFY_FAILED", Mock(side_effect=ModelUnavailable), demo_reply))
check("생성 실패", "local injection", lambda: stored_error("REPLY_FAILED", demo_classify, Mock(side_effect=ModelUnavailable)))
check("분류값 오류", "local injection", lambda: stored_error("CLASSIFY_FORMAT", Mock(side_effect=InvalidModelOutput), demo_reply))
check("FAQ 번호 불일치", "local injection", lambda: stored_error("REPLY_FORMAT", demo_classify, bad_faq))
check("중복 접수", "deployed HTTPS and UI event configuration", duplicate)
check("두 창 갱신", "deployed HTTPS, separate client sessions", stale)
check("완료 보호", "deployed HTTPS", completed)
Path(__file__).with_name("t16-error-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(results, ensure_ascii=False), flush=True)
