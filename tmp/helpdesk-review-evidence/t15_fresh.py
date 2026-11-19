import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

import httpx
from dotenv import dotenv_values
from gradio_client import Client

url = "http://127.0.0.1:17868"
env = {
    **os.environ,
    **{k: v for k, v in dotenv_values(Path(r"D:\ai-smart-helpdesk\.env")).items() if v is not None},
    "HELPDESK_MODE": "kev",
    "GRADIO_SERVER_PORT": "17868",
    "KEV_BASE_URL": "http://127.0.0.1:18089",
    "PYTHONIOENCODING": "utf-8",
}
assert env.get("GEMINI_API_KEY"), "Local Gemini configuration missing"


def start():
    proc = subprocess.Popen(
        [sys.executable, "-u", "app.py"], env=env,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, creationflags=subprocess.CREATE_NO_WINDOW,
    )
    try:
        for _ in range(50):
            if proc.poll() is not None:
                raise RuntimeError(f"Clean-checkout app exited ({proc.returncode})")
            try:
                if httpx.get(url + "/config", timeout=1).is_success:
                    return proc
            except httpx.RequestError:
                pass
            time.sleep(0.4)
        raise RuntimeError("Clean-checkout app did not start")
    except BaseException:
        if proc.poll() is None:
            proc.terminate()
            proc.wait(timeout=10)
        raise


process = start()
try:
    c = Client(url, verbose=False)
    message = "이번 학기 성적장학금 신청은 따로 해야 하나요?"
    number, result = c.predict(message, api_name="/submit_ticket")
    assert "FAQ-S01" in result and "Kev-4B / Gemini" in result and number in result
    details = c.predict(number, api_name="/get_ticket")
    assert number in details and message in details
    print("PASS fresh checkout: app.py, real model FAQ-S01, same receipt and message", flush=True)
finally:
    process.terminate()
    process.wait(timeout=10)

process = start()
try:
    c = Client(url, verbose=False)
    assert not c.predict(api_name="/list_tickets")["data"]
    assert c.predict(number, api_name="/get_ticket") == "접수번호를 확인해 주세요."
    result = {
        "date": datetime.now().astimezone().isoformat(timespec="seconds"),
        "release": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
        "python": sys.version.split()[0],
        "engine": "Existing local Kev-4B Q4_K_M and Gemini, new app directory and Python environment",
        "case": message,
        "faq": "FAQ-S01",
        "receipt": number,
        "same_receipt_and_original": True,
        "new_process_empty_and_old_receipt_unavailable": True,
    }
    Path(__file__).with_name("t15-fresh-results.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print("PASS restart: empty list and old receipt unavailable.", flush=True)
finally:
    process.terminate()
    process.wait(timeout=10)
