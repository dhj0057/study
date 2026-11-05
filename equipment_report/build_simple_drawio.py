from pathlib import Path
import xml.etree.ElementTree as ET

base=Path('D:/study/equipment_report')
source=(base/'build_drawio.py').read_text(encoding='utf-8')
for color in ['#182B40','#60758B','#506B85']:
 source=source.replace(color,'#222222')
for color in ['#DFEAF5','#F4F7FB','#FFF0D6','#F3F7FC']:
 source=source.replace(color,'#FFFFFF')
source=source.replace('strokeWidth=1.5','strokeWidth=1').replace('strokeWidth=1.6','strokeWidth=1')
source=source.replace("size=30,bold=True,align='left'","size=26,bold=True,align='left'")
source=source.replace("num+'  '+title","str(int(num))+'. '+title")
source=source.replace("drawio_01_preview.png","simple_01_preview.png").replace("drawio_02_preview.png","simple_02_preview.png").replace("drawio_03_preview.png","simple_03_preview.png")
source=source.replace('대학교_실습장비_요구명세_ERD_릴레이션.drawio','대학교_실습장비_과제형_간단정리.drawio')
hook='''
  # Simple black-and-white classroom layout, keeping the original design content.
  page_name=self.diagram.get('name')
  if page_name.startswith('01'):
   kind='text'
   if text.startswith('R') and len(text)==3:
    size=18;bold=False
  elif page_name.startswith('02'):
   if kind=='ellipse':
    # A few-pixel variation recalls manually placed shapes without losing alignment.
    y += [-6,5,-2,7,0,-4][self.i%6]
   if w>=500:kind='text';align='left'
   if kind=='rect' and w==210:size=23;bold=False
   if kind=='diamond':bold=False;size=18
  elif page_name.startswith('03'):
   if h==55 and w==490:
    kind='text';align='left';size=21
   elif w>=490 and h>55:
    kind='text';align='left'
   elif h==55:
    kind='text';align='left';size=20
'''
needle=" def box(self,text,x,y,w,h,kind='rect',fill='#FFFFFF',size=18,bold=False,align='center',key=False):\n"
assert needle in source
source=source.replace(needle,needle+hook)
exec(compile(source,'simple_drawio_generator','exec'))

old=ET.parse(base/'대학교_실습장비_요구명세_ERD_릴레이션.drawio').getroot()
new=ET.parse(base/'대학교_실습장비_과제형_간단정리.drawio').getroot()
for a,b in zip(old,new):
 ca=a.findall('.//mxCell');cb=b.findall('.//mxCell')
 assert len(ca)==len(cb)
 for x,y in zip(ca,cb):
  if x.get('id')!='2':assert x.get('value')==y.get('value'), (x.get('value'),y.get('value'))
  assert x.get('source')==y.get('source') and x.get('target')==y.get('target')
print('Verified: all requirements, attributes, keys and relationships preserved; 3 editable pages.')
