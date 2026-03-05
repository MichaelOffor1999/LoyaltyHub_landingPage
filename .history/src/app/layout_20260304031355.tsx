import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import { NeuralBackground } from "./components/ui/flow-field-background";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('clienty-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          {/* Neural flow-field background — dark mode only, fixed behind all content */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <NeuralBackground />
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
