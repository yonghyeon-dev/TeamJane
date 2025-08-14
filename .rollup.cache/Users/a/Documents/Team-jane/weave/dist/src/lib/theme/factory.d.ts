import type { ButtonVariant, ButtonSize, CardVariant } from "./types";
export declare const createButtonStyles: (variant?: ButtonVariant, size?: ButtonSize, className?: string) => string;
export declare const createCardStyles: (variant?: CardVariant, className?: string, interactive?: boolean) => string;
export declare const createInputStyles: (size?: "sm" | "md" | "lg", className?: string) => string;
export declare const createTypographyStyles: (variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "small", className?: string) => string;
export declare const createLayoutStyles: {
    container: (className?: string) => string;
    section: (className?: string) => string;
    grid: (cols: 1 | 2 | 3 | 4 | 6 | 12, gap?: "sm" | "md" | "lg", className?: string) => string;
    flex: (direction?: "row" | "col", align?: "start" | "center" | "end", justify?: "start" | "center" | "end" | "between", className?: string) => string;
};
export declare const createStateStyles: {
    loading: string;
    disabled: string;
    error: string;
    success: string;
    warning: string;
};
export declare const createResponsiveStyles: {
    hidden: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    visible: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    text: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
};
