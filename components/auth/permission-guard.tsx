'use client';

import React from 'react';
import { useAuthStore } from '@/store/auth-store';

type AllowedRole = 'SuperAdmin' | 'Owner' | 'Manager' | 'Accountant' | 'Staff' | 'Viewer';

type PermissionGuardProps = {
  allowedRoles: AllowedRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGuard({ allowedRoles, children, fallback = null }: PermissionGuardProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <>{fallback}</>;
  }

  // Resolve current logical active role based on state flags.
  // Note: Future iterations can map from complex backend claims objects.
  const getUserRole = (): AllowedRole => {
    if (user.isSuperAdmin) return 'SuperAdmin';
    // Assuming base role context here. For MVP mapping direct to Owner/Staff based on context.
    return 'Staff'; 
  };

  const currentRole = getUserRole();

  // Basic hierarchical allowance
  const isAllowed = allowedRoles.includes(currentRole as any);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
