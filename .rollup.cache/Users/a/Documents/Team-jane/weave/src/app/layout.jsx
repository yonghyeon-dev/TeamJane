import "./globals.css";
import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";
export const metadata = {
    title: "Weave Component Library",
    description: "Linear.app 다크 테마 기반의 재사용 가능한 컴포넌트 시스템",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};
export default function RootLayout({ children, }) {
    return (<html lang="ko" className="dark">
      <body className="antialiased font-primary">
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>);
}
//# sourceMappingURL=layout.jsx.map