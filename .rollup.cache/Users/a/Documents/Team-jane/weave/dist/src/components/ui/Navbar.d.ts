import React from "react";
export interface NavbarProps {
    className?: string;
    logo?: React.ReactNode;
    menuItems?: NavbarMenuItem[];
    actions?: React.ReactNode;
    variant?: "default" | "transparent" | "elevated";
}
export interface NavbarMenuItem {
    label: string;
    href: string;
    active?: boolean;
    children?: NavbarMenuItem[];
}
declare const Navbar: React.ForwardRefExoticComponent<NavbarProps & React.RefAttributes<HTMLElement>>;
export default Navbar;
