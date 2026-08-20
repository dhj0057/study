package ai0611.lab.subCar;

import  ai0611.lab.car.Car;
public class SportsCar extends Car {
    @Override
    public void upSpeed(int speed){
        super.upSpeed(speed);
        if(this.speed >= 200){
            this.speed = 200;
        }
    }
}
