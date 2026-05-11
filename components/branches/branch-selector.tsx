'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LightBranch } from '@/lib/types';

export function BranchSelector({
  branches,
  value,
  onChange,
  label = 'Assigned Branch',
}: {
  branches: LightBranch[];
  value: string;
  onChange: (branchId: string) => void;
  label?: string;
}) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return branches;
    return branches.filter((branch) => branch.name.toLowerCase().includes(term));
  }, [branches, query]);

  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[#8B9BB4]">{label}</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B9BB4]/45" aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search branches..."
          className="h-11 w-full rounded-xl border border-white/[0.06] bg-[#121A22] pl-9 pr-3 text-sm font-medium text-[#F5F7FA] outline-none placeholder:text-[#8B9BB4]/45 focus:border-[#4F8CFF]/50"
        />
      </div>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/[0.06] bg-[#121A22] px-3 text-sm font-semibold text-[#F5F7FA] outline-none focus:border-[#4F8CFF]/50"
      >
        {filtered.length === 0 ? <option value="">No matching branches</option> : null}
        {filtered.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
}
