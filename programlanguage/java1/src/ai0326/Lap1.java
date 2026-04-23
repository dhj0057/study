package ai0326;
import java.util.Scanner;

public class Lap1 {
    public static void main(String[] args) {
        System.out.println("택배를 보내라! 입력사항을 입력하시오");

        Scanner s = new Scanner(System.in);
        Scanner s1 = new Scanner(System.in);

        System.out.println("받는사람은 누구인가 :");
        String name = s.nextLine();

        System.out.println("주소는 무엇인가 :");
        String adress = s.nextLine();

        System.out.println("배송품의 무게는 얼마인가(g) :");
        int weight = s1.nextInt();

        System.out.printf("받는 사람은 %s 이다 \n", name);
        System.out.printf("받는이의 주소는 %s 이다\n" , adress);
        System.out.printf("배송비는"+(weight*5)+"원 이다\n");

        s.close();
        s1.close();
    }
}
