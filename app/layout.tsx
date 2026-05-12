import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/query-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://hexatrack.app'),
  applicationName: 'HexaTrack',
  title: {
    default: 'HexaTrack',
    template: '%s | HexaTrack',
  },
  description: 'Smart Expense & Budget Tracking',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HexaTrack',
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ['finance', 'expense tracker', 'budget tracker', 'cashflow', 'fintech'],
  openGraph: {
    title: 'HexaTrack',
    description: 'Smart Expense & Budget Tracking',
    siteName: 'HexaTrack',
    type: 'website',
    images: ['/icon.png'],
  },
  twitter: {
    card: 'summary',
    title: 'HexaTrack',
    description: 'Smart Expense & Budget Tracking',
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
    'msapplication-TileColor': '#0B1015',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1015',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

