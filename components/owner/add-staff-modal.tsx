'use client';

import { X, UserPlus, Shield, Mail, UserCircle, Layers, Loader2 } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

export function AddStaffModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#111827] border border-white/[0.06] rounded-[32px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-[#4F8CFF]/10 flex items-center justify-center text-[#4F8CFF]">
                <UserPlus size={20} />
             </div>
             <div>
               <h2 className="font-bold text-[#F9FAFB] tracking-tight text-xl">Provision Staff</h2>
               <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">Invite restricted operational associates</p>
             </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/[0.05] rounded-xl transition-colors text-[#9CA3AF]"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Full Identity (Name)</label>
            <div className="relative">
               <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
               <input required placeholder="Enter full name" className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Corporate Communication (Email)</label>
            <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
               <input type="email" required placeholder="name@organization.com" className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Target Department</label>
              <div className="relative">
                 <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                 <select required className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-xs font-bold text-[#F9FAFB] outline-none appearance-none">
                    <option>Finance</option>
                    <option>Operations</option>
                    <option>Sales</option>
                    <option>HR</option>
                 </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Role Tier</label>
              <div className="relative">
                 <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                 <select disabled className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-xs font-bold text-[#9CA3AF] outline-none cursor-not-allowed">
                    <option>STAFF</option>
                 </select>
              </div>
            </div>
          </div>

          <div className="bg-[#22C55E]/5 border border-[#22C55E]/10 p-4 rounded-2xl text-[11px] text-[#22C55E] leading-relaxed font-medium">
            Commitment triggers prompt-secure notification permitting target identity activation instantly upon cryptographic settlement.
          </div>

          <button type="submit" disabled={submitting} className="w-full h-12 bg-[#4F8CFF] text-white rounded-2xl font-bold text-sm shadow-[0_8px_20px_-5px_rgba(79,140,255,0.3)] flex items-center justify-center gap-2 active:scale-98 transition-all">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Transmit Invitation'}
          </button>

        </form>
      </motion.div>
    </div>
  );
}
