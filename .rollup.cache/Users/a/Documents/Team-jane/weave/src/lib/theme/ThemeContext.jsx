"use client";
import React, { createContext, useContext, useState } from "react";
import { THEME_CONSTANTS } from "./constants";
const ThemeContext = createContext(undefined);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
export const ThemeProvider = ({ children }) => {
    var _a;
    const [currentTheme, setCurrentTheme] = useState("dark");
    const [selectedPaletteId, setSelectedPaletteId] = useState("custom3");
    // 기본 색상 설정 (custom3 팔레트)
    const defaultColors = ((_a = THEME_CONSTANTS.colorPalettes.find((p) => p.id === "custom3")) === null || _a === void 0 ? void 0 : _a.colors) || {
        primary: "#EC4899",
        secondary: "#DB2777",
        default: "#BE185D",
    };
    const [currentColors, setCurrentColors] = useState(defaultColors);
    const setTheme = (theme) => {
        setCurrentTheme(theme);
    };
    const setColors = (colors) => {
        setCurrentColors(colors);
    };
    const handleSetSelectedPaletteId = (id) => {
        const palette = THEME_CONSTANTS.colorPalettes.find((p) => p.id === id);
        if (palette) {
            setSelectedPaletteId(id);
            setCurrentColors(palette.colors);
        }
    };
    return (<ThemeContext.Provider value={{
            currentTheme,
            setTheme,
            currentColors,
            setColors,
            selectedPaletteId,
            setSelectedPaletteId: handleSetSelectedPaletteId,
        }}>
      {children}
    </ThemeContext.Provider>);
};
//# sourceMappingURL=ThemeContext.jsx.map