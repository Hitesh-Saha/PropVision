import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropVision – Property Valuation Platform",
  description: "AI-powered property valuation and real-time market insights",
};

import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
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
        <AuthProvider>
          <Header />
          <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">
            <QueryProvider>
              {children}
            </QueryProvider>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
