'use client';

import { X, Globe, Building, Phone, MapPin, Clock, Loader2, Plus } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CreateBranchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Faux artificial delay simulating async branch commit
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-[#111827] border border-white/[0.06] rounded-[32px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                <Building size={20} />
             </div>
             <div>
               <h2 className="font-bold text-[#F9FAFB] tracking-tight text-xl">Establish New Branch</h2>
               <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">Expand your organizational footprint</p>
             </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/[0.05] rounded-xl transition-colors text-[#9CA3AF]"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Branch Identifier</label>
              <input required placeholder="e.g. Dubai Branch" className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none focus:border-[#F59E0B]/40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Branch Key / Code</label>
              <input required placeholder="DBX-01" className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-mono font-bold text-[#F9FAFB] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Fiscal Currency</label>
              <div className="relative">
                 <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                 <select className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-bold text-[#F9FAFB] outline-none appearance-none">
                   <option>AED</option>
                   <option>USD</option>
                   <option>INR</option>
                   <option>EUR</option>
                 </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Timezone Anchor</label>
              <div className="relative">
                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                 <select className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none appearance-none">
                   <option>UTC +4 (Gulf)</option>
                   <option>UTC +5:30 (IST)</option>
                   <option>UTC +0 (GMT)</option>
                 </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Physical Geometry (Address)</label>
            <div className="relative">
               <MapPin className="absolute left-3 top-3 text-[#9CA3AF]/40 h-4 w-4" />
               <textarea rows={2} placeholder="Unit, Tower, Street..." className="w-full pl-9 pr-4 py-3 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none resize-none focus:border-[#F59E0B]/40" />
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Contact Vector</label>
             <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                <input placeholder="+971 ..." className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none" />
             </div>
          </div>

          <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04] text-[11px] text-[#9CA3AF] leading-relaxed">
            Establishing a branch consumes one slot of your tiered architecture. Initialized branches instantly receive dedicated ledger instances.
          </div>

          <div className="pt-2">
            <button type="submit" disabled={submitting} className="w-full h-12 bg-[#F59E0B] text-white rounded-2xl font-bold text-sm shadow-[0_8px_20px_-5px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all disabled:opacity-60">
              {submitting ? <Loader2 className="animate-spin" size={18}/> : <><Plus size={18}/> Activate Branch</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
