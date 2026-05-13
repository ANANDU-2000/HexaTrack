'use client';

import { 
  BarChart3, 
  History, 
  Home, 
  Plus, 
  Settings, 
  Wallet, 
  ScanLine, 
  ArrowRightLeft,
  DollarSign,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { ScreenKey } from '@/components/layout/app-shell';

// Map consistent 5-tab navigation structure mandated by mobile perfection guidelines
const tabs = [
  { key: 'dashboard' as const, label: 'Home', icon: Home },
  { key: 'history' as const, label: 'Entries', icon: History },
  { key: 'reports' as const, label: 'Data', icon: BarChart3 },
  { key: 'settings' as const, label: 'Profile', icon: Settings },
];

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

  // Primary speed dial operational items
  const speedDialItems = [
    { label: 'Scan Bill', icon: ScanLine, color: 'text-cyan bg-cyan/10 border-cyan/20', delay: 0.08, onClick: () => {} },
    { label: 'Transfer', icon: ArrowRightLeft, color: 'text-indigo bg-indigo/10 border-indigo/20', delay: 0.04, onClick: () => {} },
    { label: 'Expense', icon: DollarSign, color: 'text-emerald bg-emerald/10 border-emerald/20', delay: 0, onClick: onAddTransaction },
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
            className="fixed inset-0 z-30 bg-[#0B1020]/80 backdrop-blur-xl lg:hidden pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* Floating Speed Dial Buttons Menu (Staggered Arc) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center lg:hidden pb-[max(env(safe-area-inset-bottom),1.25rem)]">
         <div className="relative w-full max-w-md mx-auto flex justify-center">
            <AnimatePresence>
              {speedDialOpen && (
                <div className="absolute bottom-24 flex flex-col items-center gap-4 pointer-events-auto">
                  {speedDialItems.map((item, idx) => (
                     <motion.div
                       key={item.label}
                       initial={{ opacity: 0, y: 20, scale: 0.8 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 15, scale: 0.8 }}
                       transition={{ type: 'spring', stiffness: 500, damping: 30, delay: item.delay }}
                       className="flex items-center gap-3 group"
                     >
                        {/* Text Label Tag */}
                        <span className="px-3 py-1 rounded-full bg-[#111827]/90 border border-white/[0.04] shadow-md text-[10px] font-black tracking-widest font-label-caps text-on-surface whitespace-nowrap uppercase">
                           {item.label}
                        </span>
                        
                        {/* Action Button Node */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAction(item.onClick)}
                          className={`w-12 h-12 rounded-full border ${item.color} shadow-lg flex items-center justify-center active:brightness-110 transition-all`}
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

      {/* Fixed Sticky Bottom Navigation Bar Component */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] lg:hidden">
        <nav className="pointer-events-auto relative mx-auto max-w-md select-none" aria-label="Mobile Navigation Bar">
          
          {/* Subtle soft Glass Inner Glow Layer */}
          <div className="absolute inset-x-0 -top-px h-[5.5rem] rounded-[32px] bg-gradient-to-b from-white/[0.06] to-transparent blur-[1px] pointer-events-none" />
          
          {/* Primary Matte Structural Container */}
          <div className="relative grid min-h-[5.5rem] grid-cols-[1fr_1fr_4.75rem_1fr_1fr] items-center rounded-[32px] border border-white/[0.08] bg-[#111827]/65 px-2 shadow-2xl backdrop-blur-3xl shadow-black/80">
            
            {/* Left Side Controls (Home, Wallets) */}
            <BottomNavItem 
              active={activeScreen === 'dashboard'} 
              icon={Home} 
              label="Home" 
              onClick={() => { onNavigate('dashboard'); setSpeedDialOpen(false); }} 
            />
            <BottomNavItem 
              active={activeScreen === 'wallets'} 
              icon={Wallet} 
              label="Wallets" 
              onClick={() => { onNavigate('wallets'); setSpeedDialOpen(false); }} 
            />

            {/* Morphing Core Speed-Dial FAB */}
            <div className="relative flex h-full items-center justify-center">
              <motion.button
                aria-label="Trigger actions"
                className={`absolute -top-6.5 grid h-14.5 w-14.5 place-items-center rounded-full border shadow-lg ring-[7px] ring-[#0B1020] transition-all outline-none z-50 ${
                  speedDialOpen 
                    ? 'bg-[#111827] text-cyan border-cyan/30 shadow-cyan/10' 
                    : 'bg-cyan text-black border-transparent shadow-cyan/20'
                }`}
                onClick={toggleSpeedDial}
                type="button"
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <motion.div
                  animate={{ rotate: speedDialOpen ? 135 : 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <Plus size={25} strokeWidth={2.6} />
                </motion.div>
              </motion.button>
            </div>

            {/* Right Side Controls (Entries, Profile) */}
            <BottomNavItem 
              active={activeScreen === 'history'} 
              icon={History} 
              label="Entries" 
              onClick={() => { onNavigate('history'); setSpeedDialOpen(false); }} 
            />
            <BottomNavItem 
              active={activeScreen === 'settings'} 
              icon={Settings} 
              label="Profile" 
              onClick={() => { onNavigate('settings'); setSpeedDialOpen(false); }} 
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
      className={`relative flex min-h-[4.5rem] min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-1 text-[9px] font-black uppercase tracking-[0.15em] font-label-caps leading-none transition-colors select-none focus:outline-none ${
        active ? 'text-cyan' : 'text-on-surface-variant/70'
      }`}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
    >
      <AnimatePresence>
        {active && (
          <>
            {/* Luminous soft capsule glow */}
            <motion.span
              className="absolute inset-x-1.5 inset-y-2.5 rounded-2xl bg-white/5 border border-white/[0.03]"
              layoutId="mobile-nav-pill-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Laser active underline */}
            <motion.span
              className="absolute bottom-1.5 w-4 h-[2px] bg-cyan rounded-full shadow-[0_0_8px_#06B6D4]"
              layoutId="mobile-nav-laser"
              initial={{ opacity: 0, scaleX: 0.2 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.2 }}
            />
          </>
        )}
      </AnimatePresence>
      
      <Icon className={`relative h-4.5 w-4.5 ${active ? 'text-cyan drop-shadow-[0_0_3px_rgba(6,182,212,0.3)]' : 'opacity-70'}`} strokeWidth={active ? 2.8 : 2.2} />
      <span className="relative block w-full truncate text-center font-black">{label}</span>
    </motion.button>
  );
}


