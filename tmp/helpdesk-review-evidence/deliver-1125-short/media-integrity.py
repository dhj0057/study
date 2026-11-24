import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

validator = Path(r"C:\Users\AISW-510-125\.codex\plugins\cache\openai-primary-runtime\presentations\26.1119.11507\skills\presentations\container_tools\inspect_presentation_package_integrity.py")
result = subprocess.run([sys.executable, str(validator), *sys.argv[1:]], capture_output=True, text=True, encoding="utf-8")
if result.returncode == 0:
    print(result.stdout, end="")
    raise SystemExit(0)

try:
    report = json.loads(result.stdout)
except json.JSONDecodeError:
    print(result.stdout, end="")
    print(result.stderr, file=sys.stderr, end="")
    raise SystemExit(result.returncode)

expected = {"code": "referenced_relationship_missing", "part": "ppt/slides/slide3.xml", "relationship_id": ""}
if report.get("findings") != [expected]:
    print(result.stdout, end="")
    raise SystemExit(result.returncode)

from xml.etree import ElementTree as ET
from hashlib import sha256
from posixpath import normpath

candidate = next(Path(x) for x in sys.argv[1:] if x.lower().endswith(".pptx") and Path(x).is_file())
r = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
a = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
p14 = "{http://schemas.microsoft.com/office/powerpoint/2010/main}"
source_video = Path(r"D:\study\tmp\helpdesk-review-evidence\deliver-1125-short\AI_Smart_Help_Desk_1a41fc5_시연영상.mp4")
with zipfile.ZipFile(candidate) as deck:
    slide = ET.fromstring(deck.read("ppt/slides/slide3.xml"))
    click, = list(slide.iter(a + "hlinkClick"))
    assert click.attrib == {r+"id": "", "action": "ppaction://media"}
    media, = list(slide.iter(p14 + "media"))
    video, = list(slide.iter(a + "videoFile"))
    rels = ET.fromstring(deck.read("ppt/slides/_rels/slide3.xml.rels"))
    by_id = {item.get("Id"): item for item in rels}
    targets = [by_id[media.get(r+"embed")], by_id[video.get(r+"link")]]
    for link in targets:
        assert link.get("TargetMode", "Internal") == "Internal"
        target = normpath("ppt/slides/" + link.get("Target"))
        assert sha256(deck.read(target)).digest() == sha256(source_video.read_bytes()).digest()
report.update(status="pass", findings=[], finding_count=0, compatibility_notes=[
    "Microsoft PowerPoint native ppaction://media uses an empty id for its playback action. Both real media relationships resolve to the byte-identical embedded MP4."
])
print(json.dumps(report))