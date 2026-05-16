'use client';

import { motion } from 'framer-motion';
import { Target, Trophy } from 'lucide-react';
import { money } from '@/lib/format';
import { useFinanceStore } from '@/store/finance-store';

export function SavingsCard() {
  const report = useFinanceStore((state) => state.report);
  
  // Simulating goals for now since they might not be in store yet
  const currentSavings = Math.max(0, report.net);
  const savingsGoal = 15000; // Mock target
  const percentage = Math.min(Math.round((currentSavings / savingsGoal) * 100), 100);
  const remaining = Math.max(0, savingsGoal - currentSavings);

  return (
    <section className="mt-6">
      <div className="bg-[#0E152B] border border-white/[0.04] rounded-[32px] p-6 overflow-hidden relative flex flex-col sm:flex-row gap-6 items-center hover:border-white/[0.08] transition-colors">
        {/* Dynamic Circular Progress Visual using SVG for premium look */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="44"
              className="stroke-current text-white/[0.04]"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="50" cy="50" r="44"
              className="stroke-current text-[#22C55E]"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="276.46"
              initial={{ strokeDashoffset: 276.46 }}
              animate={{ strokeDashoffset: 276.46 - (276.46 * percentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#E1E2EC]">
            <span className="text-xl font-bold">{percentage}%</span>
            <span className="text-[10px] text-[#C2C6D6] font-semibold uppercase tracking-wide">Saved</span>
          </div>
        </div>

        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Target size={16} className="text-[#4F8CFF]" />
            <h3 className="text-base font-bold text-[#E1E2EC]">Savings & Goals</h3>
          </div>
          <p className="text-sm text-[#C2C6D6] mb-4 font-medium">
            Monthly Target Goal Status
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2333] p-3 rounded-2xl border border-white/[0.03]">
              <p className="text-[10px] text-[#C2C6D6] font-bold uppercase tracking-wider mb-0.5">Target</p>
              <p className="text-base font-bold text-[#E1E2EC]">{money(savingsGoal)}</p>
            </div>
            <div className="bg-[#1A2333] p-3 rounded-2xl border border-white/[0.03]">
              <p className="text-[10px] text-[#C2C6D6] font-bold uppercase tracking-wider mb-0.5">Remaining</p>
              <p className="text-base font-bold text-[#22C55E]">{money(remaining)}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs font-medium bg-[#22C55E]/10 text-[#22C55E] px-3 py-2 rounded-xl border border-[#22C55E]/10">
            <Trophy size={14} />
            <span>3 months savings streak!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
