import os
import sys
from pathlib import Path

from dotenv import load_dotenv

worktree = Path(r"D:\study\tmp\helpdesk-ui-polish")
sys.path.insert(0, str(worktree))
load_dotenv(Path(r"D:\ai-smart-helpdesk") / ".env")
os.environ["HELPDESK_MODE"] = "kev"
os.environ["KEV_BASE_URL"] = "http://127.0.0.1:18089"

from app import appearance, build_app, configure
from gemini import ModelUnavailable

desk, banner = configure()
if "--retry-check" in sys.argv:
    original_classifier = desk.classifier
    fail_once = True

    def classifier(message):
        global fail_once
        if fail_once and message == "성적 좋으면 장학금 신청서를 내야 하나요, 아니면 그냥 주나요?":
            fail_once = False
            raise ModelUnavailable
        return original_classifier(message)

    desk.classifier = classifier

build_app(desk, banner).queue(max_size=16).launch(
    server_name="127.0.0.1", server_port=17875, share=False, **appearance()
)
