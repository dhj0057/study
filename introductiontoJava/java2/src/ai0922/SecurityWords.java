package ai0922;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

public class SecurityWords {

    static final int KEY = 47;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("스파이에게 전달할 메시지 ==> ");
        String message = scanner.nextLine();

        String encrypted = encrypt(message);

        try (PrintWriter writer = new PrintWriter(new FileWriter("secure.txt"))) {
            writer.println(encrypted);
            System.out.println("--- secure.txt 암호화 완료 ---");
        } catch (IOException e) {
            System.out.println("파일을 저장하는 중 오류가 발생했습니다: " + e.getMessage());
        }

        scanner.close();
    }

    static String encrypt(String text) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            sb.append((char) (ch + KEY));
        }
        return sb.toString();
    }
}