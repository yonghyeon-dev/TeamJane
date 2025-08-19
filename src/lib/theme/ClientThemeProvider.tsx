"use client";

import { ThemeProvider, ThemeType } from "./ThemeContext";

export const ClientThemeProvider = ({
  children,
  defaultTheme,
  defaultPaletteId,
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  defaultPaletteId?: string;
}) => {
  return (
    <ThemeProvider defaultTheme={defaultTheme} defaultPaletteId={defaultPaletteId}>
      {children}
    </ThemeProvider>
  );
};
