import "./globals.css";

export const metadata = {
  title: "우리 아기 준비물 체크리스트",
  description: "월령별 육아용품 준비물 가이드 - 새것/중고 구분, 최저가 링크 연결",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
