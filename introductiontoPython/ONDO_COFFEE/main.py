"""ONDO COFFEE | Python Tkinter 키오스크. 실행: python main.py"""
import os
import sys
import sqlite3
from pathlib import Path
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk, ImageOps
from model import MENUS, SIZES, TEMPS, OPTIONS, Item, Cart, save_order

BASE = Path(__file__).resolve().parent
BG, PAPER, INK = '#F5F1E9', '#FFFDFA', '#292C25'
MUTED, LINE, GREEN = '#777A6F', '#E0DED4', '#334E40'
HOT, ICE = '#BD603E', '#3B7895'
FONT = 'Malgun Gothic' if sys.platform == 'win32' else 'Arial'


class Kiosk:
    def __init__(self, root):
        self.root = root
        root.title('ONDO COFFEE | 나의 취향을 담은 한 잔')
        root.geometry('1180x760')
        root.resizable(False, False)
        # 픽셀 기반 폰트로 OS의 DPI 설정에 따른 배치 변형을 줄입니다.
        self.c = tk.Canvas(root, width=1180, height=760, bg=BG, highlightthickness=0)
        self.c.pack(fill='both', expand=True)
        self.cart = Cart()
        self.category, self.selected = '커피', 'americano'
        self.temp, self.size, self.extras, self.quantity = 'HOT', 'Regular', set(), 1
        self.service, self.method = '매장', '카드'
        self.page, self.offset, self.receipt_offset = 'menu', 0, 0
        self.notice = '음료를 고르고, 나만의 옵션을 더해보세요.'
        self.order = None
        self.hitboxes = []
        self.photos = {}
        for key, menu in MENUS.items():
            path = BASE / 'assets' / menu['image']
            try:
                with Image.open(path) as source:
                    photo = ImageOps.fit(source.convert('RGB'), (210, 226), centering=(0.5, 0.48))
                self.photos[key] = ImageTk.PhotoImage(photo)
            except (OSError, ValueError) as error:
                messagebox.showerror('사진 파일 확인', f'{path.name}을 열 수 없습니다.\nassets 폴더를 함께 압축 해제해주세요.\n{error}')
                raise
        data_dir = Path(os.environ.get('ONDO_DATA_DIR', str(BASE / 'data')))
        self.db_path = data_dir / 'orders.sqlite3'
        self.c.bind('<Button-1>', self.click)
        self.c.bind('<Motion>', self.motion)
        self.c.bind('<MouseWheel>', self.wheel)
        root.bind('<Escape>', self.escape)
        self.draw()

    def text(self, x, y, value, size=14, color=INK, bold=False, anchor='nw', width=None):
        return self.c.create_text(x, y, text=value, fill=color, anchor=anchor,
                                  font=(FONT, -size, 'bold' if bold else 'normal'), width=width)

    def rect(self, x, y, w, h, color, outline='', radius=0):
        if not radius:
            return self.c.create_rectangle(x, y, x+w, y+h, fill=color, outline=outline, width=1)
        r = radius
        points = [x+r,y,x+w-r,y,x+w,y,x+w,y+r,x+w,y+h-r,x+w,y+h,x+w-r,y+h,x+r,y+h,x,y+h,x,y+h-r,x,y+r,x,y]
        return self.c.create_polygon(points, smooth=True, fill=color, outline=outline)

    def button(self, x, y, w, h, label, command, fill=PAPER, color=INK, selected=False, enabled=True, size=14):
        self.rect(x,y,w,h,fill if enabled else '#E8E5DD', GREEN if selected else LINE, 10)
        self.text(x+w/2,y+h/2,label,size,color if enabled else '#999B93',True,'center')
        if enabled:
            self.hitboxes.append((x,y,x+w,y+h,command))

    def click(self, event):
        for x1,y1,x2,y2,callback in reversed(self.hitboxes):
            if x1 <= event.x <= x2 and y1 <= event.y <= y2:
                callback()
                break

    def motion(self, event):
        active = any(a <= event.x <= c and b <= event.y <= d for a,b,c,d,_ in self.hitboxes)
        self.c.configure(cursor='hand2' if active else '')

    def wheel(self, event):
        step = -1 if event.delta > 0 else 1
        if self.page == 'receipt':
            self.receipt_offset = min(max(0,self.receipt_offset+step),max(0,len(self.order['items'])-3))
        elif event.x >= 830:
            self.offset = min(max(0,self.offset+step),max(0,len(self.cart.items)-3))
        self.draw()

    def escape(self, _event=None):
        if self.page in ('confirm','clear'):
            self.page = 'menu'
            self.draw()

    def set_value(self, name, value):
        setattr(self, name, value)
        self.draw()

    def choose_category(self, category):
        self.category = category
        self.choose_menu(next(k for k,v in MENUS.items() if v['category']==category))

    def choose_menu(self, key):
        self.selected = key
        self.temp, self.size, self.extras, self.quantity = 'HOT', 'Regular', set(), 1
        self.notice = f"{MENUS[key]['name']}의 옵션을 선택해주세요."
        self.draw()

    def toggle_extra(self, name):
        if name in self.extras:
            self.extras.remove(name)
        else:
            self.extras.add(name)
        self.draw()

    def current_item(self):
        return Item(self.selected,self.temp,self.size,tuple(sorted(self.extras)),self.quantity)

    def add(self):
        try:
            self.cart.add(self.current_item())
            self.notice = f"{MENUS[self.selected]['name']} {self.quantity}잔을 담았어요."
            self.offset = max(0,len(self.cart.items)-3)
        except ValueError as error:
            self.notice = str(error)
        self.draw()

    def change_cart(self, index, delta):
        try:
            self.cart.change(index,delta)
        except ValueError as error:
            self.notice = str(error)
        self.offset = min(self.offset,max(0,len(self.cart.items)-3))
        self.draw()

    def remove(self, index):
        self.cart.items.pop(index)
        self.offset = min(self.offset,max(0,len(self.cart.items)-3))
        self.draw()

    def move_cart(self, delta):
        self.offset = min(max(0,self.offset+delta),max(0,len(self.cart.items)-3))
        self.draw()

    def clear(self):
        self.cart.items.clear()
        self.offset, self.page = 0, 'menu'
        self.notice = '장바구니를 비웠어요.'
        self.draw()

    def checkout(self):
        if not self.cart.items:
            return
        try:
            self.order = save_order(self.db_path,self.cart,self.service,self.method)
        except (OSError, sqlite3.Error, ValueError) as error:
            # 저장 실패 시 결제를 완료하지 않으며 장바구니를 보존합니다.
            messagebox.showerror('주문 저장 실패', f'쓰기 가능한 폴더에 압축을 풀어주세요.\n장바구니는 유지됩니다.\n{error}')
            return
        self.cart.items.clear()
        self.page, self.offset, self.receipt_offset = 'receipt',0,0
        self.draw()

    def restart(self):
        self.page,self.category,self.service,self.method = 'menu','커피','매장','카드'
        self.order = None
        self.choose_menu('americano')

    def draw(self):
        self.c.delete('all')
        self.hitboxes.clear()
        self.rect(0,0,1180,88,INK)
        self.text(26,17,'ONDO',34,'#F9F4E7',True)
        self.text(155,29,'COFFEE',16,'#CDCDBB')
        self.text(27,60,'온도  ·  당신의 취향이 머무는 곳',12,'#B9C4B6')
        self.text(1148,31,'01  메뉴 선택    /    02  나만의 옵션    /    03  주문 완료',14,'#E3E5DA',anchor='ne')
        if self.page == 'receipt':
            self.draw_receipt()
            return
        self.draw_menu()
        self.draw_options()
        self.draw_cart()
        self.text(28,730,self.notice,13,GREEN)
        self.text(1150,730,'ONDO COFFEE  /  SELF ORDER',11,MUTED,anchor='ne')
        if self.page in ('confirm','clear'):
            self.draw_modal()

    def draw_menu(self):
        self.text(28,111,'오늘은 어떤 온도인가요?',27,INK,True)
        self.text(28,151,'취향에 맞는 한 잔을 골라주세요.',14,MUTED)
        for index,category in enumerate(('커피','차')):
            active = self.category == category
            self.button(28+index*220,190,210,45,category+'  /  '+('COFFEE' if index==0 else 'TEA'),
                        lambda c=category:self.choose_category(c),GREEN if active else PAPER,'white' if active else INK)
        keys = [key for key,menu in MENUS.items() if menu['category']==self.category]
        for index,key in enumerate(keys):
            x,y = 28+index*220,254
            menu = MENUS[key]
            active = key==self.selected
            self.rect(x-1,y-1,212,350,PAPER,GREEN if active else LINE,12)
            self.c.create_image(x,y,image=self.photos[key],anchor='nw')
            self.rect(x+10,y+10,94,25,GREEN if active else INK,radius=6)
            self.text(x+57,y+22,menu['tag'],10,'white',True,'center')
            self.text(x+14,y+239,menu['name'],20,INK,True)
            self.text(x+14,y+270,menu['note'],12,MUTED)
            self.text(x+14,y+305,f"{menu['price']:,}원",19,GREEN,True)
            self.text(x+196,y+310,'선택됨' if active else '+',12,GREEN,True,'ne')
            self.hitboxes.append((x,y,x+210,y+350,lambda k=key:self.choose_menu(k)))
        self.rect(28,627,430,77,'#E8ECE2',radius=12)
        self.text(45,640,'A LITTLE PAUSE, A BETTER DAY.',12,GREEN,True)
        self.text(45,663,'기본 가격은 HOT · Regular 기준입니다.\n사진은 메뉴 연출 이미지로 온도·옵션에 따라 달라질 수 있어요.',11,MUTED)

    def draw_options(self):
        x=483
        self.rect(x,108,318,598,PAPER,LINE,14)
        self.text(x+22,129,'MAKE IT YOURS',11,GREEN,True)
        self.text(x+22,153,MENUS[self.selected]['name'],24,INK,True)
        self.text(x+22,198,'01   온도',14,INK,True)
        for i,temp in enumerate(TEMPS):
            active = self.temp==temp
            color = HOT if temp=='HOT' else ICE
            self.button(x+22+i*140,226,134,43,f'{temp}  +{TEMPS[temp]:,}',
                        lambda t=temp:self.set_value('temp',t),color if active else PAPER,'white' if active else color,active)
        self.text(x+22,291,'02   용량',14,INK,True)
        for i,(size,(ml,price)) in enumerate(SIZES.items()):
            active=self.size==size
            self.button(x+22+i*94,318,88,61,f'{size}\n{ml}ml\n+{price:,}',
                        lambda s=size:self.set_value('size',s),'#E8ECE2' if active else PAPER,GREEN,active,size=11)
        self.text(x+22,399,'03   추가 옵션',14,INK,True)
        for i,(name,price) in enumerate(OPTIONS[self.category].items()):
            active=name in self.extras
            self.button(x+22,427+i*43,274,37,f"{'✓' if active else '+'}  {name}    +{price:,}원",
                        lambda n=name:self.toggle_extra(n),'#E8ECE2' if active else PAPER,GREEN,active,size=13)
        self.text(x+22,526,'수량',13,MUTED)
        self.button(x+146,515,38,36,'−',lambda:self.set_value('quantity',self.quantity-1),enabled=self.quantity>1)
        self.text(x+214,533,str(self.quantity),18,INK,True,'center')
        self.button(x+254,515,38,36,'+',lambda:self.set_value('quantity',self.quantity+1),enabled=self.quantity<99)
        item=self.current_item()
        self.c.create_line(x+22,568,x+296,568,fill=LINE)
        self.text(x+22,580,'1잔 가격',12,MUTED)
        self.text(x+296,577,f'{item.unit_price:,}원',22,GREEN,True,'ne')
        self.text(x+22,610,f"기본 {MENUS[self.selected]['price']:,} + 온도 {TEMPS[self.temp]:,} + 용량 {SIZES[self.size][1]:,}",11,MUTED)
        extras_cost=sum(OPTIONS[self.category][a] for a in self.extras)
        self.text(x+22,628,f'추가 옵션 {extras_cost:,}원  ·  선택 수량 {self.quantity}잔',11,MUTED)
        self.button(x+22,653,274,37,f'{item.total:,}원  ·  담기  +',self.add,GREEN,'white')

    def draw_cart(self):
        x=824
        self.rect(x,108,330,598,PAPER,LINE,14)
        self.text(x+20,129,'YOUR ORDER',11,GREEN,True)
        self.text(x+20,151,'주문서',25,INK,True)
        self.text(x+310,159,f'{self.cart.count:02d} 잔',16,GREEN,True,'ne')
        for i,service in enumerate(('매장','포장')):
            active = self.service==service
            self.button(x+20+i*148,199,142,36,service,lambda s=service:self.set_value('service',s),
                        '#E8ECE2' if active else PAPER,GREEN,active,size=12)
        if not self.cart.items:
            self.text(x+165,336,'아직 비어 있어요',20,MUTED,True,'center')
            self.text(x+165,372,'마음에 드는 한 잔을 담아주세요.',12,MUTED,anchor='center')
        for visible,item in enumerate(self.cart.items[self.offset:self.offset+3]):
            index=self.offset+visible
            y=250+visible*90
            self.text(x+20,y,MENUS[item.menu]['name'],15,INK,True)
            self.text(x+20,y+24,item.description,11,HOT if item.temp=='HOT' else ICE)
            self.text(x+20,y+42,', '.join(item.extras) or '추가 옵션 없음',10,MUTED)
            self.text(x+310,y,f'{item.total:,}원',15,GREEN,True,'ne')
            self.button(x+191,y+33,27,27,'−',lambda i=index:self.change_cart(i,-1),size=13)
            self.text(x+236,y+46,str(item.quantity),13,INK,True,'center')
            self.button(x+254,y+33,27,27,'+',lambda i=index:self.change_cart(i,1),enabled=item.quantity<99,size=13)
            self.button(x+286,y+33,24,27,'×',lambda i=index:self.remove(i),size=13)
            self.c.create_line(x+20,y+78,x+310,y+78,fill=LINE)
        self.button(x+20,525,82,29,'전체 비우기',lambda:self.set_value('page','clear'),enabled=bool(self.cart.items),size=11)
        self.text(x+173,539,f'{len(self.cart.items)}개 항목',11,MUTED,anchor='center')
        self.button(x+235,525,34,29,'↑',lambda:self.move_cart(-1),enabled=self.offset>0)
        self.button(x+276,525,34,29,'↓',lambda:self.move_cart(1),enabled=self.offset+3<len(self.cart.items))
        self.text(x+20,581,'결제 금액',14,INK,True)
        self.text(x+310,572,f'{self.cart.total:,}원',31,GREEN,True,'ne')
        self.text(x+310,615,'모든 옵션 포함 · 부가세 포함',11,MUTED,anchor='ne')
        self.button(x+20,653,290,37,'주문 확인  →',lambda:self.set_value('page','confirm'),GREEN,'white',enabled=bool(self.cart.items))

    def draw_modal(self):
        # 모달이 열린 동안 배경의 클릭 영역은 비활성화합니다.
        self.hitboxes.clear()
        self.c.create_rectangle(0,88,1180,760,fill=INK,stipple='gray50',outline='')
        self.rect(355,175,470,428,PAPER,LINE,18)
        if self.page=='clear':
            self.text(590,260,'장바구니를 비울까요?',25,INK,True,'center')
            self.text(590,311,'담아둔 모든 음료가 삭제됩니다.',14,MUTED,anchor='center')
            self.button(390,440,190,52,'돌아가기',lambda:self.set_value('page','menu'))
            self.button(600,440,190,52,'전체 비우기',self.clear,GREEN,'white')
            return
        self.text(390,205,'마지막으로 확인해주세요',26,INK,True)
        self.text(390,256,f'{self.service} 이용  ·  음료 {self.cart.count}잔',16,MUTED)
        self.text(390,294,'총 결제 금액',15,INK)
        self.text(790,286,f'{self.cart.total:,}원',34,GREEN,True,'ne')
        self.text(390,350,'결제 방법',13,MUTED)
        for i,method in enumerate(('카드','간편결제')):
            active=self.method==method
            self.button(390+i*205,377,195,47,method,lambda m=method:self.set_value('method',m),
                        '#E8ECE2' if active else PAPER,GREEN,active)
        self.text(590,451,'과제용 모의 결제입니다. 실제로 청구되지 않습니다.',12,MUTED,anchor='center')
        self.button(390,495,190,54,'돌아가기',lambda:self.set_value('page','menu'))
        self.button(600,495,190,54,'결제하기',self.checkout,GREEN,'white')
        self.text(590,575,'취소해도 장바구니는 그대로 유지돼요.',11,MUTED,anchor='center')

    def draw_receipt(self):
        order=self.order
        self.rect(28,112,448,594,GREEN,radius=18)
        self.text(66,155,'THANK YOU FOR YOUR ORDER',13,'#D2DECD',True)
        self.text(66,211,'당신의 한 잔을\n준비하고 있어요.',34,'white',True)
        self.text(66,336,'주문번호',16,'#CFDBC9')
        self.text(59,360,order['number'],90,'#FFF4DA',True)
        self.text(66,493,f"{order['service']}  ·  총 {order['count']}잔",18,'white',True)
        self.text(66,538,'번호가 불리면 픽업대에서 받아주세요.\n오늘도 기분 좋은 온도로 머무르세요.',15,'#D2DECD')
        self.text(66,653,'온도  /  ONDO COFFEE',14,'#D2DECD')
        self.rect(500,112,654,594,PAPER,LINE,18)
        self.text(530,141,'ORDER RECEIPT',14,GREEN,True)
        self.text(1124,143,order['time'],12,MUTED,anchor='ne')
        self.text(530,178,'주문이 완료되었습니다',27,INK,True)
        self.c.create_line(530,230,1124,230,fill=LINE)
        for i,item in enumerate(order['items'][self.receipt_offset:self.receipt_offset+3]):
            y=253+i*79
            self.text(530,y,f"{item['name']}  × {item['quantity']}",18,INK,True)
            self.text(1124,y,f"{item['total']:,}원",19,GREEN,True,'ne')
            self.text(530,y+29,item['description']+'  /  '+(', '.join(item['extras']) or '기본'),12,MUTED)
        self.button(1029,498,42,29,'↑',lambda:self.receipt_scroll(-1),enabled=self.receipt_offset>0)
        self.button(1082,498,42,29,'↓',lambda:self.receipt_scroll(1),enabled=self.receipt_offset+3<len(order['items']))
        self.text(530,504,f"{order['method']} · 모의 결제 완료",12,MUTED)
        self.c.create_line(530,543,1124,543,fill=LINE)
        self.text(530,565,'최종 결제 금액',17,INK,True)
        self.text(1124,553,f"{order['total']:,}원",36,GREEN,True,'ne')
        self.button(530,626,594,50,'새 주문 시작하기  →',self.restart,GREEN,'white',size=16)
        self.text(28,730,'주문 내역과 번호가 저장되었습니다.',13,GREEN)
        self.text(1150,730,'실제 결제 없음  /  주문번호는 날짜별로 발급됩니다.',11,MUTED,anchor='ne')

    def receipt_scroll(self, delta):
        self.receipt_offset=min(max(0,self.receipt_offset+delta),max(0,len(self.order['items'])-3))
        self.draw()


if __name__=='__main__':
    root=tk.Tk()
    Kiosk(root)
    root.mainloop()
