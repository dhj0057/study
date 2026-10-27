package ai1027;

import center.CenterFrame2;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BorderTest extends JFrame {
    List<String> locArr = Arrays.asList(
            BorderLayout.NORTH, BorderLayout.SOUTH,
            BorderLayout.EAST, BorderLayout.WEST, BorderLayout.CENTER);
    List<JButton> btnList = new ArrayList<>();

    public BorderTest() {
        super("BorderLayout practice");
//      BorderLayout의 수평, 수직 간격을 10px로 설정하시오.
        setLayout(new BorderLayout(10, 10));

        setDefaultCloseOperation(EXIT_ON_CLOSE);
//      JFrame의 5개의 영역에 버튼을 추가하시오.(collection,for)
//      1.버튼객체 생성
//      2.JFrame의 각 위치에 추가
        int i = 1;
        for (String loc : locArr) {
            JButton btn = new JButton("버튼 " + i++);
            add(loc, btn);
            btnList.add(btn);
        }

//      각 버튼을 클릭하면 버튼의 라벨 문자열이 선택되었다는 메세지창을 보이시오.
        for (JButton btn : btnList) {
            btn.addActionListener(e ->
                    JOptionPane.showMessageDialog(this, btn.getText() + "이(가) 선택되었습니다."));
        }

        int w = 250, h = 250;
        Point point = CenterFrame2.getLocation(w, h);
        setBounds(point.x, point.y, w, h);
        setVisible(true);
    }

    public static void main(String[] args) {
        new BorderTest();
    }
}