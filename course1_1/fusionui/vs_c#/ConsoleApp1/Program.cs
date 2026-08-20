using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    internal class Program
    {
        static void Main(string[] args)
        {/*{
            if (DateTime.Now.Hour < 11)
            {
                Console.WriteLine("time to breakfast");
            }
            else if (DateTime.Now.Hour < 15)
            {
                Console.WriteLine("time to lunch ");
            }
            else
            {
                Console.WriteLine("time to dinner");
            }

            Console.WriteLine("숫자를 입력해: ");

            string s_input = Console.ReadLine();
            int input = int.Parse(s_input);
            int remain = input % 2;

            switch (remain)
            {

                case 0:
                    Console.WriteLine("짝수 데스네");
                    break;
                case 1:
                    Console.WriteLine("홀수 데스네");
                    break;
            }

            string s_num = Console.ReadLine();
            int num = int.Parse(s_num);
            int remain = num % 2;

            if (num % 2 == 0)
            {
                Console.WriteLine("짝수 데스네");
            }
            else if (num % 2 == 1)
            {

                Console.WriteLine("홀수 데스네");
            }

        static void Main(string[] args)

        {
            Console.WriteLine("이번달은 몇월인가요? :");

            int input = int.Parse(Console.ReadLine());

            switch (input)
            {

                case 12:
                case 1:
                case 2:
                    Console.WriteLine("겨울입니다.");
                    break;
                case 3:
                case 4:
                case 5:
                    Console.WriteLine("봄입니다");
                    break;
                case 6:
                case 7:
                case 8:
                    Console.WriteLine("여름입니다");
                    break;
                case 9:
                case 10:
                case 11:
                    Console.WriteLine("가을입니다");
                    break;
                default:
                    Console.WriteLine(" 일년은 12 개월입니다 ");
                    break;
            }


            Console.WriteLine("이번달은 몇월인가요? :");

            int month = int.Parse(Console.ReadLine());

            if (month < 3)
            {
                Console.WriteLine("겨울입니다");
            }
            else if (month < 6)
            {
                Console.WriteLine("봄입니다");
            }
            else if (month < 9)
            {
                Console.WriteLine("여름입니다");
            }
            else if (month < 12)
            {
                Console.WriteLine("가을입니다");
            }
            else
            {
                Console.WriteLine("겨울입니다");
            }

            Console.Write("입력 :");
            string line = Console.ReadLine();
           
            if (line.Contains("안녕"))
            {
                Console.WriteLine("안녕하세요...!");
            }
            else 
            {
                Console.WriteLine("^-^"); 
            }

            for (int i = 0; i < 1000; i++)
            {
                Console.WriteLine("출력");
            }
            //  "출력"을 출력하는 1000번 반복하는 for문 

            int[] intarro = { 1445, 1452, 13323, 4874 ,44875 ,411136, 242435};

            Console.WriteLine(intarro[0]);
            Console.WriteLine(intarro[1]);
            Console.WriteLine(intarro[2]);
            Console.WriteLine(intarro[3]);
            Console.WriteLine(intarro[4]);
            Console.WriteLine(intarro[5]);
            Console.WriteLine(intarro[6]);

            for (int i = 0; i < intarro.Length; i++)
            {
                Console.WriteLine(intarro[i]);
            }

            int[] intarro = new int[100];
            for (int i = 0; i < intarro.Length; i++)
            {
                intarro[i] = i + 1;
            }
            for (int i = 0;i < intarro.Length; i++)
            {
                Console.WriteLine(intarro[i]);
            리스트를 활용한 for문 반복


            int[] ints = { 534, 356, 354, 674, 765 };
            int mi = 0;
            while (mi < ints.Length)
            {
                Console.WriteLine(mi + "번째 출력" + ints[mi]); mi++;
            } 
            리스트 랭스(길이)를이용한 출력 

            while (!Console.ReadLine().Contains("X")) ;
            {

            }
            Console.WriteLine("프로그램종료");
            대문자X가 나올때 까지 입력 종료버튼 완성

            string[] fruit = { "사과", "배", "포도", "딸기", "바나나" };

            foreach (string item in fruit)
            {
                Console.WriteLine(item);
            }
            포이치 각각 리스트안에 것마다 한번씩 반복 

            while (true)
            {
                Console.WriteLine("숫자를 입력해라 닝겐(짝수입력시 끝이다):");
                int num = int.Parse(Console.ReadLine());
                if (num % 2 == 0)
                {
                    break;

                }
            숫자무한반복 짝수나올때 까지  

            for (int i = 0; i < 10; i++)
            {
                if( i % 2 == 0)
                {
                    continue;
                }
               Console.WriteLine(i);
            }
           
            1부터 10까지 홀수는 출력하고 짝수는 컨티뉴 for문 반복 





















        }


        }












































































        }



         

    


