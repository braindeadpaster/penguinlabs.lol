import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://penguinlabs.lol"),
  title: "penguinlabs.lol",
  description: "Your one link. Build a clean, minimal bio page in seconds.",
  openGraph: {
    type: "website",
    url: "https://penguinlabs.lol",
    title: "penguinlabs.lol",
    description: "Your one link. Build a clean, minimal bio page in seconds.",
    images: ["/bud.png"],
  },
  twitter: {
    card: "summary",
    title: "penguinlabs.lol",
    description: "Your one link. Build a clean, minimal bio page in seconds.",
    images: ["/bud.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
