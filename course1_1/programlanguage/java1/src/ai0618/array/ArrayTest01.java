package ai0618.array;

import java.util.Scanner;

public class ArrayTest01 {
    public static void main(String[] args) {
        // 5개의 성적을 입력받아서 저장할 수 있는 1차원 배열 객체를 생성하는 코드
        int  scores[ ] = new int [5];
        String[ ] subjects = {"프로그래밍 언어 실습", "데이터 베이스", "융합 UI실습", "인공지능 개론", "직업과 경력 개발"};

        // 콘솔창에서 키보드로 입력한 성적을 가져와서 배열에 저장
        Scanner s = new Scanner(System.in);

        // 입력받아서 저장하는 반복문
        System.out.print("성적 입력(정수 형태)\n");
        for( int i = 0; i < scores.length; i++)
        {
            System.out.printf("- " + subjects[i] + "성적 입력(정수값): ");
            scores[i] = s.nextInt( );
        }

        int sum = 0;
//        System.out.printf("세부성적: ");
//        for ( int i =0; i < scores.length; i++){
//            System.out.printf(scores[i] + " ");
//            sum += scores[i];
//        }

        int i = 0;
        for (int score : scores){
            System.out.printf(subjects[i] + " : " + score + " ");
            sum += score;
            i++;
        }

        System.out.println();
        System.out.printf("성적들의 전체 합계 : %d ", sum);
        System.out.printf("\n평균: %d", sum/scores.length);
        // 배열에 저장된 성적들을 한 줄로 출력하고
        // 그 다음 줄에 성적의 전체 합계가 출력되게 한다.
        s.close();
    }
}
