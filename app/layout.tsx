import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Home Services",
  description: "Сервис вызова мастеров на дом",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geist.variable} antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}