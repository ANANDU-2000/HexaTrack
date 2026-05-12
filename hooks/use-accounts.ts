import { useQuery } from '@tanstack/react-query';
import { hexaTrackApi } from '@/lib/api';
import type { Account } from '@/lib/types';

export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: ['accounts', 'list'],
    queryFn: () => hexaTrackApi.accounts.list(),
  });
}

export function useBranchAccounts(branchId?: string) {
  return useQuery<Account[]>({
    queryKey: ['accounts', 'available', branchId || 'current'],
    queryFn: () => hexaTrackApi.accounts.available(branchId),
  });
}
