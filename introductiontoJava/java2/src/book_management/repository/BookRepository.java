package book_management.repository;

import book_management.domain.Book;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class BookRepository {
    ArrayList<Book> bookList;

    public ArrayList<Book> select (String searchWord, int selectedIndex){
        bookList = new ArrayList<>();

        String[] columnName = {"name", "publish_name", "author"};

        String sql = "SELECT isbn, name, author, price, inventory, category_name,  publish_name from book b, category c, publish p " +
                "where b.category_id = c.category_id and b.publish_id = p.publish_id " +
                " and " + columnName[selectedIndex] + " like ?";
        try (Connection con = JDBCConnector.getConnection();
             PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, "%" + searchWord + "%");
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()){
                    Book book = new Book();
                    book.setIsbn(rs.getString("isbn"));
                    book.setName(rs.getString("name"));
                    book.setAuthor(rs.getString("author"));
                    book.setPrice(rs.getInt("price"));
                    book.setInventory(rs.getInt("inventory"));
                    book.setCategory_name(rs.getString("category_name"));
                    book.setPublish_name(rs.getString("publish_name"));
                    bookList.add(book);
                }
            }

        } catch(SQLException e){
            throw new RuntimeException(e);
        }

        return bookList;
    }

    public int insert(Book book){
        String sql = "insert into book values(?, ?, ?, ?, ?, ?, ?)";

        //출판사명을 id 정수값으로 변경해서
        int publish_id = 0;
        switch (book.getPublish_name()){
            case "한빛아카데미":
                publish_id = 1;
                break;
            case "생능출판사":
                publish_id = 2;
                break;
            case "민음사":
                publish_id = 3;
                break;
            case "해냄출판사":
                publish_id = 4;
                break;
        }

        //카테고리명을 id 정수값으로 변경해서
        int category_id = 0;
        switch (book.getCategory_name()){
            case "IT도서":
                category_id = 10;
                break;
            case "소설":
                category_id = 20;
                break;
            case "수필":
                category_id = 30;
                break;
            case "시":
                category_id = 40;
                break;
        }

        int result = 0;
        try (Connection con = JDBCConnector.getConnection();
             PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, book.getIsbn());
            pstmt.setString(2, book.getName());
            pstmt.setString(3, book.getAuthor());
            pstmt.setInt(4, book.getPrice());
            pstmt.setInt(5, book.getInventory());
            pstmt.setInt(6, category_id);
            pstmt.setInt(7, publish_id);
            result = pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return result;
    }

    public int update(Book book){
        String sql = "update book set name = ?, author = ?, price = ?, inventory = ?, " +
                "category_id = ?, publish_id = ? where isbn = ?";

        int publish_id = 0;
        switch (book.getPublish_name()){
            case "한빛아카데미": publish_id = 1; break;
            case "생능출판사": publish_id = 2; break;
            case "민음사": publish_id = 3; break;
            case "해냄출판사": publish_id = 4; break;
        }

        int category_id = 0;
        switch (book.getCategory_name()){
            case "IT도서": category_id = 10; break;
            case "소설": category_id = 20; break;
            case "수필": category_id = 30; break;
            case "시": category_id = 40; break;
        }

        int result = 0;
        try (Connection con = JDBCConnector.getConnection();
             PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, book.getName());
            pstmt.setString(2, book.getAuthor());
            pstmt.setInt(3, book.getPrice());
            pstmt.setInt(4, book.getInventory());
            pstmt.setInt(5, category_id);
            pstmt.setInt(6, publish_id);
            pstmt.setString(7, book.getIsbn());
            result = pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    public int delete(String isbn){
        String sql = "delete from book where isbn = ?";

        int result = 0;
        try (Connection con = JDBCConnector.getConnection();
             PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, isbn);
            result = pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
