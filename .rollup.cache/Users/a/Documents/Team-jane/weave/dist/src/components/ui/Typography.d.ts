import React from "react";
import type { TypographyVariant, TypographySize, TypographyWeight, TypographyColor } from "@/lib/theme/types";
export interface TypographyProps {
    variant?: TypographyVariant;
    size?: TypographySize;
    weight?: TypographyWeight;
    color?: TypographyColor;
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
}
declare const Typography: React.ForwardRefExoticComponent<TypographyProps & React.RefAttributes<HTMLElement>>;
export default Typography;
