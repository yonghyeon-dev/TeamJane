export declare const THEME_CONSTANTS: {
    readonly colors: {
        readonly primary: {
            readonly red: "#FF6B6B";
            readonly teal: "#4ECDC4";
            readonly blue: "#45B7D1";
            readonly yellow: "#F7B801";
            readonly darkTeal: "#1A535C";
            readonly darkBlue: "#032D29";
        };
        readonly gray: {
            readonly 50: "#F8F9FA";
            readonly 100: "#F1F3F4";
            readonly 200: "#E9ECEF";
            readonly 300: "#DEE2E6";
            readonly 400: "#CED4DA";
            readonly 500: "#ADB5BD";
            readonly 600: "#6C757D";
            readonly 700: "#495057";
            readonly 800: "#343A40";
            readonly 900: "#212529";
        };
    };
    readonly colorPalettes: readonly [{
        readonly id: "custom1";
        readonly name: "Custom 1";
        readonly description: "청록색 계열 그라디언트";
        readonly colors: {
            readonly primary: "#4ECDC4";
            readonly secondary: "#45B7D1";
            readonly default: "#1A535C";
        };
        readonly rgb: {
            readonly primary: "78, 205, 196";
            readonly secondary: "69, 183, 209";
            readonly default: "26, 83, 92";
        };
    }, {
        readonly id: "custom2";
        readonly name: "Custom 2";
        readonly description: "파랑색 계열 그라디언트";
        readonly colors: {
            readonly primary: "#3B82F6";
            readonly secondary: "#1D4ED8";
            readonly default: "#1E40AF";
        };
        readonly rgb: {
            readonly primary: "59, 130, 246";
            readonly secondary: "29, 78, 216";
            readonly default: "30, 64, 175";
        };
    }, {
        readonly id: "custom3";
        readonly name: "Custom 3";
        readonly description: "분홍색 계열 그라디언트";
        readonly colors: {
            readonly primary: "#EC4899";
            readonly secondary: "#DB2777";
            readonly default: "#BE185D";
        };
        readonly rgb: {
            readonly primary: "236, 72, 153";
            readonly secondary: "219, 39, 119";
            readonly default: "190, 24, 93";
        };
    }];
    readonly spacing: {
        readonly xs: "0.25rem";
        readonly sm: "0.5rem";
        readonly md: "0.75rem";
        readonly lg: "1rem";
        readonly xl: "1.5rem";
        readonly "2xl": "2rem";
        readonly "3xl": "3rem";
        readonly "4xl": "4rem";
    };
    readonly shadows: {
        readonly sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
        readonly md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        readonly lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        readonly xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    };
    readonly transitions: {
        readonly fast: "150ms ease-in-out";
        readonly normal: "300ms ease-in-out";
        readonly slow: "500ms ease-in-out";
    };
    readonly breakpoints: {
        readonly sm: "640px";
        readonly md: "768px";
        readonly lg: "1024px";
        readonly xl: "1280px";
        readonly "2xl": "1536px";
    };
};
export declare const COMMON_STYLES: {
    readonly container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
    readonly section: "py-12 md:py-16 lg:py-20";
    readonly card: {
        readonly base: "bg-primary-surface rounded-xl shadow-lg border border-primary-borderSecondary";
        readonly elevated: "bg-primary-surface rounded-xl shadow-xl border border-primary-borderSecondary hover:shadow-2xl transition-shadow duration-normal";
        readonly outlined: "bg-transparent rounded-xl border-2 border-primary-border";
    };
    readonly button: {
        readonly base: "inline-flex items-center justify-center font-medium transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
        readonly sizes: {
            readonly sm: "px-3 py-1.5 text-xs rounded-md h-8";
            readonly md: "px-4 py-2 text-sm rounded-lg h-10";
            readonly lg: "px-6 py-3 text-base rounded-xl h-12";
        };
    };
    readonly input: {
        readonly base: "w-full px-3 py-2 border border-primary-borderSecondary rounded-lg bg-primary-surface text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-border focus:border-transparent transition-all duration-fast";
    };
    readonly typography: {
        readonly h1: "text-4xl md:text-6xl font-black leading-tight";
        readonly h2: "text-3xl md:text-4xl font-bold leading-tight";
        readonly h3: "text-2xl md:text-3xl font-semibold leading-tight";
        readonly h4: "text-xl md:text-2xl font-semibold leading-tight";
        readonly h5: "text-lg md:text-xl font-medium leading-tight";
        readonly h6: "text-base md:text-lg font-medium leading-tight";
        readonly body: "text-base leading-relaxed";
        readonly small: "text-sm leading-relaxed";
    };
};
export declare const COMPONENT_DEFAULTS: {
    readonly button: {
        readonly size: "md";
        readonly variant: "primary";
    };
    readonly card: {
        readonly variant: "default";
    };
    readonly input: {
        readonly size: "md";
    };
    readonly typography: {
        readonly size: "base";
        readonly weight: "normal";
    };
};
export declare const VALIDATION_RULES: {
    readonly email: RegExp;
    readonly phone: RegExp;
    readonly url: RegExp;
    readonly password: {
        readonly minLength: 8;
        readonly requireUppercase: true;
        readonly requireLowercase: true;
        readonly requireNumbers: true;
        readonly requireSpecialChars: true;
    };
};
