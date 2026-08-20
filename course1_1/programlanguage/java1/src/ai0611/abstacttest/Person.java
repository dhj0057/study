package ai0611.abstacttest;

// 추상클래스

public abstract class Person {
    String name;
    int weight;
    int height;

    public void eat(String food) {
        System.out.println(food + "을 먹는다.");
    }

    public void sleep(int hour){
        System.out.println(hour + "시간 잔다.");
    }

    public abstract void study();
}
