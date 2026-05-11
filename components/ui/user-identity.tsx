'use client';

import { RoleBadge, UserRole } from '@/components/ui/role-badge';

interface UserIdentityCardProps {
  name: string;
  role: UserRole;
  branchName?: string;
}

export function UserIdentityCard({ name, role, branchName }: UserIdentityCardProps) {
  return (
    <div className="flex items-center gap-3 bg-[#111827]/60 border border-white/[0.05] rounded-2xl px-3 py-2 backdrop-blur-sm hover:bg-[#111827] transition-colors group cursor-pointer">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8CFF]/20 to-[#4F8CFF]/5 flex items-center justify-center text-[#4F8CFF] font-bold text-sm border border-white/[0.05] shadow-inner group-hover:border-[#4F8CFF]/30 transition-all shrink-0">
        {name.charAt(0)}
      </div>
      <div className="hidden sm:flex flex-col min-w-0 text-left">
        <span className="text-sm font-bold text-[#F9FAFB] tracking-tight leading-tight truncate">{name}</span>
        <div className="mt-1">
           <RoleBadge role={role} branchName={branchName} animate={false} />
        </div>
      </div>
    </div>
  );
}
