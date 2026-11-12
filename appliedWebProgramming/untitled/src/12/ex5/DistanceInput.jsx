import React from "react";
import "./DistanceCalculator.css";

const unitNames = {
    km: "킬로미터",
    mi: "마일",
};

function DistanceInput(props) {
    const unit = props.unit || "km";

    const handleChange = (event) => {
        props.onDistanceChange(event.target.value);
    };

    return (
        <fieldset className={`distance-fieldset unit-${unit}`}>
            <legend className="distance-legend">
                거리를 입력해 주세요 (단위: {unitNames[unit]})
            </legend>
            <input
                className="distance-input"
                type="text"
                placeholder={unit === "mi" ? "마일 (mi) 입력..." : "킬로미터 (km) 입력..."}
                value={props.distance}
                onChange={handleChange}
            />
        </fieldset>
    );
}

export default DistanceInput;
