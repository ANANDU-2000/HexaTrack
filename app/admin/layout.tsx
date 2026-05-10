'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, hexaTrackApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

/**
 * Server-enforced super-admin is on the API (JWT validation + SuperAdmin policy).
 * This layout revalidates `/api/auth/me` so demotions and lockouts update the SPA session immediately.
 */
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const applyMeResponse = useAuthStore((s) => s.applyMeResponse);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated || !accessToken) return;
    let cancelled = false;
    void (async () => {
      try {
        const me = await hexaTrackApi.auth.me();
        if (cancelled) return;
        applyMeResponse(me);
        if (!me.isSuperAdmin) {
          router.replace('/');
        }
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          logout();
          router.replace('/');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, applyMeResponse, hydrated, logout, router]);

  return <>{children}</>;
}
