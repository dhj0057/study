import React from "react";
import catImg from "./imgs/cat_character.png";
import dogImg from "./imgs/dog_character.png";
import koalaImg from "./imgs/koala_character.png";
import meercatImg from "./imgs/meercat_character.png";
import rabbitImg from "./imgs/rabbit_character.png";
import "./AttendanceCardBook.css";
const students = [
    {
        id: 1,
        name: "장원영",
        grade: 1,
        major: "인공지능소프트웨어",
        avatar: catImg
    },
    {
        id: 2,
        name: "안유진",
        grade: 2,
        major: "메카트로닉스",
        avatar: dogImg
    },
    {
        id: 3,
        name: "김리즈",
        grade: 1,
        major: "인공지능소프트웨어",
        avatar: koalaImg
    },
    {
        id: 4,
        name: "박레이",
        grade: 3,
        major: "스마트정보통신",
        avatar: meercatImg
    },
    {
        id: 5,
        name: "이가을",
        grade: 4,
        major: "시각디자인",
        avatar: rabbitImg
    },
    {
        id: 6,
        name: "최이서",
        grade: 1,
        major: "메타버스콘텐츠",
        avatar: catImg
    }
];

function AttendanceCardBook() {
    return(
        <div className={"attendance-container"}>
            <h2 className={"attendance-title"}>학생 출석부</h2>
            <div className={"attendance-grid"}>
                {students.map(student => (
                    <div key={student.id} className={"student-card"}>
                        <div className={"avatar-wrapper"}>
                            <img src={student.avatar} className={"avatar-img"} alt={student.name}/>
                        </div>
                        <div className={"student-info"}>
                            <h3 className={"student-name"}>{student.name}</h3>
                            <p className={"student-details"}>
                                <span className={"grade-badge"}>{student.grade}학년</span>
                                <span className={"major-text"}>{student.major}</span>
                            </p>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    );

}

export default AttendanceCardBook;