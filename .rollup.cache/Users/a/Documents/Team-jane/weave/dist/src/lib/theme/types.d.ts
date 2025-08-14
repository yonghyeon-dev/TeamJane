export type ThemeName = "Linear.app Dark Theme";
export type ThemeType = "dark" | "white";
export type PrimaryColors = {
    background: string;
    surface: string;
    surfaceSecondary: string;
    surfaceHover: string;
    surfacePressed: string;
    border: string;
    borderSecondary: string;
};
export type TextColors = {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    muted: string;
    inverse: string;
};
export type StatusColors = {
    success: string;
    warning: string;
    error: string;
    info: string;
    progress: string;
};
export type AccentColors = {
    yellow: string;
    orange: string;
    blue: string;
    purple: string;
    green: string;
};
export type GradientColors = {
    subtle: string;
    card: string;
    textFade: string;
};
export type FontFamily = {
    primary: string;
};
export type FontSize = {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
};
export type FontWeight = {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
};
export type LineHeight = {
    tight: string;
    normal: string;
    relaxed: string;
};
export type LetterSpacing = {
    tight: string;
    normal: string;
    wide: string;
};
export type Spacing = {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
};
export type BorderRadius = {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    full: string;
};
export type Shadows = {
    none: string;
    sm: string;
    md: string;
    lg: string;
};
export type Transitions = {
    fast: string;
    normal: string;
    slow: string;
    properties: {
        all: string;
    };
};
export type Layout = {
    maxWidth: {
        container: string;
        prose: string;
    };
    breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
    };
};
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "gradient";
export type ButtonSize = "sm" | "md" | "lg";
export type StatusType = "success" | "warning" | "error" | "info" | "progress";
export type StatusVariant = "badge" | "pill" | "dot";
export type CardVariant = "default" | "elevated" | "outlined";
export type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
export type TypographySize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type TypographyWeight = "normal" | "medium" | "semibold" | "bold";
export type TypographyColor = "primary" | "secondary" | "tertiary" | "accent" | "muted" | "gradient";
export type ColorPalette = {
    id: string;
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        default: string;
    };
    rgb: {
        primary: string;
        secondary: string;
        default: string;
    };
};
export type ColorSelection = {
    primary: string;
    secondary: string;
    default: string;
};
export type DesignTokens = {
    easing: {
        standard: string;
        easeIn: string;
        easeOut: string;
        easeInOut: string;
    };
    zIndex: {
        dropdown: string;
        overlay: string;
        modal: string;
        popover: string;
        tooltip: string;
    };
};
export interface Theme {
    theme: {
        name: ThemeName;
        description: string;
        type: ThemeType;
    };
    colors: {
        primary: PrimaryColors;
        text: TextColors;
        status: StatusColors;
        accent: AccentColors;
        gradients: GradientColors;
    };
    typography: {
        fontFamily: FontFamily;
        fontSize: FontSize;
        fontWeight: FontWeight;
        lineHeight: LineHeight;
        letterSpacing: LetterSpacing;
    };
    spacing: Spacing;
    borderRadius: BorderRadius;
    shadows: Shadows;
    transitions: Transitions;
    layout: Layout;
    components: {
        button: {
            primary: Record<string, string>;
            secondary: Record<string, string>;
            ghost: Record<string, string>;
            danger: Record<string, string>;
            gradient: Record<string, string>;
        };
        navigation: {
            link: Record<string, string>;
        };
        card: {
            base: Record<string, string>;
        };
    };
    designTokens: DesignTokens;
}
