import React from "react";
import Card from "./Card";

function ProfileCard(props) {
    return (
        <Card backgroundColor="white">
            <div className="box"></div>
            <h3>{props.title}</h3>
            <p>{props.text}</p>
        </Card>
    );
}

export default ProfileCard;