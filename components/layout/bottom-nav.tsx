'use client';

import { 
  BarChart3, 
  History as HistoryIcon, 
  Home, 
  Plus, 
  ArrowRightLeft,
  Settings,
  Receipt,
  Wallet,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { ScreenKey } from '@/components/layout/app-shell';

type BottomNavProps = {
  activeScreen: ScreenKey;
  onAddTransaction: () => void;
  onNavigate: (screen: ScreenKey) => void;
};

export function BottomNav({ activeScreen, onAddTransaction, onNavigate }: BottomNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const toggleSheet = () => setSheetOpen(v => !v);
  const closeSheet = () => setSheetOpen(false);

  const handleAction = (action: () => void) => {
    closeSheet();
    action();
  };

  const sheetItems = [
    { 
      label: 'Add Expense', 
      subtitle: 'Record outbound payment', 
      icon: TrendingDown, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10 border-rose-500/20', 
      onClick: () => handleAction(onAddTransaction)
    },
    { 
      label: 'Add Income', 
      subtitle: 'Record incoming funds', 
      icon: TrendingUp, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10 border-emerald-500/20', 
      onClick: () => handleAction(onAddTransaction)
    },
    { 
      label: 'Transfer', 
      subtitle: 'Move funds between accounts', 
      icon: ArrowRightLeft, 
      color: 'text-teal-400', 
      bg: 'bg-teal-500/10 border-teal-500/20', 
      onClick: () => handleAction(() => onNavigate('wallets'))
    },
    { 
      label: 'Add Account', 
      subtitle: 'Connect bank or wallet', 
      icon: Wallet, 
      color: 'text-secondary', 
      bg: 'bg-secondary/10 border-secondary/20', 
      onClick: () => handleAction(() => onNavigate('wallets'))
    },
    { 
      label: 'Upload Receipt', 
      subtitle: 'Scan invoice or expense bill', 
      icon: Receipt, 
      color: 'text-primary', 
      bg: 'bg-primary/10 border-primary/20', 
      onClick: () => handleAction(onAddTransaction)
    },
  ];

  return (
    <>
      {/* ── BACKDROP ── */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeSheet}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── BOTTOM ACTION SHEET ── */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className="fixed inset-x-0 z-[70] flex flex-col"
            style={{ bottom: 'calc(78px + env(safe-area-inset-bottom))' }}
          >
            <div className="mx-4 bg-[#0E152B] border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_-16px_48px_rgba(0,0,0,0.6)]">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/15" />
              </div>
              {/* Title */}
              <div className="px-5 pt-2 pb-3 border-b border-white/[0.05]">
                <h3 className="text-[13px] font-bold text-white/90 tracking-wide">Quick Record</h3>
              </div>
              {/* Actions */}
              <div className="p-3 flex flex-col gap-1.5">
                {sheetItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 500, damping: 32 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={item.onClick}
                    className="flex items-center gap-4 w-full px-3 py-3 rounded-2xl bg-white/[0.025] active:bg-white/[0.06] text-left transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center border shrink-0 ${item.bg} ${item.color}`}>
                      <item.icon size={18} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-white leading-tight">{item.label}</span>
                      <span className="text-[11px] text-[#C2C6D6] mt-0.5 leading-tight">{item.subtitle}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FIXED BOTTOM NAV BAR ── 
           Height = 78px + env(safe-area-inset-bottom)
           Never covers scrollable content — the shell's <main> already has
           padding-bottom = calc(78px + safe-area + 24px)
      ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-50"
        style={{
          background: 'rgba(5,8,22,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(140,144,159,0.15)',
        }}
      >
        <nav
          className="mx-auto w-full max-w-md grid grid-cols-5 items-end select-none"
          style={{ height: 78, paddingBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="Mobile Bottom Navigation"
        >
          <NavItem
            active={activeScreen === 'dashboard'}
            icon={Home}
            label="Home"
            onClick={() => { onNavigate('dashboard'); closeSheet(); }}
          />

          <NavItem
            active={activeScreen === 'history'}
            icon={HistoryIcon}
            label="History"
            onClick={() => { onNavigate('history'); closeSheet(); }}
          />

          {/* ── CENTER FAB ── */}
          <div className="relative flex items-center justify-center" style={{ height: 78 }}>
            {/* Glow halo */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 64,
                height: 64,
                background: 'rgba(16,185,129,0.2)',
                filter: 'blur(12px)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -54%)',
              }}
            />
            <motion.button
              aria-label="Add Record"
              whileTap={{ scale: 0.90 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onClick={toggleSheet}
              type="button"
              className="relative z-10 flex items-center justify-center rounded-full overflow-hidden"
              style={{
                width: 64,
                height: 64,
                marginBottom: 10,
                background: 'linear-gradient(145deg, #34D399 0%, #10B981 50%, #059669 100%)',
                boxShadow: '0 8px 24px rgba(16,185,129,0.45), 0 2px 8px rgba(0,0,0,0.4)',
                border: '1.5px solid rgba(255,255,255,0.15)',
              }}
            >
              <motion.div
                animate={{ rotate: sheetOpen ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Plus size={28} strokeWidth={2} className="text-white" />
              </motion.div>
            </motion.button>
          </div>

          <NavItem
            active={activeScreen === 'reports'}
            icon={BarChart3}
            label="Reports"
            onClick={() => { onNavigate('reports'); closeSheet(); }}
          />

          <NavItem
            active={activeScreen === 'settings'}
            icon={Settings}
            label="Settings"
            onClick={() => { onNavigate('settings'); closeSheet(); }}
          />
        </nav>
      </div>
    </>
  );
}

type NavItemProps = {
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
};

function NavItem({ active, icon: Icon, label, onClick }: NavItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="relative flex flex-col items-center justify-end gap-1.5 w-full h-full pb-[10px] outline-none"
      aria-label={label}
    >
      {/* Active indicator line at top of nav */}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute top-0 inset-x-3 h-[2px] rounded-b-full"
          style={{ background: '#10B981', boxShadow: '0 2px 8px #10B981' }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        />
      )}

      <motion.div
        animate={{ y: active ? -1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{ color: active ? '#E1E2EC' : '#C2C6D6' }}
      >
        <Icon
          size={22}
          strokeWidth={1.75}
          style={active ? { filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' } : undefined}
        />
      </motion.div>

      <span
        className="leading-none font-medium"
        style={{
          fontSize: 11,
          color: active ? '#E1E2EC' : '#C2C6D6',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}
