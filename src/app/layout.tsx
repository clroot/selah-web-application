import type { Metadata, Viewport } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";

import { Toaster } from "sonner";

import { Providers } from "@/app/_providers/Providers";

import "./globals.css";

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Selah - 멈추고, 묵상하고, 기록하다",
  description:
    "기도제목과 기도문을 기록하고, 응답받은 기도를 확인하며 믿음을 성장시키는 개인용 기도노트 서비스",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${nanumMyeongjo.variable} ${notoSansKR.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <div className="app-container">{children}</div>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--cream)",
                color: "var(--deep-brown)",
                border: "1px solid var(--sand)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
