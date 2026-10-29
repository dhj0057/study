import React, {useState} from "react";
import Toolbar from "./Toolbar";
import dog2Img from "./dog_character.png"
import "./LandingPage.css";

function LandingPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginClick = () => {
        setIsLoggedIn(true);
    }

    const logoutClick = () => {
        setIsLoggedIn(false);
    }

    return(
        <div>
            <Toolbar isLoggedIn={isLoggedIn} loginClick={loginClick} logoutClick={logoutClick}/>
            <hr width={"50%"}/>
            <div>
                9장 조건부 렌더링 실습 화면입니다.
                <img src={dog2Img}  width="200"/>
            </div>
        </div>
    );
}

export default LandingPage;