import React, { useEffect, useState } from 'react';
import './Button.css';

const Button = ({ text }) => {
    const [theme, setTheme] = useState("light"); // Standard-Theme ist light -> Die Seite ist zu beginn hell

    // Theme wird auch im localStorage gespeichert, damit die Seite bei einem erneutem Aufrufen weiterhin im gewünschtem Stil bleibt
    if (theme === "light" && localStorage.getItem("Theme") === "#333") {
        setTheme("dark");
    }

    // Das schalten von einem Theme zum anderem.
    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            localStorage.setItem("Theme", "#333");
        } else {
            setTheme("light");
            localStorage.setItem("Theme", "#fff");
        }
    }

    // Die <body> Elementklasse wird zum Wert vom "theme" useState umbenannt. Mithilfe der Darkmode.css werden dann die Farben umgeschaltet.
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // Der <button> befindet sich in der Navbar-Komponente
    return (
        <>
            <button id="customButton" onClick={toggleTheme}>{text}</button>
        </>
    );
};

export default Button;