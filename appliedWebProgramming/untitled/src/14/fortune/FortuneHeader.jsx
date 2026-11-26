import { useContext } from "react";
import ThemeContext from "../ThemeContext";

function FortuneHeader(props) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const today = new Date();
    const dateText = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월 " + today.getDate() + "일";

    return (
        <header className="fortune-header">
            <div>
                <h1 className="fortune-logo">🔮 오늘의 운세</h1>
                <p className="fortune-date">{dateText}</p>
            </div>
            <button className="theme-btn" onClick={toggleTheme}>
                {theme === "light" ? "🌙 다크 모드" : "☀️ 라이트 모드"}
            </button>
        </header>
    );
}

export default FortuneHeader;
