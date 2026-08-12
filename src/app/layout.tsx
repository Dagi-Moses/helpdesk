import type { Metadata } from "next";
import { Manrope, Work_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import "./globals.css";


const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Helpdesk | IT Support Console | Qrynex",
  description: "Enterprise IT helpdesk ticketing system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${workSans.variable} ${jetbrainsMono.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}