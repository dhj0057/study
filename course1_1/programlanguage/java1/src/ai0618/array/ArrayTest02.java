package ai0618.array;

import java.util.Arrays;

public class ArrayTest02 {
    public static void main(String[] args) {
        String[] subjects = {"프로그래밍 언어 실습", "데이터 베이스", "융합 UI실습"};

        System.out.println("* 현재 배열의 길이: " + subjects.length);
        System.out.println("* 현재 배열의 내용 ");
        for (String subject : subjects){
            System.out.println(subject + "  ");
        }
        System.out.println();

        subjects = Arrays.copyOf(subjects, subjects.length +2);
        subjects[subjects.length -2] = "영상인공지능처리";
        subjects[subjects.length -1] = "직업과 경력개발";

        System.out.println("* 현재 배열의 길이: " + subjects.length);
        System.out.println("* 현재 배열의 내용 ");
        for (String subject : subjects){
            System.out.println(subject + "  ");


        }
    }

}
