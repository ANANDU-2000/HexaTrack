'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, WifiOff, X } from 'lucide-react';
import { BrandMark } from '@/components/ui/brand';
import { notificationScheduler } from '@/lib/notifications';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const INSTALL_DISMISSED_KEY = 'hexatrack.install.dismissed.v1';

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function PwaProvider() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [online, setOnline] = useState(true);
  const [dismissed, setDismissed] = useState(true);
  const [standalone, setStandalone] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setOnline(window.navigator.onLine);
    setStandalone(isStandaloneDisplay());
    setDismissed(window.localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true');
    notificationScheduler.prepare();

    const splashTimer = window.setTimeout(() => setShowSplash(false), 980);
    const syncViewportHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--visual-viewport-height', `${height}px`);
    };
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setDismissed(window.localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true');
    };
    const markInstalled = () => {
      setStandalone(true);
      setInstallPrompt(null);
      window.localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
      setDismissed(true);
    };

    syncViewportHeight();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        void navigator.serviceWorker.register('/sw.js', { scope: '/' });
      });
    }

    window.visualViewport?.addEventListener('resize', syncViewportHeight);
    window.visualViewport?.addEventListener('scroll', syncViewportHeight);
    window.addEventListener('resize', syncViewportHeight);
    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    window.addEventListener('appinstalled', markInstalled);

    return () => {
      window.clearTimeout(splashTimer);
      window.visualViewport?.removeEventListener('resize', syncViewportHeight);
      window.visualViewport?.removeEventListener('scroll', syncViewportHeight);
      window.removeEventListener('resize', syncViewportHeight);
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
    }
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  const dismissInstall = () => {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  return (
    <>
      {showSplash && (
        <div className="pwa-splash fixed inset-0 z-[100] grid place-items-center bg-background px-6">
          <div className="flex flex-col items-center">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-secondary shadow-[0_0_40px_rgba(173,198,255,0.3)] accent-glow">
              <Image src="/icons/icon-192x192.png" alt="" width={80} height={80} className="h-20 w-20 rounded-2xl" priority />
            </div>
            <div className="mt-8">
              <BrandMark tone="dark" className="scale-110" />
            </div>
            <p className="mt-4 text-sm font-medium text-on-surface-variant/60 tracking-wider font-label-mono uppercase">INITIALIZING CORE</p>
          </div>
        </div>
      )}

      {!online && (
        <div className="fixed inset-x-0 top-0 z-[90] px-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#121A22]/95 px-3 py-3 text-sm font-medium text-[#F5F7FA] shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <WifiOff className="h-5 w-5 shrink-0 text-[#4F8CFF]" />
            <span className="min-w-0 flex-1">Offline mode. Cached balances and transactions stay available.</span>
          </div>
        </div>
      )}

      {installPrompt && !dismissed && !standalone && (
        <div className="fixed inset-x-0 bottom-[calc(6.7rem+env(safe-area-inset-bottom))] z-[90] px-3 lg:bottom-5">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#121A22] px-3 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.35)]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4F8CFF]/15 text-[#4F8CFF]">
              <Download size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#F5F7FA]">Install HexaTrack</p>
              <p className="truncate text-xs text-[#8B9BB4]">Open faster in standalone mode.</p>
            </div>
            <button className="soft-button app-tap-target px-3 py-2" onClick={install} type="button">
              Install
            </button>
            <button
              aria-label="Dismiss install prompt"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#8B9BB4] transition hover:bg-white/[0.06]"
              onClick={dismissInstall}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}
