import themeData from "./theme.json";
export const theme = themeData;
export const getColor = (path) => {
    const keys = path.split(".");
    let value = theme;
    for (const key of keys) {
        if (typeof value === "object" && value !== null && key in value) {
            value = value[key];
        }
        else {
            console.warn(`Color path "${path}" not found in theme`);
            return "#000000";
        }
    }
    return typeof value === "string" ? value : "#000000";
};
export const getStatusColor = (type) => {
    return theme.colors.status[type];
};
export const getAccentColor = (color) => {
    return theme.colors.accent[color];
};
export const getButtonStyles = (variant) => {
    return theme.components.button[variant];
};
export const getSpacing = (size) => {
    return theme.spacing[size];
};
export const getBorderRadius = (size) => {
    return theme.borderRadius[size];
};
export const getFontSize = (size) => {
    return theme.typography.fontSize[size];
};
export const getFontWeight = (weight) => {
    return theme.typography.fontWeight[weight];
};
export const getTransition = (type) => {
    return theme.transitions[type];
};
export const getShadow = (size) => {
    return theme.shadows[size];
};
// CSS 변수로 테마를 적용하는 함수
export const getThemeCSSVariables = () => {
    const cssVars = {};
    // Colors
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
        cssVars[`--color-primary-${key}`] = value;
    });
    Object.entries(theme.colors.text).forEach(([key, value]) => {
        cssVars[`--color-text-${key}`] = value;
    });
    Object.entries(theme.colors.status).forEach(([key, value]) => {
        cssVars[`--color-status-${key}`] = value;
    });
    Object.entries(theme.colors.accent).forEach(([key, value]) => {
        cssVars[`--color-accent-${key}`] = value;
    });
    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
        cssVars[`--spacing-${key}`] = value;
    });
    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
        cssVars[`--radius-${key}`] = value;
    });
    // Font sizes
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        cssVars[`--font-size-${key}`] = value;
    });
    // Font weights
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
        cssVars[`--font-weight-${key}`] = value;
    });
    return cssVars;
};
//# sourceMappingURL=utils.js.map