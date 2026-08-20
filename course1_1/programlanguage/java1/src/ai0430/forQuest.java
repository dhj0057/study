package ai0430;

public class forQuest {
    static void main() {
        int hap= 0;
        for(int i =1; i <= 10; i++ ){
            hap +=i;
            if(i<10)
                System.out.print(i+ "+");
            else
                System.out.print(i+ "=");
        }
        System.out.println(hap);
    }
}
