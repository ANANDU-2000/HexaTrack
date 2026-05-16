'use client';

import React, { useEffect, useState } from 'react';
import { 
  MoreHorizontal, Search, Shield, UserPlus, Briefcase, Trash2, 
  Lock, Mail, Loader2, X, AlertCircle, CheckCircle2,
  KeyRound, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hexaTrackApi } from '@/lib/api';
import type { AdminUserListItem, LightBranch } from '@/lib/types';
import { BranchBadge } from '@/components/branches/branch-badge';
import { BranchFilterDropdown } from '@/components/branches/branch-filter-dropdown';
import { BranchSelector } from '@/components/branches/branch-selector';
import { BranchStaffAnalytics } from '@/components/branches/branch-staff-analytics';
import { ReassignBranchModal } from '@/components/branches/reassign-branch-modal';
import { StaffBranchCard } from '@/components/branches/staff-branch-card';

export function StaffManagementTable() {
  const [search, setSearch] = useState('');
  const [staff, setStaff] = useState<AdminUserListItem[]>([]);
  const [branches, setBranches] = useState<LightBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [reassigning, setReassigning] = useState<AdminUserListItem | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [staffRes, branchRes] = await Promise.all([
        hexaTrackApi.owner.listStaff(),
        hexaTrackApi.owner.listBranches()
      ]);
      setStaff(staffRes);
      setBranches(branchRes);
    } catch (e) {
      console.error("Failed loading personnel infrastructure:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = staff.filter(s => 
    (!selectedBranchId || s.branchId === selectedBranchId) &&
    (
      s.displayName?.toLowerCase().includes(search.toLowerCase()) || 
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase()) ||
      s.branchName?.toLowerCase().includes(search.toLowerCase())
    )
  );

  function updateStaffRow(updated: AdminUserListItem) {
    setStaff((items) => items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             <Shield size={13} className="text-cyan animate-pulse" />
             <span className="text-[10px] font-black font-label-caps tracking-widest text-cyan uppercase">Personnel Databank</span>
          </div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Workforce Registry</h2>
          <p className="text-[13px] text-on-surface-variant mt-1 font-medium tracking-wide">Authorize operational clearances, reset access tokens, and provision node operators.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-5.5 bg-cyan text-black rounded-full font-black font-label-caps tracking-widest text-[10px] uppercase shadow-md shadow-cyan/20 flex items-center gap-2 hover:brightness-105 transition-all active:scale-98 shrink-0 border border-white/[0.1]"
        >
          <UserPlus size={14} /> Add Node Operator
        </button>
      </div>

      <BranchStaffAnalytics staff={staff} branches={branches} />

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mt-4 relative z-20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-cyan h-4 w-4 opacity-80" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, access link, branch, cluster..."
            className="w-full h-13 bg-[#0E152B]/60 border border-white/[0.05] rounded-[20px] pl-12 pr-5 text-xs text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-cyan/30 transition-all shadow-inner font-medium"
          />
        </div>
        <BranchFilterDropdown branches={branches} value={selectedBranchId} onChange={setSelectedBranchId} />
      </div>

      <div className="grid gap-4 md:hidden">
        {filtered.map((item) => (
          <button key={item.id} type="button" onClick={() => setReassigning(item)} className="text-left active:scale-[0.99] transition-transform">
            <StaffBranchCard staff={item} />
          </button>
        ))}
      </div>

      {/* Tabular Engine */}
      <div className="bg-[#0E152B]/40 backdrop-blur-md border border-white/[0.05] rounded-[28px] overflow-hidden shadow-lg relative min-h-[320px] hidden md:block">
        {loading && staff.length === 0 ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1020]/90 backdrop-blur-md z-30">
             <Loader2 className="animate-spin h-7 w-7 text-cyan mb-3" />
             <span className="text-[10px] font-black text-cyan uppercase tracking-widest font-label-caps animate-pulse">Synchronizing records...</span>
           </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-[#0E152B]/50">
                <th className="px-6 py-4 text-[9px] font-black font-label-caps text-on-surface-variant uppercase tracking-widest">Identity Vector</th>
                <th className="px-6 py-4 text-[9px] font-black font-label-caps text-on-surface-variant uppercase tracking-widest">Sector</th>
                <th className="px-6 py-4 text-[9px] font-black font-label-caps text-on-surface-variant uppercase tracking-widest">Assigned Node</th>
                <th className="px-6 py-4 text-[9px] font-black font-label-caps text-on-surface-variant uppercase tracking-widest">Access Flow</th>
                <th className="px-6 py-4 text-[9px] font-black font-label-caps text-on-surface-variant uppercase tracking-widest text-right">Sequence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.map((s) => (
                <tr key={s.id} className="group hover:bg-[#0E152B]/50 transition-colors">
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10.5 h-10.5 rounded-xl bg-[#0E152B] flex items-center justify-center text-cyan font-black shadow-inner border border-cyan/15 shrink-0">
                        {(s.displayName || s.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-extrabold text-on-surface tracking-wide group-hover:text-cyan transition-colors truncate">{s.displayName || 'System Matrix'}</p>
                        <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 flex items-center gap-1 truncate select-all"><Mail size={11} className="opacity-50" /> {s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                     <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                       <Briefcase size={13} className="text-on-surface-variant opacity-60" />
                       {s.department || 'Finance Ops'}
                     </div>
                  </td>
                  <td className="px-6 py-4.5">
                     <BranchBadge name={s.branchName} />
                  </td>
                  <td className="px-6 py-4.5">
                     {s.isLocked ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black font-label-caps uppercase tracking-wider text-danger bg-danger/5 px-2.5 py-1 rounded-full border border-danger/20 shadow-inner">
                          <Lock size={11} /> TERMINAL LOCKED
                        </span>
                     ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black font-label-caps uppercase tracking-wider text-emerald bg-emerald/5 px-2.5 py-1 rounded-full border border-emerald/20 shadow-inner">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shadow-[0_0_6px_#10B981]" /> SECURED LINK
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4.5 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => setReassigning(s)} className="h-8 px-3 bg-[#0E152B] border border-white/[0.04] hover:border-cyan/20 rounded-lg text-on-surface-variant hover:text-cyan transition-all text-[10px] font-black font-label-caps tracking-widest uppercase" title="Reroute Node">Reroute</button>
                        <button className="h-8 w-8 bg-[#0E152B] border border-white/[0.04] hover:border-cyan/20 rounded-lg text-on-surface-variant hover:text-cyan flex items-center justify-center transition-all" title="Reset Signature"><KeyRound size={13} /></button>
                        <button className="h-8 w-8 bg-[#0E152B] border border-white/[0.04] hover:border-danger/20 rounded-lg text-on-surface-variant hover:text-danger flex items-center justify-center transition-all" title="Revoke Authority"><Trash2 size={13} /></button>
                        <button className="h-8 w-8 bg-[#0E152B] border border-white/[0.04] hover:border-white/[0.1] rounded-lg text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-all"><MoreHorizontal size={13} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && staff.length > 0 && (
            <div className="py-20 text-center text-on-surface-variant font-bold text-sm italic select-none">Zero signal signatures matches filters in cache memory.</div>
          )}

          {!loading && staff.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6 select-none">
               <div className="w-20 h-20 bg-cyan/5 rounded-[28px] flex items-center justify-center border border-cyan/15 mb-6 shadow-inner relative overflow-hidden">
                  <UsersFull size={32} className="text-cyan drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
               </div>
               <h3 className="text-xl font-extrabold text-on-surface tracking-wide font-sans">Deploy New Personnel Subnode</h3>
               <p className="text-[13px] text-on-surface-variant max-w-sm mt-2 font-medium leading-relaxed tracking-wide">No operational operators have been provisioned inside this tenant cluster. Recruit the first agent below.</p>
               
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="mt-8 h-12 px-7 bg-cyan text-black font-black text-[10px] font-label-caps tracking-widest uppercase rounded-full shadow-md shadow-cyan/15 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 border border-white/[0.1]"
               >
                  <UserPlus size={15} /> Initialize Recruitment Pipeline <ArrowRight size={15} />
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals Portal */}
      <AnimatePresence>
        {isModalOpen && (
           <CreateStaffModal 
              branches={branches} 
              onClose={() => setIsModalOpen(false)} 
              onSuccess={() => {
                 setIsModalOpen(false);
                 void loadData();
              }}
           />
        )}
        {reassigning && (
          <ReassignBranchModal
            staff={reassigning}
            branches={branches}
            onClose={() => setReassigning(null)}
            onSaved={updateStaffRow}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateStaffModal({ branches, onClose, onSuccess }: { branches: LightBranch[], onClose: () => void, onSuccess: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    branchId: branches[0]?.id || '',
    department: 'Finance'
  });

  useEffect(() => {
    if (!form.branchId && branches.length > 0) {
       setForm(f => ({ ...f, branchId: branches[0].id }));
    }
  }, [branches, form.branchId]);

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null);

     if (!form.branchId) {
        setError("Operational authorization requires an active node link.");
        return;
     }

     setSaving(true);
     try {
        await hexaTrackApi.owner.createStaff(form);
        onSuccess();
     } catch (err: any) {
        console.error(err);
        setError(err.message || "Node registry communication failure.");
     } finally {
        setSaving(false);
     }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 font-sans animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-[#0B1020] border border-white/[0.08] rounded-[28px] shadow-2xl overflow-hidden z-10 shadow-cyan/5"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        
        <div className="p-6 border-b border-white/[0.04] flex justify-between items-center bg-[#0E152B]/20">
           <div>
             <h3 className="font-black text-lg text-on-surface font-sans tracking-wide">Recruit Subnode Operator</h3>
             <p className="text-[9px] text-cyan font-black font-label-caps mt-1 uppercase tracking-widest flex items-center gap-1.5">
               <Shield size={11} className="text-cyan animate-pulse"/> VALIDATED INTERFACE LINK
             </p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-xl bg-[#0E152B] border border-white/[0.04] text-on-surface-variant hover:text-cyan flex items-center justify-center transition-all active:scale-90">
             <X size={15} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5.5">
           {error && (
             <div className="bg-danger/10 border border-danger/30 rounded-[18px] p-4 text-danger text-[11px] font-bold font-sans flex items-start gap-2.5 animate-in slide-in-from-top-2 shadow-sm leading-relaxed">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {error}
             </div>
           )}

           <div className="space-y-2">
              <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest font-label-caps ml-1 opacity-80">Legal Operator Name</label>
              <input 
                required
                value={form.fullName}
                onChange={(e) => setForm({...form, fullName: e.target.value})}
                placeholder="Ex: Alexander Vance"
                className="w-full h-12 px-4.5 bg-[#0E152B] border border-white/[0.05] rounded-[18px] text-xs text-on-surface font-medium focus:border-cyan/30 outline-none transition-all shadow-inner"
              />
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest font-label-caps ml-1 opacity-80">Identity Email Link</label>
              <input 
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="operator@entity.corp"
                className="w-full h-12 px-4.5 bg-[#0E152B] border border-white/[0.05] rounded-[18px] text-xs text-on-surface font-medium focus:border-cyan/30 outline-none transition-all shadow-inner"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <BranchSelector
                   branches={branches}
                   value={form.branchId}
                   onChange={(branchId) => setForm({...form, branchId})}
                   label="Branch Vector"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest font-label-caps ml-1 opacity-80">Cluster Sector</label>
                 <select 
                   value={form.department}
                   onChange={(e) => setForm({...form, department: e.target.value})}
                   className="w-full h-12 px-4 bg-[#0E152B] border border-white/[0.05] rounded-[18px] text-xs text-cyan font-bold tracking-wide focus:border-cyan/30 outline-none appearance-none cursor-pointer shadow-inner select-none"
                 >
                    {['Finance', 'Operations', 'Sales', 'HR', 'Management'].map(d => (
                       <option key={d} value={d} className="bg-[#0B1020] text-on-surface font-medium">{d}</option>
                    ))}
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest font-label-caps ml-1 opacity-80">Initial Entrance Key</label>
              <input 
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                className="w-full h-12 px-4.5 bg-[#0E152B] border border-white/[0.05] rounded-[18px] text-xs text-cyan tracking-widest focus:border-cyan/30 outline-none transition-all shadow-inner"
              />
           </div>

           <div className="pt-5 border-t border-white/[0.04] flex gap-3 relative z-10">
              <button type="button" onClick={onClose} className="flex-1 h-12 bg-[#0E152B] border border-white/[0.04] hover:border-white/[0.1] rounded-full text-[10px] font-black font-label-caps tracking-widest uppercase text-on-surface-variant hover:text-on-surface transition-all active:scale-[0.98]">
                Abort Seq
              </button>
              <button 
                 type="submit" 
                 disabled={saving || branches.length === 0} 
                 className="flex-1 h-12 bg-cyan text-black font-black text-[10px] font-label-caps tracking-widest uppercase rounded-full shadow-md shadow-cyan/10 border border-white/[0.05] flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50 active:scale-[0.98] transition-all"
              >
                {saving ? <Loader2 className="animate-spin" size={15} /> : 'Provision Cell'}
              </button>
           </div>
        </form>
      </motion.div>
    </div>
  );
}

/* High-Tech Registry SVG Icon */
function UsersFull(props: any) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

