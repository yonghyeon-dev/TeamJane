import React from "react";
export interface HeroProps {
    title: string;
    subtitle?: string;
    description?: string;
    primaryAction?: HeroAction;
    secondaryAction?: HeroAction;
    image?: string;
    imageAlt?: string;
    variant?: "default" | "centered" | "split";
    className?: string;
}
export interface HeroAction {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "ghost";
}
declare const Hero: React.ForwardRefExoticComponent<HeroProps & React.RefAttributes<HTMLElement>>;
export default Hero;
