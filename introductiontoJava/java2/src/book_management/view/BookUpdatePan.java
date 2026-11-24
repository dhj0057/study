package book_management.view;

import book_management.domain.Book;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;

public class BookUpdatePan extends JPanel {
    Book book;
    JTable table;
    DefaultTableModel model;
    ArrayList<Book> bookList;
    String[] tableHeader = {"도서번호", "도서명", "저자명", "출판사", "가격", "재고량", "카테고리"};
    String[] header = {"도서번호", "도서명", "저자명", "가격", "재고량", "출판사" ,"카테고리"};
    String[] categoryNames = {"IT도서", "소설", "수필", "시"};
    String[] publishNames = {"한빛아카데미", "생능출판사", "민음사", "해냄출판사"};
    JLabel[] lbls = new JLabel[tableHeader.length];
    JTextField[] tfs = new JTextField[tableHeader.length-2];
    JComboBox<String> comboCategory, comboPublish;
    JButton btnUpdate = new JButton("도서수정");
    JButton btnDelete = new JButton("도서삭제");
    JPanel panS = new JPanel(new GridLayout(4, 4, 20, 2));

    public BookUpdatePan() {
        setLayout(new BorderLayout());
    }

    public void setBookList(ArrayList<Book> bookList) {
        this.bookList = bookList;
    }

    public JButton getBtnUpdate() {
        return btnUpdate;
    }

    public JButton getBtnDelete() {
        return btnDelete;
    }

    public void initView() {
        // 1. 도서 목록 테이블
        model = new DefaultTableModel(tableHeader, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
            @Override
            public Class<?> getColumnClass(int columnIndex) {
                // 가격(4), 재고량(5)은 숫자로 정렬
                return (columnIndex == 4 || columnIndex == 5) ? Integer.class : String.class;
            }
        };
        table = new JTable(model);
        table.setAutoCreateRowSorter(true); // 열 제목 클릭 시 오름차순/내림차순 정렬
        add(new JScrollPane(table), BorderLayout.CENTER);
        putBookList();

        // 2. 입력 패널: 앞 5개는 텍스트필드, 뒤 2개는 콤보박스
        comboPublish = new JComboBox<>(publishNames);
        comboCategory = new JComboBox<>(categoryNames);

        for (int i = 0; i < header.length; i++) {
            lbls[i] = new JLabel(header[i]);
            panS.add(lbls[i]);
            if (i < tfs.length) {
                tfs[i] = new JTextField();
                panS.add(tfs[i]);
            } else if (header[i].equals("출판사")) {
                panS.add(comboPublish);
            } else {
                panS.add(comboCategory);
            }
        }
        tfs[0].setEditable(false); // 도서번호는 수정 불가
        panS.add(btnUpdate);
        panS.add(btnDelete);
        add(panS, BorderLayout.SOUTH);

        // 3. 행 클릭 → 입력칸에 채우기
        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int row = table.getSelectedRow();
                if (row < 0) return;
                row = table.convertRowIndexToModel(row); // 정렬된 화면 행 → 원래 데이터 행
                book = bookList.get(row);
                tfs[0].setText(book.getIsbn());
                tfs[1].setText(book.getName());
                tfs[2].setText(book.getAuthor());
                tfs[3].setText(String.valueOf(book.getPrice()));
                tfs[4].setText(String.valueOf(book.getInventory()));
                comboPublish.setSelectedItem(book.getPublish_name());
                comboCategory.setSelectedItem(book.getCategory_name());
            }
        });
    }

    public void putBookList() {
        model.setRowCount(0);
        if (bookList == null) return;
        for (Book b : bookList) {
            model.addRow(new Object[]{
                    b.getIsbn(), b.getName(), b.getAuthor(), b.getPublish_name(),
                    b.getPrice(), b.getInventory(), b.getCategory_name()
            });
        }
    }

    // 선택된 도서번호 (선택 안 했으면 null)
    public String getSelectedIsbn() {
        String isbn = tfs[0].getText().trim();
        if (isbn.isEmpty()) {
            JOptionPane.showMessageDialog(this, "도서를 표에서 먼저 선택하세요.");
            return null;
        }
        return isbn;
    }

    // 입력칸 값을 Book으로 반환 (선택 안 했거나 입력 오류면 null)
    public Book getInputBook() {
        if (getSelectedIsbn() == null) return null;

        for (JTextField tf : tfs) {
            if (tf.getText().trim().isEmpty()) {
                JOptionPane.showMessageDialog(this, "모든 항목을 입력하세요.");
                return null;
            }
        }
        int price, inventory;
        try {
            price = Integer.parseInt(tfs[3].getText().trim());
            inventory = Integer.parseInt(tfs[4].getText().trim());
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "가격과 재고량은 숫자로 입력하세요.");
            return null;
        }

        Book b = new Book();
        b.setIsbn(tfs[0].getText().trim());
        b.setName(tfs[1].getText().trim());
        b.setAuthor(tfs[2].getText().trim());
        b.setPrice(price);
        b.setInventory(inventory);
        b.setPublish_name((String) comboPublish.getSelectedItem());
        b.setCategory_name((String) comboCategory.getSelectedItem());
        return b;
    }

    public void clearInput() {
        for (JTextField tf : tfs) tf.setText("");
        comboPublish.setSelectedIndex(0);
        comboCategory.setSelectedIndex(0);
        table.clearSelection();
    }
}