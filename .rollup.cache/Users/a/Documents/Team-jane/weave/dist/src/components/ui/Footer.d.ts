import React from "react";
export interface FooterProps {
    className?: string;
    logo?: React.ReactNode;
    links?: FooterLinkGroup[];
    socialLinks?: FooterSocialLink[];
    copyright?: string;
    variant?: "default" | "minimal";
}
export interface FooterLinkGroup {
    title: string;
    links: FooterLink[];
}
export interface FooterLink {
    label: string;
    href: string;
}
export interface FooterSocialLink {
    name: string;
    href: string;
    icon: React.ReactNode;
}
declare const Footer: React.ForwardRefExoticComponent<FooterProps & React.RefAttributes<HTMLElement>>;
export default Footer;
