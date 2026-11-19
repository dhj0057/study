package book_management.controller;

import book_management.domain.Book;
import book_management.repository.BookRepository;
import book_management.view.BookInsertPan;
import book_management.view.BookSearchPan;
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

        // 4. 버튼 이벤트 연결
        JButton btnSearch = searchPan.getBtnSearch();
        btnSearch.addActionListener(btnSearchListener);

        JButton btnInsert = insertPan.getBtnInsert();
        btnInsert.addActionListener(btnInsertListener);

        // 5. 탭에 두 화면 붙이기
        tabbedPane.add("도서 검색", searchPan);
        tabbedPane.add("도서 추가", insertPan);
        add(tabbedPane);

        SetFrame.setFrame(this, "도서관리 시스템", 700, 600);
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
            // 1. 입력값을 Book 객체로 받아옴 (입력 오류면 null)
            Book book = insertPan.getInputBook();
            if (book == null) return;

            // 2. DB에 저장
            int result = repository.insert(book);
            if (result == 0) {
                JOptionPane.showMessageDialog(insertPan, "도서 추가에 실패했습니다.");
                return;
            }
            JOptionPane.showMessageDialog(insertPan, "도서가 추가되었습니다.");

            // 3. 전체 목록 다시 조회해서 테이블 갱신
            bookList = repository.select("", 0);
            insertPan.setBookList(bookList);
            insertPan.putBookList();
            insertPan.clearInput();
        }
    };

    public static void main(String[] args) {
        new BookController();
    }
}