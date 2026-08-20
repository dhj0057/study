package ai0430;

import java.util.Scanner;

public class birthYear {
    static void main() {
        System.out.println(" 출생연도를 입력삐리빠리뽕!");
        Scanner s = new Scanner(System.in);
        System.out.println("====================== 출생년에 따른 띠============================");
        int birthYear = s.nextInt();

        switch (birthYear % 12){
            case(0):
                System.out.println("당신은 원숭이 띠");
                break;
            case(1):
                System.out.println("당신은 닭 띠");
                break;
            case(2):
                System.out.println("당신은 개 띠");
                break;
            case(3):
                System.out.println("당신은 돼지 띠");
                break;
            case(4):
                System.out.println("당신은 쥐 띠");
                break;
            case(5):
                System.out.println("당신은 소 띠");
                break;
            case(6):
                System.out.println("당신은 호랑이 띠");
                break;
            case(7):
                System.out.println("당신은 토끼 띠");
                break;
            case(8):
                System.out.println("당신은 용 띠");
                break;
            case(9):
                System.out.println("당신은 뱀 띠");
                break;
            case(10):
                System.out.println("당신은 말 띠");
                break;
            case(11):
                System.out.println("당신은 양 띠");
                break;
            default:
                System.out.println("잘못된 출생연도입니다.");

        }


        s.close();

    }
}
