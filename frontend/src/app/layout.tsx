import React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://square21marketing.com'),
  title: {
    default: "Square21 Marketing | Leading Real Estate Agency in Islamabad",
    template: "%s | Square21 Marketing"
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  description: "Specializing in Industrial, Commercial, and Residential rentals. Commercial sales in CDA sectors. Premium real estate services in Islamabad's prime locations including I-9, I-10, and Blue Area.",
  keywords: ["Real Estate Islamabad", "Industrial Property Islamabad", "Commercial Rental Islamabad", "CDA Sectors Real Estate", "Square21 Marketing", "I-9 Industrial Area", "Property for Lease Islamabad"],
  authors: [{ name: "Square21 Marketing" }],
  creator: "Square21 Marketing",
  publisher: "Square21 Marketing",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Square21 Marketing | Leading Real Estate Agency in Islamabad",
    description: "Specializing in Industrial, Commercial, and Residential rentals in Islamabad's prime locations.",
    url: "https://square21marketing.com",
    siteName: "Square21 Marketing",
    images: [
      {
        url: "/assets/hero-building.jpg",
        width: 1200,
        height: 630,
        alt: "Square21 Marketing - Premium Real Estate Islamabad",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Square21 Marketing | Real Estate Islamabad",
    description: "Premium Industrial, Commercial, and Residential real estate services in Islamabad.",
    images: ["/assets/hero-building.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
