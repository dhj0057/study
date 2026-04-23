package ai0416;

import java.util.Scanner;

public class overLabIfTest {
    public static void main(String[] args) {
        System.out.println("=========범위 숫자 판별 프로그램 ===========");
        Scanner s = new Scanner(System.in);
        System.out.print("* 정수를 입력 :");
        int num = s.nextInt();

        if(num > 100){
            if(num < 1000)
                System.out.printf("입력된 숫자 %d는(은) 100보다 크고 1000보다 작다\n", num);
            else
                System.out.println("입력된 숫자는 1000 보다 크다 ");
        }
        else
            System.out.println("입력된 숫자는 100보다 작다");


        s.close();
    }


}
