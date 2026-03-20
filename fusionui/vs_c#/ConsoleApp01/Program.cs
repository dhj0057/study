using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp01
{
    internal class Program
    {
        static void Main(string[] args)
        {
          /*  Console.Write("Hello C# Programming\n");//3월13일 C# 프로그래밍기초 01 강병준교수님
            Console.Write("Hello C# Programming\n");
            Console.Write("Hello C# Programming\n");
            Console.Write(52); // 52처럼 생긴 문자열 출력
            Console.Write("52"); //   질문 0은 ',"없는것이 정수인데 왜 write52는 52처럼생긴 그림인지
            // 정수는 사칙연산이 가능하다
            Console.Write(5 + 3 * 2);
            //  / 는 나눗셈 몫의 값 , % 는 나머지의 값
            // 정수는 정수끼리 연산했을때 몫의 값은 무조건 정수
            // 나머지연산자의 부호는 피연산자의부호를 따름
            // 문자 'ㅇ' 문자하나만 EX) '열' '받' '아'  NOT'열받'
            Console.WriteLine("안녕하세요");
            // 문자열 문자의집합
            Console.WriteLine("2601110287");
            Console.WriteLine("AISW과 도형준입니다.");
            Console.WriteLine("\"안녕\"\t하세요"); // 안에따옴표는 중복인식에러기때문에 앞수식\로 덧데어준다 수평 뛰움은 \t로 표현한다
            Console.WriteLine("안녕하세요"[0]); // 문자열내 특정 문자선택 첫번째문자인 안 <- 만출력됌
            Console.WriteLine("안녕하세요"[1]); //EXCEPTION 에러남 100번째 문자가없기때문에
            Console.WriteLine((int)'가');
            Console.WriteLine((int)'힣');
            Console.WriteLine('가'+'힣'); // 문자를 표현하기위해 숫자로 맵핑 한다 문자는 숫자에 가깝다
            Console.WriteLine((char)66); // 숫자를 문자로 표현하는 char 
            Console.WriteLine(true); // 논리곱 && and연산 두가지모두참일때 참
            Console.WriteLine(false); // 논리합 || or연산 두가지중하나만참이어도 참 
            int time = 10;
            Console.WriteLine((9 < time) && (time < 12));
            Console.WriteLine(DateTime.Now.Hour > 9 || DateTime.Now.Hour < 12);
            Console.WriteLine(DateTime.Now.Hour > 9 && DateTime.Now.Hour < 12);
            // Int 자료형 4바이트 = 32비트 2의 32승 의 숫자 약 42억 음수까지 한다면 절대값21억 을 넘어가면 오버플로우일어남 자료형의 범위를 잘확인후 코딩
            // 
            int a = 2000000000;
            int b = 1000000000;
            Console.WriteLine((long)a + b);
            Console.WriteLine(a+(long)b);
            Console.WriteLine(b+(long)a);
            Console.WriteLine(int.MaxValue);
            Console.WriteLine(int.MinValue);
            Console.WriteLine("int: " + sizeof(int));
            Console.WriteLine("long:" + sizeof(long));
            Console.WriteLine("float:" + sizeof(float));
            Console.WriteLine("double:" + sizeof(double));
            Console.WriteLine("char:" + sizeof (char));

            char c = 'c';
            char d = 'd';
            Console.WriteLine((char)('c' + 'd'));
            Console.WriteLine(c - d);
            Console.WriteLine(c * d);
            Console.WriteLine(c / d);
            Console.WriteLine(c % d);

            Console.WriteLine(sizeof(bool));
          */  
            
            //간단한 2가지 더하기 계산기 :)

          /*  Console.WriteLine("첫번째칸");
            string num1 = Console.ReadLine();
            Console.WriteLine("두번째칸");
            string num2 = Console.ReadLine();
            Console.WriteLine(int.Parse(num1)+ int.Parse(num2));
         
            Console.WriteLine((52 + "" + 52));

            /*        double number = 52.273103;
                    Console.WriteLine(number.ToString("0.0"));
                    Console.WriteLine(number.ToString("0.00"));
                    Console.WriteLine(number.ToString("0.000"));
                    Console.WriteLine(number.ToString("0.0000"));

                    Console.WriteLine(number.ToString("F1"));
                    Console.WriteLine(number.ToString("F2"));
                    Console.WriteLine(number.ToString("F3"));
                    Console.WriteLine(number.ToString("F4"));

            */        // 소수점 까지 표현해줌 아래버려지는 소수점 반올림 


            Console.WriteLine("부호있는정수 플러스 첫번째숫자");
            string num1 = Console.ReadLine();

            Console.WriteLine("부호있는정수 플러스 두번째숫자");
            string num2 = Console.ReadLine();
      
            Console.WriteLine(num1 + "+" + num2 + "=" + (int.Parse(num1) + int.Parse(num2)));



            Console.WriteLine("부호있는정수 마이너스 첫번째숫자");
            string num3 = Console.ReadLine();

            Console.WriteLine("부호있는정수 마이너스 두번째숫자");
            string num4 = Console.ReadLine();

            Console.WriteLine(num3 +"-"+ num4 +"=" + (int.Parse(num3) - int.Parse(num4)));



            Console.WriteLine("부호있는정수 나누기 첫번째숫자");
            string num5 = Console.ReadLine();

            Console.WriteLine("부호있는정수 나누기 두번째숫자");
            string num6 = Console.ReadLine();

            Console.WriteLine(num5 +"/"+ num6 + "=" +(float.Parse(num5) / float.Parse(num6)));


            Console.WriteLine("부호있는정수 곱하기 첫번째숫자");
            string num7 = Console.ReadLine();

            Console.WriteLine("부호있는정수 곱하기 두번째숫자");
            string num8 = Console.ReadLine();

            Console.WriteLine(num7 +"×"+ num8 + "=" +(float.Parse(num7) * float.Parse(num8)));
     
            
            












        }
    }
}
