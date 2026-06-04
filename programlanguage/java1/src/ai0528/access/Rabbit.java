package ai0528.access;

public class Rabbit {
    // private String shape;
    // private int x;
    // private int y;

    public String shape;
    public int x;
    public int y;

    // default (생략) 제한자는 같은 package 내에서만 접근이 가능하다.
    // package가 달라지만 public으로 접근 해야한다.
    // shape;
    //int x;
    //int y;

    //public String getShape() {
    //    return shape;
    //}

    //public void setShape(String shape) {
    //    this.shape = shape;
    //}

    public void setLocation(int x, int y){
        this.x = x;
        this.y = y;
    }

    public void printInfo(){
        System.out.printf("%s모양의 토끼는 (%d, %d) 좌표에 있음.\n",shape,x,y);
    }
}
