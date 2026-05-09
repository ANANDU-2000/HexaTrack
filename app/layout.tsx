import type { Metadata, Viewport } from 'next';
import './globals.css';

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
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': '#10B981',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#10B981',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
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
