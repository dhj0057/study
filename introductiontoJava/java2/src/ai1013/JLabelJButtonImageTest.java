package ai1013;

import ai0929.gui.CenterFrame;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class JLabelJButtonImageTest extends JFrame {

    // 생성자 밖에서도 사용해야 하므로 멤버변수로 선언
    JLabel lbl;
    ImageIcon lblIcon;

    boolean flag = true;

    public JLabelJButtonImageTest() {

        setTitle("ImageIcon설정 컴포넌트");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // 버튼
        JButton btn = new JButton("Click Here");

        // 이미지
        lblIcon = new ImageIcon("java2/imgs/dog1.jpg");

        // JLabel
        lbl = new JLabel();
        lbl.setHorizontalAlignment(JLabel.CENTER);

        // 버튼에 이벤트 연결
        btn.addActionListener(btnListener);

        add(btn, BorderLayout.NORTH);
        add(lbl, BorderLayout.CENTER);

        int w = 350;
        int h = 350;

        int[] locations = CenterFrame.getLocation(w, h);
        setBounds(locations[0], locations[1], w, h);

        setVisible(true);
    }

    // 버튼 이벤트
    ActionListener btnListener = new ActionListener() {

        @Override
        public void actionPerformed(ActionEvent e) {

            if (flag) {
                lbl.setIcon(lblIcon);
                flag = false;
            } else {
                lbl.setIcon(null);
                flag = true;
            }
        }
    };

    public static void main(String[] args) {
        new JLabelJButtonImageTest();
    }
}