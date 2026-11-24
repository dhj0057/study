package book_management.controller;

import book_management.domain.Book;
import book_management.repository.BookRepository;
import book_management.view.BookInsertPan;
import book_management.view.BookSearchPan;
import book_management.view.BookUpdatePan;
import center.SetFrame;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class BookController extends JFrame {
    JTabbedPane tabbedPane = new JTabbedPane(JTabbedPane.TOP);
    BookRepository repository;
    BookSearchPan searchPan;
    BookInsertPan insertPan;
    BookUpdatePan updatePan;
    ArrayList<Book> bookList;
    JComboBox<String> combo;

    public BookController(){
        // 1. DB 연결 객체
        repository = new BookRepository();

        // 2. 도서 검색 화면
        searchPan = new BookSearchPan();
        combo = searchPan.getCombo();
        bookList = repository.select(searchPan.getSearchWord(), combo.getSelectedIndex());
        searchPan.setBookList(bookList);
        searchPan.initView();

        // 3. 도서 추가 화면
        insertPan = new BookInsertPan();
        insertPan.setBookList(bookList);
        insertPan.initView();

        // 4. 도서 수정/삭제 화면
        updatePan = new BookUpdatePan();
        updatePan.setBookList(bookList);
        updatePan.initView();

        // 5. 버튼 이벤트 연결
        searchPan.getBtnSearch().addActionListener(btnSearchListener);
        insertPan.getBtnInsert().addActionListener(btnInsertListener);
        updatePan.getBtnUpdate().addActionListener(btnUpdateListener);
        updatePan.getBtnDelete().addActionListener(btnDeleteListener);

        // 6. 탭에 화면 붙이기
        tabbedPane.add("도서 검색", searchPan);
        tabbedPane.add("도서 추가", insertPan);
        tabbedPane.add("도서 수정/삭제", updatePan);
        add(tabbedPane);

        // 7. 탭을 바꿀 때마다 그 탭의 표를 DB 최신 내용으로 갱신
        tabbedPane.addChangeListener(e -> refreshCurrentTab());

        SetFrame.setFrame(this, "도서관리 시스템", 700, 600);
    }

    // 추가·수정·삭제 후 모든 탭의 목록을 최신으로 갱신
    private void refreshList() {
        bookList = repository.select("", 0);
        insertPan.setBookList(bookList);
        insertPan.putBookList();
        updatePan.setBookList(bookList);
        updatePan.putBookList();
        refreshSearch();
    }

    // 검색 탭: 현재 입력된 검색어·검색 조건 그대로 다시 조회
    private void refreshSearch() {
        ArrayList<Book> searchList = repository.select(searchPan.getSearchWord(), combo.getSelectedIndex());
        searchPan.setBookList(searchList);
        searchPan.putSearchResult();
    }

    // 선택된 탭만 다시 조회
    private void refreshCurrentTab() {
        if (tabbedPane.getSelectedComponent() == searchPan) {
            refreshSearch();
        } else {
            refreshList();
        }
    }

    ActionListener btnSearchListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            bookList = repository.select(searchPan.getSearchWord(), combo.getSelectedIndex());
            searchPan.setBookList(bookList);
            searchPan.putSearchResult();
        }
    };

    ActionListener btnInsertListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            Book book = insertPan.getInputBook();
            if (book == null) return;

            int result = repository.insert(book);
            if (result == 0) {
                JOptionPane.showMessageDialog(insertPan, "도서 추가에 실패했습니다.");
                return;
            }
            JOptionPane.showMessageDialog(insertPan, "도서가 추가되었습니다.");

            refreshList();
            insertPan.clearInput();
        }
    };

    ActionListener btnUpdateListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            Book book = updatePan.getInputBook();
            if (book == null) return;

            // 수정 전 확인
            int answer = JOptionPane.showConfirmDialog(updatePan,
                    "도서번호 " + book.getIsbn() + " [" + book.getName() + "]을(를) 수정하시겠습니까?",
                    "수정 확인", JOptionPane.YES_NO_OPTION);
            if (answer != JOptionPane.YES_OPTION) return;

            int result = repository.update(book);
            if (result == 0) {
                JOptionPane.showMessageDialog(updatePan, "도서 수정에 실패했습니다.");
                return;
            }
            JOptionPane.showMessageDialog(updatePan, "도서가 수정되었습니다.");

            refreshList();
            updatePan.clearInput();
        }
    };

    ActionListener btnDeleteListener = new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            String isbn = updatePan.getSelectedIsbn();
            if (isbn == null) return;

            // 삭제 전 확인
            int answer = JOptionPane.showConfirmDialog(updatePan,
                    "도서번호 " + isbn + "을(를) 삭제하시겠습니까?\n삭제하면 되돌릴 수 없습니다.",
                    "삭제 확인", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (answer != JOptionPane.YES_OPTION) return;

            int result;
            try {
                result = repository.delete(isbn);
            } catch (RuntimeException ex) {
                String msg = (ex.getCause() != null) ? ex.getCause().getMessage() : ex.getMessage();
                if (msg != null && msg.contains("ORA-02292")) {
                    msg = "다른 테이블(주문 등)에서 이 도서를 참조하고 있어 삭제할 수 없습니다.";
                }
                JOptionPane.showMessageDialog(updatePan, "도서 삭제에 실패했습니다.\n" + msg);
                return;
            }
            if (result == 0) {
                JOptionPane.showMessageDialog(updatePan, "도서 삭제에 실패했습니다.");
                return;
            }
            JOptionPane.showMessageDialog(updatePan, "도서가 삭제되었습니다.");

            refreshList();
            updatePan.clearInput();
        }
    };

    public static void main(String[] args) {
        new BookController();
    }
}
