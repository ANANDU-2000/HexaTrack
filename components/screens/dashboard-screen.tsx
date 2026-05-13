'use client';

import { Bell, Sparkles, Send, Search, Plus, ChevronRight, BarChart3 } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { WalletCarousel } from '@/components/dashboard/wallet-carousel';
import { QuickInsights } from '@/components/dashboard/quick-insights';
import { ExpenseAnalytics } from '@/components/dashboard/expense-analytics';
import { DashboardTransactions } from '@/components/dashboard/dashboard-transactions';
import { RecurringAlerts } from '@/components/dashboard/recurring-alerts';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';

export function DashboardScreen({ compact = false, onAddTransaction, onNavigate }: { compact?: boolean; onAddTransaction: () => void; onNavigate?: (screen: any) => void }) {
  const user = useAuthStore(s => s.user);
  
  const greetingName = user?.displayName?.split(' ')[0] || 'Agent';
  
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-28 lg:pb-10 px-4 sm:px-6 lg:px-gutter pt-5 font-sans select-none">
      
      {/* Premium Mobile Header Layer */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Status Glowing Avatar Ring */}
          <div className="relative">
             <div className="w-11.5 h-11.5 rounded-full bg-[#111827] border border-white/[0.06] flex items-center justify-center text-cyan font-black text-sm shadow-inner ring-1 ring-white/[0.03]">
                {greetingName.slice(0, 2).toUpperCase()}
             </div>
             <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#0B1020] shadow-[0_0_6px_#10B981] animate-pulse" />
          </div>
          
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] font-label-caps text-cyan opacity-90 leading-none mb-1">{getTimeGreeting()}</p>
            <h2 className="text-base font-extrabold text-on-surface tracking-wide">{greetingName}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Action Bell */}
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#111827]/60 border border-white/[0.04] hover:border-white/[0.1] active:scale-95 transition-all relative shadow-inner">
             <Bell size={16} className="text-on-surface-variant" />
             <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_6px_#06B6D4]" />
          </button>
        </div>
      </header>

      {/* Immersive AI Assistant Prompt Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-7 group"
      >
         <div 
            onClick={() => onNavigate?.('assistant')}
            className="w-full flex items-center gap-3 h-13 rounded-[20px] bg-[#111827]/50 border border-white/[0.04] px-4 backdrop-blur-md hover:border-cyan/20 active:scale-[0.99] transition-all shadow-inner cursor-pointer"
         >
            <div className="w-7 h-7 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan shrink-0 drop-shadow-[0_0_4px_rgba(6,182,212,0.2)]">
               <Sparkles size={14} className="group-hover:animate-pulse" />
            </div>
            <p className="text-[11px] font-bold text-on-surface-variant/60 group-hover:text-on-surface-variant/80 tracking-wide transition-colors flex-1">
               Analyze expenditure anomalies this week...
            </p>
            <span className="text-[9px] font-black font-label-caps text-cyan uppercase tracking-widest border border-cyan/20 px-2 py-0.5 rounded-md bg-cyan/5">
               Ask AI
            </span>
         </div>
      </motion.div>

      {/* Primary Responsive Bento Assembly */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7"
      >
        {/* Left Composite Node (Dashboard Metrics & Assets) */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-7">
          
          {/* HERO LIQUIDITY BLOCK */}
          <div className="h-full min-h-[220px]">
            <DashboardHero />
          </div>

          {/* WALLET INTERACTIVE SWIPER */}
          <div className="pt-1 pb-1">
             <WalletCarousel />
          </div>

          {/* MOBILE QUICK ACTIONS GRID (Large targets) */}
          <div className="grid grid-cols-3 gap-3 mt-2">
             <MobileActionBtn label="Deposit" icon={<Plus size={20} strokeWidth={2.5} />} color="text-cyan" onClick={onAddTransaction} />
             <MobileActionBtn label="Transfer" icon={<Send size={18} strokeWidth={2.2} />} color="text-indigo" onClick={() => {}} />
             <MobileActionBtn label="Stats" icon={<BarChart3 size={18} strokeWidth={2.2} />} color="text-emerald" onClick={() => {}} />
          </div>

          {/* SPENDING ANALYTICS (Linear Vectors) */}
          <div className="glass-card rounded-[28px] p-5 md:p-7 border border-white/[0.04] shadow-lg shadow-black/10">
             <ExpenseAnalytics />
          </div>
          
        </div>

        {/* Right Composite Node (Telemetry & Ledger) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-7">
           <QuickInsights />
           <DashboardTransactions />
           <RecurringAlerts />
        </div>
        
      </motion.main>
    </div>
  );
}

// Mobile-Optimized Touch Targets Widget
function MobileActionBtn({ label, icon, color, onClick }: { label: string; icon: React.ReactNode; color: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#111827]/40 border border-white/[0.04] hover:border-white/[0.1] rounded-[24px] flex flex-col items-center justify-center gap-2.5 py-4 transition-all active:scale-[0.96] active:bg-[#111827]/60 w-full shadow-inner backdrop-blur-sm select-none outline-none"
    >
       <div className={`${color} opacity-90`}>
         {icon}
       </div>
       <span className="text-[9px] font-black uppercase tracking-[0.18em] text-on-surface font-label-caps leading-none select-none">{label}</span>
    </button>
  );
}



