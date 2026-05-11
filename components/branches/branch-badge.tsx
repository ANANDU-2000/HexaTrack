'use client';

import { Building2 } from 'lucide-react';

export function BranchBadge({ name }: { name?: string | null }) {
  return (
    <span className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full border border-[#4F8CFF]/25 bg-[#4F8CFF]/10 px-3 py-1 text-[11px] font-bold text-[#4F8CFF] shadow-[0_8px_24px_rgba(79,140,255,0.08)]">
      <Building2 className="h-3 w-3" aria-hidden />
      {name || 'Unassigned'}
    </span>
  );
}
