import React, {useState} from "react";
import BoilingVerdict from "./BoilingVerdict";

function Calculator() {
    const [temperature, setTemperature] = useState('');

    const handleChange = (event) => {
        setTemperature(event.target.value);
    }

    return(
        <fieldset>
            <legend>섭씨 온도를 입력하세요</legend>
            <input
                value = {temperature}
                onChange = {handleChange}/>
            <BoilingVerdict
                celsius = {parseFloat(temperature)}/>
        </fieldset>
    )
}

export default Calculator;