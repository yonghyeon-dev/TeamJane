import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Next.js 13+ viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4ECDC4',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
      <head />
      <body className={`${inter.className} antialiased font-primary bg-white`}>
        <ReactQueryProvider>
          <ErrorProvider>
            <AuthProvider>
              <ClientThemeProvider defaultTheme="white" defaultPaletteId="custom1">
                {children}
              </ClientThemeProvider>
            </AuthProvider>
          </ErrorProvider>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
