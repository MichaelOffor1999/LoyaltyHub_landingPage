import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ShootingStarsWrapper } from "./components/ui/shooting-stars-wrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

// ← Change this when you buy a domain
const SITE_URL = "https://loyalty-hub-landing-page-wheat.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Clienty — Turn Every Customer Into a Loyal Fan",
    template: "%s | Clienty",
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
    "Clienty",
  ],
  authors: [{ name: "Clienty" }],
  creator: "Clienty",
  publisher: "Clienty",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Clienty",
    title: "Clienty — Turn Every Customer Into a Loyal Fan",
    description:
      "Digital loyalty cards, customer insights, and automated re-engagement. The simplest way to reward your best customers and grow your revenue.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clienty — Turn Every Customer Into a Loyal Fan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clienty — Turn Every Customer Into a Loyal Fan",
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
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {/* Global shooting stars — fixed, behind all content */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <ShootingStars starColor="#e8944a" trailColor="#c97b3a" minSpeed={12} maxSpeed={28} minDelay={1000} maxDelay={3000} />
          <ShootingStars starColor="#ffffff" trailColor="#c97b3a" minSpeed={8}  maxSpeed={20} minDelay={2000} maxDelay={5000} />
          <ShootingStars starColor="#f5b97a" trailColor="#ffffff" minSpeed={15} maxSpeed={35} minDelay={1500} maxDelay={4000} />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
