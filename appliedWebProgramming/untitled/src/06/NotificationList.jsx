import React from "react";
import Notification from "./Notification";
import "./NotificationList.css";

const reservedNotifications=[
    {
        id:1,
        message:"안녕하세요,여러분 반갑습니다"
    },
    {
        id:2,
        message:"오늘은 10월을 시작하는 날입니다."
    },
    {
        id:3,
        message:"오늘은 기분은 어떠신가요?"
    },
    {
        id:4,
        message:"만약 우울하시다면 기분 전환될 생각을 해보세요"
    },
    {
        id:5,
        message:"내일은 더 좋은 일이 생길겁니다."
    },
]
var timer;
class NotificationList extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            notifications:[]
        }

    }

    render() {
        const {notifications} = this.state;
        const total = reservedNotifications.length;
        const received = notifications.length;

        return(
            <div className="notification-page">
                <header className="dashboard-header">
                    <span className="dashboard-brand">Notice</span>
                    <span className="dashboard-date">{new Date().toLocaleDateString("ko-KR")}</span>
                </header>
                <main className="dashboard-main">
                    <h1 className="dashboard-heading">Dashboard</h1>
                    <p className="dashboard-description">오늘 도착한 알림을 한눈에 확인하세요.</p>

                    <div className="dashboard-stats">
                        <div className="dashboard-card stat-card">
                            <div className="stat-label">수신</div>
                            <div className="stat-value">{received}</div>
                            <div className="stat-hint">지금까지 도착한 알림</div>
                        </div>
                        <div className="dashboard-card stat-card">
                            <div className="stat-label">대기</div>
                            <div className="stat-value">{total - received}</div>
                            <div className="stat-hint">도착 예정인 알림</div>
                        </div>
                        <div className="dashboard-card stat-card">
                            <div className="stat-label">전체</div>
                            <div className="stat-value">{total}</div>
                            <div className="stat-hint">예약된 알림</div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="notification-card-header">
                            <div>
                                <h2 className="notification-card-title">알림</h2>
                                <p className="notification-card-description">
                                    읽지 않은 알림이 {received}건 있습니다.
                                </p>
                            </div>
                            <span className="notification-badge">{received} / {total}</span>
                        </div>
                        <div className="notification-progress">
                            <div className="notification-progress-bar"
                                 style={{width: `${(received / total) * 100}%`}}/>
                        </div>
                        <div className="notification-card-content">
                            {
                                received === 0 &&
                                <p className="notification-list-empty">새로운 알림이 없습니다.</p>
                            }
                            {
                                notifications.map((notification)=>
                                {
                                    return<Notification key={notification.id}
                                                        id={notification.id}
                                                        time={notification.time}
                                                        message = {notification.message}/>
                                } )
                            }
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    componentDidMount() {
        const {notifications} = this.state;
        timer = setInterval(()=> {
            if(notifications.length< reservedNotifications.length){
                const index = notifications.length;
                notifications.push({
                    ...reservedNotifications[index],
                    time: new Date().toLocaleTimeString("ko-KR")
                });
                this.setState({
                    notifications: notifications
                });
            }else{
                this.setState({
                    notifications:[]
                })
                clearInterval(timer);

            }
        },3000);
    }
    componentWillUnmount() {
        if (timer){
            clearInterval(timer)};
    }

}

export default NotificationList;