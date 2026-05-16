'use client';

import { RoleBadge, UserRole } from '@/components/ui/role-badge';
import { motion } from 'framer-motion';

interface WelcomeHeroProps {
  role: UserRole;
  userName: string;
  branchName?: string;
  summaryText?: string;
}

export function WelcomeHero({ role, userName, branchName, summaryText }: WelcomeHeroProps) {
  
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const defaultSummaries = {
    SuperAdmin: 'Platform systems operational. Overall ecosystem health is stable.',
    Owner: `${branchName || 'Branch'} performance vectors maintained stable trajectories this cycles.`,
    Staff: 'Assigned daily finance throughput loops are initialized.'
  };

  const greeting = getTimeGreeting();
  const activeSummary = summaryText || defaultSummaries[role];

  return (
    <div className="relative w-full bg-[#0E152B] border border-white/[0.06] rounded-[32px] overflow-hidden p-6 md:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)]">
      {/* Background Decoratives */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F8CFF]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-[#4F8CFF] uppercase tracking-[0.15em]">{greeting}</span>
            <RoleBadge role={role} branchName={branchName} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#E1E2EC] tracking-tight">
            Welcome back, {userName}
          </h1>
          
          <p className="text-sm text-[#C2C6D6] max-w-lg font-medium leading-relaxed">
            {activeSummary}
          </p>
        </div>

        {/* High Energy Status Pill */}
        <div className="flex items-center bg-[#0B1015]/50 border border-white/[0.05] rounded-2xl px-4 py-3 gap-4 backdrop-blur-sm shrink-0">
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-[#C2C6D6] uppercase tracking-widest">Network Status</span>
             <span className="text-sm font-bold text-[#E1E2EC] flex items-center gap-2 mt-0.5">
               <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
               Active & Secure
             </span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
