'use client';

import { 
  MoreHorizontal, 
  Search, 
  Shield, 
  UserPlus, 
  Briefcase, 
  Trash2, 
  Lock,
  Mail,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { hexaTrackApi } from '@/lib/api';
import type { AdminUserListItem } from '@/lib/types';

export function StaffManagementTable() {
  const [search, setSearch] = useState('');
  const [staff, setStaff] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const res = await hexaTrackApi.owner.listStaff();
      setStaff(res);
    } catch (e) {
      console.error("Failed loading staff", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = staff.filter(s => 
    s.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F9FAFB] tracking-tight">Branch Personnel</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">Command and monitor team-level authorizations.</p>
        </div>
        <button className="h-11 px-5 bg-[#4F8CFF] text-white rounded-2xl font-bold text-sm shadow-[0_10px_25px_-5px_rgba(79,140,255,0.3)] flex items-center gap-2.5 hover:brightness-105 transition-all active:scale-95">
          <UserPlus size={18} /> Invite Associate
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]/50 h-4 w-4" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Query staff by handle or identity..."
            className="w-full h-12 bg-[#111827] border border-white/[0.05] rounded-2xl pl-11 pr-4 text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF]/40 outline-none focus:border-[#4F8CFF]/40 transition"
          />
        </div>
      </div>

      {/* Tabular Engine */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-sm relative min-h-[200px]">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
             <Loader2 className="animate-spin h-5 w-5 text-[#4F8CFF] mr-2" /> <span className="text-xs font-bold text-[#9CA3AF]">Verifying Clearance...</span>
           </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Associate</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vector / Dept</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Lifecycle</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filtered.map((s) => (
                <tr key={s.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8CFF]/20 to-[#4F8CFF]/5 flex items-center justify-center text-[#4F8CFF] font-bold text-sm border border-white/[0.04]">
                        {(s.displayName || s.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#F9FAFB] tracking-tight">{s.displayName || 'Anonymous'}</p>
                        <p className="text-xs text-[#9CA3AF] font-medium mt-0.5 flex items-center gap-1"><Mail size={10} className="opacity-60" /> {s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F9FAFB]">
                      <Briefcase size={14} className="text-[#9CA3AF]" />
                      {s.department || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]`}>
                        <Shield size={12} /> Staff
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     {s.isLocked ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold text-[#EF4444]`}>
                          <Lock size={12} /> Locked
                        </span>
                     ) : (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold text-[#22C55E]`}>
                          <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} /> Active
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/[0.05] rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"><Lock size={16} /></button>
                        <button className="p-2 hover:bg-[#EF4444]/10 rounded-lg text-[#9CA3AF] hover:text-[#EF4444] transition-colors"><Trash2 size={16} /></button>
                        <button className="p-2 hover:bg-white/[0.05] rounded-lg text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"><MoreHorizontal size={16} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center text-[#9CA3AF] font-medium text-sm">Zero operational associates mapped to query.</div>
          )}
        </div>
      </div>
    </div>
  );
}
