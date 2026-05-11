'use client';

import { 
  Building2, 
  Check, 
  ChevronDown, 
  Search, 
  Star, 
  MapPin,
  Plus,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hexaTrackApi } from '@/lib/api';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useFinanceStore } from '@/store/finance-store';
import type { LightBranch } from '@/lib/types';

export function BranchSwitcher() {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<LightBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);
  const loadFinanceWorkspace = useFinanceStore((s) => s.loadWorkspace);

  useEffect(() => {
     const load = async () => {
        try {
           const res = await hexaTrackApi.owner.listBranches();
           setBranches(res);
           // Auto-select first if none active
           if (res.length > 0 && !activeWorkspaceId && res[0].workspaceId) {
              setActiveWorkspaceId(res[0].workspaceId);
              void loadFinanceWorkspace();
           }
        } catch (e) {
           console.error(e);
        } finally {
           setLoading(false);
        }
     };
     void load();
  }, [activeWorkspaceId, setActiveWorkspaceId, loadFinanceWorkspace]);

  const activeBranch = branches.find(b => b.workspaceId === activeWorkspaceId) || branches[0];

  const handleSwitch = async (branch: any) => {
     if (!branch.workspaceId) return;
     setActiveWorkspaceId(branch.workspaceId);
     setOpen(false);
     // Trigger immediate global finance refresh across all components!
     await loadFinanceWorkspace();
  };

  const filtered = branches.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && branches.length === 0) {
     return (
        <div className="h-11 px-4 bg-[#111827] border border-white/[0.05] rounded-2xl flex items-center gap-3 animate-pulse">
           <div className="w-4 h-4 bg-white/10 rounded" />
           <div className="w-20 h-3 bg-white/10 rounded" />
        </div>
     );
  }

  if (branches.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#111827] px-4 py-2.5 transition hover:border-[#4F8CFF]/30 active:scale-[0.98] shadow-sm w-full sm:w-auto group"
      >
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#4F8CFF]/20 to-transparent flex items-center justify-center text-[#4F8CFF] border border-[#4F8CFF]/20 shrink-0 group-hover:from-[#4F8CFF] group-hover:text-white transition-all">
          <Building2 size={16} />
        </div>
        <div className="min-w-0 flex-1 text-left hidden sm:block">
          <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none mb-0.5">Active Node</p>
          <p className="truncate text-sm font-black text-[#F9FAFB]">{activeBranch?.name || 'Select Branch'}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
              className="absolute left-0 top-full mt-3 z-50 w-[320px] bg-[#111827] border border-white/[0.08] rounded-[28px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="p-4 border-b border-white/[0.05] bg-white/[0.01]">
                 <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">Operational Nodes</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Locate branch..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0B1015] border border-white/[0.06] rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-white placeholder:text-[#9CA3AF]/30 outline-none focus:border-[#4F8CFF]/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="max-h-[280px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filtered.map(branch => {
                  const isActive = branch.workspaceId === activeWorkspaceId;
                  return (
                    <button
                      key={branch.id}
                      disabled={!branch.workspaceId}
                      onClick={() => handleSwitch(branch)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left group relative ${
                        isActive ? 'bg-[#4F8CFF]/10 border border-[#4F8CFF]/20' : 'hover:bg-white/[0.03] border border-transparent'
                      } ${!branch.workspaceId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all border ${
                        isActive ? 'bg-[#4F8CFF] border-white/20 text-white shadow-lg shadow-[#4F8CFF]/30' : 'bg-white/[0.04] border-white/[0.05] text-[#9CA3AF] group-hover:text-white group-hover:bg-white/[0.08]'
                      }`}>
                         <MapPin size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className={`text-sm font-black truncate ${isActive ? 'text-[#4F8CFF]' : 'text-white'}`}>
                           {branch.name}
                         </p>
                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                           {branch.code || 'STNDRD'} • {branch.currency || 'USD'}
                        </p>
                      </div>
                      {isActive && <Check size={18} className="text-[#4F8CFF] shrink-0 mr-1" />}
                    </button>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#9CA3AF] font-bold uppercase tracking-wider flex flex-col items-center gap-2">
                     <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center"><Search size={14} /></div>
                     Zero Results
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/[0.04] bg-white/[0.01]">
                <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-white/[0.15] text-xs font-black text-white uppercase tracking-wider hover:bg-white/[0.04] hover:border-[#4F8CFF]/40 transition-all">
                   <Plus size={14} /> Provision Node
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
