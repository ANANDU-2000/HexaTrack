'use client';

import { Eye, EyeOff, Loader2, X, Shield, Building2, Network, User, ArrowRight } from 'lucide-react';
import { FormEvent, useEffect, useId, useState } from 'react';
import { z } from 'zod';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { AdminCreateUserResponse } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const createUserSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(320),
  fullName: z.string().min(1, 'Full name required'),
  phoneNumber: z.string().optional(),
  password: z.string().min(8, 'Require 8+ chars'),
  targetRole: z.enum(['Owner', 'Staff']),
  orgId: z.string().min(1, 'Organization required'),
  branchId: z.string().min(1, 'Branch required'),
  workspaceName: z.string().trim().min(1, 'Identity container required'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof createUserSchema>, string>>;

export function CreateUserModal({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCreated?: (c: any) => void }) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedRole, setSelectedRole] = useState<'Owner' | 'Staff'>('Owner');

  useEffect(() => {
    if (open) {
      setStep(1);
      setErrors({});
      setSelectedRole('Owner');
    }
  }, [open]);

  if (!open) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = createUserSchema.safeParse(Object.fromEntries(fd.entries()));

    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map(i => [i.path[0], i.message])));
      return;
    }

    setSubmitting(true);
    try {
      // Execute mapped creation to current backend compatible endpoint
      const body = {
        email: parsed.data.email,
        password: parsed.data.password,
        workspaceName: parsed.data.workspaceName,
        workspaceType: 'Business',
        currency: 'USD',
        isSuperAdmin: false,
        initialWorkspaceRole: parsed.data.targetRole,
      };
      const created = await hexaTrackApi.admin.createUser(body as any);
      onCreated?.(created);
      onOpenChange(false);
    } catch (error) {
       // Display form-level error
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
        
        {/* Premium Fixed Header */}
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-[#4F8CFF]/10 flex items-center justify-center text-[#4F8CFF]">
                <Shield size={20} />
             </div>
             <div>
               <h2 className="font-bold text-[#F9FAFB] tracking-tight text-xl">Initialize Operator</h2>
               <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">Super Admin User Generation Loop</p>
             </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/[0.05] rounded-xl transition-colors text-[#9CA3AF]"><X size={20}/></button>
        </div>

        {/* Step Indicator */}
        <div className="flex px-6 pt-6">
           <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-[#4F8CFF]' : 'bg-white/[0.1]'}`} />
           <div className="w-2" />
           <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#4F8CFF]' : 'bg-white/[0.1]'}`} />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                
                <div>
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 block">1. Absolute Tiering</label>
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
                        <span className="text-[10px] font-medium opacity-60">{r === 'Owner' ? 'Full Branch Control' : 'Restricted Vectors'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider block">2. Topographic Assignment</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                       <Network className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                       <select name="orgId" className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-xs font-bold text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40 appearance-none">
                          <option value="">Select Organization</option>
                          <option value="sunil-ltd">Sunil Holdings Ltd.</option>
                       </select>
                    </div>
                    <div className="relative">
                       <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]/40 h-4 w-4" />
                       <select name="branchId" className="w-full h-11 pl-9 pr-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-xs font-bold text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40 appearance-none">
                          <option value="">Select Branch</option>
                          <option value="dubai">Dubai Branch</option>
                          <option value="kochi">Kochi Hub</option>
                       </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider block">3. Identity Container</label>
                  <input 
                    name="workspaceName"
                    placeholder="e.g. Primary Finance Ledger"
                    className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none focus:border-[#4F8CFF]/40"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.04]">
                   <button type="button" onClick={handleNext} className="w-full h-12 bg-[#4F8CFF] text-white rounded-2xl font-bold text-sm shadow-[0_8px_20px_-5px_rgba(79,140,255,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all">
                     Proceed to Identity <ArrowRight size={16} />
                   </button>
                </div>

              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Full Name</label>
                    <input name="fullName" required className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Contact Vector</label>
                    <input name="phoneNumber" placeholder="+971..." className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Target Email</label>
                  <input name="email" type="email" required placeholder="name@organization.com" className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none" />
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Access Key</label>
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required
                    className="w-full h-11 px-4 bg-[#0B1015] border border-white/[0.05] rounded-xl text-sm font-medium text-[#F9FAFB] outline-none" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[28px] text-[#9CA3AF] hover:text-white"><Eye size={16}/></button>
                </div>

                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04] text-[11px] text-[#9CA3AF] leading-relaxed">
                   Confirming creation will fire the secure invite vector to the defined target email instantaneously.
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.04]">
                   <button type="button" onClick={handleBack} className="h-12 bg-white/[0.05] text-[#F9FAFB] rounded-2xl font-bold text-sm hover:bg-white/[0.08] transition-all">Back</button>
                   <button type="submit" disabled={submitting} className="h-12 bg-[#22C55E] text-white rounded-2xl font-bold text-sm shadow-[0_8px_20px_-5px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50">
                     {submitting ? <Loader2 size={16} className="animate-spin"/> : 'Commit & Invite'}
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
