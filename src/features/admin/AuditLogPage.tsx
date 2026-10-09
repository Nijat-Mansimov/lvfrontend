import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Search,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { adminEndpoints } from '@/api/endpoints/admin';
import { queryKeys } from '@/api/queryKeys';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CopyButton } from '@/components/ui/CopyButton';
import { formatDateTime } from '@/lib/formatting';

export function AuditLogPage() {
  const [actionFilter, setActionFilter] = useState<string>('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('');
  const [actorFilter, setActorFilter] = useState<string>('');
  const [beforeId, setBeforeId] = useState<number | undefined>(undefined);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.auditEvents({
      action: actionFilter || undefined,
      outcome: outcomeFilter || undefined,
      actor: actorFilter || undefined,
      before_id: beforeId,
      limit: 25,
    }),
    queryFn: () =>
      adminEndpoints.getAuditEvents({
        action: actionFilter || undefined,
        outcome: outcomeFilter || undefined,
        actor: actorFilter || undefined,
        before_id: beforeId,
        limit: 25,
      }),
  });

  const toggleRow = (id: number) => {
    const next = new Set(expandedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedRows(next);
  };

  const smallestId = events.length > 0 ? Math.min(...events.map((e) => e.id)) : undefined;

  return (
    <div className="min-h-full pb-12">
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span>Administration</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              Audit Log
            </span>
          </div>
        }
      />

      <div className="p-6 max-w-[1560px] mx-auto space-y-6">
        <PageHeader
          title="Security Audit Events"
          description="Tamper-evident record of administrator actions, authentication events, and collector ingestions."
        />

        {/* Filter controls row */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex flex-wrap items-center gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold pr-2 border-r border-slate-200 dark:border-slate-800">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </div>

          <div className="w-48">
            <Input
              type="text"
              placeholder="Filter by actor..."
              value={actorFilter}
              onChange={(e) => {
                setActorFilter(e.target.value);
                setBeforeId(undefined);
              }}
              icon={<Search className="w-3 h-3" />}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setBeforeId(undefined);
            }}
            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:ring-slate-900 cursor-pointer"
          >
            <option value="">All Actions</option>
            <option value="auth.login">auth.login</option>
            <option value="auth.logout">auth.logout</option>
            <option value="auth.password_change">auth.password_change</option>
            <option value="user.create">user.create</option>
            <option value="user.update">user.update</option>
            <option value="api_key.create">api_key.create</option>
            <option value="api_key.revoke">api_key.revoke</option>
            <option value="inventory.ingest">inventory.ingest</option>
            <option value="inventory.raw_export">inventory.raw_export</option>
            <option value="intel.analyze">intel.analyze</option>
            <option value="intel.refresh">intel.refresh</option>
          </select>

          <select
            value={outcomeFilter}
            onChange={(e) => {
              setOutcomeFilter(e.target.value);
              setBeforeId(undefined);
            }}
            className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:ring-slate-900 cursor-pointer"
          >
            <option value="">All Outcomes</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="denied">Denied</option>
          </select>

          {(actionFilter || outcomeFilter || actorFilter || beforeId) && (
            <button
              onClick={() => {
                setActionFilter('');
                setOutcomeFilter('');
                setActorFilter('');
                setBeforeId(undefined);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {error ? (
          <ErrorState
            title="Failed to load audit events"
            message={error.message}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No audit events matched"
            description="Try modifying your filters or clear search criteria."
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold select-none">
                    <th className="py-3 px-3 w-8"></th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Request ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {events.map((event) => {
                    const isExpanded = expandedRows.has(event.id);

                    return (
                      <React.Fragment key={event.id}>
                        <tr
                          onClick={() => toggleRow(event.id)}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                          {/* Expand icon */}
                          <td className="py-3 px-3 text-slate-400">
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isExpanded ? 'rotate-90 text-slate-900 dark:text-slate-100' : ''
                              }`}
                            />
                          </td>

                          {/* Timestamp */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap" title={event.occurred_at}>
                            {formatDateTime(event.occurred_at)}
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 font-bold font-mono text-slate-900 dark:text-slate-100">
                            {event.action}
                          </td>

                          {/* Outcome badge */}
                          <td className="py-3 px-4">
                            {event.outcome === 'success' ? (
                              <Badge variant="allowed" size="sm">
                                Success
                              </Badge>
                            ) : event.outcome === 'denied' ? (
                              <Badge variant="blocked" size="sm">
                                Denied
                              </Badge>
                            ) : (
                              <Badge variant="critical" size="sm">
                                Failure
                              </Badge>
                            )}
                          </td>

                          {/* Actor */}
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{event.actor_name}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                              ({event.actor_type})
                            </span>
                          </td>

                          {/* Target */}
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                            {event.target_type ? `${event.target_type}:${event.target_id || ''}` : '—'}
                          </td>

                          {/* IP Address */}
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                            {event.ip_address || '—'}
                          </td>

                          {/* Request ID */}
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            <div className="flex items-center gap-1">
                              <span className="truncate max-w-[100px]">{event.request_id || '—'}</span>
                              {event.request_id && <CopyButton value={event.request_id} size="sm" />}
                            </div>
                          </td>
                        </tr>

                        {/* Expandable JSON details */}
                        {isExpanded && (
                          <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                            <td colSpan={8} className="p-4 pl-12 border-b border-slate-100 dark:border-slate-800">
                              <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                  Audit Event Details Payload:
                                </span>
                                <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                                  <code>{JSON.stringify(event.details, null, 2)}</code>
                                </pre>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Load older cursor pagination */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
              <span>Showing {events.length} audit records</span>
              {smallestId && events.length >= 25 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBeforeId(smallestId)}
                  className="text-xs"
                >
                  Load older events
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
