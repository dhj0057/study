package ai1103;

import center.SetFrame;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class MenuTest extends JFrame {
    JTextArea textArea = new JTextArea();
    JFileChooser fileChooser = new JFileChooser();
    JFrame frame;
    String[] btnIconFileNames = {"new", "open", "close", "Magenta", "Blue", "White"};
    JButton[] btns = new JButton[6];

    public MenuTest() {
        frame = this;
        JScrollPane scrollPane = new JScrollPane(textArea, JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED, JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setComponentOrientation(ComponentOrientation.RIGHT_TO_LEFT);
        add(scrollPane);

        JToolBar toolbar = new JToolBar();
        add("North", toolbar);

        for (int i = 0; i < btns.length; i++) {
            btns[i] = new JButton(resizeIcon("toolbar/" + btnIconFileNames[i] + ".png", 48, 48));
            btns[i].addActionListener(btnListener);
            toolbar.add(btns[i]);
        }

        JMenuBar menuBar = new JMenuBar();
        setJMenuBar(menuBar);
        JMenu fileMenu = new JMenu("File");
        JMenu editMenu = new JMenu("Edit");
        menuBar.add(fileMenu);
        menuBar.add(editMenu);

        JMenuItem newMenuItem = new JMenuItem("New"); //textArea의 문자열을 초기화
        JMenuItem openMenuItem = new JMenuItem("Open"); //JFileChooser
        JMenuItem closeMenuItem = new JMenuItem("Close"); //System.exit
        fileMenu.add(newMenuItem);
        fileMenu.add(openMenuItem);
        fileMenu.add(closeMenuItem);

        JMenuItem whiteMenuItem = new JMenuItem("White");
        JMenuItem blueMenuItem = new JMenuItem("Blue");
        JMenuItem magentaMenuItem = new JMenuItem("Magenta");
        editMenu.add(whiteMenuItem);
        editMenu.add(blueMenuItem);
        editMenu.add(magentaMenuItem);

        whiteMenuItem.addActionListener(backgroundListener);
        blueMenuItem.addActionListener(backgroundListener);
        magentaMenuItem.addActionListener(backgroundListener);

        newMenuItem.addActionListener(fileListener);
        openMenuItem.addActionListener(fileListener);
        closeMenuItem.addActionListener(fileListener);

        SetFrame.setFrame(this, "메뉴만들기", 500, 500);
    }

    ActionListener btnListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            JButton eBtn = (JButton) e.getSource();

            if (eBtn == btns[0]) {
                textArea.setText("");
            } else if (eBtn == btns[1]) {
                openFile();
            } else if (eBtn == btns[2]) {
                System.exit(0);
            } else if (eBtn == btns[3]) {
                textArea.setBackground(Color.MAGENTA);
            } else if (eBtn == btns[4]) {
                textArea.setBackground(Color.BLUE);
            } else if (eBtn == btns[5]) {
                textArea.setBackground(Color.WHITE);
            }
        }
    };

    ActionListener fileListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            switch (e.getActionCommand()) {
                case "New":
                    textArea.setText("");
                    break;
                case "Open":
                    openFile();
                    break;
                case "Close":
                    System.exit(0);
                    break;
            }
        }
    };

    ActionListener backgroundListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            Color color = null;
            switch (e.getActionCommand()) {
                case "White":
                    color = Color.WHITE;
                    break;
                case "Blue":
                    color = Color.BLUE;
                    break;
                case "Magenta":
                    color = Color.MAGENTA;
                    break;
            }
            textArea.setBackground(color);
        }
    };

    private void openFile() {
        int result = fileChooser.showOpenDialog(frame);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            textArea.setText(readFile(selectedFile));
            textArea.setCaretPosition(0);
        }
    }

    private ImageIcon resizeIcon(String path, int width, int height) {
        Image image = new ImageIcon(path).getImage();
        Image resized = image.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        return new ImageIcon(resized);
    }

    public String readFile(File selectedFile) {
        String totalLines = "";
        try (BufferedReader br = new BufferedReader(new FileReader(selectedFile))) {
            String line;
            while ((line = br.readLine()) != null) {
                totalLines += line + "\n";
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return totalLines;
    }

    public static void main(String[] args) {
        new MenuTest();
    }
}