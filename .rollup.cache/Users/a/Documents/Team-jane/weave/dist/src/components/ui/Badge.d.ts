import React from "react";
export interface BadgeProps {
    variant?: "primary" | "secondary" | "accent" | "outline" | "destructive";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
    className?: string;
}
declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLDivElement>>;
export default Badge;
