package ai0611.lab;

import ai0611.lab.subCar.SchoolBus;
import ai0611.lab.subCar.SportsCar;

import java.util.Scanner;

public class RunCarMain {
    public static void main(String[] args) {
        Scanner s1 = new Scanner(System.in);
        int speed =0;

        SchoolBus schoolBus = new SchoolBus();
        SportsCar sportsCar = new SportsCar();

        while (true){
            System.out.println("가속할 속도 입력: ");
            speed = s1.nextInt();

            if (speed == -1)
                break;

            schoolBus.upSpeed(speed);
            sportsCar.upSpeed(speed);

            System.out.printf("☆ 스쿨버스의 현재 속도: %d\n", schoolBus.getSpeed());
            System.out.printf("☆ 스포츠 카의 현재 속도: %d\n", sportsCar.getSpeed());
        }

        s1.close();
    }
}