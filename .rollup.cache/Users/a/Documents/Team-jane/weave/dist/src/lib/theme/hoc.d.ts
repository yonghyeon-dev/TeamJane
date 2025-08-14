import React from "react";
export declare const withBaseComponent: <P extends object>(Component: React.ComponentType<P>, defaultClassName?: string) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
}> & React.RefAttributes<HTMLElement>>;
export declare const withContainer: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
}> & React.RefAttributes<HTMLElement>>;
export declare const withSection: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
}> & React.RefAttributes<HTMLElement>>;
export declare const withState: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
    loading?: boolean;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
    warning?: boolean;
}> & React.RefAttributes<HTMLElement>>;
export declare const withResponsive: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
    responsive?: {
        hidden?: "sm" | "md" | "lg" | "xl";
        visible?: "sm" | "md" | "lg" | "xl";
        text?: "sm" | "md" | "lg" | "xl";
    };
}> & React.RefAttributes<HTMLElement>>;
export declare const withTheme: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
    theme?: "dark" | "white";
}> & React.RefAttributes<HTMLElement>>;
export declare const withAccessibility: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-hidden"?: boolean;
    role?: string;
    tabIndex?: number;
}> & React.RefAttributes<HTMLElement>>;
export declare const withAnimation: <P extends object>(Component: React.ComponentType<P>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    className?: string;
    animation?: {
        type?: "fade" | "slide" | "scale" | "bounce";
        duration?: "fast" | "normal" | "slow";
        delay?: number;
    };
}> & React.RefAttributes<HTMLElement>>;
export declare const composeHOCs: (...hocs: Array<(Component: React.ComponentType<any>) => React.ComponentType<any>>) => (Component: React.ComponentType<any>) => React.ComponentType<any>;
export declare const withCommonProps: (Component: React.ComponentType<any>) => React.ComponentType<any>;
export declare const withLayoutProps: (Component: React.ComponentType<any>) => React.ComponentType<any>;
export declare const withFullProps: (Component: React.ComponentType<any>) => React.ComponentType<any>;
