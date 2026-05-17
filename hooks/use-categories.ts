import { useQuery } from '@tanstack/react-query';
import { hexaTrackApi } from '@/lib/api';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { Category, TransactionType } from '@/lib/types';

export type CategoryFilters = {
  branchId?: string;
  type?: TransactionType;
};

export function useCategories(filters?: CategoryFilters) {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  return useQuery<Category[]>({
    queryKey: ['categories', filters?.branchId || 'current', filters?.type || 'all', activeWorkspaceId],
    queryFn: () => hexaTrackApi.categories.list(filters),
    enabled: !!activeWorkspaceId,
  });
}
