package book_management.view;

import book_management.domain.Book;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;

public class BookInsertPan extends JPanel {
    JTable table;
    DefaultTableModel model;
    ArrayList<Book> bookList;
    String[] header = {"도서번호", "도서명", "저자명", "출판사", "가격", "재고량", "카테고리"};
    String[] categoryNames = {"IT도서", "소설", "수필", "시"};
    String[] publishNames = {"한빛아카데미", "생능출판사", "민음사", "해냄출판사"};
    JLabel[] lbls = new JLabel[header.length];

    JTextField tfIsbn, tfName, tfAuthor, tfPrice, tfInventory;
    JComboBox<String> cbPublish, cbCategory;
    JButton btnInsert;

    public BookInsertPan() {
        setLayout(new BorderLayout());
    }

    public void setBookList(ArrayList<Book> bookList) {
        this.bookList = bookList;
    }

    public JButton getBtnInsert() {
        return btnInsert;
    }

    public void initView() {
        // 1. 도서 목록 테이블 (가운데)
        model = new DefaultTableModel(header, 0) {
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

        // 2. 라벨 생성
        for (int i = 0; i < header.length; i++) {
            lbls[i] = new JLabel(header[i]);
        }

        // 3. 입력 컴포넌트 생성
        tfIsbn = new JTextField();
        tfName = new JTextField();
        tfAuthor = new JTextField();
        tfPrice = new JTextField();
        tfInventory = new JTextField();
        cbPublish = new JComboBox<>(publishNames);
        cbCategory = new JComboBox<>(categoryNames);
        btnInsert = new JButton("도서추가");

        // 4. 입력 패널 (아래쪽, 4행 4열)
        JPanel inputPan = new JPanel(new GridLayout(4, 4, 5, 5));
        inputPan.add(lbls[0]); inputPan.add(tfIsbn);       // 도서번호
        inputPan.add(lbls[1]); inputPan.add(tfName);       // 도서명
        inputPan.add(lbls[2]); inputPan.add(tfAuthor);     // 저자명
        inputPan.add(lbls[4]); inputPan.add(tfPrice);      // 가격
        inputPan.add(lbls[5]); inputPan.add(tfInventory);  // 재고량
        inputPan.add(lbls[3]); inputPan.add(cbPublish);    // 출판사
        inputPan.add(lbls[6]); inputPan.add(cbCategory);   // 카테고리
        inputPan.add(btnInsert);
        add(inputPan, BorderLayout.SOUTH);
    }

    // bookList 내용을 테이블에 채움
    public void putBookList() {
        model.setRowCount(0);
        if (bookList == null) return;
        for (Book book : bookList) {
            model.addRow(new Object[]{
                    book.getIsbn(),
                    book.getName(),
                    book.getAuthor(),
                    book.getPublish_name(),
                    book.getPrice(),
                    book.getInventory(),
                    book.getCategory_name()
            });
        }
    }

    // 입력값을 Book 객체로 만들어 반환 (입력 오류면 null)
    public Book getInputBook() {
        String isbn = tfIsbn.getText().trim();
        String name = tfName.getText().trim();
        String author = tfAuthor.getText().trim();
        String priceText = tfPrice.getText().trim();
        String inventoryText = tfInventory.getText().trim();

        if (isbn.isEmpty() || name.isEmpty() || author.isEmpty()
                || priceText.isEmpty() || inventoryText.isEmpty()) {
            JOptionPane.showMessageDialog(this, "모든 항목을 입력하세요.");
            return null;
        }

        int price, inventory;
        try {
            price = Integer.parseInt(priceText);
            inventory = Integer.parseInt(inventoryText);
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "가격과 재고량은 숫자로 입력하세요.");
            return null;
        }

        Book book = new Book();
        book.setIsbn(isbn);
        book.setName(name);
        book.setAuthor(author);
        book.setPrice(price);
        book.setInventory(inventory);
        book.setPublish_name((String) cbPublish.getSelectedItem());
        book.setCategory_name((String) cbCategory.getSelectedItem());
        return book;
    }

    // 입력칸 비우기
    public void clearInput() {
        tfIsbn.setText("");
        tfName.setText("");
        tfAuthor.setText("");
        tfPrice.setText("");
        tfInventory.setText("");
        cbPublish.setSelectedIndex(0);
        cbCategory.setSelectedIndex(0);
        tfIsbn.requestFocus();
    }
}