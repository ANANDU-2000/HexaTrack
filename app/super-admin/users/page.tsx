'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { AdminUserListItem, AdminCreateUserRequest, WorkspaceType } from '@/lib/types';
import { Users, Plus, Search, Shield, Lock, Unlock, Trash2, X, ChevronLeft, ChevronRight, MoreVertical, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersPage() {
  const { accessToken } = useAuthStore();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [actionUser, setActionUser] = useState<string | null>(null);
  const pageSize = 20;

  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await hexaTrackApi.admin.users(search || undefined, page, pageSize);
      setUsers(result.items);
      setTotalCount(result.totalCount);
    } catch { }
    setLoading(false);
  }, [accessToken, search, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleLock = async (u: AdminUserListItem) => {
    await hexaTrackApi.admin.setLocked(u.id, !u.isLocked);
    setActionUser(null);
    fetchUsers();
  };

  const handleToggleSuperAdmin = async (u: AdminUserListItem) => {
    await hexaTrackApi.admin.setSuperAdmin(u.id, !u.isSuperAdmin);
    setActionUser(null);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user permanently?')) return;
    await hexaTrackApi.admin.deleteUser(id);
    setActionUser(null);
    fetchUsers();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div>
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-1">Management</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
        </div>
        <div className="sm:ml-auto">
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all active:scale-[0.98]">
            <Plus size={16} /> New User
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users by name or email..." className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.06] bg-[#0E1425] text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/30 transition-colors" />
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1425] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_60px] gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span>User</span>
          <span>Organization</span>
          <span>Role</span>
          <span>Plan</span>
          <span>Status</span>
          <span />
        </div>

        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {users.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="relative grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_60px] gap-2 lg:gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {u.displayName?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white truncate">{u.displayName}</p>
                      {u.isSuperAdmin && <Crown size={12} className="text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">{u.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 truncate">{u.organizationName ?? '—'}</p>
                <div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.organizationRole === 'Owner' ? 'text-amber-400 bg-amber-500/10' : u.organizationRole === 'Staff' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 bg-gray-500/10'}`}>
                    {u.organizationRole ?? 'Individual'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400">{u.subscriptionPlan ?? 'Free'}</span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${u.isLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.isLocked ? 'bg-red-400' : 'bg-emerald-400'}`} />
                    {u.isLocked ? 'Locked' : 'Active'}
                  </span>
                </div>
                <div className="relative">
                  <button onClick={() => setActionUser(actionUser === u.id ? null : u.id)} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500">
                    <MoreVertical size={16} />
                  </button>
                  <AnimatePresence>
                    {actionUser === u.id && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-10 w-48 rounded-xl border border-white/[0.08] bg-[#141828] shadow-xl z-20 py-1">
                        <button onClick={() => handleToggleLock(u)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/[0.04]">
                          {u.isLocked ? <><Unlock size={13} /> Unlock</> : <><Lock size={13} /> Lock</>}
                        </button>
                        <button onClick={() => handleToggleSuperAdmin(u)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-400 hover:bg-white/[0.04]">
                          <Shield size={13} /> {u.isSuperAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/[0.04]">
                          <Trash2 size={13} /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
            <p className="text-[11px] text-gray-500">{totalCount} total</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-gray-500 disabled:opacity-30"><ChevronLeft size={14} /></button>
              <span className="text-xs text-gray-400 px-2">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-gray-500 disabled:opacity-30"><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchUsers(); }} />}
      </AnimatePresence>
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<AdminCreateUserRequest>({ email: '', password: '', fullName: '', workspaceName: 'Default', workspaceType: 'Personal' as WorkspaceType, currency: 'INR', isSuperAdmin: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try { await hexaTrackApi.admin.createUser(form); onCreated(); }
    catch (e: any) { setError(e.message ?? 'Failed'); }
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0E1425] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold text-white">New User</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
            <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30" placeholder="jane@example.com" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-white/[0.06] bg-[#141828] text-sm text-white outline-none focus:border-emerald-500/30" placeholder="••••••••" />
          </div>
          <div className="flex items-center gap-3 px-1 py-2">
            <input type="checkbox" checked={form.isSuperAdmin} onChange={e => setForm(f => ({ ...f, isSuperAdmin: e.target.checked }))} className="w-4 h-4 rounded accent-emerald-500" id="sa-check" />
            <label htmlFor="sa-check" className="text-sm text-gray-300">Super Admin privileges</label>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-white/[0.06]">
          <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all disabled:opacity-60">
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
