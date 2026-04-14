import type { Metadata } from "next";
import { Nunito, Space_Mono } from 'next/font/google';
import "./globals.css";

const nunito = Nunito({ 
  variable: "--font-sans", 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"] 
});

const spaceMono = Space_Mono({ 
  variable: "--font-mono", 
  subsets: ["latin"], 
  weight: ["400", "700"] 
});

export const metadata: Metadata = {
  title: "Katydids",
  description: "Frontend-only software metrics calculator",
  icons: {
    icon: "/assets/katydids-logo.png",
    shortcut: "/assets/katydids-logo.png",
    apple: "/assets/katydids-logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">{children}</body>
    </html>
  );
}
