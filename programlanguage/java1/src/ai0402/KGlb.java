package ai0402;
import java.util.Scanner;

public class KGlb {
    public static void main(String[] args) {
        Scanner s = new Scanner(System.in);


        System.out.println("파운드 값을 입력해라");
        Double num1 = s.nextDouble();

        double kg = num1*0.453592;

        System.out.printf("입력한 파운드값의 킬로값은 %.3fKG\n", kg);


        System.out.println("킬로 값을 입력해라");
        Double num2 = s.nextDouble();

        double lb = num2*2.204623;

        System.out.printf("입력한 킬로값의 파운드값은 %.3flb", lb);

        s.close();


    }

}
