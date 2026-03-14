import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CityProvider } from "@/contexts/city-context";
import { CityConfirmation } from "@/components/geo/city-confirmation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cashpeek — Сравнить займы онлайн на карту | Лучшие МФО 2025",
  description: "Сравните условия 8+ проверенных МФО. Займы онлайн на карту под 0% для новых клиентов. Быстрое решение за 5 минут. Высокий процент одобрения.",
  keywords: ["займ онлайн", "мфо", "микрозайм", "займ на карту", "займ без отказа", "срочный займ", "займ под 0"],
  authors: [{ name: "cashpeek" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "cashpeek — Сравнить займы онлайн на карту",
    description: "Сравните условия проверенных МФО. Займы онлайн под 0% для новых клиентов.",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CityProvider>
            {children}
            <CityConfirmation />
            <Toaster />
          </CityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
