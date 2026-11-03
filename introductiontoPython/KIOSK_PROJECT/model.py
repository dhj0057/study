"""메뉴, 가격 계산, 장바구니, 주문 저장. GUI와 분리해 검증할 수 있습니다."""
from dataclasses import dataclass, asdict, replace
from datetime import datetime
from pathlib import Path
import json
import sqlite3

MENUS = {
    'americano': dict(name='아메리카노', english='AMERICANO', category='커피', price=3000,
                      note='깊고 깔끔한 한 잔', tag='BEST', image='americano.jpg'),
    'latte': dict(name='카페 라떼', english='CAFE LATTE', category='커피', price=3800,
                 note='우유의 부드러운 여운', tag='SIGNATURE', image='latte.jpg'),
    'lemon': dict(name='레몬차', english='LEMON TEA', category='차', price=3500,
                 note='산뜻하게 채우는 기분', tag='CITRUS', image='lemon.jpg'),
    'chamomile': dict(name='카모마일', english='CHAMOMILE', category='차', price=3500,
                     note='은은한 꽃향기의 휴식', tag='HERBAL', image='chamomile.jpg'),
}
SIZES = {'Regular': (355, 0), 'Large': (473, 700), 'Grande': (591, 1200)}
TEMPS = {'HOT': 0, 'ICE': 300}
OPTIONS = {'커피': {'샷 추가': 500, '바닐라 시럽': 400},
           '차': {'꿀 추가': 400, '레몬 추가': 300}}


@dataclass(frozen=True)
class Item:
    menu: str
    temp: str = 'HOT'
    size: str = 'Regular'
    extras: tuple = ()
    quantity: int = 1

    def __post_init__(self):
        if self.menu not in MENUS or self.temp not in TEMPS or self.size not in SIZES:
            raise ValueError('메뉴 또는 옵션이 올바르지 않습니다.')
        allowed = OPTIONS[MENUS[self.menu]['category']]
        if len(set(self.extras)) != len(self.extras) or any(x not in allowed for x in self.extras):
            raise ValueError('이 메뉴에 사용할 수 없는 추가 옵션입니다.')
        if type(self.quantity) is not int or not 1 <= self.quantity <= 99:
            raise ValueError('수량은 1~99잔이어야 합니다.')

    @property
    def unit_price(self):
        return (MENUS[self.menu]['price'] + TEMPS[self.temp] + SIZES[self.size][1]
                + sum(OPTIONS[MENUS[self.menu]['category']][x] for x in self.extras))

    @property
    def total(self):
        return self.unit_price * self.quantity

    @property
    def key(self):
        return self.menu, self.temp, self.size, tuple(sorted(self.extras))

    @property
    def description(self):
        return f'{self.temp} · {self.size} · {SIZES[self.size][0]}ml'


class Cart:
    def __init__(self):
        self.items = []

    def add(self, item):
        for index, old in enumerate(self.items):
            if old.key == item.key:
                self.items[index] = replace(old, quantity=old.quantity + item.quantity)
                return
        self.items.append(item)

    def change(self, index, delta):
        item = self.items[index]
        # 1잔에서 빼기를 누르면 해당 항목 삭제
        if item.quantity + delta <= 0:
            self.items.pop(index)
        else:
            self.items[index] = replace(item, quantity=item.quantity + delta)

    @property
    def total(self):
        return sum(item.total for item in self.items)

    @property
    def count(self):
        return sum(item.quantity for item in self.items)


def save_order(path, cart, service, method, now=None):
    """SQLite 트랜잭션으로 날짜별 번호와 주문을 함께 저장합니다."""
    if not cart.items:
        raise ValueError('음료를 먼저 담아주세요.')
    if service not in ('매장', '포장') or method not in ('카드', '간편결제'):
        raise ValueError('주문 방식이 올바르지 않습니다.')
    now = now or datetime.now()
    day = now.strftime('%Y%m%d')
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(path, timeout=5) as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS orders (day TEXT, seq INTEGER, payload TEXT NOT NULL, PRIMARY KEY(day, seq))')
        conn.execute('BEGIN IMMEDIATE')
        seq = conn.execute('SELECT COALESCE(MAX(seq),0)+1 FROM orders WHERE day=?', (day,)).fetchone()[0]
        order = dict(number=f'A{seq:03d}', date=day, time=now.strftime('%Y-%m-%d %H:%M:%S'),
                     service=service, method=method, total=cart.total, count=cart.count,
                     items=[dict(**asdict(i), name=MENUS[i.menu]['name'], unit_price=i.unit_price,
                                 total=i.total, description=i.description) for i in cart.items])
        conn.execute('INSERT INTO orders VALUES(?,?,?)', (day, seq, json.dumps(order, ensure_ascii=False)))
    return order
