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
    SuperAdmin: 'bg-indigo/5 border-indigo/20 text-indigo shadow-inner',
    Owner: 'bg-cyan/5 border-cyan/20 text-cyan shadow-inner',
    Staff: 'bg-emerald/5 border-emerald/20 text-emerald shadow-inner'
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-black font-label-caps tracking-widest uppercase ${styles}`}
    >
      <Icon size={11} className={isSuperAdmin ? 'animate-pulse' : ''} />
      <span>{role === 'SuperAdmin' ? 'SUPER ADMIN' : role}</span>
      
      {branchName && (
        <>
          <div className="w-1 h-1 rounded-full bg-current opacity-30 mx-0.5" />
          <span className="flex items-center gap-1 normal-case opacity-90 font-semibold font-sans tracking-wide">
             {isOwner ? <Building2 size={10} /> : null}
             {branchName}
          </span>
        </>
      )}
    </motion.div>
  );
}

