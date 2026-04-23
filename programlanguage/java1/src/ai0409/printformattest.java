package ai0409;

public class printformattest {
    public static void main(String[] args) {
        System.out.printf("%d\n" , 345 );
        System.out.printf("%5d\n" , 345 );
        System.out.printf("%05d\n" , 345 );

        System.out.println("자바자바자바자바자바");
        System.out.printf("%s" , "자바자바자바자바자바\n");
        System.out.printf("%50s" , "자바자바자바자바자바\n");

        String s1 = "인공지능\'소프트\b웨어과\'";
        System.out.println(s1);

        String s2 = "한국\n"+ "폴리텍\n"+ "대학\n";
        System.out.println(s2);

        String s3 = "한국\n폴리텍\n대학\n";
        System.out.println(s3);

        String s4 = "한국\n폴리\\텍\n대\t학\n";
        System.out.println(s4);



    }
}
