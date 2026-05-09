import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Fingerprint,
  Globe2,
  HelpCircle,
  Info,
  KeyRound,
  Layers,
  LogOut,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CategoriesSettingsPanel } from '@/components/settings/categories-settings-panel';
import { BrandMark } from '@/components/ui/brand';
import { AppScreen } from '@/components/ui/mobile-layout';
import { notificationScheduler } from '@/lib/notifications';
import { useAuthStore } from '@/store/auth-store';

type SettingsView =
  | 'root'
  | 'profile'
  | 'categories'
  | 'intelligence'
  | 'security'
  | 'biometric'
  | 'notifications'
  | 'appearance'
  | 'currency'
  | 'language'
  | 'privacy'
  | 'help'
  | 'about'
  | 'logout';

const menuGroups = [
  [
    { view: 'intelligence' as const, icon: Sparkles, title: 'HexaTrack Intelligence', detail: 'Insights, anomaly detection, category suggestions' },
    { view: 'security' as const, icon: ShieldCheck, title: 'Security', detail: 'JWT session, device controls, trusted login' },
    { view: 'biometric' as const, icon: Fingerprint, title: 'Biometric unlock', detail: 'Face ID, fingerprint, and quick unlock' },
    { view: 'notifications' as const, icon: Bell, title: 'Notifications', detail: 'Recurring bills and spending alerts' },
    { view: 'appearance' as const, icon: Palette, title: 'Appearance', detail: 'Theme and visual preferences' },
  ],
  [
    { view: 'currency' as const, icon: CircleDollarSign, title: 'Currency', detail: 'Default display currency and formats' },
    { view: 'language' as const, icon: Globe2, title: 'Language', detail: 'App language and regional formats' },
    { view: 'categories' as const, icon: Layers, title: 'Categories', detail: 'Parent categories and subcategories' },
    { view: 'privacy' as const, icon: KeyRound, title: 'Privacy', detail: 'Data controls and API connection' },
  ],
  [
    { view: 'help' as const, icon: HelpCircle, title: 'Help Center', detail: 'Support, FAQs, and contact options' },
    { view: 'about' as const, icon: Info, title: 'About App', detail: 'HexaTrack version and legal details' },
    { view: 'logout' as const, icon: LogOut, title: 'Logout', detail: 'Sign out of this device', danger: true },
  ],
];

export function SettingsScreen() {
  const [view, setView] = useState<SettingsView>('root');
  const logout = useAuthStore((state) => state.logout);

  return (
    <AppScreen>
      <AnimatePresence mode="wait">
        {view === 'root' ? (
          <motion.div key="settings-root" className="space-y-4" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.18 }}>
            <div>
              <p className="eyebrow">Preferences</p>
              <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
            </div>

            <motion.button
              className="card group flex min-h-[5.5rem] w-full items-center gap-4 p-4 text-left transition hover:border-[#D1FAE5] active:scale-[0.99]"
              onClick={() => setView('profile')}
              type="button"
              whileTap={{ scale: 0.985 }}
            >
              <BrandMark compact />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-[#111827]">HexaTrack</h2>
                <p className="truncate text-sm text-[#6B7280]">Track Smarter. Spend Better.</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#6B7280] transition group-hover:translate-x-0.5 group-hover:text-[#059669]" />
            </motion.button>

            {menuGroups.map((group, groupIndex) => (
              <section key={groupIndex} className="card overflow-hidden">
                {group.map((item) => (
                  <SettingsItem key={item.view} {...item} onClick={() => setView(item.view)} />
                ))}
              </section>
            ))}
          </motion.div>
        ) : (
          <SettingsDetail key={view} view={view} onBack={() => setView('root')} onLogout={logout} />
        )}
      </AnimatePresence>
    </AppScreen>
  );
}

function SettingsItem({ danger = false, detail, icon: Icon, onClick, title }: { danger?: boolean; detail: string; icon: React.ElementType; onClick: () => void; title: string }) {
  return (
    <motion.button className="group flex min-h-[4.75rem] w-full items-center gap-3 border-b border-[#E5E7EB] px-4 py-3 text-left last:border-b-0 transition hover:bg-[#F8FAFC]" onClick={onClick} type="button" whileTap={{ scale: 0.985 }}>
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${danger ? 'bg-red-50 text-red-600' : 'bg-[#ECFDF5] text-[#059669]'}`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${danger ? 'text-red-600' : 'text-[#111827]'}`}>{title}</p>
        <p className="truncate text-xs text-[#6B7280]">{detail}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-[#9CA3AF] transition group-hover:translate-x-0.5 group-hover:text-[#059669]" />
    </motion.button>
  );
}

function SettingsDetail({ onBack, onLogout, view }: { onBack: () => void; onLogout: () => void; view: Exclude<SettingsView, 'root'> }) {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [billAlerts, setBillAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [theme, setTheme] = useState<'Light' | 'Dark' | 'System'>('System');
  const pushReady = notificationScheduler.supportsPush();

  const titleMap: Record<typeof view, string> = {
    profile: 'Profile',
    categories: 'Categories',
    intelligence: 'Intelligence',
    security: 'Security',
    biometric: 'Biometric Unlock',
    notifications: 'Notifications',
    appearance: 'Appearance',
    currency: 'Currency',
    language: 'Language',
    privacy: 'Privacy',
    help: 'Help Center',
    about: 'About HexaTrack',
    logout: 'Logout',
  };

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
      <div className="flex items-center gap-3">
        <motion.button aria-label="Back to settings" className="icon-button" onClick={onBack} type="button" whileTap={{ scale: 0.94 }}>
          <ChevronLeft size={20} />
        </motion.button>
        <div className="min-w-0">
          <p className="eyebrow">Settings</p>
          <h1 className="truncate text-2xl font-bold text-[#111827]">{titleMap[view]}</h1>
        </div>
      </div>

      {view === 'profile' && <Panel title="HexaTrack profile" detail="Manage your product identity and connected workspace." rows={['Workspace: HexaTrack Personal', 'Email: maya@hexatrack.app', 'Plan: Starter']} />}
      {view === 'categories' && <CategoriesSettingsPanel />}
      {view === 'intelligence' && <Panel title="AI insights" detail="Personalized insights are enabled for spending trends, category suggestions, and anomaly detection." rows={['Weekly cashflow summary', 'Merchant category suggestions', 'Recurring spend detection']} />}
      {view === 'security' && <Panel title="Security controls" detail="Your session is protected with token-based authentication and device-aware controls." rows={['Trusted device: This browser', 'Session timeout: 60 minutes', 'API connection: Active']} />}
      {view === 'biometric' && (
        <section className="card p-4">
          <ToggleRow label="Enable quick unlock" detail="Use device biometric unlock when available." enabled={biometricEnabled} onToggle={() => setBiometricEnabled((value) => !value)} />
        </section>
      )}
      {view === 'notifications' && (
        <section className="card divide-y divide-[#E5E7EB]">
          <ToggleRow label="Recurring bill alerts" detail="Notify before scheduled payments are due." enabled={billAlerts} onToggle={() => setBillAlerts((value) => !value)} />
          <ToggleRow label="Budget warnings" detail="Notify when spending trends move unusually fast." enabled={budgetAlerts} onToggle={() => setBudgetAlerts((value) => !value)} />
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-[#111827]">Push notification structure</p>
            <p className="mt-1 text-xs leading-5 text-[#6B7280]">{pushReady ? 'This install can support recurring payment and budget alert push flows.' : 'Recurring payment and budget alert intents are stored locally until push is enabled.'}</p>
          </div>
        </section>
      )}
      {view === 'appearance' && (
        <section className="card p-4">
          <p className="text-sm font-semibold text-[#111827]">Theme mode</p>
          <div className="mt-3 grid grid-cols-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-1">
            {(['Light', 'Dark', 'System'] as const).map((item) => (
              <button key={item} className={`rounded-xl px-2 py-3 text-xs font-semibold transition ${theme === item ? 'bg-white text-[#059669] shadow-sm' : 'text-[#6B7280]'}`} onClick={() => setTheme(item)} type="button">
                {item === 'Light' && <Sun className="mx-auto mb-1 h-4 w-4" />}
                {item === 'Dark' && <Moon className="mx-auto mb-1 h-4 w-4" />}
                {item === 'System' && <Palette className="mx-auto mb-1 h-4 w-4" />}
                {item}
              </button>
            ))}
          </div>
        </section>
      )}
      {view === 'currency' && <Panel title="Currency" detail="Default currency is used for summaries, reports, and new transactions." rows={['Default: USD', 'Number format: 1,234.56', 'Exchange updates: Manual']} />}
      {view === 'language' && <Panel title="Language" detail="Regional formats keep dates and amounts familiar." rows={['Language: English', 'Region: United States', 'Date format: MMM d, yyyy']} />}
      {view === 'privacy' && <Panel title="Privacy" detail="Control local session data and API behavior." rows={['Local session storage: Enabled', 'Analytics sharing: Off', 'Export data: Available']} />}
      {view === 'help' && <Panel title="Help Center" detail="Support resources for the HexaTrack workspace." rows={['FAQs', 'Contact support', 'Report a bug']} />}
      {view === 'about' && <Panel title="HexaTrack" detail="Track Smarter. Spend Better." rows={['Version: 0.0.0', 'Build: Local development', 'Made for premium fintech workflows']} />}
      {view === 'logout' && (
        <section className="card p-4">
          <p className="text-sm font-semibold text-[#111827]">Sign out of this device?</p>
          <p className="mt-1 text-sm leading-6 text-[#6B7280]">Your local session will be cleared and you can sign in again anytime.</p>
          <button className="mt-4 min-h-12 w-full rounded-2xl bg-red-600 px-4 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition active:scale-[0.98]" onClick={onLogout} type="button">
            Logout
          </button>
        </section>
      )}
    </motion.div>
  );
}

function Panel({ detail, rows, title }: { detail: string; rows: string[]; title: string }) {
  return (
    <section className="card p-4">
      <p className="text-sm font-semibold text-[#111827]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#6B7280]">{detail}</p>
      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <div key={row} className="rounded-2xl bg-[#F8FAFC] px-3 py-3 text-sm font-medium text-[#111827]">
            {row}
          </div>
        ))}
      </div>
    </section>
  );
}

function ToggleRow({ detail, enabled, label, onToggle }: { detail: string; enabled: boolean; label: string; onToggle: () => void }) {
  return (
    <button className="flex min-h-[4.75rem] w-full items-center gap-3 px-4 py-3 text-left" onClick={onToggle} type="button">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#111827]">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#6B7280]">{detail}</p>
      </div>
      <span className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition ${enabled ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`}>
        <motion.span className="block h-6 w-6 rounded-full bg-white shadow-sm" animate={{ x: enabled ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
      </span>
    </button>
  );
}
