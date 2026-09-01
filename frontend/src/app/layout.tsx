import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Leony Jaya | Premium Denim Apparel",
    template: "%s | Leony Jaya",
  },
  description: "Premium denim apparel - Limited drops, raw denim, distressed jeans, and denim jackets. Direct-to-consumer streetwear.",
  keywords: ["denim", "raw denim", "streetwear", "limited drops", "premium jeans", "denim jacket"],
  authors: [{ name: "Leony Jaya" }],
  creator: "Leony Jaya",
  publisher: "Leony Jaya",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Leony Jaya",
    title: "Leony Jaya | Premium Denim Apparel",
    description: "Premium denim apparel - Limited drops, raw denim, distressed jeans, and denim jackets.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Leony Jaya Premium Denim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leony Jaya | Premium Denim Apparel",
    description: "Premium denim apparel - Limited drops, raw denim, distressed jeans, and denim jackets.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}