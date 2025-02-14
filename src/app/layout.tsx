import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
