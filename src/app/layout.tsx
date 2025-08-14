import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weave ERP - 프리랜서를 위한 올인원 워크스페이스",
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
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Weave ERP - 프리랜서를 위한 올인원 워크스페이스",
    description: "흩어진 당신의 업무를 하나로 엮다. 프리랜서 맞춤형 ERP 시스템",
    siteName: "Weave ERP",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weave ERP - 프리랜서를 위한 올인원 워크스페이스",
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
        <AuthProvider>
          <ClientThemeProvider defaultTheme="white" defaultPaletteId="custom1">
            {children}
          </ClientThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
