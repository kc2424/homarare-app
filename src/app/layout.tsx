import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://homarare-app.vercel.app"),
  title: "ほめられ",
  description: "やったことを書くだけで、みんなが褒めてくれる",
  openGraph: {
    title: "ほめられ",
    description: "やったことを書くだけで、みんなが褒めてくれる",
    images: ["/ogp.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
