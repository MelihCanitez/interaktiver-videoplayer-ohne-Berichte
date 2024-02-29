import React, { useEffect, useState } from 'react';
import './Button.css';

const Button = ({ text }) => {
    const [theme, setTheme] = useState("light");

    if (theme === "light" && localStorage.getItem("Theme") === "#333") {
        setTheme("dark");
    }

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            localStorage.setItem("Theme", "#333");
        } else {
            setTheme("light");
            localStorage.setItem("Theme", "#fff");
        }
    }

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <>
            <button id="customButton" onClick={toggleTheme}>{text}</button>
        </>
    );
};

export default Button;