import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Minute Repeater Online",
  description: "Enjoy the pleasure of minute repeater online!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-LFSHEWLSTL" />
      <body>{children}</body>
    </html>
  );
}
