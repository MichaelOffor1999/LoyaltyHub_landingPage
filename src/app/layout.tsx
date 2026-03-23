import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://clientin.co";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "clientIn — Turn Every Customer Into a Loyal Fan",
    template: "%s | clientIn",
  },
  description:
    "The simplest way to reward your best customers, boost repeat business, and grow your revenue. Digital loyalty cards, customer insights, and automated re-engagement — all in one app.",
  keywords: [
    "loyalty program",
    "digital loyalty card",
    "customer retention",
    "repeat customers",
    "small business loyalty",
    "stamp card app",
    "customer rewards",
    "loyalty app",
    "clientIn",
  ],
  authors: [{ name: "clientIn" }],
  creator: "clientIn",
  publisher: "clientIn",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "clientIn",
    title: "clientIn — Turn Every Customer Into a Loyal Fan",
    description:
      "Digital loyalty cards, customer insights, and automated re-engagement. The simplest way to reward your best customers and grow your revenue.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "clientIn — Turn Every Customer Into a Loyal Fan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "clientIn — Turn Every Customer Into a Loyal Fan",
    description:
      "Digital loyalty cards, customer insights, and automated re-engagement. The simplest way to reward your best customers and grow your revenue.",
    images: ["/og-image.png"],
    // creator: "@yourtwitterhandle",  ← Add when you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} antialiased`} style={{ overflowX: "hidden", maxWidth: "100%" }}>
            {children}
      </body>
    </html>
  );
}
