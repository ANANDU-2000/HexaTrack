'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { AdminWorkspaceListItem } from '@/lib/types';
import { Layers, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const MODE_COLORS: Record<string, string> = { Personal: '#10B981', Business: '#0D9488', Family: '#F59E0B' };

export default function WorkspacesPage() {
  const { accessToken } = useAuthStore();
  const [workspaces, setWorkspaces] = useState<AdminWorkspaceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const fetch = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const r = await hexaTrackApi.admin.workspaces(search || undefined, page, pageSize);
      setWorkspaces(r.items); setTotalCount(r.totalCount);
    } catch {}
    setLoading(false);
  }, [accessToken, search, page]);

  useEffect(() => { fetch(); }, [fetch]);
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div>
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-1">Management</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces</h1>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search workspaces..." className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.06] bg-[#0E1425] text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/30 transition-colors" />
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1425] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span>Workspace</span><span>Type</span><span>Owner</span><span>Members</span><span>Plan</span>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : workspaces.length === 0 ? (
          <div className="p-12 text-center"><Layers size={40} className="mx-auto text-gray-600 mb-3" /><p className="text-sm text-gray-500">No workspaces found</p></div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {workspaces.map((ws, i) => (
              <motion.div key={ws.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 lg:gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${MODE_COLORS[ws.type] ?? '#6B7280'}15` }}>
                    <Layers size={16} style={{ color: MODE_COLORS[ws.type] ?? '#6B7280' }} />
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{ws.name}</p>
                </div>
                <span className="inline-flex w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ color: MODE_COLORS[ws.type], background: `${MODE_COLORS[ws.type]}15` }}>{ws.type}</span>
                <p className="text-xs text-gray-400 truncate">{ws.ownerEmail}</p>
                <p className="text-sm text-gray-300">{ws.memberCount}</p>
                <span className="text-xs font-medium text-gray-400">{ws.ownerSubscriptionPlan ?? 'Free'}</span>
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
    </div>
  );
}
