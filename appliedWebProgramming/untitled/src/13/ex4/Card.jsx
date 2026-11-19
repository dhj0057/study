import React from 'react';
import "./Card.css"

function Card(props) {
    const { title, backgroundColor, children } = props;

    return (
        <div className="card" style={{ backgroundColor: backgroundColor }}>
            {title && (<h1>{title}</h1>)}
            {children}
        </div>
    );
}
export default Card;