'use client';

import { 
  BarChart3, 
  History as HistoryIcon, 
  Home, 
  Plus, 
  Sparkles, 
  ArrowRightLeft,
  DollarSign,
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
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const toggleSpeedDial = () => setSpeedDialOpen(!speedDialOpen);

  const handleAction = (action: () => void) => {
     setSpeedDialOpen(false);
     action();
  };

  // Primary speed dial operational items adjusted for operational fintech direction
  const speedDialItems = [
    { label: 'Add Income', icon: TrendingUp, color: 'text-teal bg-teal/10 border-teal/20', delay: 0.06, onClick: onAddTransaction },
    { label: 'Add Expense', icon: DollarSign, color: 'text-emerald bg-emerald/10 border-emerald/20', delay: 0, onClick: onAddTransaction },
  ];

  return (
    <>
      {/* Speed Dial Backdrop Overlay */}
      <AnimatePresence>
        {speedDialOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSpeedDialOpen(false)}
            className="fixed inset-0 z-30 bg-[#0B0D11]/80 backdrop-blur-md lg:hidden pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* Floating Speed Dial Buttons Menu */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center lg:hidden pb-[max(env(safe-area-inset-bottom),1.25rem)]">
         <div className="relative w-full max-w-md mx-auto flex justify-center">
            <AnimatePresence>
              {speedDialOpen && (
                <div className="absolute bottom-24 flex flex-col items-center gap-4 pointer-events-auto">
                  {speedDialItems.map((item) => (
                     <motion.div
                       key={item.label}
                       initial={{ opacity: 0, y: 15, scale: 0.9 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.9 }}
                       transition={{ type: 'spring', stiffness: 400, damping: 28, delay: item.delay }}
                       className="flex items-center gap-3 group"
                     >
                        {/* Text Label Tag */}
                        <span className="px-3 py-1.5 rounded-lg bg-[#1D1F27] border border-outline-variant/20 shadow-md text-[10px] font-black tracking-wider font-label-caps text-on-surface whitespace-nowrap uppercase">
                           {item.label}
                        </span>
                        
                        {/* Action Button Node */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAction(item.onClick)}
                          className={`w-12 h-12 rounded-xl border ${item.color} shadow-md flex items-center justify-center active:brightness-110 transition-all`}
                        >
                           <item.icon size={18} />
                        </motion.button>
                     </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
         </div>
      </div>

      {/* Fixed Floating Bottom Navigation Bar Component */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] lg:hidden">
        <nav className="pointer-events-auto relative mx-auto max-w-md select-none" aria-label="Mobile Navigation Bar">
          
          {/* Primary Matte Clean Container */}
          <div className="relative grid min-h-[4.75rem] grid-cols-[1fr_1fr_4.25rem_1fr_1fr] items-center rounded-2xl border border-outline-variant/20 bg-[#11131A]/90 px-2 shadow-xl backdrop-blur-xl">
            
            {/* Left Side Controls (Home, Reports) */}
            <BottomNavItem 
              active={activeScreen === 'dashboard'} 
              icon={Home} 
              label="Home" 
              onClick={() => { onNavigate('dashboard'); setSpeedDialOpen(false); }} 
            />
            <BottomNavItem 
              active={activeScreen === 'reports'} 
              icon={BarChart3} 
              label="Reports" 
              onClick={() => { onNavigate('reports'); setSpeedDialOpen(false); }} 
            />

            {/* Floating Action Button */}
            <div className="relative flex h-full items-center justify-center">
              <motion.button
                aria-label="Add transaction"
                className={`absolute -top-5 grid h-13 w-13 place-items-center rounded-xl border shadow-lg transition-all outline-none z-50 ${
                  speedDialOpen 
                    ? 'bg-[#1D1F27] text-emerald border-emerald/30' 
                    : 'bg-emerald text-white border-transparent shadow-emerald/20'
                }`}
                onClick={toggleSpeedDial}
                type="button"
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <motion.div
                  animate={{ rotate: speedDialOpen ? 135 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Plus size={24} strokeWidth={2.5} />
                </motion.div>
              </motion.button>
            </div>

            {/* Right Side Controls (History, Assistant) */}
            <BottomNavItem 
              active={activeScreen === 'history'} 
              icon={HistoryIcon} 
              label="History" 
              onClick={() => { onNavigate('history'); setSpeedDialOpen(false); }} 
            />
            <BottomNavItem 
              active={activeScreen === 'assistant'} 
              icon={Sparkles} 
              label="AI Help" 
              onClick={() => { onNavigate('assistant'); setSpeedDialOpen(false); }} 
            />
            
          </div>
        </nav>
      </div>
    </>
  );
}

// Isolated Navigation Node Component
function BottomNavItem({ active, icon: Icon, label, onClick }: { active: boolean; icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <motion.button
      className={`relative flex min-h-[4rem] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[9px] font-bold uppercase tracking-wider font-label-caps leading-none transition-colors select-none focus:outline-none ${
        active ? 'text-emerald' : 'text-on-surface-variant/60'
      }`}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {active && (
          <>
            {/* Simple, clean pill glow */}
            <motion.span
              className="absolute inset-x-1 inset-y-1 rounded-xl bg-emerald/5 border border-emerald/10"
              layoutId="mobile-nav-pill-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Small Active Dot */}
            <motion.span
              className="absolute bottom-1.5 w-1 h-1 bg-emerald rounded-full shadow-[0_0_4px_rgba(16,185,129,0.5)]"
              layoutId="mobile-nav-dot"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>
      
      <Icon className={`relative h-4.5 w-4.5 ${active ? 'text-emerald' : 'opacity-70'}`} strokeWidth={active ? 2.5 : 2} />
      <span className="relative block w-full truncate text-center mt-0.5">{label}</span>
    </motion.button>
  );
}
