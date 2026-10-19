import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ludwig Marais — Portfolio",
  description: "Portfolio interactif façon terminal de Ludwig Marais, développeur web full stack en alternance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
