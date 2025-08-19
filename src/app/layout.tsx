import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { Analytics } from "@vercel/analytics/react";
import { MonitoringProvider } from "@/components/providers/MonitoringProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WEAVE - 프리랜서를 위한 올인원 워크스페이스",
  description: "흩어진 당신의 업무를 하나로 엮다. 프리랜서 맞춤형 ERP 시스템",
  keywords: [
    "프리랜서",
    "ERP",
    "프로젝트 관리",
    "클라이언트 관리",
    "문서 관리",
    "청구서",
  ],
  authors: [{ name: "Team Jane" }],
  creator: "Team Jane",
  publisher: "Weave",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "WEAVE - 프리랜서를 위한 올인원 워크스페이스",
    description: "흩어진 당신의 업무를 하나로 엮다. 프리랜서 맞춤형 ERP 시스템",
    siteName: "WEAVE",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "WEAVE - 프리랜서를 위한 올인원 워크스페이스",
    description: "흩어진 당신의 업무를 하나로 엮다. 프리랜서 맞춤형 ERP 시스템",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} light`}>
      <head>
        <meta name="theme-color" content="#4ECDC4" />
      </head>
      <body className={`${inter.className} antialiased font-primary bg-white`}>
        <MonitoringProvider>
          <ReactQueryProvider>
            <ErrorProvider>
              <AuthProvider>
                <ClientThemeProvider defaultTheme="white" defaultPaletteId="custom1">
                  {children}
                </ClientThemeProvider>
              </AuthProvider>
            </ErrorProvider>
          </ReactQueryProvider>
        </MonitoringProvider>
        <Analytics />
      </body>
    </html>
  );
}
