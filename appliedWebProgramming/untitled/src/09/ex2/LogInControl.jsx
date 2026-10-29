import React, {useState} from "react";
import LogInButton from "./LogInButton";
import LogOutButton from "./LogOutButton";
import "./LogInControl.css";

function LogInControl() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logInClickListener = () => {
        setIsLoggedIn(true);
    }

    const logOutClickListener = () => {
        setIsLoggedIn(false);
    }

    let button;

    if(isLoggedIn){
        button = <LogOutButton onClick={logOutClickListener}/>
    }else {
        button = <LogInButton onClick={logInClickListener}/>
    }

    return (
        <div className={isLoggedIn ? "login-control logged-in" : "login-control"}>
            <h2>{isLoggedIn ? "로그인 상태입니다" : "로그아웃 상태입니다"}</h2>
            {button}
        </div>
    );
}

export default LogInControl;