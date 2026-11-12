import React from "react";
import "./DistanceCalculator.css";

const MARATHON_KM = 42.195;

function DistanceVerdict(props) {
    const km = props.km;
    const isValid = !Number.isNaN(km) && km >= 0;
    const isMarathon = isValid && km >= MARATHON_KM;
    const status = isMarathon ? "reached" : "not-reached";

    // 마라톤 풀코스 대비 진행률 (0~100%)
    const percent = isValid ? Math.min((km / MARATHON_KM) * 100, 100) : 0;

    let message = "거리를 입력해 주세요.";
    if (isMarathon) {
        message = "마라톤 풀코스 이상입니다.";
    } else if (isValid) {
        const remain = Math.round((MARATHON_KM - km) * 1000) / 1000;
        message = `마라톤 풀코스까지 ${remain}km 남았습니다.`;
    }

    return (
        <div className={`distance-verdict ${status}`}>
            <div className="distance-track-card">
                <div className="distance-track">
                    <div className="distance-track-fill" style={{ width: `${percent}%` }} />
                    <span className="distance-runner" style={{ left: `${percent}%` }}>🏃</span>
                    <span className="distance-flag">🏁</span>
                </div>
                <div className="distance-track-labels">
                    <span>0km</span>
                    <span>{Math.round(percent)}%</span>
                    <span>42.195km</span>
                </div>
            </div>
            <p className={`distance-verdict-text ${status}`}>{message}</p>
        </div>
    );
}

export default DistanceVerdict;
