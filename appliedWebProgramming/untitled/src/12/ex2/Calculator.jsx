import React, { useState } from "react";
import BoilingVerdict from "./BoilingVerdict";
import "./Calculator.css";

function Calculator() {
    const [temperature, setTemperature] = useState('');

    const handleChange = (event) => {
        setTemperature(event.target.value);
    };

    const celsius = parseFloat(temperature);
    const isBoiling = !Number.isNaN(celsius) && celsius >= 100;

    return (
        <fieldset className={`calculator-fieldset ${isBoiling ? "is-boiling" : "is-cool"}`}>
            <legend className="calculator-legend">섭씨 온도를 입력하세요 (°C)</legend>
            <input
                className="temperature-input"
                type="number"
                placeholder="예: 100"
                value={temperature}
                onChange={handleChange}
            />
            <BoilingVerdict celsius={celsius} />
        </fieldset>
    );
}

export default Calculator;