export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  inventory: {
    summary: ['inventory', 'summary'] as const,
    endpoints: ['inventory', 'endpoints'] as const,
    endpoint: (id: string) => ['inventory', 'endpoints', id] as const,
    runs: (limit?: number) => ['inventory', 'runs', { limit }] as const,
    items: (params: { run_id?: number | null; category?: string; q?: string; limit?: number; offset?: number }) =>
      ['inventory', 'items', params] as const,
    diff: (runId: number) => ['inventory', 'diff', runId] as const,
  },
  intel: {
    status: (runId?: number | null) => ['intel', 'status', runId] as const,
  },
  admin: {
    users: ['admin', 'users'] as const,
    apiKeys: (includeRevoked: boolean) => ['admin', 'api-keys', { includeRevoked }] as const,
    auditEvents: (params: { action?: string; outcome?: string; actor?: string; before_id?: number; limit?: number }) =>
      ['admin', 'audit-events', params] as const,
  },
};
