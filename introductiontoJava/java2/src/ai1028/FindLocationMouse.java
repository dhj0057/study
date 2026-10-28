package ai1028;

import ai1027.SetFrame;

import javax.swing.*;
import java.awt.event.*;

public class FindLocationMouse extends JFrame {
    JTextField textX, textY;
    public FindLocationMouse() {
        JPanel panel = new JPanel();
        textX = new JTextField(5);
        textY = new JTextField(5);

        panel.add(textX);
        panel.add(textY);
        add("South", panel);
        addMouseListener(frameListener);
        addMouseMotionListener(frameMotionListener);

        SetFrame.setFrame(this, "마우스이벤트 발생 위치 출력", 500, 500);
    }

    MouseListener frameListener = new MouseAdapter() {
        @Override
        public void mouseClicked(MouseEvent e) {
            textX.setText(e.getX() + "");
            textY.setText(e.getY() + "");
        }
    };

    MouseMotionListener frameMotionListener = new MouseMotionAdapter() {
        @Override
        public void mouseMoved(MouseEvent e) {
            textX.setText(e.getX() + "");
            textY.setText(e.getY() + "");
        }
    };

    public static void main(String[] args) {
        new FindLocationMouse();
    }
}
