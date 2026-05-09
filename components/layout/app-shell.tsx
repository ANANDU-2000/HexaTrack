import { BarChart3, Clock3, History, Home, Plus, Settings, UsersRound } from 'lucide-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BrandMark } from '@/components/ui/brand';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';

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
  return (
    <div className="app-viewport-min mx-auto flex w-full max-w-6xl flex-col lg:flex-row">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-[#E5E7EB] bg-white px-5 py-6 lg:block">
        <div>
          <BrandMark />
          <div className="mt-4">
            <WorkspaceSwitcher />
          </div>
          <p className="mt-2 text-xs text-[#6B7280]">{transactionCount} tracked entries</p>
        </div>

        <button
          className="primary-button mt-7 w-full"
          onClick={onAddTransaction}
          type="button"
        >
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
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active ? 'bg-[#D1FAE5] text-[#059669]' : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'
                }`}
                onClick={() => onNavigate(item.key)}
                type="button"
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="mobile-page-bottom min-w-0 flex-1 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
        <header className="mb-5 flex flex-col gap-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">HexaTrack</p>
              <h1 className="text-2xl font-bold text-[#111827]">Track Smarter</h1>
            </div>
            <button aria-label="Add transaction" className="icon-button" onClick={onAddTransaction} type="button">
              <Plus size={20} />
            </button>
          </div>
          <WorkspaceSwitcher />
        </header>
        {children}
      </main>

      <BottomNav activeScreen={activeScreen} onAddTransaction={onAddTransaction} onNavigate={onNavigate} />
    </div>
  );
}
