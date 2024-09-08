import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "EventMe - Best Event Management App",
  description:
    "Event Management App EventMe & EventMe is a platform for event management.",
  icons: {
    icon: "/assets/images/logo2.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "EventMe - Best Event Management App",
    description:
      "EventMe simplifies event management for businesses and individuals.",
    url: "https://eventme-flame.vercel.app",
    images: [
      {
        url: "/assets/images/logo2.png",
        width: 800,
        height: 600,
        alt: "EventMe Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventMe - Best Event Management App",
    description:
      "EventMe simplifies event management for businesses and individuals.",
    images: ["/assets/images/logo2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <link rel="icon" href="./favicon.ico" />
        <body className={poppins.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
