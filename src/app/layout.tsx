import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ほめられ",
  description: "やったことを一言入れるだけで、複数の人格から一斉に褒められる",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
