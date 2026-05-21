package ai0521.Car;


public class Car {
    // 메소드 바깥쪽에 선언된 변수: 필드
    private String product; //제조사
    private String name; //자동차 이름
    private int displacement; //배기량
    private String color; //색상
    private int price;

    //생성자
    //생성자의 역할 : 객체가 생성될때 필드의 값을 초기화
    //기본생성자    :객체만 생성하고 필드의 값을 초기화시키지 않는다.

    //기본 생성자
    public Car() {

    }
    //일반적인 생성자


    public Car(String product, String name, int displacement, String color, int price) {
        this.product = product;
        this.name = name;
        this.displacement = displacement;
        this.color = color;
        this.price = price;
    }

    //getter 메소드 : 필드에 저장된 값을 반환
    //setter 메소드 : 필드에 값을 설정(저장)
    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDisplacement() {
        return displacement;
    }

    public void setDisplacement(int displacement) {
        this.displacement = displacement;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    //Car의 기능에 해당하는 메소드
    public void startOn() {
        System.out.println(name + "자동차에 시동을 건다.");
    }

    public void startOff() {
        System.out.println(name + "자동차에 시동을 끈다.");
    }

    public void drive() {
        System.out.println(name + "자동차 주행한다");
    }

    public void forward() {
        System.out.println(name + "자동차 전진한다");
    }

    public void stop() {
        System.out.println(name + "자동차 정지한다");
    }

    public void rotate(String direction) {
        System.out.println(name + "자동차가" + direction + "한다");
    }

}

