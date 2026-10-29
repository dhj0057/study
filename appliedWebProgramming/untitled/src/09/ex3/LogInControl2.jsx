import React, {useState} from "react";
import LogInButton from "../ex2/LogInButton";
import LogOutButton from "../ex2/LogOutButton";
import Greeting from "../ex1/Greeting";
import "./LogInControl2.css";

function LogInControl2() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logInClickListener = () => {
        setIsLoggedIn(true);
    }

    const logOutClickListener = () => {
        setIsLoggedIn(false);
    }

    let button;

    button = isLoggedIn ? <LogOutButton onClick={logOutClickListener}/> : <LogInButton onClick={logInClickListener}/>

    return(
        <div className={isLoggedIn ? "login-control2 logged-in" : "login-control2"}>
            <Greeting isLoggedIn={isLoggedIn} />
            {button}
        </div>
    );

}

export default LogInControl2;