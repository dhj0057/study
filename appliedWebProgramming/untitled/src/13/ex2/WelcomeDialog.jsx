import React from "react";
import FancyBorder from "../ex1/FancyBorder";
import Dialog from "./Dialog";

function WelcomeDialog() {
    return(
        <div className={"Dialog-container"}>
            <Dialog title={"Welcome"} message={"어서오세요"}></Dialog>

        </div>
    );
}

export default WelcomeDialog;