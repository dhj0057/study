package ai0929;

import java.util.Random;

public class RunTimeExceptionTest2 {
    public static void main(String[] args) {
        int[] results = {10,20,30};
        Random random = null;
        //try : 예외발생 가능성이 있는 문장, try에서 예외가 발생하면 try안에있는 예외 발생 아래쪽 문장은 실행되지않는다
        //catch : 예외가 발생했을때 처리할 문장
        //하위 클래스 => 상위 예외 클래스 순으로 catch절을 배치한다

        try {
            System.out.println(results[2]);
            int randomNum = random.nextInt(5);
            results[1] = 600 / 0;
        } catch (ArrayIndexOutOfBoundsException e){
            System.out.println("배열의인덱스 범위를 벗어났습니다.");
        } catch (ArithmeticException e){
            System.out.println("나눗셈 연산식에서 나누는 수는 0이면 안됩니다.");
        } catch (NullPointerException e){
            System.out.println("참조할 객체가 존재하지 않습니다.");
        } catch (Exception e){
            System.out.println("예외가 발생했습니다");
        }
    }
}
