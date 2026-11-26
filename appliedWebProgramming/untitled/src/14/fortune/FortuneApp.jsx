import { useState, useCallback } from "react";
import ThemeContext from "../ThemeContext";
import FortuneHeader from "./FortuneHeader";
import FortuneContent from "./FortuneContent";
import "./Fortune.css";

function FortuneApp(props) {
    const [theme, setTheme] = useState("light");

    const toggleTheme = useCallback(() => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("light");
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={"fortune-app " + theme}>
                <FortuneHeader />
                <FortuneContent />
            </div>
        </ThemeContext.Provider>
    );
}

export default FortuneApp;
