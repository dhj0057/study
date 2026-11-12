import React, { useState } from "react";
import DistanceInput from "./DistanceInput";
import DistanceVerdict from "./DistanceVerdict";
import "./DistanceCalculator.css";

const KM_PER_MILE = 1.609344;

function toKm(mile) {
    return mile * KM_PER_MILE;
}

function toMile(km) {
    return km / KM_PER_MILE;
}

function tryConvert(distance, convert) {
    const input = parseFloat(distance);
    if (Number.isNaN(input)) {
        return "";
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

function DistanceCalculator() {
    const [distance, setDistance] = useState("");
    const [unit, setUnit] = useState("km");

    const handleKmChange = (distance) => {
        setDistance(distance);
        setUnit("km");
    };

    const handleMileChange = (distance) => {
        setDistance(distance);
        setUnit("mi");
    };

    // 어느 칸에 입력하든 tryConvert로 반대 단위를 계산
    const km = unit === "mi" ? tryConvert(distance, toKm) : distance;
    const mile = unit === "km" ? tryConvert(distance, toMile) : distance;

    return (
        <div className="distance-wrapper">
            <DistanceInput unit="km" distance={km} onDistanceChange={handleKmChange} />
            <DistanceInput unit="mi" distance={mile} onDistanceChange={handleMileChange} />
            {/* 변환된 km 값을 넘겨 마일로 입력해도 판정이 연동됨 */}
            <DistanceVerdict km={parseFloat(km)} />
        </div>
    );
}

export default DistanceCalculator;
