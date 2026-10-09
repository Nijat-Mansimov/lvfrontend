import { apiClient } from '../client';
import {
  Summary,
  SummarySchema,
  EndpointsResponse,
  EndpointsResponseSchema,
  RunsResponse,
  RunsResponseSchema,
  ItemsResponse,
  ItemsResponseSchema,
  DiffResponse,
  DiffResponseSchema,
} from '../schemas/inventory';

export const inventoryEndpoints = {
  getSummary: () =>
    apiClient<Summary>('/api/v1/summary', { method: 'GET' }, { schema: SummarySchema }),

  getEndpoints: () =>
    apiClient<EndpointsResponse>('/api/v1/endpoints', { method: 'GET' }, { schema: EndpointsResponseSchema }),

  getRuns: (limit: number = 50) =>
    apiClient<RunsResponse>('/api/v1/runs', { method: 'GET' }, { params: { limit }, schema: RunsResponseSchema }),

  getItems: (params: {
    run_id?: number | null;
    category?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }) =>
    apiClient<ItemsResponse>('/api/v1/items', { method: 'GET' }, { params, schema: ItemsResponseSchema }),

  getDiff: (runId: number) =>
    apiClient<DiffResponse>('/api/v1/diff', { method: 'GET' }, { params: { run_id: runId }, schema: DiffResponseSchema }),

  getRawScan: (runId: number) =>
    apiClient<unknown>('/api/v1/raw', { method: 'GET' }, { params: { run_id: runId } }),
};
