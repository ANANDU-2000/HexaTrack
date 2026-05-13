'use client';

import { RoleBadge, UserRole } from '@/components/ui/role-badge';

interface UserIdentityCardProps {
  name: string;
  role: UserRole;
  branchName?: string;
}

export function UserIdentityCard({ name, role, branchName }: UserIdentityCardProps) {
  return (
    <div className="flex items-center gap-3 bg-[#111827]/50 border border-white/[0.04] rounded-[20px] px-3 py-2 backdrop-blur-md hover:bg-[#111827]/70 hover:border-cyan/15 transition-all group cursor-pointer shadow-inner select-none">
      <div className="w-9 h-9 rounded-xl bg-[#111827] flex items-center justify-center text-cyan font-black text-sm border border-cyan/10 shadow-inner group-hover:border-cyan/30 group-hover:scale-105 transition-all shrink-0 select-none">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="hidden sm:flex flex-col min-w-0 text-left pr-1">
        <span className="text-[13px] font-extrabold text-on-surface tracking-wide leading-tight truncate group-hover:text-cyan transition-colors">{name}</span>
        <div className="mt-0.5">
           <RoleBadge role={role} branchName={branchName} animate={false} />
        </div>
      </div>
    </div>
  );
}

