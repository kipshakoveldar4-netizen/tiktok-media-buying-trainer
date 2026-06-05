import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "TikTok Media Buying Trainer",
  description: "MVP-тренажер для подготовки к TikTok Media Buying Certification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
