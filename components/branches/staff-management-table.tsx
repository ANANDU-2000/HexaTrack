'use client';

import { 
  MoreHorizontal, 
  Search, 
  Shield, 
  UserPlus, 
  Briefcase, 
  Trash2, 
  Lock,
  Mail
} from 'lucide-react';
import { useState } from 'react';

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Accountant' | 'Staff' | 'Viewer';
  department: 'Operations' | 'Finance' | 'Sales' | 'Tech';
  status: 'Active' | 'Pending' | 'Suspended';
};

const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Amit Sharma', email: 'amit@company.ae', role: 'Manager', department: 'Operations', status: 'Active' },
  { id: '2', name: 'Sara Khan', email: 'sara@company.in', role: 'Accountant', department: 'Finance', status: 'Active' },
  { id: '3', name: 'John Doe', email: 'john@company.ae', role: 'Staff', department: 'Sales', status: 'Pending' },
  { id: '4', name: 'Vikram Ray', email: 'vik@company.in', role: 'Staff', department: 'Operations', status: 'Active' },
  { id: '5', name: 'Elena Rostova', email: 'elena@company.tech', role: 'Viewer', department: 'Tech', status: 'Suspended' },
];

export function StaffManagementTable() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_STAFF.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
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
      <div className="bg-[#111827] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Associate</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Vector / Dept</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Clearance Level</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Lifecycle</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filtered.map((staff) => (
                <tr key={staff.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8CFF]/20 to-[#4F8CFF]/5 flex items-center justify-center text-[#4F8CFF] font-bold text-sm border border-white/[0.04]">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#F9FAFB] tracking-tight">{staff.name}</p>
                        <p className="text-xs text-[#9CA3AF] font-medium mt-0.5 flex items-center gap-1"><Mail size={10} className="opacity-60" /> {staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F9FAFB]">
                      <Briefcase size={14} className="text-[#9CA3AF]" />
                      {staff.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${getRoleStyles(staff.role)}`}>
                        <Shield size={12} /> {staff.role}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1 text-xs font-bold ${getStatusColor(staff.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`} />
                        {staff.status}
                     </span>
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
          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#9CA3AF] font-medium text-sm">Zero associates mapped to query.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function getRoleStyles(role: StaffMember['role']) {
  switch (role) {
    case 'Manager': return 'bg-[#4F8CFF]/10 border-[#4F8CFF]/20 text-[#4F8CFF]';
    case 'Accountant': return 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#8B5CF6]';
    case 'Staff': return 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]';
    case 'Viewer': return 'bg-white/[0.05] border-white/[0.1] text-[#9CA3AF]';
  }
}

function getStatusColor(status: StaffMember['status']) {
  switch (status) {
    case 'Active': return 'text-[#22C55E]';
    case 'Pending': return 'text-[#F59E0B]';
    case 'Suspended': return 'text-[#EF4444]';
  }
}
