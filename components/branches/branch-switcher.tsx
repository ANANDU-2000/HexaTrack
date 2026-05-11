'use client';

import { 
  Building2, 
  Check, 
  ChevronDown, 
  Globe, 
  Search, 
  Star, 
  MapPin,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Branch = {
  id: string;
  name: string;
  location: string;
  isFavorite: boolean;
  currency: string;
};

const MOCK_BRANCHES: Branch[] = [
  { id: '1', name: 'Dubai HQ', location: 'Business Bay, Dubai', isFavorite: true, currency: 'AED' },
  { id: '2', name: 'Kochi Operations', location: 'Infopark, Kochi', isFavorite: true, currency: 'INR' },
  { id: '3', name: 'Bangalore Tech', location: 'Whitefield, BLR', isFavorite: false, currency: 'INR' },
  { id: '4', name: 'Abu Dhabi Office', location: 'Global Market, AD', isFavorite: false, currency: 'AED' },
];

export function BranchSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState<Branch>(MOCK_BRANCHES[0]);
  const [search, setSearch] = useState('');

  const filtered = MOCK_BRANCHES.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#111827] px-4 py-2.5 transition hover:border-[#4F8CFF]/30 active:scale-[0.98] shadow-sm w-full sm:w-auto"
      >
        <div className="h-8 w-8 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center text-[#4F8CFF] shrink-0">
          <Building2 size={16} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-none mb-0.5">Active Branch</p>
          <p className="truncate text-sm font-bold text-[#F9FAFB]">{activeBranch.name}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 top-full mt-2 z-50 w-full sm:w-[320px] bg-[#111827] border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl"
            >
              <div className="p-3 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/60 h-4 w-4" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Filter branches..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0B1015] border border-white/[0.05] rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40 transition"
                  />
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                
                {/* Favorites Label */}
                {filtered.filter(b => b.isFavorite).length > 0 && (
                  <div className="px-2 pt-1 pb-0.5">
                     <span className="text-[10px] font-bold text-[#9CA3AF]/60 uppercase tracking-widest">Favorites</span>
                  </div>
                )}

                {filtered.map(branch => {
                  const isActive = branch.id === activeBranch.id;
                  return (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setActiveBranch(branch);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                        isActive ? 'bg-[#4F8CFF]/10' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-[#4F8CFF] text-white' : 'bg-white/[0.04] text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                      }`}>
                         <MapPin size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#4F8CFF]' : 'text-[#F9FAFB]'}`}>
                            {branch.name}
                          </p>
                          {branch.isFavorite && <Star size={10} className="text-yellow-500 fill-yellow-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] truncate font-medium">{branch.location} • {branch.currency}</p>
                      </div>
                      {isActive && <Check size={16} className="text-[#4F8CFF] shrink-0" />}
                    </button>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="p-4 text-center text-xs text-[#9CA3AF] font-medium">No matching branches found.</div>
                )}
              </div>

              <div className="p-2 border-t border-white/[0.04] bg-white/[0.01]">
                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-white/[0.1] text-xs font-bold text-[#F9FAFB] hover:bg-white/[0.02] hover:border-[#4F8CFF]/30 transition-colors">
                   <Plus size={14} /> Add Branch
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
