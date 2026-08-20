package ai0611.interfacetest;

public class K9 implements Car{

    public int speed;


    public static final String carName = "K9";

    @Override
    public void start() {
        System.out.println(carName + "자동차의 시동을 건다");
    }

    @Override
    public void stop() {
        System.out.println(carName + "자동차를 멈춘다.");

    }

    @Override
    public void upSpeed(int speed) {
        this.speed +=speed;
        System.out.println(carName + "자동차의 현재속도는"+ this.speed + "입니다");
    }

    @Override
    public void downSpeed(int speed) {
        this.speed -=speed;
        System.out.println(carName + "자동차의 현재속도는"+ this.speed + "입니다");
    }

    @Override
    public void rotate(String direction) {
        System.out.println(carName + "자동차를 "+ direction + "회전한다.");
    }

    @Override
    public void forward() {

    }

    @Override
    public void backward() {

    }
}
