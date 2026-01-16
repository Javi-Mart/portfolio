// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Prompt, Hubot_Sans } from "next/font/google";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const hubotSans = Hubot_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Javier Martínez · Portfolio",
  description: "Graphic Designer · Technical Artist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${prompt.variable} ${hubotSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
