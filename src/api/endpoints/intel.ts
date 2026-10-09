import { apiClient } from '../client';
import {
  TIStatus,
  TIStatusSchema,
  AnalyzeResponse,
  AnalyzeResponseSchema,
  Feeds,
  FeedsSchema,
} from '../schemas/intel';

export const intelEndpoints = {
  getStatus: (runId?: number | null) =>
    apiClient<TIStatus>(
      '/api/v1/ti/status',
      { method: 'GET' },
      { params: { run_id: runId }, schema: TIStatusSchema }
    ),

  recalculateRisk: (runId: number) =>
    apiClient<AnalyzeResponse>(
      '/api/v1/risk/analyze',
      { method: 'POST' },
      { params: { run_id: runId }, schema: AnalyzeResponseSchema }
    ),

  refreshFeeds: () =>
    apiClient<Feeds>('/api/v1/ti/refresh', { method: 'POST' }, { schema: FeedsSchema }),
};
