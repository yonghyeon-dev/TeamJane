const config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Primary colors - using CSS variables for dynamic theming
                primary: {
                    background: "var(--color-primary-background)",
                    surface: "var(--color-primary-surface)",
                    surfaceSecondary: "var(--color-primary-surfaceSecondary)",
                    surfaceHover: "var(--color-primary-surfaceHover)",
                    surfacePressed: "var(--color-primary-surfacePressed)",
                    border: "var(--color-primary-border)",
                    borderSecondary: "var(--color-primary-borderSecondary)",
                },
                // Text colors - using CSS variables for dynamic theming
                text: {
                    primary: "var(--color-text-primary)",
                    secondary: "var(--color-text-secondary)",
                    tertiary: "var(--color-text-tertiary)",
                    accent: "var(--color-text-accent)",
                    muted: "var(--color-text-muted)",
                    inverse: "var(--color-text-inverse)",
                },
                // Status colors - using CSS variables for dynamic theming
                status: {
                    success: "var(--color-status-success)",
                    warning: "var(--color-status-warning)",
                    error: "var(--color-status-error)",
                    info: "var(--color-status-info)",
                    progress: "var(--color-status-progress)",
                },
                // Accent colors - using CSS variables for dynamic theming
                accent: {
                    yellow: "var(--color-accent-yellow)",
                    orange: "var(--color-accent-orange)",
                    blue: "var(--color-accent-blue)",
                    purple: "var(--color-accent-purple)",
                    green: "var(--color-accent-green)",
                },
                gradient: {
                    primary: "linear-gradient(to right, #FF6B6B, #4ECDC4)",
                    "primary-start": "#FF6B6B",
                    "primary-end": "#4ECDC4",
                },
            },
            fontFamily: {
                primary: [
                    "Inter Variable",
                    "SF Pro Display",
                    "-apple-system",
                    "system-ui",
                    "Segoe UI",
                    "Roboto",
                    "Oxygen",
                    "Ubuntu",
                    "Cantarell",
                    "Open Sans",
                    "Helvetica Neue",
                    "sans-serif",
                ],
            },
            fontSize: {
                xs: "13px",
                sm: "15px",
                base: "16px",
                lg: "21px",
                xl: "24px",
                "2xl": "32px",
                "3xl": "48px",
                "4xl": "56px",
            },
            fontWeight: {
                normal: "400",
                medium: "510",
                semibold: "538",
                bold: "600",
            },
            lineHeight: {
                tight: "1.1",
                normal: "1.5",
                relaxed: "1.6",
            },
            letterSpacing: {
                tight: "-0.025em",
                normal: "0",
                wide: "0.025em",
            },
            spacing: {
                xs: "4px",
                sm: "8px",
                md: "12px",
                lg: "16px",
                xl: "24px",
                "2xl": "32px",
                "3xl": "48px",
                "4xl": "64px",
                "5xl": "96px",
                "6xl": "128px",
            },
            borderRadius: {
                none: "0px",
                sm: "6px",
                md: "8px",
                lg: "10px",
                xl: "12px",
                "2xl": "16px",
                full: "9999px",
            },
            boxShadow: {
                none: "none",
                sm: "rgba(0, 0, 0, 0) 0px 8px 2px 0px, rgba(0, 0, 0, 0.01) 0px 5px 2px 0px, rgba(0, 0, 0, 0.04) 0px 3px 2px 0px, rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 1px 0px",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
            transitionTimingFunction: {
                standard: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
                "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
                "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
            },
            transitionDuration: {
                fast: "0.16s",
                normal: "0.2s",
                slow: "0.3s",
            },
            maxWidth: {
                container: "1024px",
                prose: "768px",
            },
            zIndex: {
                dropdown: "1000",
                overlay: "1010",
                modal: "1020",
                popover: "1030",
                tooltip: "1040",
            },
            backgroundImage: {
                "gradient-subtle": "linear-gradient(rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0) 20%)",
                "gradient-card": "linear-gradient(134deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0) 55%)",
                "gradient-text-fade": "linear-gradient(to right, rgb(247, 248, 248), rgba(0, 0, 0, 0) 80%)",
            },
        },
    },
    plugins: [],
};
export default config;
//# sourceMappingURL=tailwind.config.js.map