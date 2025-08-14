import React from "react";
import type { StatusType, StatusVariant } from "@/lib/theme/types";
export interface StatusProps {
    type: StatusType;
    variant?: StatusVariant;
    children: React.ReactNode;
    className?: string;
}
declare const Status: React.ForwardRefExoticComponent<StatusProps & React.RefAttributes<HTMLDivElement>>;
export default Status;
