'use client';

import { Lock, Sparkles } from 'lucide-react';
import React from 'react';

interface FeatureLockOverlayProps {
  children: React.ReactNode;
  isLocked: boolean;
  requiredPlan?: string;
  onUpgradeClick?: () => void;
}

export function FeatureLockOverlay({ children, isLocked, requiredPlan = 'Professional', onUpgradeClick }: FeatureLockOverlayProps) {
  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative group overflow-hidden rounded-[inherit]">
      {/* The Blurred Behind layer */}
      <div className="select-none blur-[6px] grayscale opacity-30 pointer-events-none transition-all duration-500">
        {children}
      </div>

      {/* The Floating Access layer */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/10 backdrop-blur-[2px]">
        <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center justify-center text-[#F59E0B] mb-4 animate-in zoom-in duration-300">
          <Lock size={22} />
        </div>
        
        <div className="space-y-1 mb-5">
          <h4 className="text-base font-bold text-[#F9FAFB] tracking-tight">Premium Sub-Module Locked</h4>
          <p className="text-xs text-[#9CA3AF] font-medium">Requires {requiredPlan} architectural tier.</p>
        </div>

        <button 
          onClick={onUpgradeClick}
          className="h-10 px-5 bg-white text-[#0B1015] rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Sparkles size={14} /> Upgrade Now
        </button>
      </div>
    </div>
  );
}
