package ai0319;

public class VariableTest2 {
    public static void main(String[] args) {
       int num1, num2 , result , result2 , result3;

       num1 = 300;
       num2 = 500;
       result = num1 +  num2;
       result2 = num1 * num2;
       result3 = num1 / num2;

        System.out.println(num1 + "+" +  num2+ "=" + result);
        System.out.printf("%d + %d = %d\n", num1 , num2 ,result);
        System.out.printf("%d × %d = %d\n", num1 , num2 ,result2);
        System.out.printf("%d ÷ %d = %d\n", num1 , num2 ,result3);
//
// 지역변수는 반드시 int를 설정해야한다
// 변수 = num1 + 200  오른쪽을 먼저계산하여 변수에대입



    }
}
