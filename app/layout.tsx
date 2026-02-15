import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Industria y Agronomía Digital del Cannabis",
  description: "Plataforma de formación experta en cannabis, tecnología y agronomía digital.",
  verification: {
    google: "DTS04uS1vMRovaSApxygHzTmmGo8vZeadGl8aMGjCDE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Header />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}
