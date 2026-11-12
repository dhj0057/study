import React, { useState } from "react";
import TemperatureInput from "./TemperatureInput";
import BoilingVerdict from "./BoilingVerdict";
import "./Calculator.css";

function toCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return "";
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

function Calculator() {
    const [temperature, setTemperature] = useState("");
    const [scale, setScale] = useState("c");

    const handleCelsiusChange = (temperature) => {
        setTemperature(temperature);
        setScale("c");
    };

    const handleFahrenheitChange = (temperature) => {
        setTemperature(temperature);
        setScale("f");
    };

    // 어느 칸에 입력하든 tryConvert로 반대 단위를 계산
    const celsius =
        scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit =
        scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    const celsiusNum = parseFloat(celsius);
    const isBoiling = !Number.isNaN(celsiusNum) && celsiusNum >= 100;

    return (
        <div className={`calculator-wrapper ${isBoiling ? "is-boiling" : "is-cool"}`}>
            <TemperatureInput
                scale="c"
                temperature={celsius}
                onTemperatureChange={handleCelsiusChange}
            />
            <TemperatureInput
                scale="f"
                temperature={fahrenheit}
                onTemperatureChange={handleFahrenheitChange}
            />
            {/* 변환된 섭씨 값을 그대로 넘겨 화씨로 입력해도 판정이 연동됨 */}
            <BoilingVerdict celsius={celsiusNum} />
        </div>
    );
}

export default Calculator;
