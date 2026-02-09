import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components/layout";
import { Chatbot } from "@/components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Square21 Marketing | Leading Real Estate Agency in Islamabad",
  description: "Specializing in Industrial, Commercial, and Residential rentals. Commercial sales in CDA sectors. Premium real estate services in Islamabad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}
