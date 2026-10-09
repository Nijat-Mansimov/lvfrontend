import { z } from 'zod';

export const SourceStatusSchema = z.object({
  status: z.string(),
  configured: z.boolean().optional(),
  mode: z.string().optional(),
  records: z.number().optional(),
  updated_at: z.string().optional(),
  error: z.string().optional(),
});

export const FeedsSchema = z.object({
  enabled: z.boolean(),
  updated_at: z.string(),
  extension_iocs: z.number(),
  network_iocs: z.number(),
  reputation_checks: z.number(),
  registry_checks: z.number(),
  refresh_due: z.boolean(),
  sources: z.record(z.string(), SourceStatusSchema),
});
export type Feeds = z.infer<typeof FeedsSchema>;

export const TIStatusSchema = z.object({
  run_id: z.number().nullable(),
  counts: z.record(z.string(), z.number()),
  max_items_per_run: z.number(),
  feeds: FeedsSchema,
});
export type TIStatus = z.infer<typeof TIStatusSchema>;

export const AnalyzeResponseSchema = z.object({
  status: z.literal('queued'),
  run_id: z.number(),
});
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
