from pathlib import Path
src=Path('D:/study/equipment_report/build.py').read_text(encoding='utf-8')
src=src[:src.index("d.core_properties.title=")]
exec(src)

# Keep the existing chapters and identify the added logical design in the contents.
d.tables[0].add_row().cells[0].text='7'
d.tables[0].rows[-1].cells[1].text='논리적 설계와 릴레이션 스키마'
page('7 논리적 설계와 릴레이션 스키마')
p('앞서 정의한 다섯 개체를 다섯 릴레이션으로 변환한다. 이 장의 영문 이름은 구현에 사용할 이름이며 한글 속성과 일대일로 대응한다. PK는 기본키, FK는 외래키, UQ는 유일키를 뜻한다. 밑줄 대신 PK 표기로 식별자를 명시한다.')
h('7 1 릴레이션 스키마')
schemas=[
('학생 STUDENT','STUDENT(student_id [PK], name, department, phone, eligibility)'),
('장비 EQUIPMENT','EQUIPMENT(equipment_id [PK], equipment_name, model_name, storage_location, operating_status)'),
('예약 RESERVATION','RESERVATION(reservation_id [PK], student_id [FK], equipment_id [FK], requested_at, starts_at, ends_at, reservation_status, purpose)'),
('대여 LOAN','LOAN(loan_id [PK], reservation_id [FK, UQ], checked_out_at, returned_at, return_inspection)'),
('정비 MAINTENANCE','MAINTENANCE(maintenance_id [PK], equipment_id [FK], started_at, completed_at, reason, action_taken)')]
for title,s in schemas:h(title);p(s)
h('7 2 외래키와 관계의 변환')
table(['참조하는 속성','참조 대상','구현되는 관계'],[
('RESERVATION.student_id','STUDENT.student_id','학생 1 : 예약 N'),
('RESERVATION.equipment_id','EQUIPMENT.equipment_id','장비 1 : 예약 N'),
('LOAN.reservation_id','RESERVATION.reservation_id','예약 1 : 대여 0..1'),
('MAINTENANCE.equipment_id','EQUIPMENT.equipment_id','장비 1 : 정비 N')],[6.1,5.9,4.6])
p('모든 FK는 NOT NULL이다. LOAN.reservation_id에는 UNIQUE를 함께 적용하여 예약 하나에 대여가 최대 한 건만 연결되도록 한다. 모든 참조에 ON DELETE NO ACTION 또는 RESTRICT를 적용하고 식별자는 변경하지 않는다. 이력 테이블의 삭제는 업무 처리에서 제공하지 않는다.')
p('대여의 학생과 장비는 예약을 통해 조회한다. 따라서 LOAN에 student_id와 equipment_id를 추가하지 않으며, 예약의 학생·장비·시간 구간은 등록 후 변경하지 않는다. 일정 변경은 취소 후 재예약으로 처리한다.')

page('7 속성별 자료형과 도메인')
p('자료형은 특정 DBMS를 선택하기 전의 설계안이다. VARCHAR 길이는 최대 문자 수 기준이며 한글을 저장할 수 있는 문자 설정을 사용한다. TIMESTAMP는 시간대를 제외한 일시형을 뜻하며 모든 시각을 한국 표준시로 통일한다. 실제 DDL에서는 DBMS에 맞게 DATETIME 등으로 변환한다.')
def dictionary(title,rows):
 h(title)
 t=table(['한글 속성','영문 속성','자료형','키와 도메인'],rows,[3.0,5.4,3.0,5.2])
 for row in t.rows:
  for cell in row.cells:
   for par in cell.paragraphs:
    par.paragraph_format.space_before=Pt(1.5)
    par.paragraph_format.space_after=Pt(1.5)
dictionary('7 3 학생과 장비',[
('학번','student_id','VARCHAR(20)','학생 PK'),('이름','name','VARCHAR(50)','필수'),('학과','department','VARCHAR(100)','필수'),('연락처','phone','VARCHAR(30)','필수, 숫자 연산 대상 아님'),('이용가능여부','eligibility','VARCHAR(10)','가능 또는 제한'),
('장비번호','equipment_id','VARCHAR(20)','장비 PK'),('장비명','equipment_name','VARCHAR(100)','필수'),('모델명','model_name','VARCHAR(100)','필수'),('보관위치','storage_location','VARCHAR(100)','필수'),('운영상태','operating_status','VARCHAR(10)','정상 또는 정비중')])
dictionary('7 4 예약',[
('예약번호','reservation_id','BIGINT','PK, 시스템 생성 양의 정수'),('학번','student_id','VARCHAR(20)','FK → 학생'),('장비번호','equipment_id','VARCHAR(20)','FK → 장비'),('신청일시','requested_at','TIMESTAMP','필수, 시스템 처리 시각'),('예약시작일시','starts_at','TIMESTAMP','필수'),('예약종료일시','ends_at','TIMESTAMP','필수'),('예약상태','reservation_status','VARCHAR(10)','확정, 취소, 대여전환'),('사용목적','purpose','VARCHAR(500)','필수')])
p('이 장의 모든 속성은 NOT NULL을 기본으로 한다. NULL을 허용하는 네 속성은 다음 쪽에 명시한다. 필수 문자열은 공백만 있는 입력을 허용하지 않으며, 학번과 장비번호는 선행 0을 보존할 수 있도록 문자형으로 정의한다.')

page('7 대여 정비와 무결성 제약')
dictionary('7 5 대여와 정비',[
('대여번호','loan_id','BIGINT','대여 PK, 시스템 생성 양의 정수'),('예약번호','reservation_id','BIGINT','FK → 예약, UNIQUE'),('실제대여일시','checked_out_at','TIMESTAMP','필수, 시스템 처리 시각'),('실제반납일시','returned_at','TIMESTAMP','NULL 허용'),('반납점검내용','return_inspection','VARCHAR(1000)','NULL 허용'),
('정비번호','maintenance_id','BIGINT','정비 PK, 시스템 생성 양의 정수'),('장비번호','equipment_id','VARCHAR(20)','FK → 장비'),('정비시작일시','started_at','TIMESTAMP','필수, 시스템 처리 시각'),('정비완료일시','completed_at','TIMESTAMP','NULL 허용'),('정비사유','reason','VARCHAR(500)','필수'),('조치내용','action_taken','VARCHAR(1000)','NULL 허용')])
h('7 6 행 단위 제약과 업무 처리 제약')
table(['적용 방법','제약 내용'],[
('CHECK 등 행 단위 제약','requested_at ≤ starts_at < ends_at. returned_at은 NULL 또는 checked_out_at 이상. completed_at은 NULL 또는 started_at 이상. 각 상태값은 정의된 도메인만 허용.'),
('NULL 쌍 제약','returned_at과 return_inspection은 모두 NULL이거나 모두 값이 있어야 한다. completed_at과 action_taken도 같은 규칙을 적용한다. 완료 내용은 공백 입력을 허용하지 않는다.'),
('트랜잭션 검사와 변경','R08의 시간 중복, R12의 대여 가능 조건, 미반납 장비 중복, 진행 정비 최대 한 건, 예약상태와 대여의 일치, 정비와 장비상태의 일치를 검사·변경한다. 장비별 잠금으로 검사 후 동시 등록을 막는다.')],[4.1,12.5])
h('7 7 함수 종속성과 정규화 검토')
p('각 릴레이션의 PK는 해당 행의 모든 비키 속성을 결정한다. 대여의 reservation_id도 UNIQUE와 NOT NULL에 의해 후보키이며 대여의 모든 속성을 결정한다. 속성은 원자값으로 저장하고 복합키가 없으므로 부분 함수 종속이 없다. 선언한 업무 규칙에서 비키 속성 간 추가 함수 종속은 없으므로 각 릴레이션은 제3정규형을 만족한다.')
p('학과와 보관위치는 명칭만 저장하므로 별도 개체로 분리하지 않는다. 장비명과 모델명은 이 프로젝트에서 독립 입력값으로 취급하며 모델명만으로 장비명 등이 결정된다는 규칙은 두지 않는다. 향후 학과의 별도 정보나 모델별 공통 사양을 관리한다면 해당 함수 종속성을 다시 검토한다.')
d.core_properties.title='대학교 실습장비 예약 대여 정비 관리 시스템'
d.core_properties.subject='요구사항 분석 및 개념적 설계와 릴레이션 스키마'
d.core_properties.author=''
target=OUT/'대학교_실습장비_보고서_릴레이션스키마_추가.docx'
d.save(target)
print(target)
