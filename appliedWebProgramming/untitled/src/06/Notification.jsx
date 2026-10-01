import React from "react";
import "./Notification.css";
//클래스형 컴포넌트
class Notification extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="notification">
                <span className="notification-dot"/>
                <span className="notification-message">
                    {this.props.message}
                </span>
                <span className="notification-number">
                    No. {String(this.props.id).padStart(2, "0")}
                </span>
                <span className="notification-meta">
                    {this.props.time} 수신
                </span>
            </div>
        );
    }
    componentDidMount() {
        console.log(`${this.props.id}: componentDidMount called`);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(`${this.props.id}: componentDidUpdate called`);
    }
    componentWillUnmount() {
        console.log(`${this.props.id}: componentWillUnmount called`);
    }
}


export default Notification;
