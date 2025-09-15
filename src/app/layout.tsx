import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/language-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'فندق قاعود | Kaoud Hotel',
  description: 'فندق فاخر في قلب الإسكندرية يوفر إقامة مميزة وخدمات راقية',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          {children}
          <Toaster />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
