package ai0825;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

public class SortArray {
    public static void main(String[] args) {
        int[] numArr = {87, 42, 54, 64, 66, 33, 12};
        Arrays.sort(numArr);
    //  Arrays.sort(numArr, Collections.reverseOrder()); 오름차순

        for (int data : numArr){
            System.out.print(data + "  ");
        }

        System.out.println("");

        String[] nameArr = {"김유민","도형준","강석현","유재화","장영서"};
        Arrays.sort(nameArr); //오름차순정렬
        for (String name : nameArr){
            System.out.print(name + "    ");
        }

    }
}
