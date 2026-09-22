package ai0922;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class FileWriterTest1 {
    public static void main(String[] args) {
        try{
            Scanner s = new Scanner(System.in);
            FileWriter fw = new FileWriter("myData2.txt");
            String line = "";

            while (true){
                if(line.equals("exit"))
                    break;


                System.out.println("파일에 저장할 1줄 내용 입력(종료 : exit):");
                line = s.nextLine();
                fw.write(line + "\n");
            }



            fw.close();
            System.out.println("myData2.txt에 내용 저장 완료");
            s.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    }

