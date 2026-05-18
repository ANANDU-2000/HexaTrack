'use client';

import { showToast } from '@/components/ui/toast';

export type NotificationChannel =
  | 'recurring-transaction'
  | 'budget-alert'
  | 'expense-reminder'
  | 'subscription-reminder'
  | 'admin-alert';

export type NotificationIntent = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  scheduledFor: string;
  data?: Record<string, string>;
};

const NOTIFICATION_INTENTS_KEY = 'hexatrack.notification-intents.v1';

export const notificationScheduler = {
  prepare() {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(NOTIFICATION_INTENTS_KEY)) {
      window.localStorage.setItem(NOTIFICATION_INTENTS_KEY, '[]');
    }

    // Auto-request notifications after a slight delay on initial boot to ensure app-like feel
    setTimeout(() => {
      this.requestPermission();
    }, 4000);
  },

  list(): NotificationIntent[] {
    if (typeof window === 'undefined') return [];

    try {
      return JSON.parse(window.localStorage.getItem(NOTIFICATION_INTENTS_KEY) ?? '[]') as NotificationIntent[];
    } catch {
      window.localStorage.setItem(NOTIFICATION_INTENTS_KEY, '[]');
      return [];
    }
  },

  save(intent: NotificationIntent) {
    if (typeof window === 'undefined') return;
    const next = [intent, ...this.list().filter((item) => item.id !== intent.id)];
    window.localStorage.setItem(NOTIFICATION_INTENTS_KEY, JSON.stringify(next));
  },

  supportsPush() {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.supportsPush()) return 'default';
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('[Push Notification] Permission granted');
        // Trigger a beautiful startup welcome notification
        this.triggerLocalNotification(
          'admin-alert',
          '⚡ HexaTrack Premium Active',
          'Progressive Web App shell loaded. Offline-ready vaults active.'
        );
      }
      return permission;
    } catch (e) {
      console.warn('Notification permission request failed', e);
      return 'default';
    }
  },

  triggerLocalNotification(channel: NotificationChannel, title: string, body: string) {
    if (typeof window === 'undefined') return;

    // 1. Log the notification intent
    const newIntent: NotificationIntent = {
      id: crypto.randomUUID(),
      channel,
      title,
      body,
      scheduledFor: new Date().toISOString(),
    };
    this.save(newIntent);

    // 2. Play subtle sound or show custom toast fallback
    showToast('success', `${title}: ${body}`);

    // 3. Fire Native OS Push Notification if permitted
    if (this.supportsPush() && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/favicon.ico',
          vibrate: [100, 50, 100],
          tag: `hexatrack-${channel}`,
          data: { channel }
        } as any);
      });
    }
  },

  scheduleNotification(channel: NotificationChannel, title: string, body: string, delayMs: number) {
    setTimeout(() => {
      this.triggerLocalNotification(channel, title, body);
    }, delayMs);
  }
};
