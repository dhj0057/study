import React, {useState} from "react";
import "./Reservation.css";

function Reservation() {
    const [haveBreakfast, setHaveBreakfast] = useState(true);
    const [numberOfGuest, setNumberOfGuest] = useState(1);

    const handleBreakfastChange = (event) => {
        setHaveBreakfast(event.target.checked);
    }

    const handleGuestChange = (event) => {
        setNumberOfGuest(event.target.value);
    }

    const handleSubmit = (event) => {
        alert(`아침 식사 여부: ${haveBreakfast}, 방문객 수: ${numberOfGuest}명`);
        event.preventDefault();
    }

    return(
        <form className={"reservation-form"} onSubmit={handleSubmit}>
            <h2 className={"reservation-title"}>숙소 예약</h2>
            <label className={"reservation-label"}>
                아침식사 여부:
                <input className={"reservation-checkbox"} type={"checkbox"} checked={haveBreakfast} onChange={handleBreakfastChange}/>
            </label>
            <label className={"reservation-label"}>
                방문자 수:
                <input className={"reservation-number"} type={"number"} min={1} value={numberOfGuest} onChange={handleGuestChange}/>
            </label>
            <button className={"reservation-btn"} type={"submit"}>제출</button>
        </form>
    );
}

export default Reservation;