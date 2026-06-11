package ai0611.abstacttest;

public class Men extends Person{
    //추상클래스를 상속받으려면
    //추상매서드를 구현하거나 현재 클래스가 추상클래스이던지
    @Override
    public void study() {
        System.out.println("아들이 공부를 열심히 한다");
    }
}