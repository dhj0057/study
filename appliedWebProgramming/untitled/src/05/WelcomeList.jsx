import React from "react";
import Welcome from "./Welcome";
import "./WelcomeList.css";

function WelcomeList() {
    return (
        <div className="welcome-list">
            <Welcome name="장영서" /><br/>
            <Welcome name="도형준" /><br/>
            <Welcome name="반용학" /><br/>
        </div>
    );
}

export default WelcomeList;