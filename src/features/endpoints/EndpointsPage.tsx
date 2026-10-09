import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Laptop, Search, ChevronRight, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { inventoryEndpoints } from '@/api/endpoints/inventory';
import { queryKeys } from '@/api/queryKeys';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateTime, formatRelativeTime } from '@/lib/formatting';

export function EndpointsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredEndpoints = useMemo(() => {
    if (!searchTerm.trim()) return endpoints;
    const q = searchTerm.toLowerCase();
    return endpoints.filter(
      (e) =>
        e.hostname.toLowerCase().includes(q) ||
        e.current_user.toLowerCase().includes(q) ||
        e.os.toLowerCase().includes(q) ||
        e.device_id.toLowerCase().includes(q)
    );
  }, [endpoints, searchTerm]);

  return (
    <div className="min-h-full pb-12">
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Laptop className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Endpoints</span>
          </div>
        }
      />

      <div className="p-6 max-w-[1680px] mx-auto space-y-6">
        <PageHeader
          title="Monitored Endpoints"
          description="Endpoints reporting local software-supply-chain telemetry via the read-only collector."
          actions={
            <div className="w-72">
              <Input
                type="text"
                placeholder="Search hostname, user, OS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
          }
        />

        {error ? (
          <ErrorState
            title="Failed to load endpoints"
            message={error.message}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : filteredEndpoints.length === 0 ? (
          <EmptyState
            icon={Laptop}
            title="No endpoints found"
            description={searchTerm ? 'No endpoints matched your search filter.' : 'No endpoints are currently reporting.'}
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-4">Hostname</th>
                    <th className="py-3 px-4">Operating System</th>
                    <th className="py-3 px-4">Architecture</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Last Seen</th>
                    <th className="py-3 px-4">Collector</th>
                    <th className="py-3 px-4 text-center">Assets</th>
                    <th className="py-3 px-4">Risk Profile</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredEndpoints.map((endpoint) => (
                    <tr
                      key={endpoint.device_id}
                      onClick={() => navigate(`/endpoints/${endpoint.device_id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      {/* Hostname */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                            <Laptop className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block">{endpoint.hostname}</span>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-normal">
                              {endpoint.device_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* OS */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <span>{endpoint.os}</span>{' '}
                        <span className="text-slate-400 dark:text-slate-500">{endpoint.os_version}</span>
                      </td>

                      {/* Architecture */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {endpoint.arch}
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {endpoint.current_user}
                      </td>

                      {/* Last Seen */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400" title={formatDateTime(endpoint.last_seen)}>
                        {formatRelativeTime(endpoint.last_seen)}
                      </td>

                      {/* Collector Version */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        v{endpoint.collector_version}
                      </td>

                      {/* Asset count */}
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                        {endpoint.item_count}
                      </td>

                      {/* Risk Profile badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {endpoint.risk.known_malware > 0 && (
                            <Badge variant="blocked" size="sm" className="gap-1">
                              <AlertOctagon className="w-3 h-3 text-red-600 dark:text-red-400" />
                              {endpoint.risk.known_malware} Malware
                            </Badge>
                          )}
                          {endpoint.risk.critical > 0 && (
                            <Badge variant="critical" size="sm">
                              {endpoint.risk.critical} Critical
                            </Badge>
                          )}
                          {endpoint.risk.high > 0 && (
                            <Badge variant="high" size="sm">
                              {endpoint.risk.high} High
                            </Badge>
                          )}
                          {endpoint.risk.critical === 0 &&
                            endpoint.risk.high === 0 &&
                            endpoint.risk.known_malware === 0 && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Low Risk
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Action Chevron */}
                      <td className="py-3.5 px-4 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
