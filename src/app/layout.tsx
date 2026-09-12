import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zakat-wealth-engine.vercel.app'),
  title: "Modern Zakat & Wealth Engine | AAOIFI Standard No. 35 for Tech RSUs & Equities",
  description: "Institutional-grade wealth audit and Zakat calculator for tech employees. Deterministic math for unvested RSUs, long-term equities, EPF/401(k), and bullion. 100% client-side privacy.",
  openGraph: {
    title: "Modern Zakat & Wealth Engine | Built for Modern Tech Compensation",
    description: "Zero DB Storage. Client-side deterministic Zakat engine calibrated for RSUs, EPF/401(k), and Crypto.",
    url: "https://zakat-wealth-engine.vercel.app",
    siteName: "Modern Zakat Engine",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Modern Zakat Engine Preview",
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Zakat & Wealth Engine",
    description: "AAOIFI-compliant wealth audit tool for RSUs, locked retirement, and digital assets.",
    images: ["/og-image.png"]
  },
  icons: {
    icon: [{ url: '/icon.svg?v=3', type: 'image/svg+xml' }],
    shortcut: '/icon.svg?v=3',
    apple: '/icon.svg?v=3'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Modern Zakat Engine",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
