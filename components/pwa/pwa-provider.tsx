'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Download, 
  WifiOff, 
  X, 
  Bell, 
  Sparkles, 
  Trash2, 
  CheckCheck, 
  Smartphone,
  Info,
  DollarSign,
  AlertTriangle,
  Clock,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BrandMark } from '@/components/ui/brand';
import { notificationScheduler, type NotificationIntent, type NotificationChannel } from '@/lib/notifications';
import { offlineQueue } from '@/lib/offline-queue';
import { useFinanceStore } from '@/store/finance-store';
import { motion, AnimatePresence } from 'framer-motion';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const INSTALL_DISMISSED_KEY = 'hexatrack.install.dismissed.v1';
const PUSH_PROMPT_DISMISSED_KEY = 'hexatrack.push-prompt.dismissed.v1';

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Custom sample seeds matching requested Fintech alerts
const SEED_NOTIFICATIONS: Array<{ channel: NotificationChannel; title: string; body: string }> = [
  {
    channel: 'admin-alert',
    title: 'New branch user added',
    body: 'Operator account for "Anand - Calicut Branch" activated.'
  },
  {
    channel: 'expense-reminder',
    title: '₹2,500 spent on Food',
    body: 'Transaction processed successfully at "Zomato Resto" vault.'
  },
  {
    channel: 'budget-alert',
    title: 'You reached 80% of your monthly budget',
    body: 'Food & Outing allocation is nearing threshold caps.'
  },
  {
    channel: 'recurring-transaction',
    title: 'Netflix subscription due tomorrow',
    body: 'Auto-debit of ₹649 scheduled under Standard Bank ledger.'
  },
  {
    channel: 'subscription-reminder',
    title: 'Salary credited successfully',
    body: 'Professional direct deposit of ₹1,85,000 processed.'
  },
  {
    channel: 'recurring-transaction',
    title: 'Electricity bill due today',
    body: 'KSEB power utility invoice payment threshold expires today.'
  }
];

export function PwaProvider() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [online, setOnline] = useState(true);
  const [dismissed, setDismissed] = useState(true);
  const [standalone, setStandalone] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Push Permission Prompt states
  const [showPushModal, setShowPushModal] = useState(false);

  // Notification Drawer states
  const [notifications, setNotifications] = useState<NotificationIntent[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load and seed notifications if empty
  const loadNotifications = () => {
    let list = notificationScheduler.list();
    if (list.length === 0) {
      // Seed initial dummy high-fidelity alerts so user has premium items to play with
      SEED_NOTIFICATIONS.forEach((seed, i) => {
        const intent: NotificationIntent = {
          id: `seed-${i}-${Date.now()}`,
          channel: seed.channel,
          title: seed.title,
          body: seed.body,
          scheduledFor: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
          data: { unread: 'true' }
        };
        // Save directly to localStorage
        const existing = JSON.parse(window.localStorage.getItem('hexatrack.notification-intents.v1') ?? '[]');
        existing.push(intent);
        window.localStorage.setItem('hexatrack.notification-intents.v1', JSON.stringify(existing));
      });
      list = notificationScheduler.list();
    }
    setNotifications(list);
  };

  useEffect(() => {
    setOnline(window.navigator.onLine);
    setStandalone(isStandaloneDisplay());
    setDismissed(window.localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true');
    notificationScheduler.prepare();
    loadNotifications();

    // Fade out splash screen slightly faster for snap startup
    const splashTimer = window.setTimeout(() => setShowSplash(false), 980);

    const syncViewportHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--visual-viewport-height', `${height}px`);
    };

    const markOnline = () => {
      setOnline(true);
      void offlineQueue.processQueue(() => useFinanceStore.getState().loadWorkspace());
    };

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
      
      // Auto-trigger a welcome notification on successful install
      notificationScheduler.triggerLocalNotification(
        'admin-alert',
        '🚀 HexaTrack PWA Successfully Installed',
        'Launched from Home Screen. Full native standalone capability unlocked!'
      );
      loadNotifications();
    };

    // Custom event listener to trigger notification drawer globally from header/footer bells
    const openDrawerListener = () => {
      loadNotifications();
      setIsDrawerOpen(true);
    };

    syncViewportHeight();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        void navigator.serviceWorker.register('/sw.js', { scope: '/' });
      });
    }

    if (window.navigator.onLine) {
      void offlineQueue.processQueue(() => useFinanceStore.getState().loadWorkspace());
    }

    window.visualViewport?.addEventListener('resize', syncViewportHeight);
    window.visualViewport?.addEventListener('scroll', syncViewportHeight);
    window.addEventListener('resize', syncViewportHeight);
    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    window.addEventListener('appinstalled', markInstalled);
    window.addEventListener('pwa-open-notifications', openDrawerListener);

    // Dynamic Trigger for push notifications modal after splash finishes
    const checkPushPermission = setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'default' &&
        window.localStorage.getItem(PUSH_PROMPT_DISMISSED_KEY) !== 'true'
      ) {
        setShowPushModal(true);
      }
    }, 2800);

    return () => {
      window.clearTimeout(splashTimer);
      clearTimeout(checkPushPermission);
      window.visualViewport?.removeEventListener('resize', syncViewportHeight);
      window.visualViewport?.removeEventListener('scroll', syncViewportHeight);
      window.removeEventListener('resize', syncViewportHeight);
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
      window.removeEventListener('appinstalled', markInstalled);
      window.removeEventListener('pwa-open-notifications', openDrawerListener);
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

  // Push notification permission handlers
  const requestPushPermission = async () => {
    setShowPushModal(false);
    window.localStorage.setItem(PUSH_PROMPT_DISMISSED_KEY, 'true');
    await notificationScheduler.requestPermission();
    loadNotifications();
  };

  const dismissPushModal = () => {
    setShowPushModal(false);
    window.localStorage.setItem(PUSH_PROMPT_DISMISSED_KEY, 'true');
  };

  // Notification Drawer mutations
  const deleteNotification = (id: string) => {
    const next = notifications.filter(n => n.id !== id);
    window.localStorage.setItem('hexatrack.notification-intents.v1', JSON.stringify(next));
    setNotifications(next);
  };

  const markAllAsRead = () => {
    const next = notifications.map(n => ({
      ...n,
      data: { ...n.data, unread: 'false' }
    }));
    window.localStorage.setItem('hexatrack.notification-intents.v1', JSON.stringify(next));
    setNotifications(next);
  };

  const clearAllNotifications = () => {
    window.localStorage.setItem('hexatrack.notification-intents.v1', '[]');
    setNotifications([]);
  };

  const getChannelConfig = (channel: NotificationChannel) => {
    switch (channel) {
      case 'budget-alert':
        return { color: '#F59E0B', label: 'Budget Alert', icon: AlertTriangle };
      case 'expense-reminder':
        return { color: '#EF4444', label: 'Expense Alert', icon: DollarSign };
      case 'recurring-transaction':
        return { color: '#06B6D4', label: 'Recurring', icon: Clock };
      case 'admin-alert':
        return { color: '#8B5CF6', label: 'Admin Log', icon: Briefcase };
      default:
        return { color: '#10B981', label: 'Inflow Notification', icon: Sparkles };
    }
  };

  return (
    <>
      {/* ─── 1. FULLSCREEN APP SPLASH SCREEN ─── */}
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="pwa-splash fixed inset-0 z-[100] grid place-items-center bg-[#050816] px-6 select-none"
          >
            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="grid h-24 w-24 place-items-center rounded-3xl bg-[#0E152B] border border-white/[0.05] shadow-[0_0_50px_rgba(16,185,129,0.15)] accent-glow relative"
              >
                <Image src="/icons/icon-192x192.png" alt="" width={80} height={80} className="h-20 w-20 rounded-2xl" priority />
                <div className="absolute inset-0 rounded-3xl border border-primary/20 animate-pulse" />
              </motion.div>
              <motion.div 
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-8 flex flex-col items-center"
              >
                <BrandMark tone="dark" className="scale-110" />
                <p className="mt-4 text-[9px] font-black text-cyan tracking-[0.2em] font-label-mono uppercase leading-none">INITIALIZING PWA SHELL</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. OFFLINE TELEMETRY STATUS BANNER ─── */}
      {!online && (
        <div className="fixed inset-x-0 top-0 z-[90] px-3 pt-[max(env(safe-area-inset-top),0.75rem)] animate-bounce">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-danger/20 bg-[#120F16]/95 px-4 py-3 text-sm font-medium text-danger shadow-[0_18px_42px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <WifiOff className="h-5 w-5 shrink-0 text-danger" />
            <span className="min-w-0 flex-1 text-xs font-sans tracking-wide">Offline mode. Vault engine using secure cached balances.</span>
          </div>
        </div>
      )}

      {/* ─── 3. PREMIUM PWA APP INSTALL BANNER ─── */}
      {installPrompt && !dismissed && !standalone && (
        <div className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[89] px-4 md:bottom-6">
          <div className="mx-auto max-w-md rounded-2xl border border-white/[0.06] bg-[#0E152B]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Smartphone size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black tracking-wide text-on-surface">Install HexaTrack App</h4>
                <p className="text-xs text-on-surface-variant/75 mt-0.5 leading-relaxed">Add HexaTrack to your home screen for quick standalone entry, splash startup, and offline vaults.</p>
              </div>
              <button
                aria-label="Dismiss install prompt"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-on-surface-variant/40 hover:bg-white/[0.04] active:scale-90 transition"
                onClick={dismissInstall}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex gap-3 justify-end">
              <button 
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 hover:text-on-surface transition"
                onClick={dismissInstall}
                type="button"
              >
                Not Now
              </button>
              <button 
                className="bg-primary hover:brightness-105 shadow-md shadow-primary/10 text-white rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest border border-white/[0.08]"
                onClick={install} 
                type="button"
              >
                Install App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. BROWSER PUSH NOTIFICATION MODAL ─── */}
      <AnimatePresence>
        {showPushModal && (
          <div className="fixed inset-0 z-[98] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 md:items-center">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm rounded-[24px] border border-white/[0.06] bg-[#0E152B] p-6 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/5 blur-2xl rounded-full" />
              
              <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
                <Bell size={24} className="animate-bounce" />
              </div>
              
              <h3 className="text-center text-base font-black tracking-wide text-on-surface leading-snug">Enable Notifications</h3>
              <p className="text-center text-xs text-on-surface-variant/80 mt-2.5 leading-relaxed px-2">
                Stay updated in real-time with push alerts on budget caps, instant expense signals, and recurring reminders on your device.
              </p>
              
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={requestPushPermission}
                  className="h-11 w-full bg-primary hover:brightness-105 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/[0.08] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  Allow Signals
                  <ArrowRight size={12} />
                </button>
                <button
                  onClick={dismissPushModal}
                  className="h-11 w-full bg-white/[0.02] hover:bg-white/[0.04] rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant active:scale-[0.98] transition-all"
                >
                  Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 5. PWA SIGNALS NOTIFICATION DRAWER (Notification Center) ─── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[999] flex justify-end bg-black/60 backdrop-blur-sm">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative h-full w-full max-w-md bg-[#050816] border-l border-white/[0.05] shadow-2xl flex flex-col pt-[max(env(safe-area-inset-top),1rem)]"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-on-surface tracking-wide leading-none">Telemetry Signals</h3>
                    <span className="text-[9px] font-bold font-label-caps text-on-surface-variant/40 uppercase tracking-widest mt-1 block">
                      {notifications.filter(n => n.data?.unread === 'true').length} unread alerts
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <>
                      <button 
                        onClick={markAllAsRead}
                        title="Mark all read"
                        className="h-8 w-8 rounded-lg bg-white/[0.01] border border-white/[0.04] text-on-surface-variant/60 hover:text-primary active:scale-95 transition-all flex items-center justify-center"
                      >
                        <CheckCheck size={14} />
                      </button>
                      <button 
                        onClick={clearAllNotifications}
                        title="Clear all"
                        className="h-8 w-8 rounded-lg bg-white/[0.01] border border-white/[0.04] text-on-surface-variant/60 hover:text-danger active:scale-95 transition-all flex items-center justify-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="h-8 w-8 rounded-lg bg-white/[0.02] border border-white/[0.04] text-on-surface-variant/60 hover:text-on-surface active:scale-95 transition-all flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable Alerts feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {notifications.map((item) => {
                    const cfg = getChannelConfig(item.channel);
                    const isUnread = item.data?.unread === 'true';
                    const Icon = cfg.icon;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 80 }}
                        className={`rounded-xl border p-4 transition-all relative overflow-hidden flex gap-3 hover:bg-white/[0.01] ${
                          isUnread ? 'bg-[#0E152B]/40 border-primary/20' : 'bg-white/[0.01] border-white/[0.04]'
                        }`}
                      >
                        {/* Channel indicator icon */}
                        <div 
                          className="h-9 w-9 rounded-xl flex-shrink-0 flex items-center justify-center border"
                          style={{ 
                            backgroundColor: `${cfg.color}08`, 
                            borderColor: `${cfg.color}18`,
                            color: cfg.color
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span 
                              className="text-[8px] font-black uppercase tracking-widest font-label-caps"
                              style={{ color: cfg.color }}
                            >
                              {cfg.label}
                            </span>
                            <span className="text-[8px] font-medium text-on-surface-variant/40">
                              {new Date(item.scheduledFor).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <h4 className="text-xs font-bold text-on-surface mt-1 leading-snug flex items-center gap-1.5">
                            {item.title}
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant/80 mt-1 leading-relaxed">{item.body}</p>
                        </div>
                        
                        <button
                          onClick={() => deleteNotification(item.id)}
                          className="h-6 w-6 rounded-md bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] text-on-surface-variant/40 hover:text-danger transition-colors flex items-center justify-center flex-shrink-0 self-start"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {notifications.length === 0 && (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center px-6 select-none">
                    <div className="h-16 w-16 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-center text-on-surface-variant/30 mb-4">
                      <Bell size={24} />
                    </div>
                    <h4 className="text-xs font-bold text-on-surface">No alerts logged</h4>
                    <p className="text-[10px] text-on-surface-variant/50 max-w-[200px] mt-1.5 leading-normal">Operational signal queues are synchronized and empty.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
