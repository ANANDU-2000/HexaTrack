'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Printer, Laptop, Car, Briefcase, 
  Monitor, ArrowUpRight, Calendar, DollarSign, User, MapPin, 
  X, Loader2, AlertCircle, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hexaTrackApi } from '@/lib/api';
import { LightBranch } from '@/lib/types';

export function AssetManagement() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await hexaTrackApi.owner.assets.list();
      setAssets(res);
    } catch (e) {
      console.error("Failed load assets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssets();
  }, []);

  const filtered = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalVal = assets.reduce((sum, a) => sum + (a.purchaseAmount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Asset Registry
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] uppercase tracking-widest font-bold">Hardware</span>
             </h1>
             <p className="text-[#C2C6D6] text-sm font-medium mt-1">Track hardware allocation, depreciation, and localized deployment.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 bg-[#4F8CFF] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#4F8CFF]/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Plus size={18} /> Register Asset
          </button>
       </div>

       {/* Top Metrics Row */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0E152B] border border-white/[0.05] rounded-2xl p-6 flex items-center gap-5">
             <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Monitor size={28} />
             </div>
             <div>
                <p className="text-[11px] font-black text-[#C2C6D6] uppercase tracking-wider">Inventory Count</p>
                <p className="text-3xl font-black text-white">{assets.length}</p>
             </div>
          </div>
          <div className="bg-[#0E152B] border border-white/[0.05] rounded-2xl p-6 flex items-center gap-5">
             <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <DollarSign size={28} />
             </div>
             <div>
                <p className="text-[11px] font-black text-[#C2C6D6] uppercase tracking-wider">Cumulative Valuation</p>
                <p className="text-3xl font-black text-white">${totalVal.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
             </div>
          </div>
          <div className="bg-[#0E152B] border border-white/[0.05] rounded-2xl p-6 flex items-center gap-5">
             <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <CheckCircle2 size={28} />
             </div>
             <div>
                <p className="text-[11px] font-black text-[#C2C6D6] uppercase tracking-wider">Network Status</p>
                <p className="text-2xl font-black text-[#22C55E]">ONLINE</p>
             </div>
          </div>
       </div>

       {/* Search Bar */}
       <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2C6D6] opacity-40" size={18} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by asset name or serial code..."
            className="w-full h-12 bg-[#0E152B] border border-white/[0.06] rounded-xl pl-12 pr-4 text-sm text-white placeholder:text-[#C2C6D6]/30 outline-none focus:border-[#4F8CFF]/50 transition-all"
          />
       </div>

       {/* Table Render */}
       <div className="bg-[#0E152B] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-2xl min-h-[300px] relative">
          {loading && assets.length === 0 && (
             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-20 text-white text-sm font-bold uppercase gap-2">
                <Loader2 className="animate-spin text-[#4F8CFF]" /> Streaming Assets...
             </div>
          )}

          {assets.length === 0 && !loading ? (
             <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-white/[0.03] border border-white/[0.08] rounded-3xl flex items-center justify-center mb-5 text-[#C2C6D6]">
                   <Package size={40} />
                </div>
                <h3 className="text-xl font-black text-white">Zero Enterprise Assets Registered</h3>
                <p className="text-sm text-[#C2C6D6] mt-1.5 max-w-xs font-medium">Begin cataloging laptops, vehicles, and office machinery linked to active branches.</p>
                <button onClick={() => setIsModalOpen(true)} className="mt-8 h-11 px-6 bg-[#4F8CFF] text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg hover:brightness-105 transition-all">
                   <Plus size={16} /> Register Initial Node
                </button>
             </div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-white/[0.02] text-[11px] font-black uppercase tracking-widest text-[#C2C6D6]">
                     <tr>
                        <th className="px-6 py-4">Identified Asset</th>
                        <th className="px-6 py-4">Location Context</th>
                        <th className="px-6 py-4">Assigned Operator</th>
                        <th className="px-6 py-4">Original Value</th>
                        <th className="px-6 py-4 text-right">Control</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                     {filtered.map((asset) => (
                        <tr key={asset.id} className="group hover:bg-white/[0.01] transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.08] flex items-center justify-center text-white shadow-inner">
                                    {getCatIcon(asset.category)}
                                 </div>
                                 <div>
                                    <div className="font-bold text-white tracking-tight">{asset.name}</div>
                                    <div className="text-[10px] font-black text-[#C2C6D6] uppercase tracking-widest mt-0.5">{asset.code || 'NOCODE'} • {asset.category}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-[#E1E2EC] font-bold text-xs">
                                 <MapPin size={12} className="text-[#C2C6D6]" /> {asset.branchName}
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-white font-medium text-xs">
                                 <User size={12} className="text-[#C2C6D6]" /> {asset.assignedTo}
                              </div>
                           </td>
                           <td className="px-6 py-4 font-black text-white text-sm">
                              ${(asset.purchaseAmount || 0).toLocaleString(undefined, {minimumFractionDigits:2})}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="h-8 px-3 border border-white/[0.08] rounded-lg text-[#C2C6D6] text-xs font-bold hover:text-white transition-colors">View</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}
       </div>

       <AnimatePresence>
          {isModalOpen && <CreateAssetModal onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); loadAssets(); }} />}
       </AnimatePresence>
    </div>
  );
}

function getCatIcon(cat: string) {
   const c = cat?.toLowerCase() || '';
   if (c.includes('laptop') || c.includes('computer')) return <Laptop size={18} />;
   if (c.includes('pos') || c.includes('printer')) return <Printer size={18} />;
   if (c.includes('vehicle')) return <Car size={18} />;
   if (c.includes('furniture')) return <Briefcase size={18} />;
   return <Package size={18} />;
}

function CreateAssetModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState('');
   const [branches, setBranches] = useState<LightBranch[]>([]);
   const [staff, setStaff] = useState<any[]>([]);

   const [form, setForm] = useState({
      name: '',
      code: '',
      category: 'Laptops',
      purchaseAmount: '',
      branchId: '',
      assignedUserId: '',
      notes: ''
   });

   useEffect(() => {
      const preload = async () => {
         try {
            const [brs, st] = await Promise.all([
               hexaTrackApi.owner.listBranches(),
               hexaTrackApi.owner.listStaff()
            ]);
            setBranches(brs);
            setStaff(st);
            if (brs.length > 0) setForm(f => ({ ...f, branchId: brs[0].id }));
         } catch (e) {}
      };
      preload();
   }, []);

   const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!form.branchId) return setError("Mandatory local node anchoring required.");
      
      setSaving(true);
      try {
         await hexaTrackApi.owner.assets.create({
            ...form,
            purchaseAmount: parseFloat(form.purchaseAmount) || 0,
            assignedUserId: form.assignedUserId || null
         });
         onSuccess();
      } catch (err: any) {
         setError(err.message || "API Link fault during ingestion.");
      } finally {
         setSaving(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
         <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} className="relative bg-[#0B1015] border border-white/[0.08] rounded-[32px] w-full max-w-md shadow-2xl z-10 overflow-hidden">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center">
               <div>
                  <h3 className="font-black text-xl text-white tracking-tight">Provision New Asset</h3>
                  <p className="text-[10px] font-bold text-[#C2C6D6] tracking-widest uppercase mt-0.5">Permanent Physical Log</p>
               </div>
               <button onClick={onClose} className="text-[#C2C6D6] hover:text-white"><X size={18} /></button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
               {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-lg flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#C2C6D6] uppercase tracking-widest ml-1">Descriptor Name</label>
                  <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="MacBook Pro 16-inch" className="w-full h-11 bg-[#0E152B] border border-white/[0.06] rounded-xl text-sm text-white px-4 outline-none focus:border-blue-500/50" />
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-[#C2C6D6] uppercase tracking-widest ml-1">Asset Tag / Code</label>
                     <input required value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} placeholder="LP-X-101" className="w-full h-11 bg-[#0E152B] border border-white/[0.06] rounded-xl text-sm text-white px-4 outline-none focus:border-blue-500/50" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-[#C2C6D6] uppercase tracking-widest ml-1">Category</label>
                     <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full h-11 bg-[#0E152B] border border-white/[0.06] rounded-xl text-sm text-white px-3 outline-none appearance-none">
                        {['Laptops', 'POS Systems', 'Printers', 'Vehicles', 'Office Equipment'].map(c => <option key={c} value={c} className="bg-[#0B1015]">{c}</option>)}
                     </select>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#C2C6D6] uppercase tracking-widest ml-1">Purchase Base Amount ($)</label>
                  <input required type="number" value={form.purchaseAmount} onChange={(e) => setForm({...form, purchaseAmount: e.target.value})} placeholder="0.00" className="w-full h-11 bg-[#0E152B] border border-white/[0.06] rounded-xl text-sm text-white px-4 outline-none focus:border-blue-500/50" />
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#C2C6D6] uppercase tracking-widest ml-1">Branch Anchor</label>
                  <select required value={form.branchId} onChange={(e) => setForm({...form, branchId: e.target.value})} className="w-full h-11 bg-[#0E152B] border border-white/[0.06] rounded-xl text-sm text-white px-3 outline-none appearance-none">
                     {branches.length === 0 && <option>Loading...</option>}
                     {branches.map(b => <option key={b.id} value={b.id} className="bg-[#0B1015]">{b.name}</option>)}
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#C2C6D6] uppercase tracking-widest ml-1">Assigned Operator (Optional)</label>
                  <select value={form.assignedUserId} onChange={(e) => setForm({...form, assignedUserId: e.target.value})} className="w-full h-11 bg-[#0E152B] border border-white/[0.06] rounded-xl text-sm text-white px-3 outline-none appearance-none">
                     <option value="" className="bg-[#0B1015]">-- Pool Inventory --</option>
                     {staff.map(s => <option key={s.id} value={s.id} className="bg-[#0B1015]">{s.displayName}</option>)}
                  </select>
               </div>

               <div className="pt-4 flex gap-3 border-t border-white/[0.05]">
                  <button type="button" onClick={onClose} className="flex-1 h-11 border border-white/[0.08] text-white font-bold text-sm rounded-xl hover:bg-white/[0.02]">Cancel</button>
                  <button type="submit" disabled={saving || branches.length === 0} className="flex-1 h-11 bg-[#4F8CFF] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-50">
                     {saving ? <Loader2 size={16} className="animate-spin" /> : 'Commit Node'}
                  </button>
               </div>
            </form>
         </motion.div>
      </div>
   );
}
