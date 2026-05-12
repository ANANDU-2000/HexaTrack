'use client';

import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/finance-store';
import { Sparkles, ArrowRight } from 'lucide-react';

export function QuickInsights() {
  const dashboard = useFinanceStore((state) => state.dashboard);
  
  const insight = dashboard?.insightLine || 'Your cashflow is optimized this period. Consider reallocating capital to growth assets.';

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary-container/80 to-surface border border-primary/20 relative overflow-hidden shadow-lg shadow-primary/5">
      <div className="absolute top-0 right-0 p-6 text-primary/30">
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles size={24} />
        </motion.div>
      </div>

      <h4 className="font-headline-md text-headline-md text-primary mb-2 font-bold">AI Agent Insight</h4>
      
      <p className="text-body-sm text-on-primary-container leading-relaxed text-sm md:text-base font-medium opacity-90">
        {insight}
      </p>

      <button className="mt-6 text-primary font-bold text-xs tracking-wide uppercase flex items-center gap-2 hover:gap-3 transition-all active:scale-95">
        Review Pattern <ArrowRight size={14} />
      </button>
    </div>
  );
}

