'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { AdminUserListItem, AdminCreateUserRequest, WorkspaceType, LightOrganization, LightBranch } from '@/lib/types';
import { Users, Plus, Search, Shield, Lock, Unlock, Trash2, X, ChevronLeft, ChevronRight, MoreVertical, Crown, Copy, Check, Sparkles, Building, Landmark, UserCheck, RefreshCw } from 'lucide-react';
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
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleLock = async (u: AdminUserListItem) => {
    try {
      await hexaTrackApi.admin.setLocked(u.id, !u.isLocked);
      setActionUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSuperAdmin = async (u: AdminUserListItem) => {
    try {
      await hexaTrackApi.admin.setSuperAdmin(u.id, !u.isSuperAdmin);
      setActionUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this user permanently? This will also remove their user data.')) return;
    try {
      await hexaTrackApi.admin.deleteUser(id);
      setActionUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
        <div>
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mb-1">Super Admin Panel</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform User Management</h1>
          <p className="text-xs text-gray-500 mt-1">Provision and audit system accounts across Individual, Org, and Branch manager levels.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/10 active:scale-[0.98]"
        >
          <Plus size={15} /> Provision New Account
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search accounts by name, email, department or organization..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.06] bg-[#0E1425] text-xs text-white placeholder:text-gray-600 outline-none focus:border-violet-500/30 transition-colors"
        />
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1425] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_60px] gap-4 px-5 py-3.5 border-b border-white/[0.04] text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/[0.01]">
          <span>User Identity</span>
          <span>Organization Context</span>
          <span>Tenant Scopes</span>
          <span>SaaS Tier</span>
          <span>System Status</span>
          <span />
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[11px] text-gray-500 mt-3">Fetching platform tenants...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-xs text-gray-500">No matching accounts found in records.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {users.map((u, i) => {
              // Deduce badges based on membership
              const isOrg = !!u.organizationName;
              const isBranch = !!u.branchName;

              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                  className="relative grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_60px] gap-2 lg:gap-4 items-center px-5 py-3.5 hover:bg-white/[0.015] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
                      {u.displayName?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white truncate">{u.displayName}</p>
                        {u.isSuperAdmin && <Crown size={11} className="text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                    </div>
                  </div>

                  <div>
                    {isOrg ? (
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-300 truncate flex items-center gap-1">
                          <Building size={11} className="text-violet-400" />
                          {u.organizationName}
                        </p>
                        {u.department && <p className="text-[9px] text-gray-500 truncate mt-0.5">{u.department}</p>}
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-600 italic">No org assignment</span>
                    )}
                  </div>

                  <div>
                    {isBranch ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10">
                        <Landmark size={9} />
                        {u.branchName}
                      </span>
                    ) : isOrg ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10">
                        <Building size={9} />
                        {u.organizationRole === 'Owner' ? 'Org Owner' : 'Org Staff'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-500/10">
                        <UserCheck size={9} />
                        Individual
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gray-400">{u.subscriptionPlan ?? 'Free Plan'}</span>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider ${u.isLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                      <span className={`w-1 h-1 rounded-full ${u.isLocked ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      {u.isLocked ? 'Locked' : 'Active'}
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setActionUser(actionUser === u.id ? null : u.id)}
                      className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-gray-500"
                    >
                      <MoreVertical size={14} />
                    </button>
                    <AnimatePresence>
                      {actionUser === u.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionUser(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-8 w-44 rounded-xl border border-white/[0.08] bg-[#141828] shadow-2xl z-20 py-1.5"
                          >
                            <button
                              onClick={() => handleToggleLock(u)}
                              className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-gray-300 hover:bg-white/[0.04]"
                            >
                              {u.isLocked ? <><Unlock size={12} /> Unlock Account</> : <><Lock size={12} /> Lock Account</>}
                            </button>
                            <button
                              onClick={() => handleToggleSuperAdmin(u)}
                              className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-amber-400 hover:bg-white/[0.04]"
                            >
                              <Shield size={12} /> {u.isSuperAdmin ? 'Demote Super' : 'Promote Super'}
                            </button>
                            <div className="border-t border-white/[0.04] my-1" />
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-red-400 hover:bg-white/[0.04]"
                            >
                              <Trash2 size={12} /> Delete Tenant
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04] bg-white/[0.005]">
            <p className="text-[10px] text-gray-500 font-semibold">{totalCount} accounts listed</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-gray-500 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] text-gray-400 px-2 font-semibold">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-gray-500 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateUserModal
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              fetchUsers();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; pass: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form selections
  const [userMode, setUserMode] = useState<'Individual' | 'Organization' | 'BranchManager'>('Individual');
  const [organizations, setOrganizations] = useState<LightOrganization[]>([]);
  const [branches, setBranches] = useState<LightBranch[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');

  const [form, setForm] = useState<AdminCreateUserRequest>({
    email: '',
    password: '',
    fullName: '',
    workspaceName: '',
    workspaceType: 'Personal',
    currency: 'USD',
    isSuperAdmin: false,
    organizationId: null,
    branchId: null,
    organizationRole: null,
    department: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto generate password
  useEffect(() => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let generated = '';
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((f) => ({ ...f, password: generated }));
  }, []);

  // Fetch Orgs & Branches
  useEffect(() => {
    if (userMode !== 'Individual') {
      hexaTrackApi.admin.allOrganizations()
        .then(setOrganizations)
        .catch(console.error);
    }
  }, [userMode]);

  useEffect(() => {
    if (selectedOrgId) {
      hexaTrackApi.admin.allBranches(selectedOrgId)
        .then(setBranches)
        .catch(console.error);
    } else {
      setBranches([]);
    }
  }, [selectedOrgId]);

  // Adjust defaults on UserMode change
  const handleModeChange = (mode: 'Individual' | 'Organization' | 'BranchManager') => {
    setUserMode(mode);
    setSelectedOrgId('');
    setSelectedBranchId('');
    setForm((f) => ({
      ...f,
      workspaceName: mode === 'Individual' ? 'My Ledger' : mode === 'Organization' ? 'HQ Workspace' : 'Branch Ledger',
      workspaceType: mode === 'Individual' ? 'Personal' : 'Business',
      organizationRole: mode === 'Organization' ? 'Owner' : mode === 'BranchManager' ? 'Staff' : null,
    }));
  };

  const handleCopy = () => {
    if (!createdCredentials) return;
    const txt = `HexaTrack Account Details\n-------------------------\nDisplay Name: ${createdCredentials.name}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.pass}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...form,
        workspaceName: form.workspaceName || 'My Finance Ledger',
        organizationId: selectedOrgId || null,
        branchId: selectedBranchId || null,
      };

      const result = await hexaTrackApi.admin.createUser(payload);

      setCreatedCredentials({
        name: result.displayName,
        email: result.email,
        pass: result.plaintextPassword || form.password,
      });
      setStep('success');
    } catch (e: any) {
      setError(e.message ?? 'Platform failed to provision account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-[#0E1425] shadow-2xl overflow-hidden"
      >
        {step === 'form' ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-bold text-white">Provision Account</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Provision an isolated individual or enterprise tenant.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[500px] overflow-y-auto">
              {/* Account Level Selector */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Account Scoping</label>
                <div className="grid grid-cols-3 gap-2 bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
                  {(['Individual', 'Organization', 'BranchManager'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleModeChange(m)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        userMode === m ? 'bg-violet-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {m === 'BranchManager' ? 'Branch Mgr' : m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organization Fields */}
              {userMode !== 'Individual' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Select Organization</label>
                      <select
                        value={selectedOrgId}
                        onChange={(e) => setSelectedOrgId(e.target.value)}
                        required
                        className="w-full h-10 px-3 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30"
                      >
                        <option value="">-- Choose Org --</option>
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
                        {userMode === 'BranchManager' ? 'Select Branch' : 'Organization Role'}
                      </label>
                      {userMode === 'BranchManager' ? (
                        <select
                          value={selectedBranchId}
                          onChange={(e) => setSelectedBranchId(e.target.value)}
                          required
                          className="w-full h-10 px-3 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30"
                        >
                          <option value="">-- Choose Branch --</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={form.organizationRole || 'Owner'}
                          onChange={(e) => setForm((f) => ({ ...f, organizationRole: e.target.value }))}
                          className="w-full h-10 px-3 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30"
                        >
                          <option value="Owner">Owner (Primary)</option>
                          <option value="Staff">Staff (Operations)</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Department (Optional)</label>
                    <input
                      value={form.department || ''}
                      onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30"
                      placeholder="e.g., Accounts, Treasury"
                    />
                  </div>
                </motion.div>
              )}

              {/* Core Credentials */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    required
                    className="w-full h-10 px-3.5 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full h-10 px-3.5 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Initial Workspace Name</label>
                  <input
                    value={form.workspaceName}
                    onChange={(e) => setForm((f) => ({ ...f, workspaceName: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30"
                    placeholder={userMode === 'Individual' ? 'My Ledger' : 'Business HQ'}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Base Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e: any) => setForm((f) => ({ ...f, currency: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-white/[0.06] bg-[#141828] text-xs text-white outline-none focus:border-violet-500/30 font-semibold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Security & Access</label>
                <div className="flex items-center gap-3 px-1 py-1">
                  <input
                    type="checkbox"
                    checked={form.isSuperAdmin}
                    onChange={(e) => setForm((f) => ({ ...f, isSuperAdmin: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/10 bg-[#141828] text-violet-500 focus:ring-violet-500/20 focus:ring-offset-0"
                    id="sa-check-mod"
                  />
                  <label htmlFor="sa-check-mod" className="text-xs text-gray-300 font-semibold cursor-pointer select-none">
                    Grant global Super Administrator role
                  </label>
                </div>
              </div>

              {error && <p className="text-[11px] text-red-400 bg-red-500/10 px-3.5 py-2 rounded-xl border border-red-500/10">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/[0.06] bg-white/[0.005]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {submitting && <RefreshCw size={12} className="animate-spin" />}
                {submitting ? 'Provisioning...' : 'Provision Tenant'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold shadow-lg shadow-emerald-500/5">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Tenant Provisioned!</h2>
              <p className="text-xs text-gray-500 mt-1">Copy the one-time generated secure credentials before closing.</p>
            </div>

            <div className="bg-[#141828] border border-white/[0.06] rounded-2xl p-4 text-left space-y-3 max-w-sm mx-auto">
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Display Name</p>
                <p className="text-xs font-semibold text-white">{createdCredentials?.name}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email / Login ID</p>
                <p className="text-xs font-semibold text-white">{createdCredentials?.email}</p>
              </div>
              <div className="relative">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">One-Time Password</p>
                <p className="text-xs font-bold text-amber-400 font-mono tracking-wide">{createdCredentials?.pass}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 max-w-xs mx-auto pt-2">
              <button
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Credentials Copied!' : 'Copy Login Details'}
              </button>
              <button
                onClick={onCreated}
                className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/[0.02] text-xs font-bold text-gray-400 hover:text-white transition-all"
              >
                Done & Return
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
