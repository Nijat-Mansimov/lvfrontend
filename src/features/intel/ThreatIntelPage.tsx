import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldAlert,
  RefreshCw,
  Play,
  Sparkles,
} from 'lucide-react';
import { intelEndpoints } from '@/api/endpoints/intel';
import { queryKeys } from '@/api/queryKeys';
import { useAuth } from '@/features/auth/useSession';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatDateTime, formatRelativeTime, formatNumber } from '@/lib/formatting';

export function ThreatIntelPage() {
  const queryClient = useQueryClient();
  const { hasScope } = useAuth();
  const canRunIntel = hasScope('intel:run');

  const [isPolling, setIsPolling] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const {
    data: status,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.intel.status(),
    queryFn: () => intelEndpoints.getStatus(),
    refetchInterval: isPolling ? 3000 : false,
  });

  // Recalculate Risk Mutation
  const analyzeMutation = useMutation({
    mutationFn: (runId: number) => intelEndpoints.recalculateRisk(runId),
    onSuccess: () => {
      setActionMessage('Risk recalculation queued. Polling pipeline status...');
      setIsPolling(true);
      setTimeout(() => {
        setIsPolling(false);
        setActionMessage('Risk assessment analysis completed successfully.');
        queryClient.invalidateQueries({ queryKey: queryKeys.inventory.summary });
        queryClient.invalidateQueries({ queryKey: queryKeys.intel.status() });
      }, 6000);
    },
  });

  // Refresh Feeds Mutation
  const refreshFeedsMutation = useMutation({
    mutationFn: intelEndpoints.refreshFeeds,
    onSuccess: () => {
      setActionMessage('Threat feeds refreshed with upstream intelligence sources.');
      queryClient.invalidateQueries({ queryKey: queryKeys.intel.status() });
      setTimeout(() => setActionMessage(null), 4000);
    },
  });

  const feeds = status?.feeds;
  const sources = feeds?.sources || {};

  return (
    <div className="min-h-full pb-12">
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <ShieldAlert className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Threat Intelligence</span>
          </div>
        }
      />

      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <PageHeader
          title="Threat Intelligence Feeds & Risk Pipeline"
          description="External security intelligence correlation feeds, malicious extension databases, and IOC caches."
          actions={
            canRunIntel && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshFeedsMutation.mutate()}
                  isLoading={refreshFeedsMutation.isPending}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Intelligence
                </Button>

                <Button
                  size="sm"
                  onClick={() => analyzeMutation.mutate(status?.run_id || 102)}
                  isLoading={analyzeMutation.isPending || isPolling}
                  className="gap-1.5 text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Recalculate Risk
                </Button>
              </div>
            )
          }
        />

        {actionMessage && (
          <div className="p-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs flex items-center justify-between shadow-sm animate-in fade-in-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>
        )}

        {error ? (
          <ErrorState
            title="Failed to load threat intelligence status"
            message={error.message}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* TOP STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Extension IOCs</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums font-mono">
                  {formatNumber(feeds?.extension_iocs)}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">Malicious extension signatures</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Network IOCs</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums font-mono">
                  {formatNumber(feeds?.network_iocs)}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">Malicious IPs & Domains</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registry & Reputation Checks</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums font-mono">
                  {formatNumber(feeds?.reputation_checks)}
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">On-demand queries</span>
              </Card>

              <Card className="p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Feed Status & Sync</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {feeds?.enabled ? 'Active & Healthy' : 'Disabled'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1" title={formatDateTime(feeds?.updated_at)}>
                  Synced {formatRelativeTime(feeds?.updated_at)}
                </span>
              </Card>
            </div>

            {/* THREAT SOURCES TABLE */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Configured Threat Intelligence Providers
                </h2>
                {feeds?.refresh_due && (
                  <Badge variant="high">Sync overdue</Badge>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      <th className="py-3 px-4">Provider / Feed Name</th>
                      <th className="py-3 px-4">Operating Mode</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Records Ingested</th>
                      <th className="py-3 px-4 text-right">Last Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {Object.entries(sources as Record<string, { status: string; mode?: string; records?: number; updated_at?: string }>).map(([key, src]) => (
                      <tr key={key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {key}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                          {src.mode || 'standard_lookup'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-900/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {src.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                          {formatNumber(src.records)}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {formatRelativeTime(src.updated_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
