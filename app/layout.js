import "./globals.css";
import RegisterSW from "../components/RegisterSW";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "우리 아기 준비물 체크리스트",
  description: "월령별 육아용품 준비물 가이드 - 새것/중고 구분, 최저가 링크 연결",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "아기체크리스트",
  },
};

export const viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        <RegisterSW />
        <Analytics />
      </body>
    </html>
  );
}
