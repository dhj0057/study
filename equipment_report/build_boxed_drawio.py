from pathlib import Path
import xml.etree.ElementTree as ET

base=Path('D:/study/equipment_report')
source=(base/'build_drawio.py').read_text(encoding='utf-8')
for old,new in {
 '#182B40':'#222222', '#60758B':'#666666', '#506B85':'#444444',
 '#DFEAF5':'#EEEEEE', '#F4F7FB':'#FFFFFF', '#FFF0D6':'#FFFFFF', '#F3F7FC':'#F7F7F7'
}.items():source=source.replace(old,new)
source=source.replace('strokeWidth=1.5','strokeWidth=1').replace('strokeWidth=1.6','strokeWidth=1.2')
source=source.replace("size=30,bold=True,align='left'","size=26,bold=True,align='left'")
source=source.replace("num+'  '+title","str(int(num))+'. '+title")
for n in ['01','02','03']:
 source=source.replace(f'drawio_{n}_preview.png',f'boxed_{n}_preview.png')
source=source.replace('대학교_실습장비_요구명세_ERD_릴레이션.drawio','대학교_실습장비_텍스트박스_수정본.drawio')
exec(compile(source,'boxed_drawio_generator','exec'))
old=ET.parse(base/'대학교_실습장비_요구명세_ERD_릴레이션.drawio').getroot()
new=ET.parse(base/'대학교_실습장비_텍스트박스_수정본.drawio').getroot()
for a,b in zip(old,new):
 ca=a.findall('.//mxCell');cb=b.findall('.//mxCell')
 assert len(ca)==len(cb)
 for x,y in zip(ca,cb):
  if x.get('id')!='2':assert x.get('value')==y.get('value')
  assert x.get('source')==y.get('source') and x.get('target')==y.get('target')
print('Verified: three editable pages, content and relationships unchanged.')
