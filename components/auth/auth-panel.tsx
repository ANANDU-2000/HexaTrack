'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';

const loginSchema = z.object({
  email: z.string().email('Enter a valid workspace email'),
  password: z.string().min(1, 'Access key required'),
});

type FieldErrors = Partial<Record<'email' | 'password', string>>;

export function AuthPanel() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const globalError = useAuthStore((state) => state.error);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = {
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
    };

    const result = loginSchema.safeParse(raw);
    if (!result.success) {
      setFieldErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as FieldErrors);
      return;
    }

    setFieldErrors({});
    try {
      await login(result.data);
    } catch {
      // Managed by global auth store
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0B1015] overflow-hidden relative font-sans selection:bg-[#4F8CFF]/30 selection:text-white">
      
      {/* Desktop LEFT SIDE: Branding Panel (Premium dark ambient) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-[#0B1015] border-r border-white/[0.04]">
        
        {/* Dynamic Ambient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#4F8CFF]/20 blur-[140px] rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#22C55E]/10 blur-[120px] rounded-full" 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="z-10 max-w-md px-8 text-center lg:text-left"
        >
          <BrandMark tone="dark" className="h-16 w-auto mb-10" />
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#F9FAFB] leading-[1.1] mb-6 font-display">
            Enter the Premium <br/> Finance OS.
          </h1>
          <p className="text-[#9CA3AF] text-lg font-medium leading-relaxed mb-10">
            HexaTrack powers elite professionals with hyper-precise asset visualization and institutional control.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#111827]/50 backdrop-blur-md rounded-2xl border border-white/[0.04] shadow-sm w-fit">
              <div className="w-8 h-8 rounded-full bg-[#4F8CFF]/10 flex items-center justify-center text-[#4F8CFF]">
                <ShieldCheck size={16} />
              </div>
              <span className="text-sm font-semibold text-[#F9FAFB]">Bank-Grade Encryption</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side / Center on Mobile: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {/* Mobile branding placeholder */}
        <div className="lg:hidden mb-8 flex flex-col items-center">
           <BrandMark tone="dark" className="h-12 w-auto mb-4" />
           <h2 className="text-xl font-bold text-[#F9FAFB]">HexaTrack</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full max-w-[420px] bg-[#111827] border border-white/[0.05] rounded-[32px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.4)] p-8 md:p-10 backdrop-blur-2xl relative overflow-hidden"
        >
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#F9FAFB] tracking-tight">Authorized Access</h2>
            <p className="mt-2 text-sm font-medium text-[#9CA3AF]">Please initialize your session to continue.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#9CA3AF] uppercase tracking-wide" htmlFor="email">
                Identity
              </label>
              <div className={`flex items-center h-12 rounded-2xl bg-[#0B1015] border border-white/[0.05] px-4 transition-all focus-within:border-[#4F8CFF]/40 focus-within:ring-4 focus-within:ring-[#4F8CFF]/5 ${fieldErrors.email ? 'border-[#EF4444]/40' : ''}`}>
                <Mail size={18} className="text-[#9CA3AF]/60 mr-3 shrink-0" />
                <input 
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="flex-1 bg-transparent text-[#F9FAFB] text-sm outline-none placeholder:text-[#9CA3AF]/30"
                  placeholder="name@organization.com"
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-[#EF4444] font-semibold pl-1">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[13px] font-bold text-[#9CA3AF] uppercase tracking-wide" htmlFor="password">
                  Security Key
                </label>
                <button type="button" className="text-xs font-bold text-[#4F8CFF] hover:underline">
                  Recover
                </button>
              </div>
              <div className={`flex items-center h-12 rounded-2xl bg-[#0B1015] border border-white/[0.05] px-4 transition-all focus-within:border-[#4F8CFF]/40 focus-within:ring-4 focus-within:ring-[#4F8CFF]/5 ${fieldErrors.password ? 'border-[#EF4444]/40' : ''}`}>
                <Lock size={18} className="text-[#9CA3AF]/60 mr-3 shrink-0" />
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-[#F9FAFB] text-sm outline-none placeholder:text-[#9CA3AF]/30"
                  placeholder="••••••••••••"
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#9CA3AF]/60 hover:text-[#F9FAFB] ml-2"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-[#EF4444] font-semibold pl-1">{fieldErrors.password}</p>}
            </div>

            <div className="flex items-center px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0B1015] border-white/[0.1] text-[#4F8CFF] focus:ring-[#4F8CFF] focus:ring-offset-[#111827]" 
                />
                <span className="text-xs font-medium text-[#9CA3AF]">Remember this device</span>
              </label>
            </div>

            {globalError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-3 text-xs font-bold text-[#EF4444] flex items-start gap-2"
              >
                <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                {globalError}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#4F8CFF] text-white rounded-2xl font-bold text-sm shadow-[0_8px_24px_-6px_rgba(79,140,255,0.4)] hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Launch Console <ArrowRight size={16} /></>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
             <p className="text-xs text-[#9CA3AF] font-medium">
               Private Platform. Restricted strictly to authenticated agents.
             </p>
          </div>
        </motion.div>

        <div className="mt-8 text-[10px] font-bold tracking-widest text-[#9CA3AF]/40 uppercase text-center">
          HexaTrack Core v1.2.0 &copy; 2026
        </div>
      </div>
    </div>
  );
}
