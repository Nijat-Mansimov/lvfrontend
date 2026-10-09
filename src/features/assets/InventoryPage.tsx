import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { AssetTable } from './AssetTable';
import { Layers, PlusSquare, Cpu, Terminal, Package, Sparkles } from 'lucide-react';

export function InventoryPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'browser_extension';

  const getCategoryTitle = () => {
    switch (category) {
      case 'browser_extension':
        return 'Extensions';
      case 'ide_extension':
        return 'IDE Extensions & Applications';
      case 'package':
        return 'Code Packages';
      case 'ai_model':
        return 'AI Models';
      case 'mcp_server':
        return 'MCP Servers';
      case 'ai_skill':
        return 'Agentic AI Skills';
      case 'git_repository':
        return 'Git Repositories';
      case 'all':
      default:
        return 'All Items';
    }
  };

  return (
    <div className="min-h-full pb-12">
      {/* Topbar with Breadcrumbs */}
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Inventory</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <PlusSquare className="w-3.5 h-3.5 text-slate-700" />
              {getCategoryTitle()}
            </span>
          </div>
        }
      />

      <div className="p-6 max-w-[1680px] mx-auto">
        <AssetTable defaultCategory={category} />
      </div>
    </div>
  );
}
