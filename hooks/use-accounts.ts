import { useQuery } from '@tanstack/react-query';
import { hexaTrackApi } from '@/lib/api';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { Account } from '@/lib/types';

export function useAccounts() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  return useQuery<Account[]>({
    queryKey: ['accounts', 'list', activeWorkspaceId],
    queryFn: () => hexaTrackApi.accounts.list(),
    enabled: !!activeWorkspaceId,
    staleTime: 1000 * 60 * 2, // 2 min – transactions invalidate this cache
  });
}

export function useBranchAccounts(branchId?: string) {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  return useQuery<Account[]>({
    queryKey: ['accounts', 'available', branchId || 'current', activeWorkspaceId],
    queryFn: () => hexaTrackApi.accounts.available(branchId),
    enabled: !!activeWorkspaceId,
    staleTime: 1000 * 60 * 2,
  });
}
