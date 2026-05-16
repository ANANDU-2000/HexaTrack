'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { LightBranch, LightOrganization } from '@/lib/types';
import { GitBranch, Search, Building2, Users, Plus, Edit, Trash2, MoreVertical, X, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateBranchRequest } from '@/lib/types';

export default function BranchesPage() {
  const { accessToken } = useAuthStore();
  const [branches, setBranches] = useState<LightBranch[]>([]);
  const [orgs, setOrgs] = useState<LightOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOrg, setFilterOrg] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [actionBranch, setActionBranch] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [b, o] = await Promise.all([
        hexaTrackApi.admin.allBranches(filterOrg || undefined),
        hexaTrackApi.admin.allOrganizations(),
      ]);
      setBranches(b); setOrgs(o);
    } catch {}
    setLoading(false);
  }, [accessToken, filterOrg]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this branch?')) return;
    await hexaTrackApi.admin.deleteBranch(id);
    setActionBranch(null);
    fetchData();
  };

  const orgMap = Object.fromEntries(orgs.map(o => [o.id, o.name]));

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-1">Management</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Branches</h1>
        </div>
        <div className="sm:ml-auto">
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all active:scale-[0.98]">
            <Plus size={16} /> New Branch
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <select value={filterOrg} onChange={e => setFilterOrg(e.target.value)} className="h-11 px-4 rounded-xl border border-white/[0.06] bg-[#0E1425] text-sm text-white outline-none min-w-[200px]">
          <option value="">All Organizations</option>
          {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1425] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_60px] gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span>Branch</span><span>Organization</span><span>Code</span><span>Currency</span><span />
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : branches.length === 0 ? (
          <div className="p-12 text-center"><GitBranch size={40} className="mx-auto text-gray-600 mb-3" /><p className="text-sm text-gray-500">No branches found</p></div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {branches.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="relative grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1fr_60px] gap-2 lg:gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center"><GitBranch size={16} className="text-amber-400" /></div>
                  <p className="text-sm font-semibold text-white truncate">{b.name}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Building2 size={13} className="text-gray-600" />
                  {orgMap[b.organizationId] ?? '—'}
                </div>
                <p className="text-sm text-gray-400 font-mono">{b.code ?? '—'}</p>
                <p className="text-sm text-gray-400">{b.currency ?? '—'}</p>
                <div className="relative">
                  <button onClick={() => setActionBranch(actionBranch === b.id ? null : b.id)} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500"><MoreVertical size={16} /></button>
                  <AnimatePresence>
                    {actionBranch === b.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-10 w-40 rounded-xl border border-white/[0.08] bg-[#141828] shadow-xl z-20 py-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/[0.04]"><Edit size={13} /> Edit</button>
                        <button onClick={() => handleDelete(b.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/[0.04]"><Trash2 size={13} /> Delete</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && <CreateBranchModal orgs={orgs} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchData(); }} />}
      </AnimatePresence>
    </div>
  );
}

function CreateBranchModal({ orgs, onClose, onCreated }: { orgs: LightOrganization[]; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreateBranchRequest>({ organizationId: orgs[0]?.id ?? '', name: '', code: '', currency: 'INR', timezone: 'Asia/Kolkata' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try { await hexaTrackApi.admin.createBranch(form); onCreated(); }
    catch (e: any) { setError(e.message ?? 'Failed'); }
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0E1425] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold text-white">New Branch</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Organization</label>
            <select value={form.organizationId} onChange={e => setForm(f => ({ ...f, organizationId: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none">
              {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Branch Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30" placeholder="Main Branch" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Code</label>
              <input value={form.code ?? ''} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none" placeholder="BR-001" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Currency</label>
              <select value={form.currency ?? 'INR'} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none">
                {['INR', 'USD', 'EUR', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-white/[0.06]">
          <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all disabled:opacity-60">
            {submitting ? 'Creating...' : 'Create Branch'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
