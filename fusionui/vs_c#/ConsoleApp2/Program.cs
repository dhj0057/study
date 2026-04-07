using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Threading;

namespace ConsoleApp2
{
    internal class Program
    {
        static void Main(string[] args)
        {
            /*string input = "Potato Tomato";
            Console.WriteLine(input.ToUpper());
            Console.WriteLine(input.ToLower());

            Console.WriteLine(input);

            //문자열 자르기 엄청많이 씀 

            string input = "감자 고구마 토마토";
            string[] output = input.Split(' ');

            for (int i = 0; i < output.Length; i++)
            {
                Console.WriteLine(output[i]);

            }*/
            //      string input = "감자 고구마 토마토";
            //      string output = input.Replace(" ", ",");
            //         Console.WriteLine(output);
            /*string input = "감자 고구마 토마토";

            string[] array = { "감자", "고구마", "토마토" };
            Console.WriteLine(string.Join("----", array));

            string[] array = { "감자", "고구마", "토마토"};
            for (int i = 0 ; i < array.Length; i++)
            { 

                Console.WriteLine(array[i]);
                Thread.Sleep(1000);*/

            bool state = true;
            while (state)
            {
                ConsoleKeyInfo info = Console.ReadKey();
                switch (info.Key)
                {
                    case ConsoleKey.UpArrow:
                        Console.WriteLine("위로");
                        break;
                    case ConsoleKey.RightArrow:
                        Console.WriteLine("우로");
                        break;
                    case ConsoleKey.LeftArrow:
                        Console.WriteLine("좌로");
                        break;
                    case ConsoleKey.DownArrow:
                        Console.WriteLine("아래로");
                        break;
                    case ConsoleKey.X:
                        state = false;
                        break;
                }


            }

        }


    }
    }

