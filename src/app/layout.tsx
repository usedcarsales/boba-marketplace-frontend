import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Web3Provider } from "@/components/Web3Provider";

export const metadata: Metadata = {
  title: "BoBA Market — Buy & Sell Bo Jackson Battle Arena™ Cards",
  description:
    "The #1 independent marketplace for Bo Jackson Battle Arena™ trading cards. Browse 17,000+ cards, buy & sell Heroes, Plays, Hot Dogs and more.",
  keywords: ["BoBA", "Bo Jackson", "Battle Arena", "trading cards", "marketplace", "TCG", "Radish"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23D1493D'/><text x='50' y='72' font-size='60' font-weight='900' font-family='sans-serif' fill='white' text-anchor='middle'>B</text></svg>" />
      </head>
      <body className="min-h-screen flex flex-col bg-boba-dark">
        <Web3Provider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
