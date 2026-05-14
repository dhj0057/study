package ai0514;

public class forDouble {
    static void main() {
        int hap =0;

        for(int i = 1; i<10;i++){
            for(int j=1;j<10;j++){
                System.out.printf("%d * %d = %d\t",j,i,i*j);
            }
            System.out.println("끝");
        }


        for(int i =2; i<=9; i++){
            for(int j =1; j <= 9;j++){
                System.out.printf("%d*%d=%d\n",i,j,i*j);
            }
        }
    }
}
