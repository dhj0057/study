import React from "react";
import Card from "./Card";

function profileCard(props) {
    return (
        <Card title="Inje Lee" backgroundColor="#AEAEAE">
            <p>안녕하세요, 소플입니다.</p>
            <p>저는 리액트를 사용해서 개발하고 있습니다.</p>
        </Card>
    );
}

export default profileCard;