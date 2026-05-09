import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, 'Enter your name'),
});

type FieldErrors = Partial<Record<'email' | 'password' | 'displayName', string>>;

const inputClassName =
  'w-full min-h-[44px] rounded-2xl border border-white/[0.06] bg-[#0B1015] px-4 py-3 text-sm text-[#F5F7FA] outline-none transition placeholder:text-[#8B9BB4] focus:border-[#4F8CFF] focus:ring-2 focus:ring-[#4F8CFF]/20';

export function AuthPanel() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = {
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
      displayName: formData.get('displayName')?.toString() ?? '',
    };

    const result = mode === 'login' ? loginSchema.safeParse(raw) : registerSchema.safeParse(raw);
    if (!result.success) {
      setFieldErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as FieldErrors);
      return;
    }

    setFieldErrors({});
    try {
      if (mode === 'login') {
        const credentials = loginSchema.parse(raw);
        await login(credentials);
        return;
      }

      const account = registerSchema.parse(raw);
      await register({
        email: account.email,
        password: account.password,
        displayName: account.displayName,
      });
    } catch {
      // The auth store owns the user-facing error message.
    }
  }

  return (
    <main className="min-h-[100dvh] min-h-screen w-full bg-[#0B1015] px-4 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-10 lg:mx-auto lg:max-w-5xl lg:flex-row lg:items-stretch lg:gap-12">
        <section className="flex flex-1 flex-col justify-center lg:max-w-md">
          <BrandMark tone="dark" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#8B9BB4]">
            Calm control of your money. Encrypted sign-in, workspace-scoped data.
          </p>
        </section>

        <section className="flex flex-1 flex-col justify-center">
          <div className="w-full max-w-[420px] rounded-3xl border border-white/[0.06] bg-[#121A22] p-6 lg:max-w-[480px] lg:self-end">
            <h1 className="text-xl font-semibold text-[#F5F7FA]">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h1>
            <p className="mt-1 text-sm text-[#8B9BB4]">Use your work email to access the right workspace.</p>

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-white/[0.06] bg-[#0B1015] p-1">
              {(['login', 'register'] as const).map((item) => (
                <button
                  key={item}
                  className={`min-h-[44px] rounded-[14px] px-3 text-sm font-semibold capitalize transition ${
                    mode === item
                      ? 'bg-[#4F8CFF] text-white'
                      : 'text-[#8B9BB4] hover:text-[#F5F7FA]'
                  }`}
                  onClick={() => setMode(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="mt-4 text-center text-sm text-[#8B9BB4]">
              <span>Invited to a workspace? </span>
              <Link className="font-medium text-[#4F8CFF] underline-offset-2 hover:underline" href="/invite">
                Accept invite
              </Link>
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Name</span>
                  <input className={inputClassName} name="displayName" placeholder="Your name" autoComplete="name" />
                  {fieldErrors.displayName && (
                    <span className="mt-1 block text-xs text-[#FF5C75]">{fieldErrors.displayName}</span>
                  )}
                </label>
              )}

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Email</span>
                <input
                  autoComplete="email"
                  className={inputClassName}
                  name="email"
                  placeholder="you@company.com"
                  type="email"
                />
                {fieldErrors.email && <span className="mt-1 block text-xs text-[#FF5C75]">{fieldErrors.email}</span>}
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Password</span>
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className={inputClassName}
                  name="password"
                  type="password"
                />
                {fieldErrors.password && (
                  <span className="mt-1 block text-xs text-[#FF5C75]">{fieldErrors.password}</span>
                )}
              </label>

              {error && (
                <p className="rounded-2xl border border-white/[0.06] bg-[#0B1015] px-3 py-2 text-sm text-[#FF5C75]">
                  {error}
                </p>
              )}

              <button
                className="inline-flex w-full min-h-[44px] items-center justify-center rounded-[18px] bg-[#4F8CFF] py-3.5 text-base font-semibold text-white transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                type="submit"
              >
                {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
