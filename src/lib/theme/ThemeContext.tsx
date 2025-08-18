"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { THEME_CONSTANTS } from "./constants";
import type { ColorSelection } from "./types";

export type ThemeType = "dark" | "white";

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  currentColors: ColorSelection;
  setColors: (colors: ColorSelection) => void;
  selectedPaletteId: string;
  setSelectedPaletteId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("white");
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>("custom1");

  // 기본 색상 설정 (custom1 팔레트)
  const defaultColors = THEME_CONSTANTS.colorPalettes.find(
    (p) => p.id === "custom1"
  )?.colors || {
    primary: "#4ECDC4",
    secondary: "#45B7D1", 
    default: "#1A535C",
  };

  const [currentColors, setCurrentColors] =
    useState<ColorSelection>(defaultColors);

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  const setColors = (colors: ColorSelection) => {
    setCurrentColors(colors);
  };

  const handleSetSelectedPaletteId = (id: string) => {
    const palette = THEME_CONSTANTS.colorPalettes.find((p) => p.id === id);
    if (palette) {
      setSelectedPaletteId(id);
      setCurrentColors(palette.colors);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        currentColors,
        setColors,
        selectedPaletteId,
        setSelectedPaletteId: handleSetSelectedPaletteId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
