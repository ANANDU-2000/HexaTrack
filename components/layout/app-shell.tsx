import { BarChart3, Clock3, History, Home, Plus, Settings, Wallet, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { BrandMark } from '@/components/ui/brand';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';
import { useAuthStore } from '@/store/auth-store';

export type ScreenKey = 'dashboard' | 'transaction' | 'history' | 'reports' | 'recurring' | 'wallets' | 'settings' | 'assistant';

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
    <div className="app-viewport-min mx-auto flex w-full max-w-[1440px] flex-col bg-background lg:flex-row relative font-sans">
      {/* Deep Space Atmospheric Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-container/10 blur-[140px] opacity-40 rounded-full -translate-x-1/3 -translate-y-1/3 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan/5 blur-[120px] opacity-20 rounded-full pointer-events-none hidden lg:block" />

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/[0.05] bg-[#111827]/50 px-5 py-8 backdrop-blur-xl lg:flex lg:flex-col z-10">
        <div className="flex items-center gap-3 px-2 mb-8">
          <BrandMark tone="dark" className="h-7 w-auto text-primary" />
          <span className="font-headline text-xl font-bold tracking-tight text-on-surface">HexaTrack</span>
        </div>

        <div className="px-1 mb-8">
           <WorkspaceSwitcher />
        </div>

        <nav className="space-y-2 flex-1">
          <div className="px-2 text-[10px] font-black tracking-[0.15em] text-on-surface-variant/40 uppercase font-label-caps mb-2">Workspace</div>
          
          {[...primaryNav].map((item) => {
            const Icon = item.icon;
            const active = activeScreen === item.key;
            return (
              <button
                key={item.key}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[13px] font-semibold font-sans tracking-wide transition-all duration-250 group relative ${
                  active
                    ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(207,188,255,0.15)] shadow-sm'
                    : 'text-on-surface-variant hover:bg-white/[0.03] hover:text-on-surface'
                }`}
                onClick={() => onNavigate(item.key)}
                type="button"
              >
                <Icon size={18} className={active ? 'text-primary' : 'text-on-surface-variant opacity-50 group-hover:opacity-90 transition-opacity'} />
                {item.label}
                {active && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(207,188,255,0.6)]" />
                )}
              </button>
            );
          })}

          <div className="pt-4 px-2 text-[10px] font-black tracking-[0.15em] text-on-surface-variant/40 uppercase font-label-caps mb-2">Manage</div>
          {[...secondaryNav].map((item) => {
             const Icon = item.icon;
             const active = activeScreen === item.key;
             return (
               <button
                 key={item.key}
                 className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[13px] font-semibold font-sans tracking-wide transition-all duration-250 group relative ${
                   active
                     ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(207,188,255,0.15)]'
                     : 'text-on-surface-variant hover:bg-white/[0.03] hover:text-on-surface'
                 }`}
                 onClick={() => onNavigate(item.key)}
                 type="button"
               >
                 <Icon size={18} className={active ? 'text-primary' : 'text-on-surface-variant opacity-50 group-hover:opacity-90 transition-opacity'} />
                 {item.label}
               </button>
             );
          })}
        </nav>

        <div className="pt-4 border-t border-white/[0.05] mt-auto">
          <button
            className="flex w-full items-center gap-3 rounded-xl border border-white/[0.04] bg-[#141218] px-4 py-3.5 text-[13px] font-semibold font-sans text-danger transition-all hover:bg-error-container/20 active:scale-[0.98]"
            onClick={logout}
            type="button"
          >
            <LogOut size={18} className="opacity-80" />
            Disconnect
          </button>
        </div>
      </aside>

      <main className="mobile-page-bottom min-w-0 flex-1 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-8 lg:pb-10 lg:pt-8 relative z-0">

        {activeScreen !== 'dashboard' && (
          <header className="mb-6 flex flex-col gap-4 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow tracking-widest mb-0.5">HEXATRACK</p>
                <h1 className="truncate text-2xl font-bold tracking-tight text-on-surface">Command Station</h1>
              </div>
              <button 
                aria-label="Add entry" 
                className="w-11 h-11 rounded-2xl bg-[#111827] border border-white/[0.05] text-cyan shadow-sm flex items-center justify-center active:scale-95 transition-transform" 
                onClick={onAddTransaction} 
                type="button"
              >
                <Plus size={20} strokeWidth={2.5} />
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

