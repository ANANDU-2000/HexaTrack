'use client';

import { Building2, CheckCircle2, Users } from 'lucide-react';
import type { AdminUserListItem, LightBranch } from '@/lib/types';

export function BranchStaffAnalytics({ staff, branches }: { staff: AdminUserListItem[]; branches: LightBranch[] }) {
  const activeStaff = staff.filter((item) => !item.isLocked).length;
  const coveredBranches = new Set(staff.map((item) => item.branchId).filter(Boolean)).size;

  const cards = [
    { label: 'Total personnel', value: staff.length, icon: Users, color: 'text-[#F5F7FA]' },
    { label: 'Covered branches', value: `${coveredBranches}/${branches.length}`, icon: Building2, color: 'text-[#4F8CFF]' },
    { label: 'Active staff', value: activeStaff, icon: CheckCircle2, color: 'text-[#1FD18B]' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-2xl border border-white/[0.06] bg-[#121A22] p-5">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#8B9BB4]">
              <Icon className="h-4 w-4 text-[#4F8CFF]" aria-hidden />
              {card.label}
            </div>
            <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
