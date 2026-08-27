import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
//import TodoApp from "./01/TodoApp";
import reportWebVitals from './reportWebVitals';
import Library from "./03/Library";
import './03/Book.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Library />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
