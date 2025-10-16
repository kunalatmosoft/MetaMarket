import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Info } from "lucide-react";

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
                🇮🇳
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-700 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    How It Works
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>How MetaMarket Works</DialogTitle>
                    <DialogDescription>
                      Explore the steps to learn about the decentralized prediction market platform.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="step1" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="step1">Step 1</TabsTrigger>
                      <TabsTrigger value="step2">Step 2</TabsTrigger>
                      <TabsTrigger value="step3">Step 3</TabsTrigger>
                      <TabsTrigger value="step4">Step 4</TabsTrigger>
                    </TabsList>
                    <TabsContent value="step1">
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">1. Connect Your Wallet</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Link your crypto wallet to start trading on MetaMarket. We support major wallets for secure transactions.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="step2">
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">2. Explore Markets</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Browse a variety of prediction markets, from sports to politics, and place your trades based on your insights.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="step3">
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">3. Trade & Forecast</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Buy or sell shares in outcome-based markets. Your trades reflect your predictions, and prices adjust based on market activity.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="step4">
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">4. Settle & Earn</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Once the event resolves, markets settle, and you earn based on the accuracy of your predictions.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              <ConnectWallet />
            </div>
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