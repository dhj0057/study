package ai0402;
import java.util.Scanner;

public class carculator {
    public static void  main(String[] args){
        Scanner s = new Scanner(System.in);


        System.out.println("연산할 첫번째 실수를 입력하시오");
        double num1 = s.nextDouble();
        System.out.println("연산할 두번째 실수를 입력하시오");
        double num2 = s.nextDouble();

        double plus = num1 + num2;
        double minus = num1 - num2;
        double multiply = num1 * num2;
        double division = num1 / num2;
        double remain = num1 % num2 ;

        System.out.printf("＋ 의값은 %.2f\n", plus);
        System.out.printf("－ 의값은 %.2f\n", minus);
        System.out.printf("× 의값은 %.2f\n", multiply);
        System.out.printf("÷ 의값은 %.2f\n", division);
        System.out.printf("나머지 의값은 %.2f\n", remain);

        s.close();














    }

}
