'use client';

import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/finance-store';
import { Sparkles, ArrowRight } from 'lucide-react';

export function QuickInsights() {
  const dashboard = useFinanceStore((state) => state.dashboard);
  
  const insight = dashboard?.insightLine || 'Core algorithms indicate cashflow is highly optimized. Liquidity reallocation to yields advised.';

  return (
    <div className="p-6 md:p-7 rounded-[28px] bg-gradient-to-br from-cyan/10 to-surface-container-lowest/40 border border-cyan/20 relative overflow-hidden shadow-lg shadow-cyan/5 group">
      {/* Atmospheric Grid Backdrop */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[radial-gradient(rgba(16,185,129,0.4)_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="absolute top-0 right-0 p-6 text-cyan">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.12, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={20} className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </motion.div>
      </div>

      <div className="flex items-center gap-2 mb-3">
         <span className="px-2 py-0.5 rounded-md bg-cyan/10 text-cyan border border-cyan/20 text-[9px] uppercase font-black tracking-widest font-label-caps">Quantum Node</span>
      </div>
      
      <h4 className="font-headline text-lg md:text-xl text-on-surface mb-2.5 font-extrabold tracking-tight">Intelligence Vector</h4>
      
      <p className="text-on-surface-variant leading-relaxed text-sm font-medium opacity-90 font-sans">
        {insight}
      </p>

      <button className="mt-5 text-cyan font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:gap-3.5 transition-all active:scale-95 font-label-caps group-hover:text-white">
        Analyze Schema <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}


