import React, { createContext, useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../theme";

export const ThemeContext = createContext();

export default function CustomThemeProvider({ children }) {
    const [mode, setMode] = useState("light");

    useEffect(() => {
        const saved = localStorage.getItem("ff_theme");
        if (saved) setMode(saved);
        else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setMode("dark");
        }
    }, []);

    const toggleTheme = () => {
        const next = mode === "light" ? "dark" : "light";
        setMode(next);
        localStorage.setItem("ff_theme", next);
    };

    const theme = mode === "light" ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
