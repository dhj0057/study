import json, os, sys, hashlib, subprocess
from pathlib import Path
from dataclasses import asdict
from datetime import datetime
from unittest.mock import patch

repo = Path(r'D:\study\tmp\helpdesk-urgent-decision')
sys.path.insert(0, str(repo))
os.chdir(repo)
from dotenv import load_dotenv
load_dotenv(r'D:\ai-smart-helpdesk\.env')
os.environ['HELPDESK_MODE'] = 'kev'
from app import configure, describe
from tickets import HelpDesk, TicketUpdate
from gemini import ModelUnavailable
import kev

data = json.loads((repo/'tests/data/cases.json').read_text(encoding='utf-8-sig'))
desk, _ = configure()
post = kev.httpx.post
raw = []
def capture(*args, **kwargs):
    response = post(*args, **kwargs)
    raw.append(response.json())
    return response

report = {'date':datetime.now().isoformat(), 'branch': 'codex/helpdesk-urgent-decision',
          'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),
          'components':{'T12':'81036d5','T13':'c084890','T08':'4eb7b60'},
          'model':'Kev-4B-Q4_K_M.gguf / Gemini configured FAQ selector',
          'scope':'base-model service integration; not a trained-model evaluation',
          'cases_sha256':hashlib.sha256((repo/'tests/data/cases.json').read_bytes()).hexdigest(), 'cases':[]}
out=Path(r'D:\study\tmp\helpdesk-review-evidence\urgent-decision-live-results.json')
with patch('kev.httpx.post', side_effect=capture):
    for case in data['cases']:
        raw.clear()
        ticket=desk.create_ticket(case['message'])
        actual=asdict(ticket)
        expected=case['expected']
        accept=case.get('accept',{})
        checks={}
        for key,val in expected.items():
            got=actual[key]
            if key=='faq_ids': got=list(got)
            checks[key]=got==val or (key in accept and got in accept[key])
        if 'pairs' in accept:
            pair=[ticket.category,ticket.department]
            checks['category']=checks['department']=pair in accept['pairs']
        checks['same_receipt_original']=desk.get_ticket(ticket.ticket_id).message==case['message']
        record={'case_id':case['case_id'],'message':case['message'],'expected':expected,'accept':accept,
                'actual':actual,'checks':checks,'passed':all(checks.values()),'raw_kev':list(raw)}
        report['cases'].append(record)
        out.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        print(case['case_id'], 'PASS' if record['passed'] else 'FAIL', ticket.error_code or '',flush=True)

# Only the first failure is injected. Recovery uses the actual configured adapters.
live_classify=desk.classifier
attempts=0
def fail_once(message):
    global attempts
    attempts+=1
    if attempts==1: raise ModelUnavailable()
    return live_classify(message)
retry_desk=HelpDesk(fail_once,desk.responder,desk.engine)
failed=retry_desk.create_ticket('이번 학기 성적장학금 신청은 따로 해야 하나요?')
recovered=retry_desk.retry_ticket(failed.ticket_id,expected=failed)
assert failed.error_code=='CLASSIFY_FAILED'
assert recovered.ticket_id==failed.ticket_id and recovered.message==failed.message
assert recovered.error_code is None and recovered.faq_ids==('FAQ-S01',)
reviewing=retry_desk.update_ticket(recovered.ticket_id,TicketUpdate(status='IN_REVIEW',reply='담당자 확인 답변',resolution_note='관리자 전용 메모'),expected=recovered)
try:
    retry_desk.update_ticket(reviewing.ticket_id,TicketUpdate(status='DONE',reply='',resolution_note=''),expected=reviewing)
    raise AssertionError('empty completion allowed')
except ValueError: pass
assert retry_desk.get_ticket(reviewing.ticket_id)==reviewing
done=retry_desk.update_ticket(reviewing.ticket_id,TicketUpdate(status='DONE'),expected=reviewing)
assert done.status=='DONE' and '관리자 전용 메모' not in describe(done)
report['retry_admin']={'first_failure_injected':True,'recovery':'real Kev + Gemini','passed':True,'ticket_id':done.ticket_id,'initial_error':failed.error_code,'recovered_faq':list(recovered.faq_ids),'completed_status':done.status}
report['summary']={'passed':sum(x['passed'] for x in report['cases']),'total':len(report['cases']),
                   'failed_ids':[x['case_id'] for x in report['cases'] if not x['passed']],
                   'errors':[x['case_id'] for x in report['cases'] if x['actual']['error_code']]}
out.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report['summary']),flush=True)
print('RETRY_ADMIN_PASS',flush=True)

