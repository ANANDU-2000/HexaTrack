import { useQuery } from '@tanstack/react-query';
import { hexaTrackApi } from '@/lib/api';
import type { Category, TransactionType } from '@/lib/types';

export type CategoryFilters = {
  branchId?: string;
  type?: TransactionType;
};

export function useCategories(filters?: CategoryFilters) {
  return useQuery<Category[]>({
    queryKey: ['categories', filters?.branchId || 'current', filters?.type || 'all'],
    queryFn: () => hexaTrackApi.categories.list(filters),
  });
}
