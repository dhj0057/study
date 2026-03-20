package ai0319;

public class VariableTest3 {
    public static void main(String[] args) {
        int n1 , n2;
        double result;

        n1 = 300;
        n2 = 500;

        result = (double)n1 / n2 ;
        System.out.printf("%d ÷ %d = %.2f", n1,n2,result);
    }
}
//정수 연산 정수는 정수부만 나옴 둘중하나를 실수로 형변환이이루어지고 값의 선언도 실수도되어있어야함
// 묵시적형변환

