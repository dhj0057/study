import ast, math, textwrap
from pathlib import Path
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

OUT=Path('D:/study/equipment_report')
src=ast.parse((OUT/'build.py').read_text(encoding='utf-8'))
req=next(ast.literal_eval(n.value) for n in src.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='req' for t in n.targets))
file=ET.Element('mxfile',host='app.diagrams.net',type='device',version='24.7.17')
fontpath='C:/Windows/Fonts/malgun.ttf'
class Page:
 def __init__(self,name,w,h):
  self.w,self.h=w,h;self.i=1;self.nodes={};self.commands=[]
  self.diagram=ET.SubElement(file,'diagram',id=f'page{len(file)+1}',name=name)
  self.model=ET.SubElement(self.diagram,'mxGraphModel',dx='1400',dy='900',grid='1',gridSize='10',guides='1',tooltips='1',connect='1',arrows='1',fold='1',page='1',pageScale='1',pageWidth=str(w),pageHeight=str(h),math='0',shadow='0')
  self.root=ET.SubElement(self.model,'root');ET.SubElement(self.root,'mxCell',id='0');ET.SubElement(self.root,'mxCell',id='1',parent='0')
 def box(self,text,x,y,w,h,kind='rect',fill='#FFFFFF',size=18,bold=False,align='center',key=False):
  self.i+=1;id=str(self.i)
  shape={'rect':'rounded=0;','ellipse':'ellipse;','diamond':'rhombus;','text':'text;strokeColor=none;fillColor=none;'}[kind]
  style=f'{shape}whiteSpace=wrap;html=0;fontFamily=Malgun Gothic;fontSize={size};fontColor=#182B40;fillColor={fill};strokeColor=#60758B;strokeWidth=1.5;align={align};verticalAlign=middle;spacing=12;fontStyle={(1 if bold else 0)+(4 if key else 0)};'
  if kind=='text':style+='strokeColor=none;fillColor=none;'
  c=ET.SubElement(self.root,'mxCell',id=id,value=text,style=style,vertex='1',parent='1');ET.SubElement(c,'mxGeometry',x=str(x),y=str(y),width=str(w),height=str(h),attrib={'as':'geometry'})
  self.nodes[id]=(x,y,w,h);self.commands.append(('box',text,x,y,w,h,kind,fill,size,bold,align,key));return id
 def line(self,a,b,label='',points=None,arrow=False):
  self.i+=1;id=str(self.i)
  style='edgeStyle=none;rounded=0;html=0;endArrow='+('classic' if arrow else 'none')+';startArrow=none;strokeColor=#506B85;strokeWidth=1.6;fontSize=17;fontFamily=Malgun Gothic;labelBackgroundColor=#FFFFFF;'
  if points:style+='edgeStyle=orthogonalEdgeStyle;'
  c=ET.SubElement(self.root,'mxCell',id=id,value=label,style=style,edge='1',parent='1',source=a,target=b)
  g=ET.SubElement(c,'mxGeometry',relative='1',attrib={'as':'geometry'})
  if points:
   ar=ET.SubElement(g,'Array',attrib={'as':'points'})
   for x,y in points:ET.SubElement(ar,'mxPoint',x=str(x),y=str(y))
  self.commands.append(('line',a,b,label,points,arrow));return id
 def title(self,num,title,subtitle):
  self.box(num+'  '+title,45,30,self.w-90,55,'text',size=30,bold=True,align='left')
  self.box(subtitle,45,88,self.w-90,45,'text',size=18,align='left')
 def preview(self,path):
  im=Image.new('RGB',(self.w,self.h),'white');dr=ImageDraw.Draw(im)
  def text(s,x,y,w,h,size,align='center',under=False):
   ft=ImageFont.truetype(fontpath,size);lines=[]
   for para in s.split('\n'):
    line=''
    for ch in para:
     if dr.textlength(line+ch,font=ft)>w-24 and line:lines.append(line);line=''
     line+=ch
    lines.append(line)
   yy=y+(h-len(lines)*(size+7))/2
   for ln in lines:
    xx=x+12 if align=='left' else x+(w-dr.textlength(ln,font=ft))/2
    dr.text((xx,yy),ln,font=ft,fill='#182B40')
    if under:dr.line((xx,yy+size+2,xx+dr.textlength(ln,font=ft),yy+size+2),fill='#182B40',width=1)
    yy+=size+7
  for c in self.commands:
   if c[0]!='line':continue
   _,a,b,lab,pts,arrow=c
   def center(id):x,y,w,h=self.nodes[id];return (x+w/2,y+h/2)
   xy=[center(a)]+(pts or [])+[center(b)];dr.line(xy,fill='#506B85',width=2)
   if lab:
    u,v=xy[len(xy)//2-1:len(xy)//2+1];mx,my=(u[0]+v[0])/2,(u[1]+v[1])/2
    dr.rectangle((mx-43,my-17,mx+43,my+17),fill='white');text(lab,mx-48,my-19,96,38,16)
  for c in self.commands:
   if c[0]!='box':continue
   _,s,x,y,w,h,k,fill,size,bold,align,key=c
   bounds=(x,y,x+w,y+h)
   if k=='rect':dr.rectangle(bounds,fill=fill,outline='#60758B',width=2)
   elif k=='ellipse':dr.ellipse(bounds,fill=fill,outline='#60758B',width=2)
   elif k=='diamond':dr.polygon([(x+w/2,y),(x+w,y+h/2),(x+w/2,y+h),(x,y+h/2)],fill=fill,outline='#60758B')
   text(s,x,y,w,h,size,align,key)
  im.save(path)

p=Page('01 요구명세서',1800,1600)
p.title('01','대학교 실습장비 예약·대여·정비 관리 시스템','요구사항 18개 · 한 관리실 · 예약 1건당 실물 장비 1대 · 학생 / 장비 / 예약 / 대여 / 정비')
for i,r in enumerate(req):
 col=i//9;row=i%9;x=45+col*870;y=155+row*138
 p.box(f'R{i+1:02d}',x,y,75,125,fill='#DFEAF5',bold=True,size=20)
 p.box(r,x+75,y,765,125,align='left',size=18)
p.box('범위 및 해석',45,1420,200,120,fill='#DFEAF5',bold=True)
p.box('예약은 신청 즉시 확정한다. 예약 시간 변경·대여 연장·묶음 예약·결제·승인·로그인 구현은 제외한다.\n장비 운영상태는 정상/정비중만 저장하며, 대여중·미반납·연체 여부는 이력과 현재 시각으로 조회한다.\n미반납 연체 = 실제반납일시가 없고 현재 시각 > 예약종료일시. 이력은 삭제하지 않는다.',245,1420,1510,120,align='left',size=18)
p.preview(OUT/'drawio_01_preview.png')

p=Page('02 E-R 다이어그램',2100,1600)
p.title('02','E-R 다이어그램','Chen 표기 · 사각형은 개체 / 마름모는 관계 / 타원은 속성 / 밑줄은 식별자')
entities={}
for name,x,y in [('학생',220,460),('예약',910,460),('장비',1630,460),('대여',910,1030),('정비',1630,1030)]:
 entities[name]=p.box(name,x,y,210,80,fill='#DFEAF5',size=26,bold=True)
def attrs(name,items,positions):
 start,step,width,yy={'학생':(35,130,120,260),'예약':(685,111,105,260),'장비':(1430,130,120,260),'대여':(710,155,145,1230),'정비':(1420,132,125,1230)}[name]
 for i,s in enumerate(items):
  a=p.box(s,start+i*step,yy,width,85,'ellipse',fill='#F4F7FB',size=16,key=i==0);p.line(entities[name],a)
attrs('학생',['학번','이름','학과','연락처','이용가능여부'],[(45,170),(255,170),(465,170),(45,300),(465,300)])
attrs('예약',['예약번호','신청일시','예약시작일시','예약종료일시','예약상태','사용목적'],[(720,170),(930,170),(1140,170),(720,300),(930,300),(1140,300)])
attrs('장비',['장비번호','장비명','모델명','보관위치','운영상태'],[(1440,170),(1650,170),(1860,170),(1440,300),(1860,300)])
attrs('대여',['대여번호','실제대여일시','실제반납일시','반납점검내용'],[(710,1180),(1130,1180),(710,1300),(1130,1300)])
attrs('정비',['정비번호','정비시작일시','정비완료일시','정비사유','조치내용'],[(1440,1180),(1650,1180),(1860,1180),(1440,1300),(1860,1300)])
def rel(name,x,y,a,b,ca,cb):
 r=p.box(name,x,y,140,100,'diamond',fill='#FFF0D6',size=20,bold=True)
 p.line(entities[a],r,ca);p.line(r,entities[b],cb)
rel('신청',590,450,'학생','예약','0..N','1..1')
rel('배정',1300,450,'예약','장비','1..1','0..N')
rel('전환',945,740,'예약','대여','0..1','1..1')
rel('정비 이력',1665,740,'장비','정비','0..N','1..1')
p.box('참여 제약 읽는 법',45,700,560,60,fill='#DFEAF5',size=22,bold=True)
p.box('관계선의 수치는 그 선에 연결된 개체 한 건이\n관계에 참여할 수 있는 최소·최대 횟수이다.\n\n0 = 부분 참여 / 1 = 전체 참여\n학생은 예약 0..N건을 신청할 수 있다.\n예약은 반드시 학생 1명에게 속한다.\n예약에는 대여가 0..1건 연결된다.\n대여는 반드시 예약 1건에 속한다.\n\n학생–장비의 반복 이용 N:M은\n예약 연관 개체로 표현한다.',45,760,560,365,align='left',size=20)
p.box('관계 외의 업무 제약',45,1150,560,60,fill='#DFEAF5',size=22,bold=True)
p.box('R08  같은 장비의 예약 시간 중복 금지\nR12  미반납 장비의 추가 대여 금지\nR16  장비당 진행 중 정비 최대 1건\n정비 시작 → 확정 예약 취소 + 장비 정비중\n정비 완료 → 장비 정상',45,1210,560,175,align='left',size=19)
p.box('설계 대응  |  학생 R01–02 · 장비 R03–04 · 예약 R05–09 · 대여 R10–13 · 정비 R14–17 · 이력 조회 및 보존 R18\n개념적 설계에서는 FK를 별도 속성으로 중복 표시하지 않는다. 관계의 FK 변환과 UNIQUE는 03 릴레이션 스키마에서 명시한다.',45,1450,2010,90,fill='#F4F7FB',size=20,align='left')
p.preview(OUT/'drawio_02_preview.png')

p=Page('03 릴레이션 스키마',1900,1600)
p.title('03','릴레이션 스키마','PK 기본키 · FK 외래키 · UQ 유일키 · 모든 FK는 NOT NULL · 연결 화살표는 FK → 참조 PK')
def card(name,x,y,rows):
 p.box(name,x,y,490,55,fill='#DFEAF5',bold=True,size=23)
 ids={}
 for i,(key,eng,ko,typ) in enumerate(rows):
  yy=y+55+i*47
  ids[eng]=p.box(f'{key:6} {eng}  |  {ko}  |  {typ}',x,yy,490,47,align='left',size=16,fill='#F3F7FC' if 'PK' in key else '#FFFFFF')
 return ids
s=card('학생  STUDENT',40,180,[('PK','student_id','학번','VARCHAR(20)'),('','name','이름','VARCHAR(50)'),('','department','학과','VARCHAR(100)'),('','phone','연락처','VARCHAR(30)'),('','eligibility','이용가능여부','VARCHAR(10)')])
r=card('예약  RESERVATION',700,180,[('PK','reservation_id','예약번호','BIGINT'),('FK','student_id','학번','VARCHAR(20)'),('FK','equipment_id','장비번호','VARCHAR(20)'),('','requested_at','신청일시','TIMESTAMP'),('','starts_at','예약시작일시','TIMESTAMP'),('','ends_at','예약종료일시','TIMESTAMP'),('','reservation_status','예약상태','VARCHAR(10)'),('','purpose','사용목적','VARCHAR(500)')])
e=card('장비  EQUIPMENT',1360,180,[('PK','equipment_id','장비번호','VARCHAR(20)'),('','equipment_name','장비명','VARCHAR(100)'),('','model_name','모델명','VARCHAR(100)'),('','storage_location','보관위치','VARCHAR(100)'),('','operating_status','운영상태','VARCHAR(10)')])
l=card('대여  LOAN',700,800,[('PK','loan_id','대여번호','BIGINT'),('FK UQ','reservation_id','예약번호','BIGINT'),('','checked_out_at','실제대여일시','TIMESTAMP'),('NULL','returned_at','실제반납일시','TIMESTAMP'),('NULL','return_inspection','반납점검내용','VARCHAR(1000)')])
m=card('정비  MAINTENANCE',1360,800,[('PK','maintenance_id','정비번호','BIGINT'),('FK','equipment_id','장비번호','VARCHAR(20)'),('','started_at','정비시작일시','TIMESTAMP'),('NULL','completed_at','정비완료일시','TIMESTAMP'),('','reason','정비사유','VARCHAR(500)'),('NULL','action_taken','조치내용','VARCHAR(1000)')])
p.line(r['student_id'],s['student_id'],points=[(610,305.5),(610,258.5)],arrow=True)
p.line(r['equipment_id'],e['equipment_id'],points=[(1280,352.5),(1280,258.5)],arrow=True)
p.line(l['reservation_id'],r['reservation_id'],points=[(640,925.5),(640,258.5)],arrow=True)
p.line(m['equipment_id'],e['equipment_id'],points=[(1880,925.5),(1880,258.5)],arrow=True)
p.box('관계 변환과 중복 방지',40,560,490,55,fill='#DFEAF5',bold=True,size=22)
p.box('학생 1 : 예약 N\n장비 1 : 예약 N\n예약 1 : 대여 0..1\n장비 1 : 정비 N\n\nLOAN.reservation_id에 UNIQUE 적용\n대여의 학생·장비는 예약을 통해 조회\n반납기한은 예약종료일시에서 조회\nNULL 표시 외 모든 속성은 필수\n참조 데이터 삭제는 RESTRICT/NO ACTION',40,615,490,365,align='left',size=19)
p.box('도메인 및 저장 기준',40,1000,490,55,fill='#DFEAF5',bold=True,size=22)
p.box('이용가능여부: 가능 / 제한\n운영상태: 정상 / 정비중\n예약상태: 확정 / 취소 / 대여전환\n일시: 한국 표준시 기준\n자료형은 DBMS 선정 후 실제 형식 확정',40,1055,490,165,align='left',size=19)
p.box('행 단위 제약',40,1290,870,55,fill='#DFEAF5',bold=True,size=22)
p.box('신청일시 ≤ 예약시작일시 < 예약종료일시\n실제반납일시 ≥ 실제대여일시 / 정비완료일시 ≥ 정비시작일시\n반납일시·점검내용, 정비완료일시·조치내용은 각각 NULL 쌍 또는 값 쌍\n식별자는 변경하지 않으며 필수 문자열은 공백 입력을 허용하지 않는다.',40,1345,870,170,align='left',size=19)
p.box('여러 행을 확인하는 트랜잭션 제약',950,1290,900,55,fill='#DFEAF5',bold=True,size=22)
p.box('예약 중복: 기존 시작 < 새 종료 AND 새 시작 < 기존 종료 (취소 제외)\n대여 등록 + 예약 대여전환을 함께 처리한다.\n정비 시작 + 확정 예약 취소 + 장비 정비중을 함께 처리한다.\n장비별 잠금으로 미반납 대여·진행 정비·동시 예약의 중복을 방지한다.',950,1345,900,170,align='left',size=19)
p.preview(OUT/'drawio_03_preview.png')

target=OUT/'대학교_실습장비_요구명세_ERD_릴레이션.drawio'
ET.indent(file,space='  ');ET.ElementTree(file).write(target,encoding='utf-8',xml_declaration=True)
# Validate editable graph IDs, references and page boundaries.
for diagram in file:
 cells=diagram.findall('.//mxCell');ids={c.get('id') for c in cells}
 assert len(ids)==len(cells)
 model=diagram.find('mxGraphModel');W,H=int(model.get('pageWidth')),int(model.get('pageHeight'))
 for c in cells:
  for attr in ('source','target','parent'):
   if c.get(attr):assert c.get(attr) in ids
  if c.get('vertex')=='1':
   g=c.find('mxGeometry');assert float(g.get('x'))>=0 and float(g.get('y'))>=0
   assert float(g.get('x'))+float(g.get('width'))<=W
   assert float(g.get('y'))+float(g.get('height'))<=H
print('Validated 3 pages:',target)
