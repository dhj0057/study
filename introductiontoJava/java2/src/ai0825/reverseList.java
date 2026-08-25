package ai0825;

import java.util.Arrays;
import java.util.Collections;

public class reverseList {
    public static void main(String[] args) {
        String[] darkpeople = {"형준","영서","용학","대환","길수"};
        System.out.println("원본 :" + Arrays.toString(darkpeople));

        Collections.reverse(Arrays.asList(darkpeople));
        System.out.println("반전(역순)"+ Arrays.toString(darkpeople));

    }
}
