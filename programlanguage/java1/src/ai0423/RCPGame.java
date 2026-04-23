package ai0423;

import java.util.Random;
import java.util.Scanner;

public class RCPGame {

    public static void main(String[] args) {
        System.out.println("====== 가위바위보 게임 ======");

        Scanner s = new Scanner(System.in);
        System.out.print("* 가위, 바위, 보 중에 하나를 입력: ");
        String me = s.nextLine();

        String[] computer = {"가위", "바위", "보"};
        Random random = new Random();


        int randNum = random.nextInt(3);


        String computerChoice = computer[randNum];

        System.out.println("*컴퓨터의 가위, 바위, 보: " + computerChoice);

        String result = "";


        if (me.equals("가위")) {ㄴ
            if (computerChoice.equals("가위")) result = "비겼습니다.";
            else if (computerChoice.equals("바위")) result = "졌습니다.";
            else result = "이겼습니다.";
        } else if (me.equals("바위")) {
            if (computerChoice.equals("가위")) result = "이겼습니다.";
            else if (computerChoice.equals("바위")) result = "비겼습니다.";
            else result = "졌습니다.";
        } else if (me.equals("보")) {
            if (computerChoice.equals("가위")) result = "졌습니다.";
            else if (computerChoice.equals("바위")) result = "이겼습니다.";
            else result = "비겼습니다.";
        } else {
            result = "잘못된 입력입니다.";
        }


        System.out.printf("나는 %s, 컴퓨터 %s 이므로 %s\n", me, computerChoice, result);

        s.close();
    }
}