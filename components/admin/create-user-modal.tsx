'use client';

import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { FormEvent, useEffect, useId, useState } from 'react';
import { z } from 'zod';
import { ApiError, hexaTrackApi } from '@/lib/api';
import type { AdminCreateUserResponse } from '@/lib/types';

const createUserSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(320),
  password: z.string().min(8, 'Use at least 8 characters'),
  workspaceName: z.string().trim().min(1, 'Workspace name is required').max(120),
  workspaceType: z.enum(['Personal', 'Business', 'Family']),
  currency: z.enum(['USD', 'INR', 'EUR', 'AED']),
  platformRole: z.enum(['user', 'superAdmin']),
  /** Seeded workspace membership (Staff maps to API Member). */
  workspaceMembership: z.enum(['Owner', 'Member', 'Viewer']),
});

type FormErrors = Partial<Record<keyof z.infer<typeof createUserSchema>, string>>;

export type CreateUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (created: AdminCreateUserResponse) => void | Promise<void>;
};

export function CreateUserModal({ open, onOpenChange, onCreated }: CreateUserModalProps) {
  const titleId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErrors({});
      setFormError(null);
      setShowPassword(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const parsed = createUserSchema.safeParse({
      email: fd.get('email'),
      password: fd.get('password'),
      workspaceName: fd.get('workspaceName'),
      workspaceType: fd.get('workspaceType'),
      currency: fd.get('currency'),
      platformRole: fd.get('platformRole'),
      workspaceMembership: fd.get('workspaceMembership'),
    });

    if (!parsed.success) {
      setFormError(null);
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])) as FormErrors,
      );
      return;
    }

    setErrors({});
    setFormError(null);
    setSubmitting(true);
    try {
      const body = {
        email: parsed.data.email,
        password: parsed.data.password,
        workspaceName: parsed.data.workspaceName,
        workspaceType: parsed.data.workspaceType,
        currency: parsed.data.currency,
        isSuperAdmin: parsed.data.platformRole === 'superAdmin',
        initialWorkspaceRole: parsed.data.workspaceMembership,
      };
      const created = await hexaTrackApi.admin.createUser(body);
      await Promise.resolve(onCreated?.(created));
      form.reset();
      onOpenChange(false);
    } catch (e) {
      setFormError(
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Could not create user.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sheet-backdrop fixed inset-0 z-[200] flex items-end justify-center bg-black/55 p-3 pt-[max(12px,env(safe-area-inset-top))] pb-[max(12px,env(safe-area-inset-bottom))] sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-h-[min(calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-24px),920px)] max-w-[min(28rem,calc(100vw-24px))] overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#121A22] shadow-[0_24px_64px_rgba(0,0,0,0.45)] sm:max-h-[calc(100dvh-48px)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] p-4 sm:p-6">
          <div>
            <p className="eyebrow">Admin</p>
            <h2 id={titleId} className="text-xl font-semibold text-[#F5F7FA]">
              Create user
            </h2>
            <p className="mt-1 text-sm text-[#8B9BB4]">They receive a workspace with starter accounts and categories.</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="icon-button shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="flex max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-11rem)] flex-col gap-4 overflow-y-auto overscroll-contain p-4 sm:max-h-[min(72dvh,560px)] sm:p-6"
          onSubmit={(e) => void handleSubmit(e)}
        >
          {formError ? (
            <p className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1015] px-4 py-3 text-sm text-[#FF5C75]" role="alert">
              {formError}
            </p>
          ) : null}

          <label className="block text-sm font-medium text-[#F5F7FA]">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="field mt-2"
              placeholder="name@company.com"
              disabled={submitting}
            />
            {errors.email ? <p className="mt-1 text-sm text-[#FF5C75]">{errors.email}</p> : null}
          </label>

          <label className="block text-sm font-medium text-[#F5F7FA]">
            Password
            <div className="relative mt-2">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="field pr-12"
                placeholder="Minimum 8 characters"
                disabled={submitting}
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-2xl text-[#8B9BB4] transition hover:bg-white/5 hover:text-[#F5F7FA]"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={submitting}
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
              </button>
            </div>
            {errors.password ? <p className="mt-1 text-sm text-[#FF5C75]">{errors.password}</p> : null}
          </label>

          <label className="block text-sm font-medium text-[#F5F7FA]">
            Workspace
            <input
              name="workspaceName"
              type="text"
              autoComplete="organization"
              className="field mt-2"
              placeholder="e.g. Personal, Freelance LLC"
              disabled={submitting}
            />
            {errors.workspaceName ? (
              <p className="mt-1 text-sm text-[#FF5C75]">{errors.workspaceName}</p>
            ) : null}
          </label>

          <label className="block text-sm font-medium text-[#F5F7FA]">
            Workspace type
            <select name="workspaceType" className="field mt-2" defaultValue="Personal" disabled={submitting}>
              <option value="Personal">Personal</option>
              <option value="Business">Business</option>
              <option value="Family">Family</option>
            </select>
            {errors.workspaceType ? (
              <p className="mt-1 text-sm text-[#FF5C75]">{errors.workspaceType}</p>
            ) : null}
          </label>

          <label className="block text-sm font-medium text-[#F5F7FA]">
            Platform access
            <select name="platformRole" className="field mt-2" defaultValue="user" disabled={submitting}>
              <option value="user">Standard user</option>
              <option value="superAdmin">Super admin</option>
            </select>
            {errors.platformRole ? (
              <p className="mt-1 text-sm text-[#FF5C75]">{errors.platformRole}</p>
            ) : null}
          </label>

          <label className="block text-sm font-medium text-[#F5F7FA]">
            Default workspace role
            <select name="workspaceMembership" className="field mt-2" defaultValue="Owner" disabled={submitting}>
              <option value="Owner">Owner</option>
              <option value="Member">Staff</option>
              <option value="Viewer">Viewer</option>
            </select>
            {errors.workspaceMembership ? (
              <p className="mt-1 text-sm text-[#FF5C75]">{errors.workspaceMembership}</p>
            ) : null}
          </label>

          <label className="block text-sm font-medium text-[#F5F7FA]">
            Currency
            <select name="currency" className="field mt-2" defaultValue="USD" disabled={submitting}>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="AED">AED</option>
            </select>
            {errors.currency ? <p className="mt-1 text-sm text-[#FF5C75]">{errors.currency}</p> : null}
          </label>

          <button className="primary-button mt-2 w-full" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Creating…
              </>
            ) : (
              'Create user'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
