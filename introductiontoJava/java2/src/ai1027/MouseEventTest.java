package ai1027;

import center.SetFrame;

import javax.swing.*;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

public class MouseEventTest extends JFrame {
    JLabel lbl = new JLabel();






    public  MouseEventTest(){
        JPanel panel = new JPanel();
        JButton btn = new JButton("mouse event practice");

        panel.add(btn);
        add(panel);
        add("South",lbl);
        btn.addMouseListener(btnMouseListener);

        SetFrame.setFrame(this,"MouseEvent Programming",300,300);

    }
    MouseListener btnMouseListener = new MouseListener() {
        @Override
        public void mouseClicked(MouseEvent e) {
            System.out.println("버튼에 마우스가 클릭ed");
            lbl.setText("버튼에 마우스가 클릭ed");
        }

        @Override
        public void mousePressed(MouseEvent e) {
            System.out.println("버튼에 마우스가 눌림ed");
            lbl.setText("버튼에 마우스가 클릭ed");
        }

        @Override
        public void mouseReleased(MouseEvent e) {
            System.out.println("버튼에 마우스가 해제됨");
            lbl.setText("버튼에 마우스가 클릭ed");
        }

        @Override
        public void mouseEntered(MouseEvent e) {
            System.out.println("버튼에 마우스가 나감");
            lbl.setText("버튼에 마우스가 클릭ed");
        }

        @Override
        public void mouseExited(MouseEvent e) {
            System.out.println("버튼에 마우스가 나감");
            lbl.setText("버튼에 마우스가 클릭ed");

        }
    };

    public static void main(String[] args) {
        new MouseEventTest();
    }
}
