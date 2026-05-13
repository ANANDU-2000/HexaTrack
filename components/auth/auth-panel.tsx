'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';

const loginSchema = z.object({
  email: z.string().email('Workspace address invalid'),
  password: z.string().min(1, 'Access signature required'),
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
      // Handled by state pipeline
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0B1020] overflow-hidden relative font-sans selection:bg-cyan/30 selection:text-on-surface">
      
      {/* Left Ambient Branding Hub */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-[#0B1020] border-r border-white/[0.03]">
        
        {/* Dynamic Background Grid & Glows */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-15%] right-[-5%] w-[600px] h-[600px] bg-cyan/15 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo/10 blur-[110px] rounded-full" 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="z-10 max-w-md px-10 text-left relative"
        >
          <div className="absolute top-[-60px] left-10 flex items-center gap-2 select-none">
             <div className="w-1.5 h-1.5 bg-cyan rounded-full shadow-[0_0_6px_#06B6D4] animate-pulse" />
             <span className="text-[9px] font-black font-label-caps uppercase tracking-[0.25em] text-cyan/80">System Core Initialized</span>
          </div>
          
          <BrandMark tone="dark" className="h-14 w-auto mb-12 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]" />
          <h1 className="text-4xl lg:text-[46px] font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6 font-headline">
            Enter the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-indigo select-none drop-shadow-sm">Autonomous</span> <br/>
            Finance OS.
          </h1>
          <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-12 max-w-sm">
            HexaTrack powers precision-grade intelligence for dynamic asset pipelines.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 px-5 py-3.5 bg-[#111827]/40 backdrop-blur-md rounded-2xl border border-white/[0.04] shadow-sm w-fit select-none group hover:border-cyan/15 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#111827] flex items-center justify-center text-cyan border border-cyan/10 shadow-inner group-hover:scale-105 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <div>
                 <p className="text-xs font-extrabold tracking-wide text-on-surface">Bank-Grade Shield</p>
                 <p className="text-[10px] text-on-surface-variant font-semibold font-sans mt-0.5">256-bit Aerospace Encryption</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Authentication Form Frame */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-cyan/5 blur-3xl rounded-full lg:hidden pointer-events-none" />
        
        <div className="lg:hidden mb-10 flex flex-col items-center select-none">
           <BrandMark tone="dark" className="h-12 w-auto mb-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.25)]" />
           <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">HexaTrack</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[430px] bg-[#111827]/30 border border-white/[0.05] rounded-[32px] shadow-2xl p-8 md:p-11 backdrop-blur-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
          
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
               <Lock size={12} className="text-cyan" />
               <span className="text-[9px] font-black font-label-caps uppercase tracking-widest text-cyan">Secure Handshake</span>
            </div>
            <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-wide">Access Gateway</h2>
            <p className="mt-1.5 text-[13px] font-medium text-on-surface-variant tracking-wide">Initialize user credentials to interface.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-label-caps ml-1 opacity-75" htmlFor="email">
                Identity Link
              </label>
              <div className={`flex items-center h-[54px] rounded-[18px] bg-[#111827] border border-white/[0.04] px-4.5 transition-all focus-within:border-cyan/30 focus-within:ring-4 focus-within:ring-cyan/5 shadow-inner ${fieldErrors.email ? 'border-danger/35' : ''}`}>
                <Mail size={17} className="text-on-surface-variant opacity-50 mr-3.5 shrink-0" />
                <input 
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="flex-1 bg-transparent text-on-surface text-[13px] outline-none placeholder:text-on-surface-variant/30 font-medium"
                  placeholder="agent@corporation.com"
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && <p className="text-[10px] text-danger font-bold pl-1 mt-1 tracking-wide font-sans animate-shake">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-label-caps opacity-75" htmlFor="password">
                  Security Signature
                </label>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest font-label-caps text-cyan hover:brightness-110 active:opacity-80 transition-all outline-none select-none">
                  Recover
                </button>
              </div>
              <div className={`flex items-center h-[54px] rounded-[18px] bg-[#111827] border border-white/[0.04] px-4.5 transition-all focus-within:border-cyan/30 focus-within:ring-4 focus-within:ring-cyan/5 shadow-inner ${fieldErrors.password ? 'border-danger/35' : ''}`}>
                <Lock size={17} className="text-on-surface-variant opacity-50 mr-3.5 shrink-0" />
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-cyan text-[13px] outline-none placeholder:text-cyan/20 font-mono-data tracking-wider"
                  placeholder="••••••••••••"
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant opacity-50 hover:text-cyan hover:opacity-100 ml-3 transition-all outline-none select-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-[10px] text-danger font-bold pl-1 mt-1 tracking-wide font-sans animate-shake">{fieldErrors.password}</p>}
            </div>

            <div className="flex items-center justify-between px-1 select-none">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/[0.1] bg-[#111827] text-cyan focus:ring-0 accent-cyan focus:ring-offset-0 transition-all" 
                />
                <span className="text-[11px] font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Persist operational trust</span>
              </label>
            </div>

            {globalError && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 border border-danger/25 rounded-[14px] p-3.5 text-[11px] font-bold text-danger flex items-start gap-2.5 animate-pulse"
              >
                <ShieldCheck size={16} className="shrink-0 mt-0.5 opacity-80" />
                <span className="leading-relaxed font-sans tracking-wide">{globalError}</span>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-[56px] bg-cyan text-black rounded-full font-black text-[10px] uppercase tracking-widest font-label-caps shadow-lg shadow-cyan/15 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 border border-white/[0.1] select-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-black" />
              ) : (
                <>Initialize Protocol <ArrowRight size={14} /></>
              )}
            </button>
          </form>
          
          <div className="mt-9 pt-6 border-t border-white/[0.04] text-center">
             <p className="text-[10px] text-on-surface-variant/70 font-medium leading-relaxed font-sans select-none">
               Enterprise access envelope. Authorization strictly audited.
             </p>
          </div>
        </motion.div>

        <div className="mt-10 text-[9px] font-black tracking-[0.2em] text-on-surface-variant/40 uppercase text-center select-none font-label-caps">
          HexaTrack Terminal Node v1.3.0
        </div>
      </div>
    </div>
  );
}

