import React,{useRef} from "react";

function TextinputWithFocusButton(){
    const inputElement = useRef(null);

    const onButtonClick = ()=> {
        inputElement.current.focus();
    };

    return(
        <div>
            <input ref={inputElement} type="text"/>&nbsp;&nbsp;&nbsp;
            <button onClick={onButtonClick}>Focus the input element</button>
        </div>
    );
}

export default TextinputWithFocusButton;