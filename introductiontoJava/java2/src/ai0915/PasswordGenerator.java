package ai0915;

import java.util.Scanner;

public class PasswordGenerator {
    // 비밀번호 문자의 개수는 8개 이상
    // 한글 또는 영문만 사용 (숫자, 기호 사용 X)

    public static boolean checkPassword(String password)
    {
        if(password.length() < 8)
        {
            System.out.println("비밀번호 문자열의 길이가 8자리 이상이어야 합니다.");
            return false;
        }

        for(int i = 0; i < password.length(); i++)
        {
            char c = password.charAt(i);
            if (!Character.isAlphabetic(c))
            {
                System.out.println("한글 또는 영문만 사용 가능합니다.");
                return false;
            }
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner s = new Scanner(System.in);
        System.out.println("새로운 비밀번호를 입력: ");
        String password = s.nextLine();

        if(checkPassword(password))
        {
            System.out.println("비밀번호 규칙에 부합합니다.");
        }

        else
        {
            System.out.println("!!!! 비밀번호 규칙에 부합하지 않습니다. !!!!");
        }

        s.close();
    }
}
