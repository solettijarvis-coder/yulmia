import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SplashScreen } from "@/components/ui/splash-screen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

// Geist Mono for data displays
const geistMono = localFont({
  src: [
    {
      path: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YULMIA — South Florida Investment Properties",
  description:
    "The only platform built for real estate investors in South Florida. Houses, multifamily, and distressed properties with AI-powered investment analysis and E2 visa guidance for Canadian investors.",
  keywords: [
    "South Florida investment properties",
    "Miami real estate investing",
    "multifamily properties Florida",
    "E2 visa real estate",
    "Canadian investor Florida",
    "distressed properties Miami",
    "house investment Fort Lauderdale",
    "cap rate calculator",
    "rental property analysis",
  ],
  openGraph: {
    title: "YULMIA — South Florida Investment Properties",
    description:
      "AI-powered investment property analysis for South Florida. Houses, multifamily, and distressed properties.",
    type: "website",
    url: "https://yulmia.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <SplashScreen />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}