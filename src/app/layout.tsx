import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WHYME 미디어 교육 자료집",
    template: "%s | WHYME 미디어 교육 자료집",
  },
  description:
    "가정에서 바로 실행할 수 있는 플랫폼 안전 설정, 체크리스트, 건강한 미디어 문화 자료를 모은 학부모용 아카이브입니다.",
  openGraph: {
    title: "WHYME 미디어 교육 자료집",
    description:
      "학부모를 위한 미디어 교육 자료, 안전 설정 가이드, 가족 협약서를 한곳에서 찾아보세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
