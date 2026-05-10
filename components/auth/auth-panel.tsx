import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FieldErrors = Partial<Record<'email' | 'password', string>>;

export function AuthPanel() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

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
      await login(loginSchema.parse(raw));
    } catch {
      // Error state driven by auth store
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background text-on-surface overflow-hidden selection:bg-primary selection:text-on-primary p-6">
      {/* Ambient Backlight Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.main 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[480px] z-10 relative"
      >
        <div className="glass-card rounded-3xl p-8 lg:p-10 flex flex-col gap-8 backdrop-blur-2xl shadow-2xl border border-white/10">
          <header className="flex flex-col items-center gap-4">
            <motion.div 
              initial={{ y: -10 }} 
              animate={{ y: 0 }} 
              className="mb-2"
            >
              <BrandMark tone="dark" className="h-14 w-auto" />
            </motion.div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-on-surface font-headline-md">Welcome back</h1>
              <p className="text-sm text-on-surface-variant mt-2 font-medium">Access your intelligent wealth dashboard</p>
            </div>
          </header>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="relative group">
              <div className="input-glow flex items-center border-b border-outline-variant/50 focus-within:border-primary transition-all duration-300 py-3">
                <span className="material-symbols-outlined text-on-surface-variant/70 mr-3">mail</span>
                <input 
                  name="email"
                  autoComplete="email"
                  className="bg-transparent border-none outline-none focus:ring-0 w-full font-label-mono text-sm text-on-surface placeholder:text-on-surface-variant/40 py-1" 
                  placeholder="Email Address" 
                  type="email"
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-danger mt-1.5 font-medium">{fieldErrors.email}</p>}
            </div>

            <div className="relative group">
              <div className="input-glow flex items-center border-b border-outline-variant/50 focus-within:border-primary transition-all duration-300 py-3">
                <span className="material-symbols-outlined text-on-surface-variant/70 mr-3">lock</span>
                <input 
                  name="password"
                  autoComplete="current-password"
                  className="bg-transparent border-none outline-none focus:ring-0 w-full font-label-mono text-sm text-on-surface placeholder:text-on-surface-variant/40 py-1" 
                  placeholder="Password" 
                  type={showPassword ? "text" : "password"}
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-variant/60 hover:text-on-surface transition-colors ml-2 flex items-center"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-danger mt-1.5 font-medium">{fieldErrors.password}</p>}
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-medium text-primary hover:text-primary-fixed transition-colors">Forgot Password?</a>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error-container/20 border border-error/20 rounded-xl px-4 py-3 text-sm text-error font-medium"
              >
                {error}
              </motion.div>
            )}

            <button 
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-base active:scale-[0.98] hover:opacity-90 transition-all shadow-[0_8px_24px_-8px_rgba(193,193,252,0.5)] mt-2 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-on-primary/40 border-t-on-primary rounded-full" />
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <div className="mt-8 flex justify-center gap-6 opacity-40 text-[11px] font-label-mono font-medium tracking-wider text-on-surface-variant uppercase">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            SECURE
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">encrypted</span>
            AES-256
          </div>
        </div>
      </motion.main>

      {/* Backdrop texture from design */}
      <div className="fixed bottom-0 left-0 w-full h-[40vh] pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>
    </div>
  );
}

