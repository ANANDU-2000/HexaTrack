'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { BrandMark } from '@/components/ui/brand';
import { useAuthStore } from '@/store/auth-store';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function InviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const acceptInvite = useAuthStore((s) => s.acceptInvite);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = { password: fd.get('password')?.toString() ?? '' };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    setFieldError(null);
    if (!token.trim()) {
      setFieldError('Invite token is missing from the link.');
      return;
    }
    try {
      await acceptInvite({ token: token.trim(), password: parsed.data.password });
      router.replace('/');
    } catch {
      // store holds error
    }
  }

  return (
    <main className="min-h-[100dvh] min-h-screen w-full bg-[#0B1015] px-4 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-8">
        <BrandMark tone="dark" />
        <div className="rounded-3xl border border-white/[0.06] bg-[#121A22] p-6">
          <h1 className="text-xl font-semibold text-[#F5F7FA]">Accept workspace invite</h1>
          <p className="mt-2 text-sm text-[#8B9BB4]">Set a password for your account, then continue to your workspace.</p>

          {!token.trim() && (
            <p className="mt-4 rounded-2xl border border-white/[0.06] bg-[#0B1015] px-3 py-2 text-sm text-[#FF5C75]">
              Open the invite link from your email (it includes the token).{' '}
              <Link className="text-[#4F8CFF] underline-offset-2 hover:underline" href="/">
                Back to sign in
              </Link>
            </p>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#8B9BB4]">Password</span>
              <input
                autoComplete="new-password"
                className="w-full min-h-[44px] rounded-2xl border border-white/[0.06] bg-[#0B1015] px-4 py-3 text-sm text-[#F5F7FA] outline-none placeholder:text-[#8B9BB4] focus:border-[#4F8CFF] focus:ring-2 focus:ring-[#4F8CFF]/20"
                name="password"
                type="password"
              />
              {fieldError && <span className="mt-1 block text-xs text-[#FF5C75]">{fieldError}</span>}
            </label>
            {error && (
              <p className="rounded-2xl border border-white/[0.06] bg-[#0B1015] px-3 py-2 text-sm text-[#FF5C75]">{error}</p>
            )}
            <button
              className="inline-flex w-full min-h-[44px] items-center justify-center rounded-[18px] bg-[#4F8CFF] py-3.5 text-base font-semibold text-white transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              disabled={loading || !token.trim()}
              type="submit"
            >
              {loading ? 'Working...' : 'Continue'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8B9BB4]">
            <Link className="font-medium text-[#4F8CFF] underline-offset-2 hover:underline" href="/">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#0B1015] text-sm text-[#8B9BB4]">Loading…</div>
      }
    >
      <InviteForm />
    </Suspense>
  );
}
