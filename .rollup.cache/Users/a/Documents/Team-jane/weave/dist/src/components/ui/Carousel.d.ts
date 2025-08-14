import React from "react";
export interface CarouselProps {
    children: React.ReactNode;
    className?: string;
    autoPlay?: boolean;
    interval?: number;
    showDots?: boolean;
    showArrows?: boolean;
}
export interface CarouselItemProps {
    children: React.ReactNode;
    className?: string;
}
export interface CarouselDotsProps {
    total: number;
    current: number;
    onDotClick: (index: number) => void;
    className?: string;
}
export interface CarouselArrowsProps {
    onPrevious: () => void;
    onNext: () => void;
    className?: string;
}
declare const Carousel: React.ForwardRefExoticComponent<CarouselProps & React.RefAttributes<HTMLDivElement>>;
declare const CarouselItem: React.ForwardRefExoticComponent<CarouselItemProps & React.RefAttributes<HTMLDivElement>>;
declare const CarouselDots: React.ForwardRefExoticComponent<CarouselDotsProps & React.RefAttributes<HTMLDivElement>>;
declare const CarouselArrows: React.ForwardRefExoticComponent<CarouselArrowsProps & React.RefAttributes<HTMLDivElement>>;
export { Carousel, CarouselItem, CarouselDots, CarouselArrows };
