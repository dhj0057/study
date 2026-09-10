import React from "react";
import "./Button.css";

function Button(props)
{
    return(
        <button className = {`bg-${props.color}`}>
            <b>{props.children}</b>
        </button>
    );
}

export default Button;