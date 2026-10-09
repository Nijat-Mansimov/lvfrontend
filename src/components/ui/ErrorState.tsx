import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { CopyButton } from './CopyButton';
import { cn } from '@/lib/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  requestId?: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this view. Please try again.',
  requestId,
  code,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-red-200/80 rounded-xl bg-red-50/20 max-w-lg mx-auto my-6',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{message}</p>

      {(code || requestId) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-[11px] font-mono text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
          {code && <span>Code: {code}</span>}
          {requestId && (
            <span className="flex items-center gap-1">
              Req ID: <span className="text-slate-800">{requestId}</span>
              <CopyButton value={requestId} size="sm" />
            </span>
          )}
        </div>
      )}

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
