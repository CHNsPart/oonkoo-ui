import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OonkooUI - Beautiful React Components",
    template: "%s | OonkooUI",
  },
  description:
    "A modern React UI component library and marketplace. Build beautiful interfaces with free and premium components compatible with shadcn/ui.",
  keywords: [
    "React",
    "UI Components",
    "shadcn",
    "Tailwind CSS",
    "Component Library",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "OonkooUI" }],
  creator: "OonkooUI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oonkoo.com",
    siteName: "OonkooUI",
    title: "OonkooUI - Beautiful React Components",
    description:
      "A modern React UI component library and marketplace. Build beautiful interfaces with free and premium components.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OonkooUI - Beautiful React Components",
    description:
      "A modern React UI component library and marketplace. Build beautiful interfaces with free and premium components.",
  },
  icons: {
    icon: "/favicon.ico",
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
