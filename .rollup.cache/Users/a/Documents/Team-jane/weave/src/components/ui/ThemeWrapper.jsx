"use client";
import React, { useEffect } from "react";
import { useTheme } from "@/lib/theme/ThemeContext";
const ThemeWrapper = ({ children }) => {
    const { currentTheme } = useTheme();
    useEffect(() => {
        const html = document.documentElement;
        html.setAttribute("data-theme", currentTheme);
    }, [currentTheme]);
    return <>{children}</>;
};
export default ThemeWrapper;
//# sourceMappingURL=ThemeWrapper.jsx.map