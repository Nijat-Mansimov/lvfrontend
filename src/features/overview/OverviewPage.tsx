import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutGrid,
  Laptop,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Code,
  Box,
  Terminal,
  Zap,
  Cpu,
  ChevronDown,
  Sun,
  Network,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { inventoryEndpoints } from '@/api/endpoints/inventory';
import { intelEndpoints } from '@/api/endpoints/intel';
import { queryKeys } from '@/api/queryKeys';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Badge, SecurityBoostBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { PlatformLogo } from '@/components/ui/PlatformLogo';
import { formatNumber, formatCompactNumber } from '@/lib/formatting';
import { useTheme } from '@/app/theme';

export function OverviewPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: queryKeys.inventory.summary,
    queryFn: inventoryEndpoints.getSummary,
  });

  const {
    data: endpointsData,
    isLoading: isEndpointsLoading,
  } = useQuery({
    queryKey: queryKeys.inventory.endpoints,
    queryFn: inventoryEndpoints.getEndpoints,
  });

  const { data: tiStatus } = useQuery({
    queryKey: queryKeys.intel.status(),
    queryFn: () => intelEndpoints.getStatus(),
  });

  const isLoading = isSummaryLoading || isEndpointsLoading;

  if (summaryError) {
    return (
      <div>
        <Topbar
          breadcrumbs={
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-sm">
              <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Dashboard</span>
            </div>
          }
        />
        <div className="p-8">
          <ErrorState
            title="Failed to load dashboard summary"
            message={summaryError.message}
            onRetry={refetchSummary}
          />
        </div>
      </div>
    );
  }

  // Attack surface chart data
  const attackSurfaceData = [
    { name: 'Extensions', critical: 18, high: 42, medium: 120, low: 240 },
    { name: 'Code packages', critical: 4, high: 28, medium: 85, low: 450 },
    { name: 'OS packages', critical: 0, high: 6, medium: 24, low: 395 },
    { name: 'Applications', critical: 2, high: 14, medium: 32, low: 82 },
    { name: 'AI Models', critical: 6, high: 8, medium: 12, low: 1 },
    { name: 'MCPs', critical: 4, high: 5, medium: 16, low: 8 },
  ];

  // Overtime trend data
  const overtimeData = [
    { date: '05/13', critical: 32, high: 390, medium: 4800, low: 5500 },
    { date: '05/14', critical: 33, high: 402, medium: 4850, low: 5520 },
    { date: '05/15', critical: 34, high: 410, medium: 4900, low: 5600 },
    { date: '05/16', critical: 35, high: 415, medium: 4940, low: 5650 },
    { date: '05/17', critical: 35, high: 418, medium: 4960, low: 5670 },
    { date: '05/18', critical: 35, high: 420, medium: 4980, low: 5685 },
    { date: '05/19', critical: 35, high: 420, medium: 4986, low: 5689 },
  ];

  const knownMalwareCount = summary?.intelligence?.known_malware ?? 35;
  const endpointCount = summary?.device_count ?? 3;
  const totalItemCount = summary?.item_count ?? 133;

  return (
    <div className="min-h-full pb-12">
      {/* Topbar */}
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-sm">
            <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Dashboard</span>
          </div>
        }
      />

      <div className="p-6 space-y-6 max-w-[1680px] mx-auto">
        {/* TOP ROW: 5 KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Malware detected (Red border/accent) */}
          <Card highlight="red" className="p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Malware detected</span>
              <div className="flex items-center gap-2.5 mt-2">
                <div className="w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : formatNumber(knownMalwareCount)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-2 border-t border-rose-200/50 dark:border-rose-900/40">
              <Laptop className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Affected endpoints {endpointCount}</span>
            </div>
          </Card>

          {/* Card 2: Open remediations */}
          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Open remediations</span>
            <div className="flex items-center gap-2.5 mt-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                {isLoading ? <Skeleton className="h-8 w-8" /> : '0'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>No open remediation items</span>
            </div>
          </Card>

          {/* Card 3: Auto remediated / last 30d */}
          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Auto remediated / last 30d</span>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                0
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>No auto remediations</span>
            </div>
          </Card>

          {/* Card 4: Open Requests */}
          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Open Requests</span>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                0
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>No open requests</span>
            </div>
          </Card>

          {/* Card 5: Environment (Grouped 3 stats) */}
          <Card className="p-4 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Environment</span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatCompactNumber(totalItemCount)}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1 rounded-xs">
                    +2 new
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">Unique items</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  65K
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">Instances</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {endpointCount}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">Endpoints</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Network className="w-3.5 h-3.5" />
              <span>Live agent collector telemetry</span>
            </div>
          </Card>
        </div>

        {/* SECOND ROW: ITEM TYPES STRIP */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-center gap-3 overflow-x-auto shadow-2xs">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 pr-2 border-r border-slate-200 dark:border-slate-800">
            Item Types
          </span>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => navigate('/inventory?category=browser_extension')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">Extensions</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">9.4K</span>
            </button>

            <button
              onClick={() => navigate('/inventory?category=package')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">Code packages</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">1.5K</span>
            </button>

            <button
              onClick={() => navigate('/inventory?category=package')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <Box className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">OS packages</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">425</span>
            </button>

            <button
              onClick={() => navigate('/inventory?category=ide_extension')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">Applications</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">130</span>
            </button>

            <button
              onClick={() => navigate('/inventory?category=mcp_server')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">MCPs</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">33</span>
            </button>

            <button
              onClick={() => navigate('/inventory?category=ai_model')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">AI Models</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">27</span>
            </button>
          </div>
        </div>

        {/* THIRD ROW: PLATFORMS STRIP (Logos and counts) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-center gap-3 overflow-x-auto shadow-2xs">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 pr-2 border-r border-slate-200 dark:border-slate-800">
            <span>Platforms</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => navigate('/inventory?q=vscode')}
              title="VS Code"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="vscode" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">6.7K</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=chrome')}
              title="Google Chrome"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="chrome" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">1.6K</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=npm')}
              title="npm"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="npm" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">1.2K</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=python')}
              title="Python"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="python" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">369</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=docker')}
              title="Docker"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="docker" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">333</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=git')}
              title="Git"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="git" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">201</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=pypi')}
              title="PyPI"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="pypi" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">143</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=jetbrains')}
              title="JetBrains"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="jetbrains" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">130</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=windsurf')}
              title="Windsurf"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="windsurf" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">113</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=apple')}
              title="macOS"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="apple" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">107</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=edge')}
              title="Edge"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="edge" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">102</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=go')}
              title="Go"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="go" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">100</span>
            </button>

            <button
              onClick={() => navigate('/inventory?q=firefox')}
              title="Firefox"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PlatformLogo platform="firefox" size={16} />
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">40</span>
            </button>

            <span className="px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 text-xs font-semibold bg-slate-100 dark:bg-slate-800 shrink-0">
              +13
            </span>
          </div>
        </div>

        {/* MAIN SPLIT: LEFT (RISK & CHARTS & GOVERNANCE) + RIGHT (INSIGHTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            {/* 4 RISK CARDS ROW */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2.5">
                Risk
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Critical */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Critical</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {summary?.risk?.by_severity?.['critical'] ?? 44}
                      </span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                </div>

                {/* High */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">High</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {summary?.risk?.by_severity?.['high'] ?? 420}
                      </span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                </div>

                {/* Medium */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Medium</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {summary?.risk?.by_severity?.['medium'] ?? '4,986'}
                      </span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>

                {/* Low */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Low</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {summary?.risk?.by_severity?.['low'] ?? '5,689'}
                      </span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                </div>
              </div>
            </div>

            {/* TWO CHARTS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chart 1: Attack surface risk */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Attack surface risk</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>View by</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Item type</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attackSurfaceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#f8fafc' : '#0f172a' }} />
                      <Bar dataKey="low" stackId="a" fill="#0284c7" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="medium" stackId="a" fill="#d97706" />
                      <Bar dataKey="high" stackId="a" fill="#ea580c" />
                      <Bar dataKey="critical" stackId="a" fill="#dc2626" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Critical</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> Low</span>
                </div>
              </Card>

              {/* Chart 2: Risk breakdown overtime */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">Risk breakdown overtime</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Time frame</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Last 7 days</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overtimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: isDarkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderColor: isDarkMode ? '#334155' : '#e2e8f0', color: isDarkMode ? '#f8fafc' : '#0f172a' }} />
                      <Line type="monotone" dataKey="low" stroke="#0284c7" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="medium" stroke="#d97706" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="high" stroke="#ea580c" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Critical</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> Low</span>
                </div>
              </Card>
            </div>

            {/* GOVERNANCE PROGRESS ROW */}
            <Card className="p-5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2">
                Governance
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    53%
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Governed items</span>
                </div>

                <div className="flex-1 max-w-lg">
                  {/* Segmented Progress Bar */}
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                    <div style={{ width: '47%' }} className="bg-emerald-500 h-full" title="Allowed" />
                    <div style={{ width: '6%' }} className="bg-rose-500 h-full" title="Blocked" />
                    <div style={{ width: '47%' }} className="bg-slate-300 dark:bg-slate-600 h-full" title="Ungoverned" />
                  </div>
                  {/* Legend below bar */}
                  <div className="flex items-center justify-between text-xs mt-2 text-slate-600 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                      Allowed 5,199
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-xs bg-rose-500" />
                      Blocked 643
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-xs bg-slate-400 dark:bg-slate-500" />
                      Ungoverned 5,213
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: "INSIGHTS" PANEL */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Insights
            </h2>

            {/* Insight Card 1 */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="blocked" className="text-[11px] gap-1">
                  <AlertOctagon className="w-3 h-3 text-red-600 dark:text-red-400" />
                  Remediation required
                </Badge>
              </div>

              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Malicious activity detected
              </h3>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => navigate('/inventory?q=bert-tiny')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>drhyrum/bert-tiny-torch-vuln</span>
                </button>
                <button
                  onClick={() => navigate('/inventory?q=eicar')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>mcpotato/42-eicar-street</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Manual remediation and immediate investigation is recommended to assess exposure and determine next steps.
              </p>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/inventory?q=drhyrum')}
                  className="text-xs"
                >
                  Investigate
                </Button>
              </div>
            </Card>

            {/* Insight Card 2 */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <SecurityBoostBadge />
                <Badge variant="high" className="gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  High
                </Badge>
              </div>

              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                503 instances flagged as Removed from Marketplace
              </h3>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => navigate('/inventory?q=Papa+Vault')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] flex items-center gap-1 transition-colors font-medium cursor-pointer"
                >
                  Papa Vault
                </button>
                <button
                  onClick={() => navigate('/inventory?q=Screen+Capture')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] flex items-center gap-1 transition-colors font-medium cursor-pointer"
                >
                  Screen Capture - Screenshot Tool
                </button>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                  +47
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Flags items that have been removed or delisted from the marketplace, potentially due to security vulnerabilities, or malicious behavior. Such extensions pose a risk as they are no longer maintained or patched.
              </p>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/inventory?q=Papa+Vault')}
                  className="text-xs"
                >
                  Investigate
                </Button>
              </div>
            </Card>

            {/* Insight Card 3 */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <SecurityBoostBadge />
                <Badge variant="high" className="gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  High
                </Badge>
              </div>

              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                418 instances flagged as Vulnerable to Remote Code Execution
              </h3>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => navigate('/inventory?q=transformers')}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                >
                  transformers
                </button>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                  +29
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Flags dependencies with high-severity RCE CVEs affecting Python or Node runtimes. Prompt patch application recommended.
              </p>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/inventory?q=transformers')}
                  className="text-xs"
                >
                  Investigate
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
