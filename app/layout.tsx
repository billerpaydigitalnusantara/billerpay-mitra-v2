"use client";

import React from "react";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased font-[family-name:var(--font-poppins-sans)]`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
