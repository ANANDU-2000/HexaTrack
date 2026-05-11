'use client';

import { Mail } from 'lucide-react';
import type { AdminUserListItem } from '@/lib/types';
import { BranchBadge } from '@/components/branches/branch-badge';

export function StaffBranchCard({ staff }: { staff: AdminUserListItem }) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#4F8CFF]/15 text-sm font-black text-[#4F8CFF]">
          {(staff.displayName || staff.email).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#F5F7FA]">{staff.displayName}</p>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#8B9BB4]">
            <Mail className="h-3 w-3" aria-hidden />
            {staff.email}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <BranchBadge name={staff.branchName} />
            <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[11px] font-bold text-[#8B9BB4]">
              {staff.department || 'Operations'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
