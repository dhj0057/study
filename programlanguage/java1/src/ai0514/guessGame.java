package ai0514;

import java.util.Random;
import java.util.Scanner;

public class guessGame {
    static void main() {
        Scanner scanner = new Scanner(System.in);
        Random random= new Random();
        int i = 0 ;
        while (true){

            int comNum = random.nextInt(5) + 1;
            i++;
            System.out.print("게임"+i+ "회 : 컴퓨터가 생각한 숫자는?");
            int userNum = scanner.nextInt();

            if(userNum == comNum){
                System.out.println("정답");
                break;
            }
            else{
                System.out.println("오답" + comNum + "이었다 다시");
            }
        }
        System.out.println("끝");
        scanner.close();
    }
}
