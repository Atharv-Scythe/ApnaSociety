import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PersonaProvider } from "../context/PersonaContext";
import { Header } from "../components/Header";
import { PersonaSwitcher } from "../components/PersonaSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApnaSociety — Modern Housing Society Management Platform",
  description: "Next-generation housing society governance, fund transparency, wing isolation, and democratic voting for Indian societies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <PersonaProvider>
          <Header />
          <main className="flex-1 pb-24">
            {children}
          </main>
          <PersonaSwitcher />
        </PersonaProvider>
      </body>
    </html>
  );
}
