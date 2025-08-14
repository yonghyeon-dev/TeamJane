import { __rest } from "tslib";
import React from "react";
import { cn } from "@/lib/utils";
import { createLayoutStyles, createStateStyles } from "./factory";
// 기본 컴포넌트 래퍼 HOC
export const withBaseComponent = (Component, defaultClassName) => {
    return React.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (<Component ref={ref} className={cn(defaultClassName, className)} {...props}/>);
    });
};
// 컨테이너 HOC
export const withContainer = (Component) => {
    return React.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (<Component ref={ref} className={createLayoutStyles.container(className)} {...props}/>);
    });
};
// 섹션 HOC
export const withSection = (Component) => {
    return React.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (<Component ref={ref} className={createLayoutStyles.section(className)} {...props}/>);
    });
};
// 상태 관리 HOC
export const withState = (Component) => {
    return React.forwardRef((_a, ref) => {
        var { className, loading, disabled, error, success, warning } = _a, props = __rest(_a, ["className", "loading", "disabled", "error", "success", "warning"]);
        const stateClasses = [
            loading && createStateStyles.loading,
            disabled && createStateStyles.disabled,
            error && createStateStyles.error,
            success && createStateStyles.success,
            warning && createStateStyles.warning,
        ].filter(Boolean);
        return (<Component ref={ref} className={cn(className, ...stateClasses)} {...props}/>);
    });
};
// 반응형 HOC
export const withResponsive = (Component) => {
    return React.forwardRef((_a, ref) => {
        var { className, responsive } = _a, props = __rest(_a, ["className", "responsive"]);
        const responsiveClasses = [];
        if (responsive) {
            if (responsive.hidden) {
                responsiveClasses.push(createResponsiveStyles.hidden[responsive.hidden]);
            }
            if (responsive.visible) {
                responsiveClasses.push(createResponsiveStyles.visible[responsive.visible]);
            }
            if (responsive.text) {
                responsiveClasses.push(createResponsiveStyles.text[responsive.text]);
            }
        }
        return (<Component ref={ref} className={cn(className, ...responsiveClasses)} {...props}/>);
    });
};
// 테마 인식 HOC
export const withTheme = (Component) => {
    return React.forwardRef((_a, ref) => {
        var { className, theme } = _a, props = __rest(_a, ["className", "theme"]);
        const themeClasses = {
            dark: "dark",
            white: "light",
        };
        return (<Component ref={ref} className={cn(className, theme && themeClasses[theme])} data-theme={theme} {...props}/>);
    });
};
// 접근성 HOC
export const withAccessibility = (Component) => {
    return React.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return <Component ref={ref} className={cn(className)} {...props}/>;
    });
};
// 애니메이션 HOC
export const withAnimation = (Component) => {
    return React.forwardRef((_a, ref) => {
        var { className, animation } = _a, props = __rest(_a, ["className", "animation"]);
        const animationClasses = [];
        if (animation) {
            const { type = "fade", duration = "normal", delay } = animation;
            const animations = {
                fade: "animate-fade-in",
                slide: "animate-slide-in",
                scale: "animate-scale-in",
                bounce: "animate-bounce-in",
            };
            const durations = {
                fast: "duration-150",
                normal: "duration-300",
                slow: "duration-500",
            };
            animationClasses.push(animations[type], durations[duration]);
            if (delay) {
                animationClasses.push(`delay-${delay}`);
            }
        }
        return (<Component ref={ref} className={cn(className, ...animationClasses)} {...props}/>);
    });
};
// 조합 HOC (여러 HOC를 조합)
export const composeHOCs = (...hocs) => {
    return (Component) => {
        return hocs.reduce((WrappedComponent, hoc) => hoc(WrappedComponent), Component);
    };
};
// 자주 사용되는 조합들
export const withCommonProps = composeHOCs(withBaseComponent, withState, withAccessibility);
export const withLayoutProps = composeHOCs(withContainer, withSection, withResponsive);
export const withFullProps = composeHOCs(withBaseComponent, withState, withResponsive, withTheme, withAccessibility, withAnimation);
//# sourceMappingURL=hoc.jsx.map