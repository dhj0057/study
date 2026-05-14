package ai0514;

public class ContinueTest {
    static void main() {
        int sum =0;

        for(int i =1; i<=100; i++){
            if(i % 4 == 0)
                continue;
            sum +=i;
        }
        System.out.println("1~100까지의 합계(4배수를 제외한 합계)" +sum);
    }
}
