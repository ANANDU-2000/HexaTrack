'use client';

import { 
  Building2, 
  Check, 
  ChevronDown, 
  Search, 
  MapPin,
  Plus
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
     await loadFinanceWorkspace();
  };

  const filtered = branches.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && branches.length === 0) {
     return (
        <div className="h-11.5 px-4.5 bg-[#111827]/50 border border-white/[0.04] rounded-[20px] flex items-center gap-3 animate-pulse w-[160px]">
           <div className="w-4 h-4 bg-[#111827] border border-white/[0.03] rounded-lg" />
           <div className="w-16 h-2.5 bg-[#111827] rounded-md" />
        </div>
     );
  }

  if (branches.length === 0) return null;

  return (
    <div className="relative font-sans select-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-[20px] border border-white/[0.05] bg-[#111827]/40 backdrop-blur-md px-4 py-2.5 transition hover:border-cyan/20 active:scale-[0.98] shadow-inner w-full sm:w-auto group outline-none select-none"
      >
        <div className="h-8.5 w-8.5 rounded-xl bg-[#111827] flex items-center justify-center text-cyan border border-cyan/10 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
          <Building2 size={15} />
        </div>
        <div className="min-w-0 flex-1 text-left hidden sm:block pr-1.5">
          <p className="text-[9px] font-black text-cyan uppercase tracking-[0.18em] font-label-caps leading-none mb-0.5">Active Node</p>
          <p className="truncate text-[13px] font-extrabold text-on-surface tracking-wide">{activeBranch?.name || 'Select Unit'}</p>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-on-surface-variant transition-transform duration-300 shrink-0 ${open ? 'rotate-180 text-cyan' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="absolute left-0 top-full mt-3 z-50 w-[310px] bg-[#0B1020] border border-white/[0.08] rounded-[28px] shadow-2xl overflow-hidden shadow-black/50"
            >
              <div className="p-4.5 border-b border-white/[0.04] bg-[#111827]/10">
                 <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.22em] mb-3.5 font-label-caps opacity-80">Cluster Registry</div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan h-3.5 w-3.5 opacity-70" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Locate operational node..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#111827] border border-white/[0.04] rounded-[16px] py-2.5 pl-10 pr-4 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-cyan/25 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="max-h-[260px] overflow-y-auto p-2 space-y-1 custom-scrollbar bg-[#0B1020]">
                {filtered.map(branch => {
                  const isActive = branch.workspaceId === activeWorkspaceId;
                  return (
                    <button
                      key={branch.id}
                      disabled={!branch.workspaceId}
                      onClick={() => handleSwitch(branch)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[20px] transition-all text-left group relative ${
                        isActive ? 'bg-[#111827]/80 border border-cyan/15 shadow-inner' : 'hover:bg-[#111827]/50 border border-transparent'
                      } ${!branch.workspaceId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all border ${
                        isActive ? 'bg-[#111827] border-cyan/20 text-cyan shadow-inner' : 'bg-[#111827] border-white/[0.04] text-on-surface-variant group-hover:text-on-surface group-hover:border-white/[0.1]'
                      }`}>
                         <MapPin size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className={`text-[13px] font-extrabold truncate tracking-wide ${isActive ? 'text-cyan' : 'text-on-surface'}`}>
                           {branch.name}
                         </p>
                        <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest mt-0.5 flex items-center gap-1.5 font-label-caps opacity-80">
                           {branch.code || 'UNIT'} • {branch.currency || 'USD'}
                        </p>
                      </div>
                      {isActive && <Check size={16} className="text-cyan shrink-0 mr-1 drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]" />}
                    </button>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="py-10 text-center text-[10px] text-on-surface-variant font-black uppercase tracking-[0.15em] flex flex-col items-center gap-2.5 font-label-caps">
                     <div className="w-10 h-10 rounded-2xl bg-[#111827] border border-white/[0.03] flex items-center justify-center text-cyan opacity-60"><Search size={15} /></div>
                     Signal Lost
                  </div>
                )}
              </div>

              <div className="p-3.5 border-t border-white/[0.04] bg-[#111827]/10">
                <button className="w-full flex items-center justify-center gap-2 h-10 rounded-[16px] border border-dashed border-cyan/25 text-[9px] font-black font-label-caps text-cyan uppercase tracking-[0.18em] hover:bg-cyan/5 hover:border-cyan/40 active:scale-98 transition-all outline-none">
                   <Plus size={13} /> Provision Subnode
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

