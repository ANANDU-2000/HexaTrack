'use client';

import { Bell, Search, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspaceStore } from '@/store/workspace-store';

interface DashboardHeaderProps {
  onAddTransaction?: () => void;
}

export function DashboardHeader({ onAddTransaction }: DashboardHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#F5F7FA] tracking-tight">
          Greetings, {user?.displayName?.split(' ')[0] || 'Agent'}
        </h1>
        <p className="text-body-sm text-on-surface-variant opacity-70 mt-1 flex items-center gap-2">
          <span>Organization Control Layer</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="font-label-mono text-[10px] font-bold uppercase text-secondary">{formattedDate}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Button */}
        <button className="w-10 h-10 rounded-xl border border-white/[0.05] bg-surface-container-lowest/50 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-[#F5F7FA] hover:border-white/20 transition-all active:scale-95 shadow-sm">
          <Search size={18} />
        </button>

        {/* Notification Bell */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('pwa-open-notifications'))}
          className="w-10 h-10 rounded-xl border border-white/[0.05] bg-surface-container-lowest/50 backdrop-blur-sm flex items-center justify-center text-on-surface-variant hover:text-[#F5F7FA] hover:border-white/20 transition-all active:scale-95 shadow-sm relative"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
        </button>

        {/* Primary Action */}
        <button 
          onClick={onAddTransaction}
          disabled={!activeWorkspaceId}
          className="h-10 px-5 bg-primary text-on-primary rounded-xl text-xs font-bold tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 uppercase"
        >
          <Plus size={16} /> Record Transact
        </button>
      </div>
    </header>
  );
}
