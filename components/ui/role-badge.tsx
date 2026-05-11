'use client';

import { Shield, Crown, User, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export type UserRole = 'SuperAdmin' | 'Owner' | 'Staff';

interface RoleBadgeProps {
  role: UserRole;
  branchName?: string;
  animate?: boolean;
}

export function RoleBadge({ role, branchName, animate = true }: RoleBadgeProps) {
  const isSuperAdmin = role === 'SuperAdmin';
  const isOwner = role === 'Owner';

  const styles = {
    SuperAdmin: 'bg-gradient-to-r from-[#4F8CFF]/20 to-[#4F8CFF]/5 border-[#4F8CFF]/40 text-[#4F8CFF]',
    Owner: 'bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/5 border-[#F59E0B]/40 text-[#F59E0B]',
    Staff: 'bg-white/[0.04] border-white/[0.1] text-[#9CA3AF]'
  }[role];

  const Icon = {
    SuperAdmin: Shield,
    Owner: Crown,
    Staff: User
  }[role];

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.95 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-sm ${styles}`}
    >
      <Icon size={12} className={isSuperAdmin ? 'animate-pulse' : ''} />
      <span>{role === 'SuperAdmin' ? 'SUPER ADMIN' : role}</span>
      
      {branchName && (
        <>
          <div className="w-1 h-1 rounded-full bg-current opacity-40 mx-0.5" />
          <span className="flex items-center gap-1 normal-case opacity-90 font-medium">
             {isOwner ? <Building2 size={10} /> : null}
             {branchName}
          </span>
        </>
      )}
    </motion.div>
  );
}
