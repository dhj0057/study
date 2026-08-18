package ai0818;

import java.util.Scanner;

public class ArrayTest01 {
    public static void main(String[]args) {
        Scanner s1 = new Scanner(System.in);
    // 5개의 정수 값을 저장할수 있는 배열 객체
        int[] numArr = new int[5];
        int sum = 0;



    // 배열의 길이 만큼 반복하는 반복문을 작성하세요

        for (int i = 0; i < numArr.length; i++) {
            System.out.printf(" *(%d) 정수 입력 :" , i+1);
            numArr[i] = s1.nextInt();
            // SUM변수에 numArr[0]~ [1] 의 합계
            sum += numArr[i];

        }
        for (int i = 0; i < numArr.length ; i++) {
            if(i<4){
                System.out.print(numArr[i] + "+");
            }
            else{
                System.out.print(numArr[i] + "=");
                System.out.print(sum);
            }
        }

        s1.close();

    }
}
