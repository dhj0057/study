package ai0611.lab.car;

public class Car {
    // protected 접근 제한자는 상속관계에 있는 sub class(자식클래스)만 접근이 가능
    protected int speed;

    public void upSpeed(int speed){
        this.speed += speed;
    }

    public int getSpeed() {
        return speed;
    }
}
