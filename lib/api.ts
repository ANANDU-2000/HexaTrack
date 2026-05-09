import type {
  Account,
  AdminUserListResult,
  AuthMeResponse,
  AuthResponse,
  Category,
  DashboardSummary,
  InviteAcceptRequest,
  LoginRequest,
  PagedResult,
  RegisterRequest,
  ReportSummary,
  Transaction,
  TransactionSearchParams,
  Transfer,
  TransferRequest,
  Workspace,
  WorkspaceRoleName,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5014';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiOptions = Omit<RequestInit, 'body'> & {
  token?: string;
  body?: unknown;
};

let accessTokenProvider: (() => string | null) | null = null;
let workspaceIdProvider: (() => string | null) | null = null;
let unauthorizedHandler: (() => void) | null = null;

type ApiErrorBody = {
  error?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

export function configureApiClient(options: {
  getAccessToken: () => string | null;
  getWorkspaceId?: () => string | null;
  onUnauthorized: () => void;
}) {
  accessTokenProvider = options.getAccessToken;
  workspaceIdProvider = options.getWorkspaceId ?? null;
  unauthorizedHandler = options.onUnauthorized;
}

function pathNeedsWorkspaceHeader(path: string): boolean {
  const queryIndex = path.indexOf('?');
  const p = queryIndex >= 0 ? path.slice(0, queryIndex) : path;
  if (!p.startsWith('/api/')) return false;
  if (p.startsWith('/api/auth')) return false;
  if (p.startsWith('/api/admin')) return false;
  if (p.startsWith('/api/subscription')) return false;
  if (p.startsWith('/api/backup')) return false;
  if (p.startsWith('/api/groups')) return false;
  const normalized = p.replace(/\/$/, '') || '/';
  if (normalized === '/api/workspaces') return false;
  const singleWorkspace = /^\/api\/workspaces\/([^/]+)$/.exec(normalized);
  if (singleWorkspace?.[1] && /^[0-9a-fA-F-]{36}$/i.test(singleWorkspace[1])) return false;
  return true;
}

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;

  if (hasBody) {
    headers.set('Content-Type', 'application/json');
  }

  const token = options.token ?? accessTokenProvider?.();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const pathOnly = path.startsWith('http') ? (() => { try { return new URL(path).pathname; } catch { return path; } })() : path;
  if (pathNeedsWorkspaceHeader(pathOnly)) {
    const ws = workspaceIdProvider?.();
    if (ws) {
      headers.set('X-Workspace-Id', ws);
    }
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    });
  } catch (error) {
    throw new ApiError(
      `Unable to reach HexaTrack API at ${API_BASE_URL}. Start the ASP.NET backend, verify NEXT_PUBLIC_API_BASE_URL, and confirm CORS allows http://localhost:3000.`,
      0,
      error,
    );
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({ error: 'Request failed' }))) as ApiErrorBody;
    if (response.status === 401) {
      unauthorizedHandler?.();
    }
    throw new ApiError(getErrorMessage(body, response.status), response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function getErrorMessage(body: ApiErrorBody, status: number) {
  if (body.error) return body.error;
  if (body.detail) return body.detail;

  const validationMessage = body.errors ? Object.values(body.errors).flat().at(0) : null;
  if (validationMessage) return validationMessage;

  if (body.title && status !== 500) return body.title;
  return status === 0 ? 'Unable to reach HexaTrack API.' : 'Request failed. Please try again.';
}

export const hexaTrackApi = {
  auth: {
    login: (payload: LoginRequest) =>
      apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: payload,
      }),
    register: (payload: RegisterRequest) =>
      apiRequest<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: payload,
      }),
    google: (idToken: string) =>
      apiRequest<AuthResponse>('/api/auth/google', {
        method: 'POST',
        body: { idToken },
      }),
    me: (tokenOverride?: string) =>
      apiRequest<AuthMeResponse>('/api/auth/me', {
        method: 'GET',
        token: tokenOverride,
      }),
    acceptInvite: (payload: InviteAcceptRequest) =>
      apiRequest<AuthResponse>('/api/auth/invite/accept', {
        method: 'POST',
        body: payload,
      }),
  },
  accounts: () => apiRequest<Account[]>('/api/accounts'),
  transfer: (payload: TransferRequest) =>
    apiRequest<Transfer>('/api/accounts/transfer', {
      method: 'POST',
      body: payload,
    }),
  categories: {
    list: () => apiRequest<Category[]>('/api/categories'),
    create: (payload: {
      name: string;
      type: Category['type'];
      parentCategoryId?: string | null;
      color?: string | null;
      icon?: string | null;
    }) =>
      apiRequest<Category>('/api/categories', {
        method: 'POST',
        body: payload,
      }),
    subcategories: {
      list: (parentId: string) => apiRequest<Category[]>(`/api/categories/${parentId}/subcategories`),
      create: (parentId: string, payload: { name: string; color?: string | null; icon?: string | null }) =>
        apiRequest<Category>(`/api/categories/${parentId}/subcategories`, {
          method: 'POST',
          body: payload,
        }),
      delete: (parentId: string, subcategoryId: string) =>
        apiRequest<void>(`/api/categories/${parentId}/subcategories/${subcategoryId}`, {
          method: 'DELETE',
        }),
    },
  },
  tags: {
    list: () => apiRequest<{ id: string; name: string }[]>('/api/tags'),
    upsert: (name: string) =>
      apiRequest<{ id: string; name: string }>('/api/tags', {
        method: 'POST',
        body: { name },
      }),
  },
  recurring: {
    list: () => apiRequest('/api/recurring-transactions'),
    create: (payload: unknown) =>
      apiRequest('/api/recurring-transactions', {
        method: 'POST',
        body: payload,
      }),
  },
  transactions: {
    list: (from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const suffix = params.size ? `?${params.toString()}` : '';
      return apiRequest<Transaction[]>(`/api/transactions${suffix}`);
    },
    search: (params: TransactionSearchParams) => {
      const q = new URLSearchParams();
      if (params.from) q.set('from', params.from);
      if (params.to) q.set('to', params.to);
      if (params.accountId) q.set('accountId', params.accountId);
      if (params.categoryId) q.set('categoryId', params.categoryId);
      if (params.tagId) q.set('tagId', params.tagId);
      if (params.query?.trim()) q.set('query', params.query.trim());
      q.set('page', String(params.page ?? 1));
      q.set('pageSize', String(params.pageSize ?? 30));
      if (params.type) q.set('type', params.type);
      if (params.transfersOnly) q.set('transfersOnly', 'true');
      const qs = q.toString();
      return apiRequest<PagedResult<Transaction>>(`/api/transactions/search?${qs}`);
    },
  },
  createTransaction: (payload: unknown) =>
    apiRequest<Transaction>('/api/transactions', {
      method: 'POST',
      body: payload,
    }),
  reportSummary: (from: string, to: string) =>
    apiRequest<ReportSummary>(`/api/reports/summary?from=${from}&to=${to}`),
  dashboard: {
    summary: (from: string, to: string) =>
      apiRequest<DashboardSummary>(`/api/dashboard/summary?from=${from}&to=${to}`),
  },
  admin: {
    users: (q?: string, page = 1, pageSize = 20) => {
      const params = new URLSearchParams();
      if (q?.trim()) params.set('q', q.trim());
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      const qs = params.toString();
      return apiRequest<AdminUserListResult>(`/api/admin/users?${qs}`);
    },
  },
  workspaces: {
    list: () => apiRequest<Workspace[]>('/api/workspaces'),
    create: (payload: { name: string; type: Workspace['type']; currency: string }) =>
      apiRequest<Workspace>('/api/workspaces', { method: 'POST', body: payload }),
    createInvite: (workspaceId: string, payload: { email: string; role: WorkspaceRoleName }) =>
      apiRequest<{ token: string }>(`/api/workspaces/${workspaceId}/invites`, {
        method: 'POST',
        body: payload,
      }),
  },
};
