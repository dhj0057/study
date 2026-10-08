import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//  import App from './App';
//  import TodolistApp from './01/TodoListApp';
// import Library from "./03/enhanced_css/Library";
// import "./03/enhanced_css/Book.css";
//import Clock from "./04/Clock";
import reportWebVitals from './reportWebVitals'
//import UserInfoList from "./05/exam03/UserInfoList";
//import ConfirmDialog from "./04/ConfirmDialog";
//import ConfirmDialogList from "./04/ConfirmDialogList";
//import WelcomeList from "./05/exam01/WelcomeList";
//import BookList from "./05/exam02/BookList"
//import NotificationList from "./06/NotificationList";
//import UseState from "./07/useState";
//import UseState from "./07/01/useState";
//import UseState2 from "./07/01/useState2";
//import TextingWithFocusButton from "./07/02/TextinputWithFocusButton";
import TextinputWithFocusButton from "./07/02/TextinputWithFocusButton";
import Accommodate from "./07/Accommodate";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Accommodate/>
    </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
