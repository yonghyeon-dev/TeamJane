import { __rest } from "tslib";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
const Card = React.forwardRef((_a, ref) => {
    var { className, variant = "default", children, interactive = false } = _a, props = __rest(_a, ["className", "variant", "children", "interactive"]);
    const variants = {
        default: "bg-transparent border border-primary-borderSecondary rounded-lg",
        elevated: "bg-primary-surface border border-primary-borderSecondary rounded-lg shadow-sm",
        outlined: "bg-transparent border-2 border-primary-border rounded-lg",
    };
    return (<div ref={ref} className={cn("transition-all duration-fast", variants[variant], interactive && "card-interactive", className)} tabIndex={interactive ? 0 : undefined} {...props}>
        {children}
      </div>);
});
const CardImage = React.forwardRef((_a, ref) => {
    var { className, alt, fill = true } = _a, props = __rest(_a, ["className", "alt", "fill"]);
    return (<div className="relative w-full h-48">
      <Image ref={ref} className={cn("object-cover rounded-t-lg", className)} alt={alt} fill={fill} {...props}/>
    </div>);
});
const CardHeader = React.forwardRef((_a, ref) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>);
});
const CardTitle = React.forwardRef((_a, ref) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight text-text-primary", className)} {...props}>
      {children}
    </h3>);
});
const CardDescription = React.forwardRef((_a, ref) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<p ref={ref} className={cn("text-sm text-text-secondary", className)} {...props}>
    {children}
  </p>);
});
const CardContent = React.forwardRef((_a, ref) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>);
});
const CardFooter = React.forwardRef((_a, ref) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>);
});
Card.displayName = "Card";
CardImage.displayName = "CardImage";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
export { Card, CardImage, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, };
//# sourceMappingURL=Card.jsx.map