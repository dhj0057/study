package ai0409;
public class stringTest {
    public static void main(String[] args) {
        String s = "난생처음 자바";

        int len;

        len = s.length();

        System.out.println("문자열 :"+ s);
        System.out.println("문자열길이 :"+ len);

        s = "     SOFTWARE 입니다     ";
        System.out.println("대문자로출력");
        System.out.println(s.toLowerCase());
        System.out.println(s);

        System.out.println(s.trim());
        System.out.println(s);




    }
}
