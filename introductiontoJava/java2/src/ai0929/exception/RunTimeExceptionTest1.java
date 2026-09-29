package ai0929.exception;

public class RunTimeExceptionTest1 {
    public static void main(String[] args) {
        String[] names = {"도형준","장영서","반용학"};

        try{
            System.out.println(names[5]);
        } catch (ArrayIndexOutOfBoundsException e){
            System.out.println("배열의 인덱스는 0부터다 빡통아");
        }
        System.out.println("프로그램 종료");
    }
}
