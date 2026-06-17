import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import DemoModal from "@/components/shared/DemoModal";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Homefix — Сервіс домашніх майстрів",
  description: "Майстер на дім: сантехніка, електрика, ремонт",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${geist.variable} antialiased min-h-screen flex flex-col`}>
        <DemoModal />
        {children}
      </body>
    </html>
  );
}