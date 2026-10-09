import { z } from 'zod';

export const SeverityBandSchema = z.enum([
  'critical',
  'high',
  'medium',
  'low',
  'informational',
  'not_analyzed',
]);

export const VerdictSchema = z.enum([
  'known_malware',
  'high_priority_review',
  'needs_review',
  'no_known_threat',
]);

export const AnalysisStatusSchema = z.enum([
  'complete',
  'partial',
  'unavailable',
  'skipped_limit',
]);

export const FindingSchema = z.object({
  rule_id: z.string(),
  category: z.string(),
  severity: z.string(),
  weight: z.number(),
  title: z.string(),
  indicator: z.string(),
  file: z.string(),
  line: z.number(),
});

export const DataFlowSchema = z.object({
  rule_id: z.string(),
  severity: z.string(),
  title: z.string(),
  source_types: z.array(z.string()),
  source_labels: z.array(z.string()),
  source_locations: z.array(z.object({ file: z.string(), line: z.number() })),
  sink_type: z.string(),
  sink_file: z.string(),
  sink_line: z.number(),
  sink_field: z.string(),
  method: z.string(),
  destination: z.string(),
  transformations: z.array(z.string()),
  cross_file: z.boolean(),
  confidence: z.string(),
  summary: z.string(),
});

export const BehaviorSummarySchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.string(),
  severity: z.string(),
  summary: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export const EvidenceCodeChunkSchema = z.object({
  file: z.string(),
  line_start: z.number(),
  line_end: z.number(),
  rule_id: z.string(),
  code: z.string(),
});

export const NetworkIndicatorsSchema = z.object({
  origins: z.array(z.string()),
  domains: z.array(z.string()),
  truncated: z.boolean(),
});

export const AnalysisSchema = z.object({
  status: AnalysisStatusSchema,
  risk_score: z.number().optional(),
  severity: z.string().optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
  potential_exfiltration: z.boolean().optional(),
  obfuscation_detected: z.boolean().optional(),
  findings: z.array(FindingSchema).optional(),
  data_flows: z.array(DataFlowSchema).optional(),
  behavior_summary: z.array(BehaviorSummarySchema).optional(),
  evidence_code_chunks: z.array(EvidenceCodeChunkSchema).optional(),
  network_indicators: NetworkIndicatorsSchema.optional(),
  stats: z.record(z.string(), z.number()).optional(),
  limitations: z.array(z.string()).optional(),
});

export const AssetMetadataSchema = z
  .object({
    permissions: z.array(z.string()).optional(),
    optional_permissions: z.array(z.string()).optional(),
    host_permissions: z.array(z.string()).optional(),
    content_scripts: z
      .array(
        z.object({
          matches: z.array(z.string()),
          js: z.array(z.string()),
          run_at: z.string().optional(),
          all_frames: z.boolean().optional(),
        })
      )
      .optional(),
    description: z.string().optional(),
    update_url: z.string().optional(),
    homepage_url: z.string().optional(),
    manifest_version: z.number().optional(),
    publisher: z.string().optional(),
    provenance: z
      .object({
        source_type: z.string().optional(),
        marketplace: z.string().optional(),
        marketplace_verified: z.boolean().optional(),
        registry_id: z.string().optional(),
        unknown_source: z.boolean().optional(),
      })
      .passthrough()
      .optional(),
    analysis: AnalysisSchema.optional(),
  })
  .passthrough();

export const ThreatIntelMatchSchema = z.object({
  source: z.string(),
  type: z.string(),
  indicator: z.string(),
  details: z.unknown().optional(),
});

export const ConnectionSchema = z.object({
  origin: z.string(),
  host: z.string(),
  reputation: z.string(),
  score: z.number(),
  sources: z.array(z.string()),
  sensitive_data_flow: z.boolean(),
  data_flows: z.array(z.unknown()).optional(),
  details: z.unknown().optional(),
});

export const RiskResultSchema = z.object({
  risk_score: z.number(),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'informational']),
  verdict: VerdictSchema,
  known_malware: z.boolean(),
  reasons: z.array(z.string()),
  rule_refs: z.array(z.string()),
  threat_intel_matches: z.array(ThreatIntelMatchSchema),
  connections: z.array(ConnectionSchema),
  provenance: z.record(z.string(), z.unknown()),
  sources_checked: z.array(z.string()),
  limitations: z.array(z.string()),
  assessed_at: z.string(),
});

export const RiskAssessmentSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  result: RiskResultSchema.nullable(),
  error: z.string(),
  updated_at: z.string(),
});

export const AssetSchema = z.object({
  id: z.number(),
  run_id: z.number(),
  device_id: z.string(),
  category: z.string(),
  platform: z.string(),
  name: z.string(),
  item_id: z.string(),
  version: z.string(),
  path: z.string(),
  profile: z.string(),
  user_name: z.string(),
  sha256: z.string(),
  metadata: AssetMetadataSchema,
  risk_score: z.number().nullable(),
  risk_severity: SeverityBandSchema,
  risk_assessment: RiskAssessmentSchema.nullable(),
});

export type Asset = z.infer<typeof AssetSchema>;
export type AssetMetadata = z.infer<typeof AssetMetadataSchema>;
export type RiskResult = z.infer<typeof RiskResultSchema>;
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type DataFlow = z.infer<typeof DataFlowSchema>;
export type EvidenceCodeChunk = z.infer<typeof EvidenceCodeChunkSchema>;

export const EndpointSchema = z.object({
  device_id: z.string(),
  hostname: z.string(),
  os: z.string(),
  os_version: z.string(),
  arch: z.string(),
  current_user: z.string(),
  first_seen: z.string(),
  last_seen: z.string(),
  latest_run_id: z.number().nullable(),
  completed_at: z.string().nullable(),
  received_at: z.string().nullable(),
  collector_version: z.string(),
  item_count: z.number(),
  error_count: z.number(),
  categories: z.record(z.string(), z.number()),
  risk: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    known_malware: z.number(),
  }),
});
export type Endpoint = z.infer<typeof EndpointSchema>;

export const EndpointsResponseSchema = z.object({
  endpoints: z.array(EndpointSchema),
});
export type EndpointsResponse = z.infer<typeof EndpointsResponseSchema>;

export const ScanRunSchema = z.object({
  id: z.number(),
  device_id: z.string(),
  hostname: z.string().optional(),
  os: z.string().optional(),
  started_at: z.string(),
  completed_at: z.string(),
  received_at: z.string(),
  collector_version: z.string(),
  item_count: z.number(),
  error_count: z.number(),
});
export type ScanRun = z.infer<typeof ScanRunSchema>;

export const RunsResponseSchema = z.object({
  runs: z.array(ScanRunSchema),
});
export type RunsResponse = z.infer<typeof RunsResponseSchema>;

export const ItemsResponseSchema = z.object({
  items: z.array(AssetSchema),
  total: z.number(),
  run_id: z.number().nullable(),
});
export type ItemsResponse = z.infer<typeof ItemsResponseSchema>;

export const DiffItemChangedSchema = z.object({
  before: AssetSchema.omit({ risk_score: true, risk_severity: true, risk_assessment: true }).passthrough(),
  after: AssetSchema.omit({ risk_score: true, risk_severity: true, risk_assessment: true }).passthrough(),
});

export const DiffResponseSchema = z.object({
  run_id: z.number(),
  previous_run_id: z.number().nullable(),
  added: z.array(AssetSchema.omit({ risk_score: true, risk_severity: true, risk_assessment: true }).passthrough()),
  removed: z.array(AssetSchema.omit({ risk_score: true, risk_severity: true, risk_assessment: true }).passthrough()),
  changed: z.array(DiffItemChangedSchema),
});
export type DiffResponse = z.infer<typeof DiffResponseSchema>;

export const SummaryCategorySchema = z.object({
  category: z.string(),
  count: z.number(),
});

export const SummaryRiskSchema = z.object({
  analyzed_extensions: z.number(),
  high_or_critical: z.number(),
  potential_exfiltration: z.number(),
  obfuscation_detected: z.number(),
  average_score: z.number(),
  max_score: z.number(),
  by_severity: z.record(z.string(), z.number()),
});

export const SummaryIntelligenceSchema = z.object({
  pending: z.number(),
  completed: z.number(),
  failed: z.number(),
  known_malware: z.number(),
  high_or_critical: z.number(),
  by_severity: z.record(z.string(), z.number()),
});

export const SummarySchema = z.object({
  device_count: z.number(),
  latest_run: ScanRunSchema.nullable(),
  item_count: z.number(),
  error_count: z.number(),
  categories: z.array(SummaryCategorySchema),
  diff: z.object({
    added: z.number(),
    removed: z.number(),
    changed: z.number(),
  }),
  risk: SummaryRiskSchema,
  intelligence: SummaryIntelligenceSchema,
});
export type Summary = z.infer<typeof SummarySchema>;
