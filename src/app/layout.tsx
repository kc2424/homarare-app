import type { Metadata } from "next";
import "./globals.css";

// TODO: Vercel 本番ドメイン確定後に metadataBase を差し替える
export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
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
