import React, { useState } from "react";
import "./Calculator.css";

const scaleNames = {
    c: "섭씨",
    f: "화씨",
};

function TemperatureInput(props) {
    const [temperature, setTemperature] = useState("");

    // 상위 컴포넌트(Calculator)에서 temperature와 onTemperatureChange를 내려줄 때와
    // 자체 useState를 사용할 때 모두 동작하도록 호환 처리
    const currentTemp = props.temperature !== undefined ? props.temperature : temperature;
    const scale = props.scale || "c";

    const handleChange = (event) => {
        if (props.onTemperatureChange) {
            props.onTemperatureChange(event.target.value);
        } else {
            setTemperature(event.target.value);
        }
    };

    return (
        <fieldset className={`temperature-fieldset scale-${scale}`}>
            <legend className="temperature-legend">
                온도를 입력해 주세요 (단위: {scaleNames[scale]})
            </legend>
            <input
                className="temperature-input"
                type="text"
                placeholder={scale === "f" ? "화씨 온도 (°F) 입력..." : "섭씨 온도 (°C) 입력..."}
                value={currentTemp}
                onChange={handleChange}
            />
        </fieldset>
    );
}

export default TemperatureInput;