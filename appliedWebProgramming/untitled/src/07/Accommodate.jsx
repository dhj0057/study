import React, { useEffect, useState } from "react";
import useCounter from "./useCounter";
import "./Accommodate.css";

const MAX_CAPACITY = 10;

function Accommodate() {
    const [count, increaseCount, decreaseCount] = useCounter(0);

    const [isFull, setIsFull] = useState(false);

    useEffect(() => {
        console.log("========= useEffect 확인용 ============");
        console.log("useEffect 실행됨: 컴포넌트가 마운트될때, 업데이트 될때");
        console.log(`isFull: ${isFull}`);
    });

    useEffect(() => {
        setIsFull(count >= MAX_CAPACITY);
        console.log(`Current count Value: ${count}`);
    }, [count]);

    // 화면 표시용 상태: 여유 / 혼잡(70% 이상) / 만석
    const level = isFull ? "full" : count >= MAX_CAPACITY * 0.7 ? "warn" : "ok";
    const label = { ok: "여유", warn: "혼잡", full: "만석" }[level];

    return (
        <div className="acc" data-level={level}>
            <div className="acc__card">
                <div className="acc__head">
                    <h1 className="acc__title">수용시설 현황</h1>
                    <span className="acc__badge">{label}</span>
                </div>

                <p className="acc__count">
                    <span className="acc__num">{count}</span>
                    <span className="acc__max">/ {MAX_CAPACITY}명</span>
                </p>
                <p className="acc__desc">{`현재 총 ${count}명 수용중입니다.`}</p>

                <div className="acc__seats">
                    {Array.from({ length: MAX_CAPACITY }, (_, i) => (
                        <span
                            key={i}
                            className={`acc__seat ${i < count ? "acc__seat--on" : ""}`}
                        />
                    ))}
                </div>

                <div className="acc__actions">
                    <button
                        className="acc__btn acc__btn--in"
                        onClick={increaseCount}
                        disabled={isFull}
                    >
                        수용시설에 입장
                    </button>
                    <button
                        className="acc__btn"
                        onClick={decreaseCount}
                        disabled={count === 0}
                    >
                        수용시설에 퇴장
                    </button>
                </div>

                {isFull && <p className="acc__alert">수용시설에 정원이 가득 찼습니다.</p>}
            </div>
        </div>
    );
}

export default Accommodate;
