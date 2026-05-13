'use client';

import { 
  BarChart3, 
  History as HistoryIcon, 
  Home, 
  Plus, 
  Sparkles, 
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Scan,
  FileSpreadsheet
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
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const toggleSpeedDial = () => setSpeedDialOpen(!speedDialOpen);

  const handleAction = (action: () => void) => {
     setSpeedDialOpen(false);
     action();
  };

  // Advanced Expansion Menu mapping all operational Fintech actions to actual functional handlers!
  const speedDialItems = [
    { label: 'Create Report', icon: FileSpreadsheet, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', delay: 0.15, onClick: () => onNavigate('reports') },
    { label: 'Quick Transfer', icon: ArrowRightLeft, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', delay: 0.12, onClick: () => onNavigate('wallets') },
    { label: 'Scan Receipt', icon: Scan, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', delay: 0.09, onClick: () => onNavigate('settings') },
    { label: 'Add Income', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', delay: 0.06, onClick: onAddTransaction },
    { label: 'Add Expense', icon: DollarSign, color: 'text-red-400 bg-red-500/10 border-red-500/20', delay: 0.03, onClick: onAddTransaction },
  ];

  return (
    <>
      {/* 1. BLUR OVERLAY BACKDROP */}
      <AnimatePresence>
        {speedDialOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSpeedDialOpen(false)}
            className="fixed inset-0 z-40 bg-[#0B0D11]/75 backdrop-blur-[8px] lg:hidden pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* 2. EXPANSION FAB MENU LIST */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center lg:hidden pb-[max(env(safe-area-inset-bottom),1.5rem)]">
         <div className="relative w-full max-w-md mx-auto flex justify-center px-4">
            <AnimatePresence>
              {speedDialOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute bottom-24 bg-[#11131A]/90 backdrop-blur-xl border border-white/[0.08] rounded-[24px] p-3.5 w-[260px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto flex flex-col gap-2.5"
                >
                  <div className="px-2 mb-1 border-b border-white/[0.05] pb-1.5">
                     <span className="text-[9px] font-black font-label-caps tracking-widest uppercase text-on-surface-variant/50">Quick Actions</span>
                  </div>
                  {speedDialItems.map((item, idx) => (
                     <motion.button
                       key={item.label}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -10 }}
                       transition={{ delay: item.delay, type: 'spring', stiffness: 500, damping: 30 }}
                       whileTap={{ scale: 0.96 }}
                       onClick={() => handleAction(item.onClick)}
                       className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-[#1D1F27]/40 hover:bg-[#1D1F27]/80 border border-outline-variant/10 text-left transition-colors group"
                     >
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color} shrink-0 transition-transform group-hover:scale-105`}>
                              <item.icon size={14} />
                           </div>
                           <span className="text-xs font-bold text-on-surface group-hover:text-white transition-colors">{item.label}</span>
                        </div>
                     </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      {/* 3. PREMIUM FLOATING GLASS BOTTOM NAVIGATION */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] lg:hidden">
        <nav className="pointer-events-auto relative mx-auto max-w-md select-none" aria-label="Mobile Floating Navigation">
          
          {/* Futuristic Capsule */}
          <div className="relative grid h-20 grid-cols-[1fr_1fr_5.5rem_1fr_1fr] items-center rounded-[32px] border border-white/[0.08] bg-[#11131A]/75 px-3 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-visible">
            
            {/* Left Controls: Dashboard, Ledger */}
            <BottomNavItem 
              active={activeScreen === 'dashboard'} 
              icon={Home} 
              label="Home" 
              onClick={() => { onNavigate('dashboard'); setSpeedDialOpen(false); }} 
            />
            <BottomNavItem 
              active={activeScreen === 'history'} 
              icon={HistoryIcon} 
              label="Ledger" 
              onClick={() => { onNavigate('history'); setSpeedDialOpen(false); }} 
            />

            {/* Glowing Center Floating FAB Button Assembly */}
            <div className="relative flex h-full items-center justify-center z-50">
              {/* Outer glowing pulse animation rings */}
              <motion.div 
                animate={{ scale: speedDialOpen ? 1.08 : [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-5 w-16 h-16 rounded-full bg-emerald-500/20 blur-md pointer-events-none"
              />
              
              <motion.button
                aria-label="Toggle Quick Actions"
                className="absolute -top-7 flex h-15 w-15 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border border-emerald-400/30 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all outline-none focus:outline-none cursor-pointer"
                onClick={toggleSpeedDial}
                type="button"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {/* Inner reflective glass layer */}
                <div className="absolute inset-0 rounded-full bg-white/10 overflow-hidden opacity-50 group-hover:opacity-80" />
                
                <motion.div
                  animate={{ rotate: speedDialOpen ? 135 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative z-10 drop-shadow-sm"
                >
                  <Plus size={28} strokeWidth={2.5} />
                </motion.div>
              </motion.button>
            </div>

            {/* Right Controls: Analytics, Assistant */}
            <BottomNavItem 
              active={activeScreen === 'reports'} 
              icon={BarChart3} 
              label="Analytics" 
              onClick={() => { onNavigate('reports'); setSpeedDialOpen(false); }} 
            />
            <BottomNavItem 
              active={activeScreen === 'assistant'} 
              icon={Sparkles} 
              label="AI Staff" 
              onClick={() => { onNavigate('assistant'); setSpeedDialOpen(false); }} 
            />
            
          </div>
        </nav>
      </div>
    </>
  );
}

// Isolated Premium Navigation Item with Dynamic Layout Animation
function BottomNavItem({ active, icon: Icon, label, onClick }: { active: boolean; icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <motion.button
      className={`relative flex h-15 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-extrabold tracking-wide transition-all select-none outline-none focus:outline-none group`}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.93 }}
    >
      {/* Sliding active pill backing using layoutId */}
      <AnimatePresence initial={false}>
        {active && (
          <motion.span
            layoutId="active-nav-capsule"
            className="absolute inset-0 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] z-0"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </AnimatePresence>

      {/* Active Icon & Label Display */}
      <div className="relative z-10 flex flex-col items-center gap-1 transition-all duration-300">
        <motion.div
          animate={{ 
            scale: active ? 1.1 : 1,
            y: active ? -2 : 0 
          }}
          className={`relative ${active ? 'text-emerald-400' : 'text-on-surface-variant/60 group-hover:text-on-surface-variant'}`}
        >
          <Icon className="h-5 w-5 drop-shadow-md" strokeWidth={active ? 2.5 : 2.2} />
          
          {/* Futuristic floating light dot for active selection */}
          {active && (
            <motion.div 
              layoutId="active-nav-dot"
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </motion.div>
        <span className={`text-[9px] uppercase tracking-widest font-label-caps leading-none transition-colors ${active ? 'text-emerald-400' : 'text-on-surface-variant/50 group-hover:text-on-surface-variant/70'}`}>
          {label}
        </span>
      </div>
    </motion.button>
  );
}
