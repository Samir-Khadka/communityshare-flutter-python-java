import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Share - Household Tool Sharing",
  description: "Share tools, save money, and build community with your neighbors. The trusted platform for household tool sharing.",
  keywords: ["Tool Sharing", "Community", "Household", "Lending", "Borrowing"],
  authors: [{ name: "Community Share Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Community Share",
    description: "Share tools, save money, and build community with your neighbors.",
    url: "https://communityshare.app",
    siteName: "Community Share",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Share",
    description: "Share tools, save money, and build community with your neighbors.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
