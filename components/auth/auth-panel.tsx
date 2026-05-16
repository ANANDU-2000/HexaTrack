'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid work email'),
  password: z.string().min(1, 'Password is required'),
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
      // Handled by auth store
    }
  }

  return (
    <div className="min-h-screen flex bg-background overflow-hidden relative font-sans select-none">
      
      {/* Left Visual Panel for Desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-background border-r border-outline-variant/20">
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald/10 blur-[100px] rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-teal/10 blur-[100px] rounded-full" 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-md px-10 relative"
        >
          <div className="flex items-center gap-2 mb-6">
             <div className="w-1.5 h-1.5 bg-emerald rounded-full shadow-[0_0_4px_#10B981]" />
             <span className="text-[9px] font-bold font-label-caps uppercase tracking-widest text-on-surface-variant/70">HexaTrack Engine</span>
          </div>
          
          <BrandMark tone="dark" className="h-10 w-auto mb-10" />
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface leading-tight mb-5 font-headline">
            Modern business <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-teal">expense tracking</span> <br/>
            done right.
          </h1>
          <p className="text-on-surface-variant/80 text-base font-medium leading-relaxed mb-10 max-w-sm">
            Fast, operational, and designed for modern accounting teams to manage enterprise capital workflows seamlessly.
          </p>

          <div className="flex items-center gap-3.5 px-4.5 py-3 bg-[#0E152B] border border-outline-variant/20 rounded-xl shadow-sm w-fit">
            <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald border border-emerald/20">
              <ShieldCheck size={16} />
            </div>
            <div>
               <p className="text-xs font-extrabold text-on-surface">Enterprise Safe</p>
               <p className="text-[10px] text-on-surface-variant/60 font-bold mt-0.5">AES 256-bit Encryption Active</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Auth Modal Context */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 bg-background">
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-emerald/5 blur-3xl rounded-full lg:hidden pointer-events-none" />
        
        <div className="lg:hidden mb-8 flex flex-col items-center">
           <BrandMark tone="dark" className="h-9 w-auto mb-3" />
           <h2 className="text-xl font-black tracking-tight text-on-surface">HexaTrack</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-[400px] bg-[#0E152B] border border-outline-variant/20 rounded-xl shadow-lg p-8 md:p-10 relative overflow-hidden"
        >
          <div className="mb-8">
            <div className="flex items-center gap-1.5 mb-1.5">
               <Lock size={12} className="text-emerald" />
               <span className="text-[9px] font-black font-label-caps uppercase tracking-wider text-emerald">Account Gateway</span>
            </div>
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Sign In</h2>
            <p className="mt-1 text-xs font-medium text-on-surface-variant/70">Provide credentials to access your workspace.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black text-on-surface-variant/60 uppercase tracking-wider font-label-caps ml-0.5" htmlFor="email">
                Email Address
              </label>
              <div className={`flex items-center h-12 bg-[#1D1F27] border border-outline-variant/10 rounded-xl px-4 transition-all focus-within:border-emerald/30 ${fieldErrors.email ? 'border-danger/40' : ''}`}>
                <Mail size={15} className="text-on-surface-variant/40 mr-3 shrink-0" />
                <input 
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="flex-1 bg-transparent text-on-surface text-xs outline-none placeholder:text-on-surface-variant/30 font-bold"
                  placeholder="manager@hexatrack.app"
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && <p className="text-[10px] text-danger font-bold pl-0.5 mt-1 animate-shake">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-[9px] font-black text-on-surface-variant/60 uppercase tracking-wider font-label-caps" htmlFor="password">
                  Password
                </label>
                <button type="button" className="text-[9px] font-black uppercase tracking-wider font-label-caps text-emerald hover:underline outline-none">
                  Reset
                </button>
              </div>
              <div className={`flex items-center h-12 bg-[#1D1F27] border border-outline-variant/10 rounded-xl px-4 transition-all focus-within:border-emerald/30 ${fieldErrors.password ? 'border-danger/40' : ''}`}>
                <Lock size={15} className="text-on-surface-variant/40 mr-3 shrink-0" />
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-emerald text-xs outline-none placeholder:text-emerald/20 font-mono tracking-wider"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant/40 hover:text-emerald ml-2 outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-[10px] text-danger font-bold pl-0.5 mt-1 animate-shake">{fieldErrors.password}</p>}
            </div>

            <div className="flex items-center justify-between px-0.5 py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-outline-variant/30 bg-[#1D1F27] text-emerald focus:ring-0 accent-emerald transition-all" 
                />
                <span className="text-[10px] font-bold text-on-surface-variant/70 group-hover:text-on-surface">Remember device</span>
              </label>
            </div>

            {globalError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 border border-danger/20 rounded-lg p-3 text-[11px] font-bold text-danger flex items-start gap-2"
              >
                <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                <span className="leading-snug">{globalError}</span>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-emerald text-white rounded-xl font-bold text-xs uppercase tracking-wider font-label-caps shadow-md shadow-emerald/10 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 mt-3 border border-white/10"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <>Sign Into Workspace <ArrowRight size={14} /></>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-5 border-t border-outline-variant/10 text-center">
             <p className="text-[10px] text-on-surface-variant/60 font-medium">
               Protected workspace portal. All logins strictly monitored.
             </p>
          </div>
        </motion.div>

        <div className="mt-8 text-[9px] font-bold tracking-widest text-on-surface-variant/40 uppercase font-label-caps">
          HexaTrack Operational Hub v2.0
        </div>
      </div>
    </div>
  );
}
