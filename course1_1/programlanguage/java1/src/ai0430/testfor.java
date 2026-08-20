package ai0430;

public class testfor {
    static void main() {
        int num1;
        int count=0;
        for(num1= 1;num1 < 101;num1++){
            System.out.print("\t "+num1);
            count++;
            if(count % 10 == 0)
                System.out.println(" ");

        }

    }
}
