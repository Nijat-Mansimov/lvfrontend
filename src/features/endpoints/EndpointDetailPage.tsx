import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Laptop, ArrowLeft } from 'lucide-react';
import { inventoryEndpoints } from '@/api/endpoints/inventory';
import { queryKeys } from '@/api/queryKeys';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { AssetTable } from '@/features/assets/AssetTable';
import { formatDateTime, formatRelativeTime } from '@/lib/formatting';

export function EndpointDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.inventory.endpoints,
    queryFn: inventoryEndpoints.getEndpoints,
  });

  const endpoints = data?.endpoints ?? [];
  const endpoint = endpoints.find((e) => e.device_id === deviceId);

  return (
    <div className="min-h-full pb-12">
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <button
              onClick={() => navigate('/endpoints')}
              className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Endpoints</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
              {endpoint?.hostname || deviceId}
            </span>
          </div>
        }
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/endpoints')} className="gap-1.5 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Endpoints
          </Button>
        }
      />

      <div className="p-6 max-w-[1680px] mx-auto space-y-6">
        {error ? (
          <ErrorState
            title="Failed to load endpoint details"
            message={error.message}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : !endpoint ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Endpoint not found</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/endpoints')}>
              Back to Endpoints
            </Button>
          </div>
        ) : (
          <>
            {/* Endpoint Facts Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      {endpoint.hostname}
                    </h1>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 block">
                      Device ID: {endpoint.device_id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {endpoint.risk.known_malware > 0 && (
                    <Badge variant="blocked" size="md">
                      {endpoint.risk.known_malware} Known Malware Detected
                    </Badge>
                  )}
                  {endpoint.risk.critical > 0 && (
                    <Badge variant="critical" size="md">
                      {endpoint.risk.critical} Critical
                    </Badge>
                  )}
                  {endpoint.risk.high > 0 && (
                    <Badge variant="high" size="md">
                      {endpoint.risk.high} High
                    </Badge>
                  )}
                </div>
              </div>

              {/* Facts grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">OS & Version</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {endpoint.os} {endpoint.os_version}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">Architecture</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{endpoint.arch}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">Logged-in User</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{endpoint.current_user}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">Collector Agent</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">v{endpoint.collector_version}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">Last Telemetry</span>
                  <span className="text-slate-700 dark:text-slate-300" title={formatDateTime(endpoint.last_seen)}>
                    {formatRelativeTime(endpoint.last_seen)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">First Registered</span>
                  <span className="text-slate-700 dark:text-slate-300">{formatDateTime(endpoint.first_seen)}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">Latest Scan Run ID</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">#{endpoint.latest_run_id || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-medium">Inventoried Assets</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">{endpoint.item_count} items</span>
                </div>
              </div>
            </div>

            {/* Asset Table for this Endpoint */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Software Supply Chain Inventory on this Device
              </h2>
              <AssetTable initialRunId={endpoint.latest_run_id} deviceId={endpoint.device_id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
