package ai0604.Inhenitance;

public class MountainRabbit extends Rabbit{
    String mountainName;

    public void eatGrass(String grassType){
        System.out.println(mountainName + "에서 산토끼가" + grassType + " 풀을 먹는다 ");
    }
}
