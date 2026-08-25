package ai0825;

import java.util.Arrays;

public class DeepCopyArray {
    public static void main(String[] args) {
        String[] foodArr = {"김치찌개","삼겹살구이","돈까스","치킨"};
        String[] newArr = foodArr.clone();

        foodArr[1] = "한우구이";
        newArr[2] = "옥수수쏨땀";

        System.out.println("원본배열: " + Arrays.toString(foodArr));
        System.out.println("복제배열: " + Arrays.toString(newArr));

    }
}
