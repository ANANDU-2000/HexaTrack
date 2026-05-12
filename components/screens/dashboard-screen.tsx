'use client';

import { Bell, Settings, User, Search, Send, Plus, TrendingUp } from 'lucide-react';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { QuickInsights } from '@/components/dashboard/quick-insights';
import { ExpenseAnalytics } from '@/components/dashboard/expense-analytics';
import { SavingsCard } from '@/components/dashboard/savings-card';
import { DashboardTransactions } from '@/components/dashboard/dashboard-transactions';
import { RecurringAlerts } from '@/components/dashboard/recurring-alerts';
import { WorkspaceSwitcher } from '@/components/workspace/workspace-switcher';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';

export function DashboardScreen({ compact = false, onAddTransaction }: { compact?: boolean; onAddTransaction: () => void }) {
  const user = useAuthStore(s => s.user);

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-24 lg:pb-10 px-4 md:px-6 pt-6">
      {/* Top Bar Alignment with Stitch design */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1A2333] border border-[#c1c1fc]/20 overflow-hidden flex items-center justify-center text-[#c1c1fc] font-bold text-xs select-none shadow-sm">
            {user?.name?.slice(0, 2).toUpperCase() || <User size={16} />}
          </div>
          <div>
            <p className="font-body-sm text-on-surface-variant text-[12px] opacity-70">Portfolio Center</p>
            <div className="w-48">
               <WorkspaceSwitcher />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all active:scale-95">
             <Bell size={20} className="text-[#c1c1fc]" />
          </button>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-gutter"
      >
        {/* 1 — HERO BALANCE CARD [Stitch Slot: md:col-span-8] */}
        <div className="md:col-span-8 h-full">
          <DashboardHero />
        </div>

        {/* 2 — QUICK ACTIONS [Stitch Slot: md:col-span-4] */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4 h-full">
           <QuickActionBtn label="Add Income" icon={<TrendingUp size={24} />} onClick={onAddTransaction} />
           <QuickActionBtn label="Transfer" icon={<Send size={24} />} onClick={() => {}} />
           <QuickActionBtn label="Search" icon={<Search size={24} />} onClick={() => {}} />
           <button 
             onClick={onAddTransaction}
             className="bg-secondary text-on-secondary-container rounded-3xl flex flex-col items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all group shadow-lg shadow-secondary/10 h-full min-h-[100px]"
           >
              <Plus size={28} className="group-hover:scale-110 transition-transform" />
              <span className="text-body-sm font-bold">New Entry</span>
           </button>
        </div>

        {/* 3 — ANALYTICS GRAPH [Stitch Slot: md:col-span-12 lg:col-span-7] */}
        <div className="md:col-span-12 lg:col-span-7">
          <ExpenseAnalytics />
        </div>

        {/* 4 — RIGHT COLUMN COMBO (Insights + Transactions) [Stitch Slot: md:col-span-12 lg:col-span-5] */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6 lg:gap-gutter">
           <QuickInsights />
           <DashboardTransactions />
           <RecurringAlerts />
        </div>
      </motion.main>
    </div>
  );
}



function QuickActionBtn({ label, icon, onClick }: { label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="glass-card rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.97] transition-all group h-full min-h-[100px]"
    >
       <div className="text-secondary group-hover:scale-110 transition-transform">
         {icon}
       </div>
       <span className="text-body-sm font-medium">{label}</span>
    </button>
  );
}

