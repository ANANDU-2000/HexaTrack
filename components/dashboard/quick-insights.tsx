'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Sparkles, TrendingDown, Zap } from 'lucide-react';
import { useFinanceStore } from '@/store/finance-store';

export function QuickInsights() {
  const dashboard = useFinanceStore((state) => state.dashboard);
  const report = useFinanceStore((state) => state.report);
  
  const aiInsights = [
    {
      id: '1',
      icon: Sparkles,
      iconBg: 'bg-[#4F8CFF]/10 text-[#4F8CFF]',
      text: dashboard?.insightLine || 'Your income is currently higher than your monthly average.',
      sub: 'Great progress'
    },
    {
      id: '2',
      icon: TrendingDown,
      iconBg: 'bg-[#22C55E]/10 text-[#22C55E]',
      text: report.net > 0 ? 'You have successfully generated net savings this month.' : 'Watch out for subscription renewals coming this week.',
      sub: 'Finance Health'
    },
    {
      id: '3',
      icon: Zap,
      iconBg: 'bg-[#F59E0B]/10 text-[#F59E0B]',
      text: '3 subscriptions renewing soon.',
      sub: 'Action required'
    }
  ];

  return (
    <section className="mt-6">
      <h3 className="px-1 mb-3 text-sm font-bold tracking-wide text-[#9CA3AF] uppercase font-display">
        Quick Insights
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x hide-scrollbar md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {aiInsights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className="min-w-[260px] flex-shrink-0 snap-start p-4 bg-[#111827] border border-white/[0.04] rounded-2xl shadow-sm flex gap-3 items-start relative group hover:bg-[#1A2333] transition-all hover:border-white/[0.08]"
          >
            <div className={`p-2.5 rounded-xl ${insight.iconBg} shrink-0 transition-transform group-hover:scale-110`}>
              <insight.icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">
                {insight.sub}
              </p>
              <p className="text-[13px] leading-snug text-[#F9FAFB] font-medium line-clamp-2">
                {insight.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
