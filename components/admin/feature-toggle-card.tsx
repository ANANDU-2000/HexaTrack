'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface FeatureToggleCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isEnabled: boolean;
  minPlan: 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  onToggle: (id: string) => void;
}

export function FeatureToggleCard({ id, title, description, icon: Icon, isEnabled, minPlan, onToggle }: FeatureToggleCardProps) {
  
  const getPlanColor = () => {
    switch(minPlan) {
      case 'Starter': return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
      case 'Professional': return 'text-[#4F8CFF] bg-[#4F8CFF]/10 border-[#4F8CFF]/20';
      case 'Business': return 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20';
      case 'Enterprise': return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';
    }
  };

  return (
    <div className={`relative bg-[#111827] border border-white/[0.06] rounded-[28px] p-5 transition-all group hover:border-white/[0.12] ${!isEnabled && 'opacity-75'}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="h-11 w-11 rounded-2xl bg-white/[0.03] flex items-center justify-center text-[#F9FAFB] border border-white/[0.05] shrink-0">
          <Icon size={20} />
        </div>
        
        <button 
          onClick={() => onToggle(id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-[#4F8CFF]' : 'bg-white/[0.1]'}`}
        >
          <span className="sr-only">Toggle {title}</span>
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-[#F9FAFB] tracking-tight flex items-center gap-2">
          {title}
          {isEnabled && <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />}
        </h4>
        <p className="text-xs text-[#9CA3AF] leading-relaxed font-medium line-clamp-2">{description}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Requirement</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${getPlanColor()}`}>
           {minPlan}+
        </span>
      </div>
    </div>
  );
}
