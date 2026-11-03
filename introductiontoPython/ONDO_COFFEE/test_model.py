"""실행: python -m unittest -v test_model.py"""
import sqlite3
import tempfile
import unittest
from contextlib import closing
from pathlib import Path
from datetime import datetime
from model import Item, Cart, save_order


class OrderTests(unittest.TestCase):
    def test_option_price(self):
        # 라떼 3800 + ICE 300 + Large 700 + 샷 500 = 5300원
        item = Item('latte', 'ICE', 'Large', ('샷 추가',), 2)
        self.assertEqual(item.unit_price, 5300)
        self.assertEqual(item.total, 10600)
        self.assertEqual(Item('lemon', 'HOT', 'Regular', ('꿀 추가',)).total, 3900)

    def test_cart_merge_and_remove(self):
        cart = Cart()
        cart.add(Item('latte', extras=('샷 추가','바닐라 시럽')))
        cart.add(Item('latte', extras=('바닐라 시럽','샷 추가')))
        self.assertEqual(len(cart.items), 1)
        self.assertEqual(cart.count, 2)
        cart.add(Item('latte', 'ICE'))
        self.assertEqual(len(cart.items), 2)
        cart.change(0, -1)
        cart.change(0, -1)
        self.assertEqual(cart.total, 4100)

    def test_validation_and_quantity_limit(self):
        for kwargs in ({'quantity':0}, {'quantity':100}, {'extras':('꿀 추가',)}, {'temp':'WARM'}):
            with self.assertRaises(ValueError):
                Item('americano', **kwargs)
        cart=Cart()
        cart.add(Item('americano', quantity=99))
        with self.assertRaises(ValueError):
            cart.add(Item('americano'))
        self.assertEqual(cart.count,99)

    def test_daily_number_and_persistence(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent) as directory:
            path=Path(directory)/'orders.db'
            cart=Cart()
            with self.assertRaises(ValueError):
                save_order(path,cart,'매장','카드')
            cart.add(Item('latte','ICE','Large',('샷 추가',),2))
            cart.add(Item('lemon',extras=('꿀 추가',)))
            first=save_order(path,cart,'포장','카드',datetime(2026,11,1))
            second=save_order(path,cart,'매장','간편결제',datetime(2026,11,1))
            third=save_order(path,cart,'매장','카드',datetime(2026,11,2))
            self.assertEqual((first['number'],second['number'],third['number']),('A001','A002','A001'))
            self.assertEqual(first['total'],14500)
            with closing(sqlite3.connect(path)) as connection:
                self.assertEqual(connection.execute('SELECT COUNT(*) FROM orders').fetchone()[0],3)


if __name__=='__main__':
    unittest.main()
