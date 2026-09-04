import React from "react";
import "./Clock.css";

function Clock() {
    return (
        <div className="clock-container">
            <div className="clock-card">
                <h1 className="clock-title">인공지능소프트웨어과</h1>

                <p className="clock-text">현재 시각은</p>
                <h2 className="time-highlight">
                    {new Date().toLocaleTimeString()}
                </h2>
                <p className="clock-text">입니다.</p>

            </div>
        </div>
    );
}

export default Clock;