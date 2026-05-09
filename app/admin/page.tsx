'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hexaTrackApi } from '@/lib/api';
import type { AdminUserListResult } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';
import { BrandMark } from '@/components/ui/brand';

export default function AdminPage() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
  const [data, setData] = useState<AdminUserListResult | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !user || !isSuperAdmin) return;
    void (async () => {
      try {
        const result = await hexaTrackApi.admin.users(undefined, 1, 30);
        setData(result);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : 'Failed to load users');
      }
    })();
  }, [hydrated, user, isSuperAdmin]);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0B1015] px-4 text-[#8B9BB4]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[#F5F7FA]">Sign in to continue.</p>
        <Link className="mt-4 inline-block text-[#4F8CFF]" href="/">
          Home
        </Link>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[#F5F7FA]">You do not have access to admin tools.</p>
        <Link className="mt-4 inline-block text-[#4F8CFF]" href="/">
          Back to app
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1015] px-4 pb-12 pt-10">
      <div className="mx-auto max-w-3xl">
        <BrandMark tone="dark" className="mb-8" />
        <h1 className="text-2xl font-semibold text-[#F5F7FA]">Super admin</h1>
        <p className="mt-1 text-sm text-[#8B9BB4]">User directory</p>

        {loadError && (
          <p className="mt-6 rounded-2xl border border-white/[0.06] bg-[#121A22] px-4 py-3 text-sm text-[#FF5C75]">
            {loadError}
          </p>
        )}

        {data && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#121A22]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.06] text-[#8B9BB4]">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#F5F7FA]">
                {data.items.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">{row.displayName}</td>
                    <td className="px-4 py-3">{row.isSuperAdmin ? 'SuperAdmin' : 'User'}</td>
                    <td className="px-4 py-3">{row.isLocked ? 'Locked' : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-white/[0.06] px-4 py-3 text-xs text-[#8B9BB4]">
              Showing {data.items.length} of {data.totalCount}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
