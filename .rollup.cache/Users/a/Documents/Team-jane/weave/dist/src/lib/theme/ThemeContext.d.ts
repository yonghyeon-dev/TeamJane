import React, { ReactNode } from "react";
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
export declare const useTheme: () => ThemeContextType;
interface ThemeProviderProps {
    children: ReactNode;
}
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
export {};
