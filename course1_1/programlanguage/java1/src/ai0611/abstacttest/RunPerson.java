package ai0611.abstacttest;

public class RunPerson {
    public static void main(String[] args) {
        //Person person = new Person() {
        Men men = new Men();
        men.name = "김폴리";
        men.weight = 70;
        men.height = 180;

        Women women = new Women();
        women.name = "박인순";
        women.weight = 48;
        women.height = 170;

        men.eat("김치찌개");
        men.sleep(8);
        men.study();

        women.eat("파스타");
        women.study();
        women.sleep(10);


    }
}
