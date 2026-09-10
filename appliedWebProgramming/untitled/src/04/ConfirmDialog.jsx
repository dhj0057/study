import React from "react";
import Button from "./Button";
import "./ConfirmDialog.css";

function ConfirmDialog(props)
{
    return(
        <div className={`div-bg-ivory`}>
            <p>을 확인한 후 버튼을 눌러주세요.</p>
            <br/>
            <Button color = {`green`}>확인</Button> &nbsp;
            <Button color = {`blue`}>취소</Button> &nbsp;
            <Button color = {`red`}>초기화</Button> &nbsp;
        </div>
    );
}

export default ConfirmDialog;