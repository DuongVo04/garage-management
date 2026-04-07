import { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../theme";

const ThemeContext = createContext({ mode: "light", toggleTheme: () => {} });

export function ThemeModeProvider({ children }) {
    const [mode, setMode] = useState(
        () => localStorage.getItem("theme-mode") || "light"
    );

    const toggleTheme = () =>
        setMode((m) => {
            const next = m === "light" ? "dark" : "light";
            localStorage.setItem("theme-mode", next);
            return next;
        });

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export const useThemeMode = () => useContext(ThemeContext);
