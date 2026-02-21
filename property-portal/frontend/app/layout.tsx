import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Portal",
  description: "Property valuation and market insights",
};

import QueryProvider from "@/providers/QueryProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">
          <QueryProvider>
            {children}
          </QueryProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}

