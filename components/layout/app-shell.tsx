import { BarChart3, Clock3, History, Home, Plus, Settings, Wallet, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BrandMark } from '@/components/ui/brand';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';
import { useAuthStore } from '@/store/auth-store';

export type ScreenKey = 'dashboard' | 'transaction' | 'history' | 'reports' | 'recurring' | 'wallets' | 'settings';

const primaryNav = [
  { key: 'dashboard' as const, label: 'Home', icon: Home },
  { key: 'wallets' as const, label: 'Wallets', icon: Wallet },
  { key: 'history' as const, label: 'History', icon: History },
  { key: 'reports' as const, label: 'Reports', icon: BarChart3 },
  { key: 'settings' as const, label: 'Settings', icon: Settings },
];

const secondaryNav = [{ key: 'recurring' as const, label: 'Recurring', icon: Clock3 }];

type AppShellProps = {
  activeScreen: ScreenKey;
  transactionCount: number;
  children: React.ReactNode;
  onNavigate: (screen: ScreenKey) => void;
  onAddTransaction: () => void;
};

export function AppShell({ activeScreen, children, onAddTransaction, onNavigate, transactionCount }: AppShellProps) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="app-viewport-min mx-auto flex w-full max-w-[1440px] flex-col bg-background lg:flex-row relative">
      {/* Desktop Edge Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#1a1b4b] blur-[120px] opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block" />

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/[0.04] bg-surface-container-lowest/30 px-5 py-8 backdrop-blur-md lg:flex lg:flex-col z-10">
        <div className="px-2 mb-8">
          <BrandMark tone="dark" />
        </div>

        <div className="px-2 mb-6">
           <WorkspaceSwitcher />
        </div>

        <nav className="space-y-1">
          {[...primaryNav, ...secondaryNav.filter((item) => item.key === 'recurring')].map((item) => {
            const Icon = item.icon;
            const active = activeScreen === item.key;
            return (
              <button
                key={item.key}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container shadow-md shadow-secondary/10'
                    : 'text-on-surface-variant hover:bg-white/[0.04] hover:text-on-surface'
                }`}
                onClick={() => onNavigate(item.key)}
                type="button"
              >
                <Icon size={18} className={active ? 'text-on-secondary-container' : 'text-on-surface-variant opacity-60 group-hover:opacity-100 transition-opacity'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <button
          className="mt-auto flex w-full items-center gap-3 rounded-2xl border border-white/[0.04] bg-surface-container-high px-4 py-3.5 text-sm font-semibold text-error transition-all hover:bg-error/10 active:scale-[0.98]"
          onClick={logout}
          type="button"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="mobile-page-bottom min-w-0 flex-1 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-0 lg:pb-10 lg:pt-0 relative z-0 overflow-hidden">

        {activeScreen !== 'dashboard' && (
          <header className="mb-5 flex flex-col gap-3 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow">HexaTrack</p>
                <h1 className="truncate text-2xl font-bold text-[#F5F7FA]">Track Smarter</h1>
              </div>
              <button aria-label="Add transaction" className="icon-button" onClick={onAddTransaction} type="button">
                <Plus size={20} />
              </button>
            </div>
            <WorkspaceSwitcher />
          </header>
        )}
        {children}
      </main>

      <BottomNav activeScreen={activeScreen} onAddTransaction={onAddTransaction} onNavigate={onNavigate} />
    </div>
  );
}
