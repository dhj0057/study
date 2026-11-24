import os
import sys
from pathlib import Path
from dotenv import load_dotenv

sys.path.insert(0, r"D:\study\tmp\helpdesk-light-mode")
load_dotenv(Path(r"D:\ai-smart-helpdesk") / ".env")
os.environ["HELPDESK_MODE"] = "kev"
os.environ["KEV_BASE_URL"] = "http://127.0.0.1:18089"
from app import appearance, build_app, configure

desk, banner = configure()
build_app(desk, banner).queue(max_size=16).launch(
    server_name="127.0.0.1", server_port=int(sys.argv[1]), share=False, **appearance()
)
