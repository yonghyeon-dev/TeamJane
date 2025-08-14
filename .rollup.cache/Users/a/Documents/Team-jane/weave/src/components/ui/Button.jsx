"use client";
import { __rest } from "tslib";
import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme/ThemeContext";
const Button = React.forwardRef((_a, ref) => {
    var { className, variant = "primary", size = "md", children, loading = false, disabled = false, fullWidth = false, asChild = false } = _a, props = __rest(_a, ["className", "variant", "size", "children", "loading", "disabled", "fullWidth", "asChild"]);
    const { currentColors } = useTheme();
    const baseStyles = cn("inline-flex items-center justify-center font-medium transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", fullWidth && "w-full");
    const variants = {
        primary: cn("text-white", "hover:opacity-90 focus:ring-text-secondary focus:ring-offset-primary-background"),
        secondary: cn("bg-transparent border border-transparent", "hover:bg-primary-surfaceHover hover:border-primary-borderSecondary", "focus:ring-text-secondary focus:ring-offset-2"),
        ghost: cn("bg-transparent text-text-secondary border border-transparent", "hover:bg-primary-surfaceHover hover:text-text-primary", "focus:ring-text-secondary focus:ring-offset-primary-background"),
        danger: cn("bg-status-error text-white border border-status-error", "hover:bg-red-600 hover:border-red-600", "focus:ring-text-secondary focus:ring-offset-primary-background", "shadow-sm"),
        gradient: cn("text-white border border-transparent", "hover:opacity-90 focus:ring-text-secondary focus:ring-offset-primary-background", "shadow-sm"),
    };
    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-md h-8",
        md: "px-4 py-2 text-sm rounded-lg h-10",
        lg: "px-6 py-3 text-base rounded-xl h-12",
    };
    // 동적 스타일 생성
    const getDynamicStyles = () => {
        const styles = {};
        switch (variant) {
            case "primary":
                styles.background = `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary}, ${currentColors.default})`;
                styles.border = "none";
                break;
            case "secondary":
                // 투명 배경, 그림자 효과
                styles.borderColor = "transparent";
                styles.boxShadow = `0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`;
                break;
            case "ghost":
                styles.backgroundColor = "transparent";
                styles.borderColor = "transparent";
                break;
            case "danger":
                // danger는 기존 스타일 유지
                break;
            case "gradient":
                styles.background = `linear-gradient(135deg, ${currentColors.secondary}, ${currentColors.default}, ${currentColors.primary})`;
                break;
        }
        return styles;
    };
    const buttonProps = Object.assign({ className: cn(baseStyles, variants[variant], sizes[size], className), style: getDynamicStyles(), ref, disabled: disabled || loading }, props);
    if (asChild) {
        return React.cloneElement(children, buttonProps);
    }
    return (<button {...buttonProps}>
        {loading && (<svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>)}
        {children}
      </button>);
});
Button.displayName = "Button";
export default Button;
//# sourceMappingURL=Button.jsx.map