import java.util.Scanner;

public static void main(String[] args) {
    Scanner s = new Scanner(System.in);

    System.out.print("나이를 입력하세요: ");

    int age = s.nextInt();
    String result = "";

    if (age >= 19) {
        result = "가능";
    } else {
        result = "불가능";
    }

    System.out.printf("당신의 나이는 %d세이므로 오후 10시 이후 PC방 사용이 %s합니다.\n", age, result);
    System.out.println("협조해 주셔서 감사합니다.");

    s.close();
}

