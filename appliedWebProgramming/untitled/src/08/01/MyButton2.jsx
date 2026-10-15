import React from "react";

function MyButton2() {

    const btnClick = (id, event) => {
        console.log(id, event.target, event.x, event.y);
    };

    return(
        <button onClick={(event)=>btnClick(1,event)}>
            버튼을 클릭하세요.(개발자도구(F12) 실행)
        </button>
    );
}

export default MyButton2;