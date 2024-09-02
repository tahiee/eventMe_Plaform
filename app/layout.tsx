import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "EventMe",
  description:
    "Event Managment App EventMe & EevntMe is a platform for event managemnt app",
    icons:'../public/assets/images/logo2.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
    <link rel="icon" href="./favicon.ico"/>
      <body className={poppins.variable}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
