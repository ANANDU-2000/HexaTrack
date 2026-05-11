'use client';

import React, { useEffect, useState } from 'react';
import { 
  MoreHorizontal, Search, Shield, UserPlus, Briefcase, Trash2, 
  Lock, Mail, Loader2, X, AlertCircle, Building2, CheckCircle2,
  KeyRound, Globe, ArrowRight
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
    <div className="space-y-5 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Workforce Registry
            <span className="px-2 py-0.5 bg-[#4F8CFF]/10 border border-[#4F8CFF]/30 text-[#4F8CFF] rounded text-[10px] font-black uppercase tracking-widest">Realtime</span>
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-1 font-medium">Command operational clearances and delegate branch responsibilities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 bg-[#4F8CFF] text-white rounded-xl font-bold text-sm shadow-[0_12px_24px_-8px_rgba(79,140,255,0.5)] flex items-center gap-2.5 hover:brightness-110 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <UserPlus size={18} /> Add Staff Member
        </button>
      </div>

      <BranchStaffAnalytics staff={staff} branches={branches} />

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]/50 h-4 w-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, branch, or dept..."
            className="w-full h-12 bg-[#111827] border border-white/[0.06] rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-[#9CA3AF]/40 outline-none focus:border-[#4F8CFF]/50 transition-all shadow-sm"
          />
        </div>
        <BranchFilterDropdown branches={branches} value={selectedBranchId} onChange={setSelectedBranchId} />
      </div>

      <div className="grid gap-3 md:hidden">
        {filtered.map((item) => (
          <button key={item.id} type="button" onClick={() => setReassigning(item)} className="text-left">
            <StaffBranchCard staff={item} />
          </button>
        ))}
      </div>

      {/* Tabular Engine */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-[24px] overflow-hidden shadow-xl relative min-h-[300px] hidden md:block">
        {loading && staff.length === 0 ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]/90 backdrop-blur-sm z-10">
             <Loader2 className="animate-spin h-8 w-8 text-[#4F8CFF] mb-3" />
             <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Indexing Realtime Records...</span>
           </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                <th className="px-6 py-4 text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Avatar / Name / Email</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Assigned Branch</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((s) => (
                <tr key={s.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4F8CFF] to-[#2563EB] flex items-center justify-center text-white font-black shadow-lg border border-white/10">
                        {(s.displayName || s.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white tracking-tight group-hover:text-[#4F8CFF] transition-colors">{s.displayName || 'Unknown Vector'}</p>
                        <p className="text-xs text-[#9CA3AF] font-medium mt-0.5 flex items-center gap-1"><Mail size={10} className="opacity-60" /> {s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                       <Briefcase size={12} className="text-[#9CA3AF]" />
                       {s.department || 'Finance'}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <BranchBadge name={s.branchName} />
                  </td>
                  <td className="px-6 py-4">
                     {s.isLocked ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                          <Lock size={12} /> Terminal Locked
                        </span>
                     ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Fully Active
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setReassigning(s)} className="h-8 px-3 flex items-center justify-center hover:bg-[#4F8CFF]/10 border border-transparent hover:border-[#4F8CFF]/20 rounded-lg text-[#9CA3AF] hover:text-[#4F8CFF] transition-all text-xs font-bold" title="Change Branch">Change Branch</button>
                        <button className="h-8 w-8 flex items-center justify-center hover:bg-white/[0.05] border border-transparent hover:border-white/[0.1] rounded-lg text-[#9CA3AF] hover:text-white transition-all" title="Reset Password"><KeyRound size={14} /></button>
                        <button className="h-8 w-8 flex items-center justify-center hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg text-[#9CA3AF] hover:text-red-400 transition-all" title="Terminate Access"><Trash2 size={14} /></button>
                        <button className="h-8 w-8 flex items-center justify-center hover:bg-white/[0.05] border border-transparent hover:border-white/[0.1] rounded-lg text-[#9CA3AF] hover:text-white transition-all"><MoreHorizontal size={14} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && staff.length > 0 && (
            <div className="py-20 text-center text-[#9CA3AF] font-bold text-sm italic">No matching personnel vectors satisfy constraints.</div>
          )}

          {!loading && staff.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center px-6">
               <div className="w-24 h-24 bg-gradient-to-br from-[#4F8CFF]/20 to-transparent rounded-[32px] flex items-center justify-center border border-[#4F8CFF]/30 mb-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white opacity-10"/>
                  <UsersFull size={40} className="text-[#4F8CFF]" />
               </div>
               <h3 className="text-2xl font-black text-white tracking-tight">Construct Your Workforce</h3>
               <p className="text-sm text-[#9CA3AF] max-w-sm mt-2 font-medium leading-relaxed">Zero active personnel exist within this operational envelope. Provision the first staff node to initiate corporate transactions.</p>
               
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="mt-8 h-12 px-8 bg-[#4F8CFF] text-white font-black text-sm rounded-2xl shadow-[0_15px_30px_-10px_rgba(79,140,255,0.5)] hover:-translate-y-1 transition-all active:translate-y-0 flex items-center gap-2.5"
               >
                  <UserPlus size={18} /> Start First Recruitment <ArrowRight size={16} />
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Staff Modal Portal */}
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
    // Re-sync branch if they loaded after mounting
    if (!form.branchId && branches.length > 0) {
       setForm(f => ({ ...f, branchId: branches[0].id }));
    }
  }, [branches, form.branchId]);

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError(null);

     if (!form.branchId) {
        setError("Operational routing requires an assigned Branch vector.");
        return;
     }

     setSaving(true);
     try {
        await hexaTrackApi.owner.createStaff(form);
        onSuccess();
     } catch (err: any) {
        console.error(err);
        setError(err.message || "Deployment communication link failure.");
     } finally {
        setSaving(false);
     }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#0B1015] border border-white/[0.08] rounded-[32px] shadow-2xl shadow-black overflow-hidden z-10"
      >
        <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
           <div>
             <h3 className="font-black text-xl text-white tracking-tight">Recruit Staff Node</h3>
             <p className="text-xs text-[#9CA3AF] font-medium mt-0.5 uppercase tracking-widest flex items-center gap-1.5">
               <Shield size={10} className="text-[#4F8CFF]"/> Validated Clearance Stream
             </p>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.05] text-[#9CA3AF] hover:text-white flex items-center justify-center transition-colors">
             <X size={16} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
           {error && (
             <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-red-400 text-xs font-bold flex items-start gap-2.5 animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {error}
             </div>
           )}

           <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Legal Associate Name</label>
              <input 
                required
                value={form.fullName}
                onChange={(e) => setForm({...form, fullName: e.target.value})}
                placeholder="Ex: Alex Mercer"
                className="w-full h-12 px-4 bg-[#111827] border border-white/[0.06] rounded-xl text-sm text-white font-medium focus:border-[#4F8CFF]/50 outline-none transition-all"
              />
           </div>

           <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Authorized Email Endpoint</label>
              <input 
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="alex@corporation.com"
                className="w-full h-12 px-4 bg-[#111827] border border-white/[0.06] rounded-xl text-sm text-white font-medium focus:border-[#4F8CFF]/50 outline-none transition-all"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <BranchSelector
                   branches={branches}
                   value={form.branchId}
                   onChange={(branchId) => setForm({...form, branchId})}
                   label="Branch Cluster"
                 />
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Allocated Dept</label>
                 <select 
                   value={form.department}
                   onChange={(e) => setForm({...form, department: e.target.value})}
                   className="w-full h-12 px-3 bg-[#111827] border border-white/[0.06] rounded-xl text-sm text-white font-medium focus:border-[#4F8CFF]/50 outline-none appearance-none cursor-pointer"
                 >
                    {['Finance', 'Operations', 'Sales', 'HR', 'Management'].map(d => (
                       <option key={d} value={d} className="bg-[#0B1015] text-white">{d}</option>
                    ))}
                 </select>
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Initial Access Matrix (Password)</label>
              <input 
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                className="w-full h-12 px-4 bg-[#111827] border border-white/[0.06] rounded-xl text-sm text-white font-medium focus:border-[#4F8CFF]/50 outline-none transition-all"
              />
           </div>

           <div className="pt-4 border-t border-white/[0.05] flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 h-12 border border-white/[0.08] rounded-xl text-sm font-bold text-white hover:bg-white/[0.05] transition-colors">
                Abort
              </button>
              <button 
                 type="submit" 
                 disabled={saving || branches.length === 0} 
                 className="flex-1 h-12 bg-[#4F8CFF] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#4F8CFF]/20 flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : 'Commit Vector'}
              </button>
           </div>
        </form>
      </motion.div>
    </div>
  );
}

/* Custom SVGs */
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
