export type NotificationChannel = 'recurring-payment' | 'budget-alert';

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
    const next = [intent, ...notificationScheduler.list().filter((item) => item.id !== intent.id)];
    window.localStorage.setItem(NOTIFICATION_INTENTS_KEY, JSON.stringify(next));
  },

  supportsPush() {
    return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  },
};
