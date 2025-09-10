import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>과천과학관 자연사관</title>
                <meta name="description" content="과천과학관 자연사관 전시용 웹앱입니다." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/main_logo.png" type="image/png"/>
                <link rel="shortcut icon" href="/main_logo.png" type="image/png"/>
                <link rel="apple-touch-icon" href="/main_logo.png"/>
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}
