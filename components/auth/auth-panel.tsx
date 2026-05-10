import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FieldErrors = Partial<Record<'email' | 'password', string>>;

const inputClassName =
  'w-full min-h-[44px] rounded-2xl border border-white/[0.06] bg-[#0B1015] px-4 py-3 text-sm text-[#F5F7FA] outline-none transition placeholder:text-[#8B9BB4] focus:border-[#4F8CFF] focus:ring-2 focus:ring-[#4F8CFF]/20';

export function AuthPanel() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
            <h1 className="text-xl font-semibold text-[#F5F7FA]">Sign in</h1>
            <p className="mt-1 text-sm text-[#8B9BB4]">Use your work email to access the right workspace.</p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
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
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
