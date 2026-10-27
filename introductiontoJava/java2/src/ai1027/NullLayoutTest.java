package ai1027;

import center.SetFrame;

import javax.swing.*;

public class NullLayoutTest extends JFrame {
    public NullLayoutTest(){
        setLayout(null);
//      컴포넌트의 X,Y 좌표
        int[] pointX={50,80,110};
        int[] pointY={50,80,110};
//      컴포넌트의 너비,높이
        int btnW = 70, btnH = 60;

        for (int i = 0; i < pointX.length; i++) {
            JButton btn = new JButton("버튼"+(i+1));
            btn.setBounds(pointX[i],pointY[i],btnW,btnH);
            add(btn);
        }
        SetFrame.setFrame(this,"Without Layout component batching",250,250);
    }

    public static void main(String[] args) {
        new NullLayoutTest();
    }
}
