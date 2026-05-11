'use client';

import { Eye, EyeOff, Loader2, X, Shield, Building2, Network, User, ArrowRight, Briefcase } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { z } from 'zod';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { LightOrganization, LightBranch } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const createUserSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(320),
  fullName: z.string().min(1, 'Full name required'),
  password: z.string().min(8, 'Require 8+ chars'),
  targetRole: z.enum(['Owner', 'Staff']),
  orgId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  workspaceName: z.string().trim().min(1, 'Identity container required'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof createUserSchema>, string>>;

export function CreateUserModal({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCreated?: (c: any) => void }) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'Owner' | 'Staff'>('Owner');

  const [organizations, setOrganizations] = useState<LightOrganization[]>([]);
  const [branches, setBranches] = useState<LightBranch[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [loadingLookup, setLoadingLookup] = useState(false);

  useEffect(() => {
    if (!open) return;
    
    setStep(1);
    setErrors({});
    setApiError(null);
    setSelectedRole('Owner');
    setSelectedOrgId('');
    
    async function fetchLookups() {
      setLoadingLookup(true);
      try {
        const [orgs, brs] = await Promise.all([
          hexaTrackApi.admin.allOrganizations(),
          hexaTrackApi.admin.allBranches(),
        ]);
        setOrganizations(orgs);
        setBranches(brs);
      } catch (e) {
        console.error("Lookups failed", e);
      } finally {
        setLoadingLookup(false);
      }
    }
    void fetchLookups();
  }, [open]);

  const filteredBranches = selectedOrgId 
    ? branches.filter(b => b.organizationId === selectedOrgId)
    : branches;

  if (!open) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(fd.entries());
    
    const parsed = createUserSchema.safeParse(rawData);

    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map(i => [i.path[0], i.message])));
      return;
    }

    setSubmitting(true);
    setApiError(null);
    try {
      const finalBody = {
        email: parsed.data.email,
        password: parsed.data.password,
        fullName: parsed.data.fullName,
        workspaceName: parsed.data.workspaceName,
        workspaceType: 'Business' as const,
        currency: 'USD' as const,
        isSuperAdmin: false,
        initialWorkspaceRole: (parsed.data.targetRole === 'Staff' ? 'Member' : 'Owner') as 'Member' | 'Owner',
        organizationId: parsed.data.orgId || null,
        branchId: parsed.data.branchId || null,
        organizationRole: parsed.data.targetRole, // 'Owner' or 'Staff'
        department: parsed.data.department || null,
      };
      
      const created = await hexaTrackApi.admin.createUser(finalBody);
      onCreated?.(created);
      onOpenChange(false);
    } catch (error) {
       setApiError(error instanceof ApiError ? error.message : 'Failed to create real user identity.');
    } finally {
       setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-[#111827] border border-white/[0.06] rounded-[32px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh]"
      >
        
        {/* Fixed Header */}
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-[#4F8CFF]/10 flex items-center justify-center text-[#4F8CFF]">
                {loadingLookup ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
             </div>
             <div>
               <h2 className="font-bold text-[#F9FAFB] tracking-tight text-xl">Initialize Operator</h2>
               <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">Generate Persistence Verified Identity</p>
             </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/[0.05] rounded-xl transition-colors text-[#9CA3AF]"><X size={20}/></button>
        </div>

        {/* Custom Bar */}
        <div className="flex px-6 pt-6">
           <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[#4F8CFF]' : 'bg-white/[0.1]'}`} />
           <div className="w-2" />
           <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[#4F8CFF]' : 'bg-white/[0.1]'}`} />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                
                <div>
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 block">1. Corporate Role Layer</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Owner', 'Staff'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 text-center ${
                          selectedRole === r ? 'bg-[#4F8CFF]/10 border-[#4F8CFF]/40 text-[#F9FAFB]' : 'bg-[#0B1015] border-white/[0.05] text-[#9CA3AF] hover:border-white/[0.15]'
                        }`}
                      >
                        <input type="radio" name="targetRole" value={r} checked={selectedRole === r} className="sr-only" readOnly />
                        {r === 'Owner' ? <Building2 size={24} /> : <User size={24} />}
                        <span className="text-sm font-bold">{r}</span>
                        <span className="text-[10px] font-medium opacity-60">{r === 'Owner' ? 'Root Operations' : 'Restricted Access'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider block">2. Context Mapping</label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                       <Network className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                       <select 
                          name="orgId" 
                          value={selectedOrgId}
                          onChange={(e) => setSelectedOrgId(e.target.value)}
                          className="w-full h-11 pl-9 pr-8 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-bold text-[#F9FAFB] outline-none appearance-none cursor-pointer focus:border-[#4F8CFF]/40"
                       >
                          <option value="">Assign Organization (Required for Owners)</option>
                          {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                       </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                          <select name="branchId" className="w-full h-11 pl-9 pr-8 bg-[#0B1015] border border-white/[0.05] rounded-xl text-xs font-medium text-[#F9FAFB] outline-none appearance-none cursor-pointer focus:border-[#4F8CFF]/40">
                             <option value="">Default Branch</option>
                             {filteredBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                       </div>
                       <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                          <select name="department" className="w-full h-11 pl-9 pr-8 bg-[#0B1015] border border-white/[0.05] rounded-xl text-xs font-medium text-[#F9FAFB] outline-none appearance-none cursor-pointer focus:border-[#4F8CFF]/40">
                             <option value="">General Dept.</option>
                             <option value="Finance">Finance</option>
                             <option value="Operations">Operations</option>
                             <option value="Executive">Executive</option>
                             <option value="Sales">Sales</option>
                          </select>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider block">3. Financial Workspace Container</label>
                  <input 
                    name="workspaceName"
                    placeholder="e.g. Main Corporate Ledger"
                    required
                    className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.04]">
                   <button type="button" onClick={handleNext} className="w-full h-12 bg-[#4F8CFF] text-white rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                     Define Identity Credentials <ArrowRight size={16} />
                   </button>
                </div>

              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Operator Legal Name</label>
                  <input name="fullName" required placeholder="John Doe" className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Authorization Email</label>
                  <input name="email" type="email" required placeholder="name@domain.com" className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40" />
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Account Security Key</label>
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[28px] text-[#9CA3AF] hover:text-white">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>

                {apiError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs font-bold text-red-400 flex gap-2 items-center">
                    <X size={14} />
                    {apiError}
                  </div>
                )}

                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04] text-[11px] text-[#9CA3AF] leading-relaxed">
                   System locks into secure commit. Data generated directly resolves encryption layers instantly. Account becomes operational immediately upon successful response.
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.04]">
                   <button type="button" onClick={handleBack} className="h-12 bg-white/[0.05] text-[#F9FAFB] rounded-2xl font-bold text-sm hover:bg-white/[0.08] transition-all">Go Back</button>
                   <button type="submit" disabled={submitting} className="h-12 bg-[#22C55E] text-white rounded-2xl font-bold text-sm shadow-[0_8px_20px_-5px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50">
                     {submitting ? <Loader2 size={16} className="animate-spin"/> : 'Finalize Deployment'}
                   </button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </form>

      </motion.div>
    </div>
  );
}
