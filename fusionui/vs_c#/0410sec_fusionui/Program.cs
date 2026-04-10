using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _0410sec_fusionui
{
    internal class Product
    {
        public string name;
        public int price;

        static void Main(string[] args)
        {
            List<Product> list = new List<Product> ();

            list.Add(new Product() { name = "감자", price = 2000 });
            list.Add(new Product() { name = "토마토", price = 3000 });

            foreach( var item in list ) {
                Console.WriteLine(item.name+ ":" + item.price +"원");

        }
    }
}
