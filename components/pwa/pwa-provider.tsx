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
        <div className="pwa-splash fixed inset-0 z-[100] grid place-items-center bg-[#F8FAFC] px-6">
          <div className="flex flex-col items-center">
            <div className="grid h-24 w-24 place-items-center rounded-[2rem] bg-[#10B981] shadow-[0_24px_70px_rgba(16,185,129,0.32)]">
              <Image src="/icons/icon-192x192.png" alt="" width={80} height={80} className="h-20 w-20 rounded-[1.5rem]" priority />
            </div>
            <div className="mt-5">
              <BrandMark compact />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#059669]">Smart Expense & Budget Tracking</p>
          </div>
        </div>
      )}

      {!online && (
        <div className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[#D1FAE5] bg-white/95 px-3 py-3 text-sm font-medium text-[#064E3B] shadow-[0_18px_42px_rgba(15,23,42,0.14)] backdrop-blur-xl">
            <WifiOff className="h-5 w-5 shrink-0 text-[#059669]" />
            <span className="min-w-0 flex-1">Offline mode. Cached balances and transactions stay available.</span>
          </div>
        </div>
      )}

      {installPrompt && !dismissed && !standalone && (
        <div className="fixed inset-x-0 bottom-[calc(6.7rem+env(safe-area-inset-bottom))] z-50 px-3 lg:bottom-5">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[#D1FAE5] bg-white px-3 py-3 shadow-[0_18px_42px_rgba(15,23,42,0.14)]">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ECFDF5] text-[#059669]">
              <Download size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#111827]">Install HexaTrack</p>
              <p className="truncate text-xs text-[#6B7280]">Open faster in standalone mode.</p>
            </div>
            <button className="soft-button app-tap-target px-3 py-2" onClick={install} type="button">
              Install
            </button>
            <button aria-label="Dismiss install prompt" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#6B7280] transition hover:bg-[#F8FAFC]" onClick={dismissInstall} type="button">
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
