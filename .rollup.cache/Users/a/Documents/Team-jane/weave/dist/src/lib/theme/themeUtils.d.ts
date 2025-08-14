import { THEME_CONSTANTS } from "./constants";
export declare const themeUtils: {
    hexToRgb: (hex: string) => {
        r: number;
        g: number;
        b: number;
    } | null;
    getBrightness: (hex: string) => number;
    getContrastColor: (hex: string) => "#000000" | "#ffffff";
    addOpacity: (hex: string, opacity: number) => string;
    createGradient: (from: string, to: string, direction?: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-tl" | "to-br" | "to-bl") => string;
    getWeaveColor: (colorName: keyof typeof THEME_CONSTANTS.colors.primary) => "#FF6B6B" | "#4ECDC4" | "#45B7D1" | "#F7B801" | "#1A535C" | "#032D29";
    getGrayColor: (level: keyof typeof THEME_CONSTANTS.colors.gray) => "#F8F9FA" | "#F1F3F4" | "#E9ECEF" | "#DEE2E6" | "#CED4DA" | "#ADB5BD" | "#6C757D" | "#495057" | "#343A40" | "#212529";
};
export declare const responsiveUtils: {
    isMobile: () => boolean;
    isTablet: () => boolean;
    isDesktop: () => boolean;
    getResponsiveClass: (baseClass: string, responsive: Record<string, string>) => string;
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
export declare const animationUtils: {
    getDelay: (index: number, baseDelay?: number) => number;
    getStaggerClass: (index: number, baseDelay?: number) => string;
    types: {
        fade: string;
        slide: string;
        scale: string;
        bounce: string;
    };
    durations: {
        fast: string;
        normal: string;
        slow: string;
    };
};
export declare const layoutUtils: {
    getGridCols: (items: number, maxCols?: number) => {
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    getSpacing: (multiplier?: number) => string;
    container: string;
    section: string;
    grid: {
        1: string;
        2: string;
        3: string;
        4: string;
        6: string;
        12: string;
    };
    flex: {
        row: string;
        col: string;
        center: string;
        between: string;
        start: string;
        end: string;
    };
};
export declare const accessibilityUtils: {
    generateAriaLabel: (element: string, context?: string) => string;
    focusFirstElement: (containerRef: React.RefObject<HTMLElement>) => void;
    handleKeyboardNavigation: (event: React.KeyboardEvent, onEnter?: () => void, onEscape?: () => void, onArrowUp?: () => void, onArrowDown?: () => void) => void;
};
export declare const stateUtils: {
    loading: string;
    disabled: string;
    error: string;
    success: string;
    warning: string;
    colors: {
        error: string;
        success: string;
        warning: string;
        info: string;
    };
};
export declare const componentUtils: {
    combineClasses: (...classes: (string | undefined | null | false)[]) => string;
    conditionalClass: (condition: boolean, trueClass: string, falseClass?: string) => string;
    responsiveClass: (baseClass: string, responsive: Record<string, string>) => string;
};
