package ai0825;

import java.util.Scanner;

public class Score {
    public static void main(String[] args) {
        Scanner s1 = new Scanner(System.in);
        int[] scoreArr = new int[5];
        int sum= 0;
        double avg;

        System.out.println("김연아 선수가 멋진 경기를 마쳤습니다");
        System.out.println(" 최대점수는 10점입니다.");
        for(int i= 0; i < scoreArr.length;i++){
            System.out.print("심사위원"+(i+1)+":");
            scoreArr[i] = s1.nextInt();
            sum += scoreArr[i];

        }

        avg = (double)sum / scoreArr.length;

        for (int i = 0; i < scoreArr.length; i++) {
            System.out.printf("심사위원 %d: %d점\n",i+1,scoreArr[i]);

        }
        System.out.println("평균총점 :"+ avg);

        s1.close();






    }
}
