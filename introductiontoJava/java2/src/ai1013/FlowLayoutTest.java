package ai1013;

import center.CenterFrame2;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class FlowLayoutTest extends JFrame {

    ArrayList<JButton> list = new ArrayList<>();
    Color[] colors = {Color.RED, Color.YELLOW};
    boolean flag = true;

    public FlowLayoutTest() {
        setTitle("FlowLayout 연습");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new FlowLayout(FlowLayout.RIGHT, 10, 10));

        for (int i = 1; i <= 5; i++) {
            JButton button = new JButton("버튼" + i);
            button.setPreferredSize(new Dimension(70, 30));

            list.add(button);
            button.addActionListener(btnListener);
            add(button);
        }

        int w = 250, h = 250;
        Point point = CenterFrame2.getLocation(w, h);
        setBounds(point.x, point.y, w, h);

        setVisible(true);
    }

    ActionListener btnListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            JButton selectedBtn = (JButton) e.getSource();

            switch (list.indexOf(selectedBtn)) {
                case 0:
                    if (flag) {
                        selectedBtn.setBackground(colors[0]);
                    } else {
                        selectedBtn.setBackground(colors[1]);
                    }

                    flag = !flag;
                    break;
            }
        }
    };

    public static void main(String[] args) {
        new FlowLayoutTest();
    }
}