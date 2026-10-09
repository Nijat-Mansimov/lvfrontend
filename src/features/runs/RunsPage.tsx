import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  Download,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  FileJson,
} from 'lucide-react';
import { inventoryEndpoints } from '@/api/endpoints/inventory';
import { queryKeys } from '@/api/queryKeys';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlatformLogo } from '@/components/ui/PlatformLogo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { formatRelativeTime } from '@/lib/formatting';
import { cn } from '@/lib/cn';

export function RunsPage() {
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: runsData,
    isLoading: isRunsLoading,
    error: runsError,
    refetch: refetchRuns,
  } = useQuery({
    queryKey: queryKeys.inventory.runs(),
    queryFn: () => inventoryEndpoints.getRuns(50),
  });

  const runs = runsData?.runs || [];
  const currentRunId = selectedRunId || (runs.length > 0 ? runs[0].id : null);

  const {
    data: diffData,
    isLoading: isDiffLoading,
    error: diffError,
    refetch: refetchDiff,
  } = useQuery({
    queryKey: queryKeys.inventory.diff(currentRunId || 0),
    queryFn: () => inventoryEndpoints.getDiff(currentRunId!),
    enabled: !!currentRunId,
  });

  const handleConfirmDownload = async () => {
    if (!currentRunId) return;
    setIsExporting(true);
    try {
      const rawData = await inventoryEndpoints.getRawScan(currentRunId);
      const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan-${currentRunId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadModalOpen(false);
    } catch (err) {
      console.error('Failed to export raw scan', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-full pb-12">
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Scans & Changes</span>
            {currentRunId && (
              <>
                <span>/</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">Run #{currentRunId}</span>
              </>
            )}
          </div>
        }
      />

      <div className="p-6 max-w-[1680px] mx-auto space-y-6">
        <PageHeader
          title="Scan Runs & Diff History"
          description="Collector scan ingestion events and inventory mutations between consecutive runs."
          actions={
            currentRunId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDownloadModalOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Raw Collector JSON
              </Button>
            )
          }
        />

        {runsError ? (
          <ErrorState
            title="Failed to load scan runs"
            message={runsError.message}
            onRetry={refetchRuns}
          />
        ) : isRunsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 1/3: RUNS LIST */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Ingested Scan Runs
              </h2>
              <div className="space-y-2">
                {runs.map((run) => {
                  const isSelected = run.id === currentRunId;
                  return (
                    <div
                      key={run.id}
                      onClick={() => setSelectedRunId(run.id)}
                      className={cn(
                        'p-3.5 rounded-xl border transition-all cursor-pointer',
                        isSelected
                          ? 'border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 ring-2 ring-slate-900/5 dark:ring-slate-100/10 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-850'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                          Run #{run.id}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          v{run.collector_version}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {run.hostname || run.device_id}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>{formatRelativeTime(run.completed_at)}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums font-mono">
                          {run.item_count} items
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT 2/3: DIFF VIEW */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Changes Against Previous Scan
                </h2>
                {diffData && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Baseline: Run #{diffData.previous_run_id || 'N/A'}
                  </span>
                )}
              </div>

              {isDiffLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : diffError ? (
                <ErrorState
                  title="Failed to load run diff"
                  message={diffError.message}
                  onRetry={refetchDiff}
                />
              ) : !diffData ||
                (diffData.added.length === 0 &&
                  diffData.removed.length === 0 &&
                  diffData.changed.length === 0) ? (
                <EmptyState
                  icon={History}
                  title="No changes in this scan"
                  description="All installed extensions, packages, and models match the baseline run."
                />
              ) : (
                <div className="space-y-4">
                  {/* ADDED ITEMS */}
                  {diffData.added.length > 0 && (
                    <Card className="p-4 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Added Items ({diffData.added.length})</span>
                      </div>
                      <div className="divide-y divide-emerald-100 dark:divide-emerald-950/40 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200/80 dark:border-emerald-900/60 overflow-hidden text-xs">
                        {diffData.added.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                                <PlatformLogo platform={item.platform} size={14} />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.name}</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono capitalize">
                                  {item.platform} · v{item.version}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-xs">
                              {item.sha256.substring(0, 16)}...
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* REMOVED ITEMS */}
                  {diffData.removed.length > 0 && (
                    <Card className="p-4 border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                        <MinusCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Removed Items ({diffData.removed.length})</span>
                      </div>
                      <div className="divide-y divide-rose-100 dark:divide-rose-950/40 bg-white dark:bg-slate-900 rounded-lg border border-rose-200/80 dark:border-rose-900/60 overflow-hidden text-xs">
                        {diffData.removed.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                                <PlatformLogo platform={item.platform} size={14} />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-slate-100 block line-through text-slate-400 dark:text-slate-500">{item.name}</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono capitalize">
                                  {item.platform} · v{item.version}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* CHANGED ITEMS */}
                  {diffData.changed.length > 0 && (
                    <Card className="p-4 border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                        <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Modified / Updated Items ({diffData.changed.length})</span>
                      </div>
                      <div className="divide-y divide-amber-100 dark:divide-amber-950/40 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/80 dark:border-amber-900/60 overflow-hidden text-xs">
                        {diffData.changed.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                                <PlatformLogo platform={item.after.platform} size={14} />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.after.name}</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono capitalize">
                                  {item.after.platform}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 block">
                                v{item.before.version} → v{item.after.version}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Export Confirmation Modal */}
      <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <FileJson className="w-5 h-5 text-indigo-600" />
              Download Scan Artifact #{currentRunId}
            </DialogTitle>
            <DialogDescription>
              Export sanitized local collector inventory JSON snapshot for threat ingestion and offline audit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p>
              Contains full JSON metadata, hashes, AST findings, and network destination arrays for this run.
            </p>
          </div>
          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setDownloadModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmDownload} isLoading={isExporting} className="gap-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
              <Download className="w-3.5 h-3.5" />
              Confirm Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
