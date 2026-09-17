import React from "react";
import Book from "./Book";
import "./BookList.css";

//  데이터 배열 (HashMap, JSON type)
const books= [
    {
        title: "처음 만난 리액트",
        author: "김소플",
        coverImage : "https://image.yes24.com/goods/172506733/L"
    },
    {
        title: "데이터 베이스 실습",
        author: "박우창",
        coverImage : "https://image.yes24.com/goods/97538787/L"
    },
    {
        title: "난생 처음 자바",
        author: "우재남",
        coverImage : "https://image.yes24.com/goods/119842978/L"
    },
    {
        title: "세네카, 오늘을 빼앗기고있는그대에게",
        author: "세네카 안나이우스 루키우스",
        coverImage : "https://image.yes24.com/goods/192474512/L"
    },
    {
        title: "싯다르타",
        author: "헤르만 헤세",
        coverImage : "https://image.yes24.com/goods/257435/L"
    },
]

function BookList()
{
    return (
        <div className = {"bookListWrapper"}>
            {books.map((book) =>
            {
                return(
                    <Book
                        title = {book.title}
                        author = {book.author}
                        coverImage = {book.coverImage}
                    />
                    /*<Book
                        title = {"데이터 베이스 실습"}
                        author = {"박우창"}
                        coverImage = {"https://image.yes24.com/goods/97538787/L"}
                    />,
                    <Book
                        title = {"난생 처음 자바"}
                        author = {"우재남"}
                        coverImage = {"https://image.yes24.com/goods/119842978/L"}
                    />*/
                )
            })}

        </div>
    );
}

export default BookList;
