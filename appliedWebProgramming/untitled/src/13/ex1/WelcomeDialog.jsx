import React from "react";
import FancyBorder from "./FancyBorder";

function WelcomeDialog() {
    return(
        <div className={"Dialog-container"}>
            <FancyBorder color={"blue"}>
                <h1 className={"Dialog-title"}>
                    어서오세요.
                </h1>
                <p className={"Dialog-message"}>
                    우리 사이트에 방문해 주셔서 감사합니다.
                </p>
            </FancyBorder>
            <FancyBorder color={"blue"}>
                <h1 className={"Dialog-title"}>
                    반갑습니다.
                </h1>
                <p className={"Dialog-message"}>
                    오늘은 수학능력시험으로 인해 8:30에 재난문자가 왔어요.
                </p>
            </FancyBorder>
        </div>
    );
}

export default WelcomeDialog;