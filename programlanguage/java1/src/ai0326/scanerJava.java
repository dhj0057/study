        package ai0326;

        import java.util.Scanner;

        public  class scanerJava{
                public static void main(String[] args) {
                        Scanner born = new Scanner(System.in);

                        System.out.print("출생연도를 입력해라:");

                        int birthyear = born.nextInt();
                        int nowyear = 2026;
                        int age = nowyear - birthyear;

                        System.out.println("당신의 현재 나이는"+age+"살 이다 ");
                        born.close();

                }
}
