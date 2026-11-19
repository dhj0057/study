import React from "react";
import ProfileCard from "./ProfileCard";
import "./Card.css";

const list1 = [
    { id: 1, title: "카드 1", text: "설명입니다" },
    { id: 2, title: "카드 2", text: "설명입니다" },
    { id: 3, title: "카드 3", text: "설명입니다" },
    { id: 4, title: "카드 4", text: "설명입니다" },
    { id: 5, title: "카드 5", text: "설명입니다" },
    { id: 6, title: "카드 6", text: "설명입니다" },
];

const list2 = [
    { id: 1, title: "카드 1", text: "설명입니다" },
    { id: 2, title: "카드 2", text: "설명입니다" },
    { id: 3, title: "카드 3", text: "설명입니다" },
    { id: 4, title: "카드 4", text: "설명입니다" },
    { id: 5, title: "카드 5", text: "설명입니다" },
    { id: 6, title: "카드 6", text: "설명입니다" },
];

function ProfileList() {
    return (
        <div className="container">
            <h2>섹션 1</h2>
            <div className="row">
                {list1.map((item) => (
                    <ProfileCard key={item.id} title={item.title} text={item.text} />
                ))}
            </div>

            <h2>섹션 2</h2>
            <div className="row">
                {list2.map((item) => (
                    <ProfileCard key={item.id} title={item.title} text={item.text} />
                ))}
            </div>
        </div>
    );
}

export default ProfileList;