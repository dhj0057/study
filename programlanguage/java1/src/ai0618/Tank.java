package ai0618;

public class Tank implements Car,Cannon{
    @Override
    public void fire(){
        System.out.println("대포를 발사하라.");
    }

    @Override
    public void move() {
        System.out.println(" 탱크가 이동한다.");
    }
}
