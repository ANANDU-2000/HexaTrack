'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { AdminUserListItem, LightOrganization, LightBranch, AddStaffRequest } from '@/lib/types';
import { UserCog, Search, Building2, GitBranch, Plus, X, ArrowRightLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffPage() {
  const { accessToken } = useAuthStore();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [orgs, setOrgs] = useState<LightOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [u, o] = await Promise.all([
        hexaTrackApi.admin.users(search || undefined, page, pageSize),
        hexaTrackApi.admin.allOrganizations(),
      ]);
      // Filter to show only org members (staff + owners)
      setUsers(u.items.filter(x => x.organizationRole));
      setTotalCount(u.items.filter(x => x.organizationRole).length);
      setOrgs(o);
    } catch {}
    setLoading(false);
  }, [accessToken, search, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleReassign = async (userId: string, branchId: string | null) => {
    try {
      await hexaTrackApi.admin.reassignStaffBranch(userId, { branchId });
      fetchData();
    } catch {}
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Management</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Staff</h1>
        </div>
        <div className="sm:ml-auto">
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all active:scale-[0.98]">
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search staff members..." className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.06] bg-[#0E1425] text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/30 transition-colors" />
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1425] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span>Staff Member</span><span>Organization</span><span>Role</span><span>Branch</span><span>Department</span>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center"><UserCog size={40} className="mx-auto text-gray-600 mb-3" /><p className="text-sm text-gray-500">No staff members found</p></div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {users.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-2 lg:gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {u.displayName?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{u.displayName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Building2 size={13} className="text-gray-600" />
                  {u.organizationName ?? '—'}
                </div>
                <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.organizationRole === 'Owner' ? 'text-amber-400 bg-amber-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
                  {u.organizationRole}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <GitBranch size={13} className="text-gray-600" />
                  {u.branchName ?? '—'}
                </div>
                <p className="text-sm text-gray-400">{u.department ?? '—'}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && <AddStaffModal orgs={orgs} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchData(); }} />}
      </AnimatePresence>
    </div>
  );
}

function AddStaffModal({ orgs, onClose, onCreated }: { orgs: LightOrganization[]; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<AddStaffRequest>({ organizationId: orgs[0]?.id ?? '', fullName: '', email: '', password: '', department: '' });
  const [branches, setBranches] = useState<LightBranch[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (form.organizationId) {
      hexaTrackApi.admin.allBranches(form.organizationId).then(setBranches).catch(() => {});
    }
  }, [form.organizationId]);

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try { await hexaTrackApi.admin.addStaff(form); onCreated(); }
    catch (e: any) { setError(e.message ?? 'Failed'); }
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0E1425] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold text-white">Add Staff Member</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Organization</label>
            <select value={form.organizationId} onChange={e => setForm(f => ({ ...f, organizationId: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none">
              {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          {branches.length > 0 && (
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Branch</label>
              <select value={form.branchId ?? ''} onChange={e => setForm(f => ({ ...f, branchId: e.target.value || undefined }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none">
                <option value="">No branch</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
            <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Department</label>
              <input value={form.department ?? ''} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none" />
            </div>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-white/[0.06]">
          <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all disabled:opacity-60">
            {submitting ? 'Adding...' : 'Add Staff'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
