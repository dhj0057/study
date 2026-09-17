import React from "react";
import UserInfo from "./UserInfo";
import "./UserInfoList.css";

const users = [
    {
        name : "Jang Wonyoung",
        avatarUrl : "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_1280.png",
        comment : "Positive mindset, lucky vibe ~"
    },
    {
        name : "Ahn Youjin",
        avatarUrl : "https://cdn.pixabay.com/photo/2025/08/28/11/47/user-9801864_1280.png",
        comment : "I think likes me. ^^"
    },
    {
        name : "Park Liz",
        avatarUrl : "https://cdn.pixabay.com/photo/2025/08/28/11/47/user-9801872_1280.png",
        comment : "Sleeping is the best ~~~~~~~~"
    },
]

function UserInfoList()
{
    const currentDate = new Date();
    return(
        <div>
            {
                users.map((user) =>
                {
                    return(
                        <div className={"comment"}>
                            <UserInfo user = {user}/>
                            <div className={"comment-text"}>
                                {users.comment}
                            </div>
                            <div className={"comment-date"}>
                                {currentDate.toDateString()}
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default UserInfoList;