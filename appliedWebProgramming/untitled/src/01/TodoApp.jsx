import React, { useState } from 'react';

import './css/TodoListApp.css';

function TodoList() {

    const [todos, setTodos] = useState([]);

    const [input, setInput] = useState('');

    // 할 일 추가 함수

    const handleAddTask = () => {

        if (input.trim() !== '') {

            setTodos([...todos, input]);

            setInput('');

        }

    };

    // 엔터 키 감지 함수

    const handleKeyDown = (e) => {

        if (e.key === 'Enter') {

            handleAddTask();

        }

    };

    // 🌟 추가된 부분: 할 일 삭제 함수 (더블클릭 시 실행)

    const handleDeleteTask = (indexToDelete) => {

        // filter를 사용하여 클릭한 인덱스와 다른 항목들만 남겨서 새로운 배열 생성

        const newTodos = todos.filter((todo, index) => index !== indexToDelete);

        setTodos(newTodos);

    };

    return (
        <div className="todo-container">
            <h2>My Groceries</h2>

            <div className="input-group">
                <input

                    value={input}

                    onChange={(e) => setInput(e.target.value)}

                    onKeyDown={handleKeyDown}

                    placeholder="Add a new item..."

                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>

            <ul className="todo-list">

                {todos.map((todo, index) => (
                    <li

                        key={index}

                        onDoubleClick={() => handleDeleteTask(index)} /* 🌟 추가: 더블클릭 이벤트 연결 */

                        title="더블클릭하여 삭제" /* 마우스를 올리면 힌트 표시 */

                        style={{ cursor: 'pointer' }} /* 마우스 커서를 손가락 모양으로 변경 */
                    >

                        {todo}
                    </li>

                ))}
            </ul>
        </div>

    );

}

export default TodoList;
