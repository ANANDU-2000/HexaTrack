'use client';

import type { LightBranch } from '@/lib/types';

export function BranchFilterDropdown({
  branches,
  value,
  onChange,
}: {
  branches: LightBranch[];
  value: string;
  onChange: (branchId: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 min-w-[180px] rounded-xl border border-white/[0.06] bg-[#121A22] px-3 text-sm font-semibold text-[#F5F7FA] outline-none transition-colors focus:border-[#4F8CFF]/50"
      aria-label="Filter by branch"
    >
      <option value="">All branches</option>
      {branches.map((branch) => (
        <option key={branch.id} value={branch.id}>
          {branch.name}
        </option>
      ))}
    </select>
  );
}
