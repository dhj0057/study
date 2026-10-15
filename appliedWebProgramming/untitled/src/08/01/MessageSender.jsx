import React, { useState } from "react";
import "./MessageSender.css";

function MessageSender() {
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSend = () => {
        alert(`전송된 메시지: ${message}`);
        setMessage("");
    };

    return (
        <div className="sender">
            <h2>메시지 전송기</h2>
            <div className="sender-row">
                <input
                    className="sender-input"
                    type="text"
                    value={message}
                    onChange={handleChange}
                />
                <button className="sender-button" onClick={handleSend}>
                    전송
                </button>
            </div>
            <p className="sender-preview">미리보기: {message}</p>
        </div>
    );
}

export default MessageSender;