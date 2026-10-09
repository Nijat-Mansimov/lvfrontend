import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from '@/components/ui/Drawer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Badge, SeverityBadge, StatusBadge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlatformLogo } from '@/components/ui/PlatformLogo';
import { getVerdictLabel } from '@/lib/severity';
import type { Asset } from '@/api/schemas/inventory';
import {
  AlertOctagon,
  AlertTriangle,
  FileCode,
  Network,
  ArrowRight,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export interface AssetDetailDrawerProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetDetailDrawer({ asset, open, onOpenChange }: AssetDetailDrawerProps) {
  if (!asset) return null;

  const result = asset.risk_assessment?.result;
  const analysis = asset.metadata?.analysis;
  const isKnownMalware = result?.known_malware || asset.risk_severity === 'critical';
  const verdict = result?.verdict || (isKnownMalware ? 'known_malware' : 'needs_review');

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700/80">
              <PlatformLogo platform={asset.platform} size={14} />
              <span className="capitalize">{asset.platform} · {asset.category.replace('_', ' ')}</span>
            </span>
            <SeverityBadge severity={result?.severity || asset.risk_severity} />
            {isKnownMalware && (
              <Badge variant="blocked" className="gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                Known Malware
              </Badge>
            )}
          </div>
          <DrawerTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 break-words">
            {asset.name}
          </DrawerTitle>
          <DrawerDescription className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span>Version: <strong className="text-slate-800 dark:text-slate-200 font-mono">{asset.version}</strong></span>
            <span>·</span>
            <span>Device: <strong className="text-slate-800 dark:text-slate-200 font-mono">{asset.device_id}</strong></span>
            <span>·</span>
            <span>User: <strong className="text-slate-800 dark:text-slate-200">{asset.user_name}</strong></span>
          </DrawerDescription>
        </DrawerHeader>

        {/* Drawer Body with 4 Tabs */}
        <DrawerBody>
          <Tabs defaultValue="risk">
            <TabsList>
              <TabsTrigger value="risk" className="gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Risk Explanation
              </TabsTrigger>
              <TabsTrigger value="metadata" className="gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Permissions & Metadata
              </TabsTrigger>
              <TabsTrigger value="network" className="gap-1.5">
                <Network className="w-3.5 h-3.5" />
                Network Connections
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                Code Analysis
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: RISK EXPLANATION */}
            <TabsContent value="risk" className="space-y-5">
              {/* Score & Verdict Banner */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
                    Verdict
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {getVerdictLabel(verdict)}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold block mb-0.5">
                    Assessed Risk Score
                  </span>
                  <div className="flex items-baseline sm:justify-end gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums font-mono">
                      {result?.risk_score ?? asset.risk_score ?? 0}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Known Malware Warning Banner if critical */}
              {isKnownMalware && (
                <div className="p-4 rounded-xl border border-red-300 dark:border-red-900/80 bg-red-50 dark:bg-red-950/30 flex items-start gap-3 text-red-900 dark:text-red-200">
                  <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-900 dark:text-red-300">Known Malware Indicator Detected</h4>
                    <p className="text-xs text-red-700 dark:text-red-300/80 mt-0.5 leading-relaxed">
                      This extension or artifact matches signatures in public malicious feeds or demonstrates deliberate data exfiltration. Immediate host containment is recommended.
                    </p>
                  </div>
                </div>
              )}

              {/* Reasons list */}
              {result?.reasons && result.reasons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Risk Factors & Reasons
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {result.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Behavior summary cards */}
              {analysis?.behavior_summary && analysis.behavior_summary.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Behavior Summary
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {analysis.behavior_summary.map((behavior, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{behavior.title}</span>
                          <SeverityBadge severity={behavior.severity} />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{behavior.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Flow Exfiltration Cards */}
              {analysis?.data_flows && analysis.data_flows.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Data Flow & Exfiltration Evidence
                  </h4>
                  <div className="space-y-2.5">
                    {analysis.data_flows.map((flow, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{flow.title}</span>
                          <SeverityBadge severity={flow.severity} />
                        </div>
                        {/* Flow diagram visualization */}
                        <div className="flex items-center gap-2 text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto">
                          <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                            {flow.source_labels.join(', ') || flow.source_types.join(', ')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded">
                            {flow.sink_type} ({flow.method})
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded truncate max-w-xs">
                            {flow.destination}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{flow.summary}</p>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Location: {flow.sink_file}:{flow.sink_line}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threat Intel Matches */}
              {result?.threat_intel_matches && result.threat_intel_matches.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Threat Intelligence Matches
                  </h4>
                  <div className="space-y-2">
                    {result.threat_intel_matches.map((match, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-start gap-3">
                        <div className="w-6 h-6 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertOctagon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{match.source}</span>
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{match.type}</span>
                          </div>
                          <span className="text-xs font-mono text-rose-700 dark:text-rose-400 block mt-0.5">{match.indicator}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources checked & limitations */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                {result?.sources_checked && (
                  <p>
                    <strong>Sources verified:</strong> {result.sources_checked.join(', ')}
                  </p>
                )}
                {result?.limitations && result.limitations.length > 0 && (
                  <p className="italic text-[11px] text-slate-400 dark:text-slate-500">
                    * Limitations: {result.limitations.join('; ')}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: PERMISSIONS & METADATA */}
            <TabsContent value="metadata" className="space-y-5">
              {/* Permissions list */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
                  Declared Permissions
                </h4>
                {asset.metadata?.permissions && asset.metadata.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {asset.metadata.permissions.map((perm, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-700">
                        {perm}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">No special permissions requested.</p>
                )}
              </div>

              {/* Host permissions */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
                  Host Permissions
                </h4>
                {asset.metadata?.host_permissions && asset.metadata.host_permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {asset.metadata.host_permissions.map((host, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono border ${
                          host === '<all_urls>'
                            ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900 font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {host}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">No host permissions requested.</p>
                )}
              </div>

              {/* Provenance & publisher */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Origin & Provenance
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Publisher</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{asset.metadata?.publisher || 'Unknown / Unverified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Marketplace</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{asset.metadata?.provenance?.marketplace || 'Direct / Sideload'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Store Status</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{asset.metadata?.provenance?.source_type || 'Active'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[11px]">Manifest Version</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">v{asset.metadata?.manifest_version || 'N/A'}</span>
                  </div>
                </div>

                {/* SHA256 with copy button */}
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1 font-semibold">SHA-256 Hash</span>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    <span className="truncate mr-2">{asset.sha256}</span>
                    <CopyButton value={asset.sha256} />
                  </div>
                </div>

                {/* Local filesystem path */}
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1 font-semibold">Local Path</span>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    <span className="truncate mr-2">{asset.path}</span>
                    <CopyButton value={asset.path} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: NETWORK CONNECTIONS */}
            <TabsContent value="network" className="space-y-4">
              {result?.connections && result.connections.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Observed Outbound Connections
                  </h4>
                  {result.connections.map((conn, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 select-all">
                          {conn.origin}
                        </span>
                        <CopyButton value={conn.origin} />
                      </div>

                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span className="text-slate-500 dark:text-slate-400">Reputation:</span>
                        <Badge
                          variant={conn.reputation === 'malicious' ? 'critical' : conn.reputation === 'suspicious' ? 'high' : 'neutral'}
                        >
                          {conn.reputation}
                        </Badge>
                        {conn.sensitive_data_flow && (
                          <Badge variant="blocked">
                            Sensitive data flow detected
                          </Badge>
                        )}
                      </div>

                      {conn.sources && conn.sources.length > 0 && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Threat feeds: {conn.sources.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : asset.metadata?.analysis?.network_indicators?.origins && asset.metadata.analysis.network_indicators.origins.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Static Network Indicators
                  </h4>
                  {asset.metadata.analysis.network_indicators.origins.map((orig, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-800 dark:text-slate-200">{orig}</span>
                      <CopyButton value={orig} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Network}
                  title="No outbound connections recorded"
                  description="Static analysis did not identify hardcoded network endpoints or dynamic sockets."
                />
              )}
            </TabsContent>

            {/* TAB 4: CODE ANALYSIS */}
            <TabsContent value="code" className="space-y-5">
              {/* Findings table */}
              {analysis?.findings && analysis.findings.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Static AST Findings
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold">
                          <th className="p-2.5">Rule</th>
                          <th className="p-2.5">Severity</th>
                          <th className="p-2.5">Finding</th>
                          <th className="p-2.5">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {analysis.findings.map((finding, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-2.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">{finding.rule_id}</td>
                            <td className="p-2.5">
                              <SeverityBadge severity={finding.severity} />
                            </td>
                            <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">{finding.title}</td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                              {finding.file}:{finding.line}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {/* Code Evidence Chunks */}
              {analysis?.evidence_code_chunks && analysis.evidence_code_chunks.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Code Evidence Chunks
                  </h4>
                  {analysis.evidence_code_chunks.map((chunk, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono px-1">
                        <span>Rule: {chunk.rule_id}</span>
                        <span>Lines {chunk.line_start}–{chunk.line_end}</span>
                      </div>
                      <CodeBlock
                        code={chunk.code}
                        filename={chunk.file}
                        lineStart={chunk.line_start}
                        lineEnd={chunk.line_end}
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {(!analysis?.findings || analysis.findings.length === 0) &&
                (!analysis?.evidence_code_chunks || analysis.evidence_code_chunks.length === 0) && (
                  <EmptyState
                    icon={FileCode}
                    title="No suspicious code patterns detected"
                    description="Static AST analysis did not trigger dangerous eval, dynamic subprocess execution, or secret harvester rules."
                  />
                )}
            </TabsContent>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
