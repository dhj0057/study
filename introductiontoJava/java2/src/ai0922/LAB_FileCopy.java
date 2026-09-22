package ai0922;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class LAB_FileCopy {
    public static void main(String[] args) {
        try {
            // Input: myData1.txt를 읽어오는 Scanner
            Scanner s = new Scanner(new FileReader("myData1.txt"));
            // Output: newFile.txt에 쓰는 FileWriter
            FileWriter fw = new FileWriter("newFile.txt");

            while (s.hasNextLine()) {
                String line = s.nextLine();
                fw.write(line + "\n");
            }

            s.close();
            fw.close();

            System.out.println("myData1.txt가 newFile.txt로 복사되었음");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}