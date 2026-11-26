import { useState, useContext } from "react";
import ThemeContext from "../ThemeContext";

const zodiacs = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

const totalMessages = [
    "막혔던 일이 술술 풀리는 하루입니다. 미뤄 둔 일을 시작해 보세요.",
    "작은 행운이 연달아 찾아옵니다. 주변을 잘 살펴보세요.",
    "서두르기보다 한 박자 쉬어 가면 더 좋은 결과가 있습니다.",
    "새로운 사람과의 만남이 좋은 기회로 이어질 수 있습니다.",
    "꾸준히 해 온 노력이 인정받는 날입니다. 자신감을 가지세요.",
    "작은 실수가 생길 수 있으니 한 번 더 확인하는 습관이 도움이 됩니다.",
    "생각지 못한 곳에서 기쁜 소식이 들려옵니다.",
    "오늘은 계획을 세우기에 좋은 날입니다. 목표를 정리해 보세요.",
];

const adviceMessages = [
    "웃는 얼굴이 행운을 부릅니다.",
    "오늘 할 일은 오늘 끝내세요.",
    "물 한 잔의 여유를 가지세요.",
    "고마운 사람에게 먼저 연락해 보세요.",
    "작은 약속도 꼭 지키세요.",
    "새로운 것에 도전해 보세요.",
];

const luckyColors = ["빨강", "주황", "노랑", "초록", "파랑", "남색", "보라", "흰색", "분홍"];

// 이름 + 띠 + 날짜로 숫자를 만들어서, 같은 날에는 같은 결과가 나오게 함
function makeSeed(text) {
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
        seed = (seed * 31 + text.charCodeAt(i)) % 100000;
    }
    return seed;
}

function pick(list, seed, offset) {
    return list[(seed + offset * 7) % list.length];
}

function stars(score) {
    return "★".repeat(score) + "☆".repeat(5 - score);
}

function FortuneContent(props) {
    const { theme } = useContext(ThemeContext);
    const [name, setName] = useState("");
    const [zodiac, setZodiac] = useState(zodiacs[0]);
    const [result, setResult] = useState(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleZodiacChange = (event) => {
        setZodiac(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (name.trim() === "") {
            alert("이름을 입력해 주세요.");
            return;
        }

        const today = new Date().toDateString();
        const seed = makeSeed(name.trim() + zodiac + today);

        setResult({
            name: name.trim(),
            zodiac: zodiac,
            total: pick(totalMessages, seed, 0),
            love: (seed % 5) + 1,
            money: ((seed >> 2) % 5) + 1,
            health: ((seed >> 4) % 5) + 1,
            color: pick(luckyColors, seed, 3),
            number: (seed % 45) + 1,
            advice: pick(adviceMessages, seed, 5),
        });
    }

    return (
        <main className="fortune-main">
            <form className="fortune-form" onSubmit={handleSubmit}>
                <h2>{theme === "light" ? "☀️" : "🌙"} 나의 운세 확인하기</h2>
                <label>
                    이름
                    <input type="text" value={name} onChange={handleNameChange} placeholder="이름을 입력하세요" />
                </label>
                <label>
                    띠
                    <select value={zodiac} onChange={handleZodiacChange}>
                        {zodiacs.map((z) => (
                            <option key={z} value={z}>{z}띠</option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="fortune-btn">운세 보기</button>
            </form>

            {result && (
                <section className="fortune-card">
                    <h2>{result.name}님({result.zodiac}띠)의 오늘의 운세</h2>
                    <p className="fortune-total">{result.total}</p>
                    <ul className="fortune-scores">
                        <li><span>💕 애정운</span><span className="stars">{stars(result.love)}</span></li>
                        <li><span>💰 금전운</span><span className="stars">{stars(result.money)}</span></li>
                        <li><span>💪 건강운</span><span className="stars">{stars(result.health)}</span></li>
                    </ul>
                    <div className="fortune-lucky">
                        <div>행운의 색<strong>{result.color}</strong></div>
                        <div>행운의 숫자<strong>{result.number}</strong></div>
                    </div>
                    <p className="fortune-advice">오늘의 한마디: {result.advice}</p>
                </section>
            )}
        </main>
    );
}

export default FortuneContent;
