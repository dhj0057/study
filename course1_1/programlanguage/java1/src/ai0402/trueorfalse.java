package ai0402;
import java.util.Scanner;
public class trueorfalse {
    public static void main(String[] args) {
        Scanner s = new Scanner(System.in);

        int score;
        System.out.print("필기시험 점수입력해라\n");
        score = s.nextInt();

        if(score >= 70)
            System.out.println("합격");

        else
            System.out.println("불합격");


        s.close();

    }
}
