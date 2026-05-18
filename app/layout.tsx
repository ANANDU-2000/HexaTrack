import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/query-provider';
import { ToastContainer } from '@/components/ui/toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://hexatrack.app'),
  applicationName: 'HexaTrack',
  title: {
    default: 'HexaTrack',
    template: '%s | HexaTrack',
  },
  description: 'Premium Expense & Budget Tracking',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HexaTrack',
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ['finance', 'expense tracker', 'budget tracker', 'cashflow', 'fintech', 'premium'],
  openGraph: {
    title: 'HexaTrack',
    description: 'Premium Expense & Budget Tracking',
    siteName: 'HexaTrack',
    type: 'website',
    images: ['/icon.png'],
  },
  twitter: {
    card: 'summary',
    title: 'HexaTrack',
    description: 'Premium Expense & Budget Tracking',
    images: ['/icon.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#050816',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#050816',
};

import { PwaProvider } from '@/components/pwa/pwa-provider';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;600;700;800&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface antialiased">
        <QueryProvider>
          {children}
          <ToastContainer />
          <PwaProvider />
        </QueryProvider>
      </body>
    </html>
  );
}


