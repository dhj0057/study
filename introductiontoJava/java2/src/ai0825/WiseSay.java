package ai0825;

import java.util.Random;

public class WiseSay {
    public static void main(String[] args) {
        String[] quote = {
                "나는 생각한다, 고로 나는 존재한다.",
                "너 자신을 알라.",
                "아는 것이 힘이다.",
                "인생은 가까이서 보면 비극이지만, 멀리서 보면 희극이다.",
                "나를 죽이지 못하는 것은 나를 더 강하게 만든다.",
                "세상은 고통으로 가득하지만, 그것을 이겨내는 사람들로도 가득하다.",
                "천 리 길도 한 걸음부터.",
                "실패한 것이 아니다. 안 되는 방법 1만 가지를 발견한 것이다.",
                "우리가 두려워해야 할 유일한 것은 두려움 그 자체다.",
                "배우기만 하고 생각하지 않으면 얻는 것이 없고, 생각만 하고 배우지 않으면 위태롭다."
        };


        Random random = new Random();
        int randomIndex = random.nextInt(quote.length);
        System.out.println("오늘의 명언 : "+ quote[randomIndex]);

    }
}
