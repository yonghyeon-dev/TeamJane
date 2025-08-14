"use client";

import { ThemeProvider } from "./ThemeContext";

export const ClientThemeProvider = ({
  children,
  defaultTheme,
  defaultPaletteId,
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultPaletteId?: string;
}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
