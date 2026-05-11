'use client';

import { Bell, Settings, User } from 'lucide-react';
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
    <div className="flex flex-col w-full max-w-3xl mx-auto pb-24 lg:pb-10">
      {/* TOP AREA STICKY HEADER - For Desktop + Custom Experience */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 lg:h-[72px] px-4 -mx-4 bg-[#0B1015]/80 backdrop-blur-md border-b border-white/[0.04] mb-6">
        <div className="w-48 lg:w-56">
          <WorkspaceSwitcher />
        </div>
        
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="p-2 rounded-full text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5 transition-colors">
            <Bell size={20} />
          </button>
          <button aria-label="Settings" className="hidden sm:block p-2 rounded-full text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/5 transition-colors">
            <Settings size={20} />
          </button>
          <div className="h-8 w-8 rounded-full bg-[#1A2333] border border-white/10 overflow-hidden flex items-center justify-center text-[#4F8CFF] font-bold text-xs select-none">
            {user?.name?.slice(0, 2).toUpperCase() || <User size={16} />}
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-1"
      >
        {/* 1 — FINANCIAL SUMMARY HERO */}
        <DashboardHero />

        {/* 2 — QUICK INSIGHTS */}
        <QuickInsights />

        {/* 3 — EXPENSE ANALYTICS */}
        <ExpenseAnalytics />

        {/* 4 — SAVINGS & GOALS */}
        <SavingsCard />

        {/* 5 — RECENT TRANSACTIONS */}
        <DashboardTransactions />

        {/* 6 — RECURRING & ALERTS */}
        <RecurringAlerts />
      </motion.div>
    </div>
  );
}
