package ai0409;
//기본자료형에 대한 연습 쓋더기릿 기리리릿가즈아ㅏ

public class dataTypeTest {
    public static void main(String[] args) {
//======================================숫자형======================================================
        byte bt = -128; // -128~ 127 -2의7승 ~ 2의7승-1
        short st = 300; //
        st  = bt ;
        int it = st;
        System.out.println("it 변수에 저장된값:"+ it);
        long lg = 700000000;
        float f1 = 1000;
        f1 =lg;
        f1 = 1000.0f;

        double d1 = 20000;
        d1 = f1;
        d1 = bt;
        d1 = 207.999;

        char c = 'A';
        System.out.println(c+1);
        System.out.println((char)(c+3));
        System.out.println((int)c);

        boolean b = true;

        System.out.println(b);
        System.out.println(!b);

        System.out.println(bt == st);






/*
    숫자
    정수
    byte = -2의7승 ~ 2의7승 -1
    short = -2의 15승 ~ 2의 15승 -1
    int = -2의 31승 ~ 2의 31승 -1
    long = -2 63승 ~ 2의 63승 -1

    실수
    float = 32
    double = 64

    문자
    unicode 값을 연산할수있다

    논리






 */
    }

}
