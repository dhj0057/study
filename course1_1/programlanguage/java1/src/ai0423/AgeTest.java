package ai0423;

import java.util.Scanner;

public class AgeTest {
    public static void main(String[] args) {
        Scanner s = new Scanner(System.in);
        System.out.print(" age(만나이) 입력 :");
        int age = s.nextInt();

        if (age >= 19) {
            System.out.println(" 성인입니다 입장하십시오 " );

        }
        else {
            System.out.println(" 성인이 아닙니다 당장나가 " );
        }



        s.close();

    }
}
