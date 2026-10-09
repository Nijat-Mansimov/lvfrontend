import React from 'react';
import { isMockMode } from '@/api/client';
import { Badge } from '@/components/ui/Badge';
import { Database, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/theme';

export interface TopbarProps {
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Topbar({ breadcrumbs, actions }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <header className="h-14 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-3">
        {breadcrumbs}
      </div>

      <div className="flex items-center gap-3">
        {isMockMode && (
          <Badge variant="neutral" className="gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 font-medium">
            <Database className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Mock data
          </Badge>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          aria-label={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
        {actions}
      </div>
    </header>
  );
}
