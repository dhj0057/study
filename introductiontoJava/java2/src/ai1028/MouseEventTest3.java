package ai1028;

import ai1027.SetFrame;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

public class MouseEventTest3 extends JFrame {
    JLabel lblImg = new JLabel();

    public MouseEventTest3(){
        String [] btnText = {"아이브", "리센느", "캣츠아이"};
        JPanel panel = new JPanel();
        for (int i = 0; i < btnText.length; i++) {
            JButton btn = new JButton(btnText[i]);
            btn.addMouseListener(btnListener);
            panel.add(btn);
        }
        add("North", panel);
        add("Center", lblImg);
        lblImg.setOpaque(true);
        lblImg.setBackground(Color.WHITE);

        SetFrame.setFrame(this, "버튼에 따른 이미지변경", 500, 500);
    }

    MouseListener btnListener = new MouseAdapter(){
        @Override
        public void mouseClicked(MouseEvent e) {
            JButton eBtn = (JButton) e.getSource();
            ImageIcon imageIcon = null;

            switch (eBtn.getText()) {
                case "아이브" :
                    imageIcon = new ImageIcon("imgs/img0.png");
                    break;

                case "리센느" :
                    imageIcon = new ImageIcon("imgs/img1.png");
                    break;

                case "캣츠아이" :
                    imageIcon = new ImageIcon("imgs/img2.png");
                    break;
            }

            lblImg.setIcon(imageIcon);
        }
    };

    public static void main(String[] args) {
        new  MouseEventTest3();
    }
}
