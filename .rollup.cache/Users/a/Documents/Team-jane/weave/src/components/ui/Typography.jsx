import { __rest } from "tslib";
import React from "react";
import { cn } from "@/lib/utils";
const Typography = React.forwardRef((_a, ref) => {
    var _b, _c;
    var { variant = "p", size, weight, color = "primary", children, className, as } = _a, props = __rest(_a, ["variant", "size", "weight", "color", "children", "className", "as"]);
    const Component = as || variant;
    const sizes = {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
    };
    const weights = {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
    };
    const colors = {
        primary: "text-text-primary",
        secondary: "text-text-secondary",
        tertiary: "text-text-tertiary",
        accent: "text-text-accent",
        muted: "text-text-muted",
        gradient: "text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]",
    };
    const variantDefaults = {
        h1: { size: "4xl", weight: "bold" },
        h2: { size: "3xl", weight: "bold" },
        h3: { size: "2xl", weight: "semibold" },
        h4: { size: "xl", weight: "semibold" },
        h5: { size: "lg", weight: "medium" },
        h6: { size: "base", weight: "medium" },
        p: { size: "base", weight: "normal" },
        span: { size: "base", weight: "normal" },
    };
    const defaultSize = size || ((_b = variantDefaults[variant]) === null || _b === void 0 ? void 0 : _b.size) || "base";
    const defaultWeight = weight || ((_c = variantDefaults[variant]) === null || _c === void 0 ? void 0 : _c.weight) || "normal";
    return (<Component ref={ref} className={cn("font-primary leading-normal", sizes[defaultSize], weights[defaultWeight], colors[color], className)} {...props}>
        {children}
      </Component>);
});
Typography.displayName = "Typography";
export default Typography;
//# sourceMappingURL=Typography.jsx.map