import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MetaMarket: Decentralized Prediction Market in India",
  description:
    "MetaMarket 🇮🇳 is a decentralized prediction market platform where users can trade, forecast events, and explore market-driven insights.",
  keywords: [
    "MetaMarket",
    "prediction market",
    "decentralized trading",
    "crypto predictions",
    "blockchain betting",
    "India Web3"
  ],
  openGraph: {
    title: "MetaMarket: Decentralized Prediction Market in India",
    description:
      "Trade, forecast, and explore with MetaMarket 🇮🇳 – a decentralized prediction market platform.",
    url: "https://your-domain.com",
    siteName: "MetaMarket",
    images: [
      {
        url: "https://your-domain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MetaMarket Prediction Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Link href="/">MetaMarket</Link>
              <span role="img" aria-label="India Flag" className="text-2xl">
                
              </span>
            </h1>
            <ConnectWallet />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 w-full">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
