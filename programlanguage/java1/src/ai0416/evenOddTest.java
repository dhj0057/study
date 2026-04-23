package ai0416;

import java.util.Scanner;

public class evenOddTest {
    public static void main(String[] args) {
        Scanner s = new Scanner(System.in);
        System.out.print("* 정수를 입력 :");
        int num = s.nextInt();
        String result = "";
        if (num %2 == 0)

            result = "짝수";
        else
            result = "홀수";

        System.out.printf("입력된 정수 %d는 %s 입니다.\n", num , result);
        System.out.println("프로그램 종료");


    }
}
