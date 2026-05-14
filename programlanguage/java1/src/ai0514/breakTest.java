package ai0514;

import java.util.Random;

public class breakTest {
    public static void main(String[] args) {
        Random random = new Random();
        int count = 0;
        while (true) {
            int dice1 = random.nextInt(6) + 1;
            int dice2 = random.nextInt(6) + 1;
            int dice3 = random.nextInt(6) + 1;
            count++;
            if (dice1 == dice2 && dice2 == dice3) {
                // 주사위 3개가 모두 같을 때 해당 숫자를 출력하도록 수정
                System.out.println("3개의 주사위는 모두 " + dice1 + " 입니다.");
                System.out.println("같은 숫자가 나올 때까지" + count+ "번 던졌습니다.");

                // 무한 루프를 종료하기 위해 반드시 필요한 구문
                break;
            }
        }
    }
}
