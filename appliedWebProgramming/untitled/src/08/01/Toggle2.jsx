import React, {useState} from "react";

function Toggle2() {
    const [isToggleOn, setIsToggleOn] = useState(true);

    // function handleClick() {
    //     setIsToggleOn((isToggleOn) => !isToggleOn);
    // }

    const handleClick = () => {
        setIsToggleOn((isToggleOn) => !isToggleOn);
    }

    return(
        <button onClick={handleClick}>
            Button {isToggleOn ? 'ON' : 'OFF'}
        </button>
    );
}

export default Toggle2;