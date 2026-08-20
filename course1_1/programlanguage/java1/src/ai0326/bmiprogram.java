package ai0326;

import  java.util.Scanner;

public class bmiprogram {
    public static void main(String[] args) {
        System.out.println("뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보뚱보");
        Scanner s = new Scanner(System.in);
        Scanner s1 = new Scanner(System.in);

        System.out.print("몸무게를 입력하시오(kg):");
        double weight = s.nextDouble();

        System.out.print("키를 입력하시오(cm):");
        double high = s.nextDouble();

        System.out.print("이름" );
        String name = s1.nextLine();

        double bmi = weight / Math.pow(high/100,2);


        System.out.printf("%s.너의 BMI 지수 결과 %.2fkg/㎡",name,bmi);
        s.close();
        s1.close();




    }
}
