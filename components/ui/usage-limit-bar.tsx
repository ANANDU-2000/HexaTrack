'use client';

import { motion } from 'framer-motion';

export interface UsageLimitBarProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}

export function UsageLimitBar({ label, current, limit, unit = '' }: UsageLimitBarProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isDanger = percentage >= 90;
  const isWarning = percentage >= 75 && percentage < 90;

  return (
    <div className="space-y-2.5 group">
      <div className="flex items-center justify-between text-xs font-bold tracking-tight">
        <span className="text-[#9CA3AF] uppercase text-[10px] tracking-wider">{label}</span>
        <span className="text-[#F9FAFB]">
          {current} / {limit} {unit}
        </span>
      </div>
      
      <div className="relative h-2 w-full bg-[#0B1015] rounded-full border border-white/[0.05] overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full relative transition-colors ${
            isDanger ? 'bg-[#EF4444]' : isWarning ? 'bg-[#F59E0B]' : 'bg-[#4F8CFF]'
          }`}
        >
           {/* Dynamic Glow */}
           <div className={`absolute inset-0 w-full blur-sm opacity-60 transition-colors ${
             isDanger ? 'bg-[#EF4444]' : isWarning ? 'bg-[#F59E0B]' : 'bg-[#4F8CFF]'
           }`} />
        </motion.div>
      </div>
      
      {isDanger && (
        <p className="text-[10px] font-bold text-[#EF4444] animate-pulse">Critical Limit Warning. Provision additional headroom.</p>
      )}
    </div>
  );
}
