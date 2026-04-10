using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace _0410fusionUi
{
    internal class Program
    {

        class Product
        {
            public string name;
            public int price;
          
        }
        static void Main(string[] args)
        {
            List<Product> list = new List<Product>();


            Product potato = new Product();
            potato.name = "감자";
            potato.price = 3000 ;
             

            Product tomato = new Product();
            tomato.name = "토마토";
            tomato.price = 3000 ;

            list.Add(tomato); 
            list.Add(potato);

            foreach(var item in list)
            {
                Console.WriteLine(item.name + ":"+ item.price + "원");
            }


           
           



           
        }




    





    }
}
