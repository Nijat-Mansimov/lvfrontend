import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  Download,
  Bookmark,
  Plus,
  Play,
  RotateCcw,
  ChevronRight,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { inventoryEndpoints } from '@/api/endpoints/inventory';
import { queryKeys } from '@/api/queryKeys';
import { AssetDetailDrawer } from './AssetDetailDrawer';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Tooltip } from '@/components/ui/Tooltip';
import { PlatformLogo } from '@/components/ui/PlatformLogo';
import type { Asset } from '@/api/schemas/inventory';
import { formatNumber } from '@/lib/formatting';
import { cn } from '@/lib/cn';

export interface AssetTableProps {
  initialRunId?: number | null;
  deviceId?: string;
  defaultCategory?: string;
}

interface PlatformFilterItem {
  id: string;
  name: string;
  count: string;
}

const PLATFORM_FILTERS: PlatformFilterItem[] = [
  { id: 'vscode', name: 'VS Code', count: '6.7K' },
  { id: 'chrome', name: 'Google Chrome', count: '1.7K' },
  { id: 'jetbrains', name: 'JetBrains', count: '413' },
  { id: 'npm', name: 'npm', count: '1.2K' },
  { id: 'python', name: 'Python', count: '369' },
  { id: 'docker', name: 'Docker', count: '333' },
  { id: 'git', name: 'Git', count: '201' },
  { id: 'edge', name: 'Microsoft Edge', count: '57' },
  { id: 'firefox', name: 'Mozilla Firefox', count: '40' },
  { id: 'cursor', name: 'Cursor', count: '24' },
  { id: 'windsurf', name: 'Windsurf', count: '4' },
  { id: 'huggingface', name: 'Hugging Face', count: '28' },
  { id: 'ollama', name: 'Ollama', count: '16' },
];

export function AssetTable({ initialRunId, deviceId, defaultCategory }: AssetTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || defaultCategory || 'all';
  const qParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limit = 50;
  const offset = (pageParam - 1) * limit;

  const [searchInput, setSearchInput] = useState(qParam);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [activePlatformFilter, setActivePlatformFilter] = useState<string | null>(null);

  // Debounced search synchronization
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (searchInput.trim()) {
        nextParams.set('q', searchInput.trim());
      } else {
        nextParams.delete('q');
      }
      nextParams.set('page', '1');
      setSearchParams(nextParams, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Keep search input in sync if URL changes
  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.inventory.items({
      run_id: initialRunId,
      category: categoryParam === 'all' ? undefined : categoryParam,
      q: qParam || undefined,
      limit,
      offset,
    }),
    queryFn: () =>
      inventoryEndpoints.getItems({
        run_id: initialRunId,
        category: categoryParam === 'all' ? undefined : categoryParam,
        q: qParam || undefined,
        limit,
        offset,
      }),
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Client-side quick filter by platform if selected
  const displayedItems = activePlatformFilter
    ? items.filter((i) => i.platform.toLowerCase() === activePlatformFilter.toLowerCase())
    : items;

  const handleSelectRow = (id: number) => {
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === displayedItems.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(displayedItems.map((i) => i.id)));
    }
  };

  const openAssetDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setDrawerOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP PLATFORM CHIPS BAR (Using Platform Logos instead of text tool names) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 flex items-center gap-2 overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActivePlatformFilter(null)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 cursor-pointer',
            activePlatformFilter === null
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
          )}
        >
          <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
          <span>All Platforms</span>
        </button>

        {PLATFORM_FILTERS.map((item) => {
          const isActive = activePlatformFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePlatformFilter(isActive ? null : item.id)}
              title={item.name}
              aria-label={item.name}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 cursor-pointer',
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
            >
              <PlatformLogo platform={item.id} size={16} />
              <span className={cn('tabular-nums font-semibold', isActive ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400')}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. QUERY BUILDER PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Query Builder</span>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Saved Queries</span>
          </button>
        </div>

        {/* Condition row */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300 text-xs">
            And
          </div>
          <div className="flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Search package name, publisher, hash..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={<Search className="w-3.5 h-3.5" />}
            />
          </div>
          <Tooltip content="Advanced AST multi-condition filtering">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Condition</span>
            </button>
          </Tooltip>
          <Tooltip content="Group multiple Boolean expressions">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Group</span>
            </button>
          </Tooltip>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setActivePlatformFilter(null);
              }}
              className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              ✕ Clear
            </button>
            <Button
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5 text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            >
              <Play className="w-3 h-3 fill-current" />
              Run <kbd className="text-[10px] bg-slate-800 dark:bg-slate-200 text-slate-200 dark:text-slate-800 px-1 rounded">Ctrl ↵</kbd>
            </Button>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Bookmark this query"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. TABLE HEADER STATS & SUBTAB BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Unique Items <strong className="font-mono">{formatNumber(total)}</strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Total Instances <strong className="font-mono text-slate-700 dark:text-slate-300">58,855</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs cursor-pointer"
            title="Table column visibility"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const jsonBlob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(jsonBlob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `inventory-export-${Date.now()}.json`;
              a.click();
            }}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs cursor-pointer"
            title="Export filtered items to JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. TABLE CONTENT */}
      {error ? (
        <ErrorState
          title="Failed to load assets"
          message={error.message}
          onRetry={refetch}
        />
      ) : isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : displayedItems.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No assets found"
          description={qParam ? `No assets matching "${qParam}".` : 'No assets found in this inventory category.'}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold select-none">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedRows.size > 0 && selectedRows.size === displayedItems.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-slate-900 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-3">Risk level</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Governed by</th>
                  <th className="py-3 px-3">Version</th>
                  <th className="py-3 px-4">Publisher</th>
                  <th className="py-3 px-4">Marketplace</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {displayedItems.map((asset) => {
                  const isChecked = selectedRows.has(asset.id);
                  const isCritical = asset.risk_severity === 'critical';
                  const isBlocked = isCritical || asset.risk_assessment?.result?.known_malware;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => openAssetDetails(asset)}
                      className={cn(
                        'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group',
                        isChecked && 'bg-slate-50/80 dark:bg-slate-800/60'
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectRow(asset.id)}
                          className="rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-slate-900 cursor-pointer"
                        />
                      </td>

                      {/* Name + Platform SVG logo + Category subline */}
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                            <PlatformLogo platform={asset.platform} size={16} />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-slate-900 dark:text-slate-100 truncate" title={asset.name}>
                              {asset.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 capitalize block">
                              {asset.category.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Risk Level Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <SeverityBadge severity={asset.risk_assessment?.result?.severity || asset.risk_severity} />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={isBlocked ? 'Blocked' : 'Ungoverned'} />
                      </td>

                      {/* Governed by */}
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap font-medium">
                        {isBlocked ? 'Malware Protection' : '—'}
                      </td>

                      {/* Version */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap tabular-nums">
                        {asset.version}
                      </td>

                      {/* Publisher */}
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-xs truncate max-w-[140px]" title={asset.metadata?.publisher}>
                        {asset.metadata?.publisher || '—'}
                      </td>

                      {/* Marketplace with Platform Logo */}
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <PlatformLogo platform={asset.platform} size={16} />
                          <span>{asset.metadata?.provenance?.marketplace || asset.platform}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openAssetDetails(asset)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Inspect details"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openAssetDetails(asset)}
                            className="p-1 rounded text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors cursor-pointer"
                            title="Open drawer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. PAGINATION FOOTER */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
            <div>
              Showing <strong className="text-slate-900 dark:text-slate-100 font-mono">{displayedItems.length}</strong> / {formatNumber(total)}
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={pageParam <= 1}
                onClick={() => handlePageChange(pageParam - 1)}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                      pageParam === pageNum
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-1 text-slate-400">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                disabled={pageParam >= totalPages}
                onClick={() => handlePageChange(pageParam + 1)}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Detail Drawer */}
      <AssetDetailDrawer
        asset={selectedAsset}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
