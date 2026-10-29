import React, {useState} from "react";
import WarningBanner from "./WarningBanner";
import "./MainPage.css"

function MainPage() {
    const [showWarning, setShowWarning] = useState(false);

    const btnListener = () => {
        setShowWarning(prevShowWarning => !prevShowWarning);
    }

    return(
        <div className="container">
            <WarningBanner warning = {showWarning}/>
            <button onClick={btnListener} className={`toggle-btn ${showWarning ? "active" : ""}`}>
                {showWarning ? "🙈 감추기" : "👀 보이기"}
            </button>
        </div>
    )
}

export default MainPage;