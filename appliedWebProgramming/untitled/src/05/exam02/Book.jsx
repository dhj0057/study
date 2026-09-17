import React from "react";

function Book(props){
    return(
        <div className = {"wrapper"}>
            <div>
                <img
                    className = {"image"}
                    src = {props.coverImage}
                    alt = {`${props.title} book cover`}
                    />
            </div>
            <div className = {"contentContainer"}>
                <span className = {"titleText"}>{props.title}</span>
                <span className={"authorText"}>{props.author}</span>
            </div>
        </div>
    );
}

export default Book;