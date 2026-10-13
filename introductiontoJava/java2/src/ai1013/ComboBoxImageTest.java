package ai1013;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ItemEvent;

public class ComboBoxImageTest extends JFrame {

    private final JLabel lbl = new JLabel("", SwingConstants.CENTER);

    public ComboBoxImageTest() {
        setTitle("이미지 입력 컴포넌트");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        String[] items = {"강아지", "고양이", "토끼", "미어캣", "코알라"};
        JComboBox<String> comboBox = new JComboBox<>(items);

        add(comboBox, BorderLayout.NORTH);
        add(lbl, BorderLayout.CENTER);

        comboBox.addItemListener(e -> {
            if (e.getStateChange() == ItemEvent.SELECTED) {
                showImage((String) e.getItem());
            }
        });

        // 처음에는 강아지 이미지 표시
        showImage(items[0]);

        setSize(250, 250);
        setLocationRelativeTo(null);
        setVisible(true);
    }

    private void showImage(String selectedItem) {
        String imgPath;

        switch (selectedItem) {
            case "강아지":
                imgPath = "java2/imgs/dog_character.png";
                break;
            case "고양이":
                imgPath = "java2/imgs/cat_character.png";
                break;
            case "토끼":
                imgPath = "java2/imgs/rabbit_character.png";
                break;
            case "미어캣":
                imgPath = "java2/imgs/meercat_character.png";
                break;
            case "코알라":
                imgPath = "java2/imgs/koala_character.png";
                break;
            default:
                return;
        }

        ImageIcon icon = new ImageIcon(imgPath);

        if (icon.getIconWidth() <= 0) {
            lbl.setIcon(null);
            lbl.setText("이미지를 찾을 수 없습니다.");
            return;
        }

        // 비율을 유지하며 200 × 180 영역에 맞추기
        double scale = Math.min(
                200.0 / icon.getIconWidth(),
                180.0 / icon.getIconHeight()
        );

        int width = Math.max(1, (int) (icon.getIconWidth() * scale));
        int height = Math.max(1, (int) (icon.getIconHeight() * scale));

        Image image = icon.getImage().getScaledInstance(
                width, height, Image.SCALE_SMOOTH
        );

        lbl.setText("");
        lbl.setIcon(new ImageIcon(image));
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(ComboBoxImageTest::new);
    }
}