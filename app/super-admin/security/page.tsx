'use client';

import React, { useEffect, useState } from 'react';
import { hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { AdminAuditLogDto } from '@/lib/types';
import { Lock, Shield, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityPage() {
  const { accessToken } = useAuthStore();
  const [logs, setLogs] = useState<AdminAuditLogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    hexaTrackApi.admin.auditLog(page, pageSize)
      .then(r => { setLogs(r.items); setTotalCount(r.totalCount); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken, page]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const actionColor = (action: string) => {
    if (action.includes('Delete') || action.includes('Suspend')) return 'text-red-400';
    if (action.includes('Create') || action.includes('Activate')) return 'text-emerald-400';
    if (action.includes('Update') || action.includes('Lock')) return 'text-amber-400';
    return 'text-gray-400';
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <div>
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-1">Security</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-1">Track all administrative actions across the platform</p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1425] overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr] gap-4 px-5 py-3 border-b border-white/[0.04] text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span>Action</span><span>Target</span><span>Type</span><span>IP</span><span>Time</span>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center"><Shield size={40} className="mx-auto text-gray-600 mb-3" /><p className="text-sm text-gray-500">No audit events</p></div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {logs.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }} className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr] gap-2 lg:gap-4 items-center px-5 py-3 hover:bg-white/[0.01]">
                <p className={`text-xs font-semibold ${actionColor(log.action)}`}>{log.action}</p>
                <p className="text-xs text-gray-400 truncate font-mono">{log.targetId ?? '—'}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-400 font-medium w-fit">{log.targetType ?? '—'}</span>
                <p className="text-xs text-gray-600 font-mono">{log.ipAddress ?? '—'}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Clock size={11} />
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
            <p className="text-[11px] text-gray-500">{totalCount} events</p>
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
