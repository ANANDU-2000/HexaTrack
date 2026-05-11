'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, ArrowUpRight, ArrowDownLeft, Filter, 
  Download, FileText, Calendar, Loader2, MapPin
} from 'lucide-react';
import { hexaTrackApi } from '@/lib/api';

export function ConsolidatedLedger() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
     setLoading(true);
     setError(null);
     try {
        const res = await hexaTrackApi.owner.ledger();
        setTxs(res);
     } catch (e: any) {
        console.error(e);
        setError(e.message || "Critical failure synthesizing master financial channels.");
     } finally {
        setLoading(false);
     }
  };

  useEffect(() => {
     void load();
  }, []);

  const safeTxs = Array.isArray(txs) ? txs : [];
  const income = safeTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = safeTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Macro Ledger
                <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] uppercase tracking-widest font-bold">Auditable</span>
             </h1>
             <p className="text-[#9CA3AF] text-sm font-medium mt-1">Consolidated cross-branch transaction stream parsed in real-time.</p>
          </div>
          <div className="flex gap-3">
             <button className="h-11 px-4 bg-white/[0.03] border border-white/[0.08] text-[#9CA3AF] rounded-xl font-bold text-sm flex items-center gap-2 hover:text-white hover:bg-white/[0.06] transition-all">
                <Download size={16} /> Export CSV
             </button>
             <button className="h-11 px-4 bg-white/[0.03] border border-white/[0.08] text-[#9CA3AF] rounded-xl font-bold text-sm flex items-center gap-2 hover:text-white hover:bg-white/[0.06] transition-all">
                <FileText size={16} /> PDF Report
             </button>
          </div>
       </div>

       {/* Fast KPI Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#111827] border border-white/[0.05] rounded-2xl p-6">
             <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                <ArrowUpRight size={12} className="text-[#22C55E]" /> Net Inflow
             </p>
             <h3 className="text-3xl font-black text-white mt-2">${income.toLocaleString(undefined, {minimumFractionDigits:2})}</h3>
          </div>
          <div className="bg-[#111827] border border-white/[0.05] rounded-2xl p-6">
             <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                <ArrowDownLeft size={12} className="text-[#EF4444]" /> Total Outflow
             </p>
             <h3 className="text-3xl font-black text-white mt-2">${expense.toLocaleString(undefined, {minimumFractionDigits:2})}</h3>
          </div>
          <div className="bg-[#111827] border border-white/[0.05] rounded-2xl p-6">
             <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Net Vector</p>
             <h3 className="text-3xl font-black text-[#4F8CFF] mt-2">${(income - expense).toLocaleString(undefined, {minimumFractionDigits:2})}</h3>
          </div>
       </div>

       {/* Record Engine */}
       <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] overflow-hidden relative min-h-[300px] shadow-2xl">
          {loading && (
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                <Loader2 className="animate-spin text-[#4F8CFF] mr-2" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Reconstructing Universal Ledger...</span>
             </div>
          )}

          {error ? (
             <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-400"><Download className="rotate-180" size={24} /></div>
                <h4 className="text-xl font-black text-white">Ledger Retrieval Failure</h4>
                <p className="text-xs font-bold text-[#9CA3AF] mt-1 mb-6 max-w-sm uppercase tracking-wider">{error}</p>
                <button onClick={() => load()} className="h-10 px-6 bg-white text-black rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
                   Retry Direct Acquisition
                </button>
             </div>
          ) : safeTxs.length === 0 && !loading ? (
             <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center mb-4"><BookOpen size={32} className="text-[#9CA3AF]" /></div>
                <h4 className="text-xl font-black text-white">Zero Transactions Detected</h4>
                <p className="text-sm text-[#9CA3AF] mt-1 max-w-xs">Macro ledger will self-populate as operations generate activity across established branches.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                   <thead className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">
                      <tr>
                         <th className="px-6 py-4">Timestamp</th>
                         <th className="px-6 py-4">Resource / Merchant</th>
                         <th className="px-6 py-4">Allocation Context</th>
                         <th className="px-6 py-4">Magnitude</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/[0.04]">
                      {safeTxs.map((t) => {
                         const isPos = t.amount > 0;
                         return (
                            <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                               <td className="px-6 py-4 text-xs font-medium text-[#9CA3AF]">
                                  {new Date(t.occurredOn).toLocaleDateString()}
                               </td>
                               <td className="px-6 py-4">
                                  <div className="font-bold text-white tracking-tight">{t.merchant || 'Internal Transfer'}</div>
                                  <div className="text-[10px] font-black text-[#4F8CFF] uppercase tracking-widest mt-0.5">{t.category}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                                     <MapPin size={12} className="text-[#9CA3AF]" /> {t.branchName}
                                  </div>
                                  <div className="text-[10px] font-medium text-[#9CA3AF] mt-0.5">{t.account}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={`font-black text-sm ${isPos ? 'text-[#22C55E]' : 'text-white'}`}>
                                     {isPos ? '+' : '-'}${Math.abs(t.amount).toLocaleString(undefined, {minimumFractionDigits:2})}
                                  </span>
                               </td>
                            </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          )}
       </div>
    </div>
  );
}
