'use client';

import { BarChart3, History, Home, Plus, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ScreenKey } from '@/components/layout/app-shell';

const tabs = [
  { key: 'dashboard' as const, label: 'Home', icon: Home },
  { key: 'history' as const, label: 'History', icon: History },
  { key: 'reports' as const, label: 'Reports', icon: BarChart3 },
  { key: 'settings' as const, label: 'Settings', icon: Settings },
];

type BottomNavProps = {
  activeScreen: ScreenKey;
  onAddTransaction: () => void;
  onNavigate: (screen: ScreenKey) => void;
};

export function BottomNav({ activeScreen, onAddTransaction, onNavigate }: BottomNavProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.85rem)] lg:hidden">
      <nav className="pointer-events-auto relative mx-auto max-w-md" aria-label="Primary">
        <div className="absolute inset-x-4 bottom-0 h-14 rounded-[2rem] bg-[#4F8CFF]/12 blur-2xl" />
        <div className="relative grid min-h-[5.25rem] grid-cols-[1fr_1fr_4.75rem_1fr_1fr] items-end rounded-[2rem] border border-white/[0.06] bg-[#121A22]/95 px-2 pb-2 pt-3 shadow-[0_20px_52px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {tabs.slice(0, 2).map((item) => (
            <BottomNavItem key={item.key} active={activeScreen === item.key} icon={item.icon} label={item.label} onClick={() => onNavigate(item.key)} />
          ))}

          <div className="relative flex h-full items-center justify-center">
            <motion.button
              aria-label="Add expense"
              className="absolute -top-8 grid h-16 w-16 place-items-center rounded-full bg-[#4F8CFF] text-white shadow-[0_18px_36px_rgba(79,140,255,0.35)] ring-8 ring-[#0B1015] transition-colors hover:brightness-110"
              onClick={onAddTransaction}
              type="button"
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 520, damping: 32 }}
            >
              <Plus size={28} strokeWidth={2.7} />
            </motion.button>
          </div>

          {tabs.slice(2).map((item) => (
            <BottomNavItem key={item.key} active={activeScreen === item.key} icon={item.icon} label={item.label} onClick={() => onNavigate(item.key)} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function BottomNavItem({ active, icon: Icon, label, onClick }: { active: boolean; icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <motion.button
      className={`relative flex min-h-[4.25rem] min-w-0 flex-col items-center justify-center gap-1.5 rounded-3xl px-1 text-[11px] font-semibold leading-none transition-colors ${
        active ? 'text-[#4F8CFF]' : 'text-[#8B9BB4]'
      }`}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
    >
      <AnimatePresence>
        {active && (
          <motion.span
            className="absolute inset-x-1 top-1 h-[3.9rem] rounded-3xl bg-[#4F8CFF]/12"
            layoutId="bottom-nav-active-pill"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
      </AnimatePresence>
      <Icon className="relative h-5 w-5" strokeWidth={active ? 2.6 : 2.2} />
      <span className="relative block w-full truncate text-center">{label}</span>
    </motion.button>
  );
}
