import { BarChart3, Clock3, History, Home, Plus, Settings, UsersRound, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BrandMark } from '@/components/ui/brand';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';
import { useAuthStore } from '@/store/auth-store';

export type ScreenKey = 'dashboard' | 'transaction' | 'history' | 'reports' | 'recurring' | 'groups' | 'settings';

const primaryNav = [
  { key: 'dashboard' as const, label: 'Home', icon: Home },
  { key: 'history' as const, label: 'History', icon: History },
  { key: 'reports' as const, label: 'Reports', icon: BarChart3 },
  { key: 'groups' as const, label: 'Groups', icon: UsersRound },
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
    <div className="app-viewport-min mx-auto flex w-full max-w-6xl flex-col bg-[#0B1015] lg:flex-row">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/[0.06] bg-[#121A22] px-5 py-6 lg:flex lg:flex-col">
        <div>
          <BrandMark tone="dark" />
          <div className="mt-4">
            <WorkspaceSwitcher />
          </div>
          <p className="mt-2 text-xs text-[#8B9BB4]">{transactionCount} tracked entries</p>
        </div>

        <button className="primary-button mt-7 w-full" onClick={onAddTransaction} type="button">
          <Plus size={18} />
          Add transaction
        </button>

        <nav className="mt-7 space-y-1">
          {[...primaryNav, ...secondaryNav.filter((item) => item.key === 'recurring')].map((item) => {
            const Icon = item.icon;
            const active = activeScreen === item.key;
            return (
              <button
                key={item.key}
                className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-[#4F8CFF]/15 text-[#F5F7FA]'
                    : 'text-[#8B9BB4] hover:bg-white/[0.04] hover:text-[#F5F7FA]'
                }`}
                onClick={() => onNavigate(item.key)}
                type="button"
              >
                <Icon size={18} className={active ? 'text-[#4F8CFF]' : undefined} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <button
          className="mt-auto flex w-full items-center gap-3 rounded-[18px] border border-white/[0.04] bg-[#0B1015] px-3 py-3.5 text-sm font-semibold text-[#FF5C75] transition hover:bg-[#FF5C75]/10 active:scale-[0.98]"
          onClick={logout}
          type="button"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="mobile-page-bottom min-w-0 flex-1 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
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
