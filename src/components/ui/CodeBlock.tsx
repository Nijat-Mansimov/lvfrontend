import React from 'react';
import { CopyButton } from './CopyButton';
import { cn } from '@/lib/cn';

export interface CodeBlockProps {
  code: string;
  lineStart?: number;
  lineEnd?: number;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, lineStart, filename, className }: CodeBlockProps) {
  const lines = code.split('\n');
  const startNum = lineStart ?? 1;

  return (
    <div className={cn('rounded-lg border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden text-xs', className)}>
      {filename && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono text-slate-400">
          <span>{filename}</span>
          <CopyButton value={code} className="text-slate-400 hover:text-slate-200 hover:bg-slate-800" />
        </div>
      )}
      <div className="relative p-3 overflow-x-auto font-mono flex gap-4 text-xs leading-relaxed">
        {/* Line numbers */}
        <div className="select-none text-right text-slate-500 pr-2 border-r border-slate-800 flex flex-col shrink-0 tabular-nums">
          {lines.map((_, idx) => (
            <span key={idx}>{startNum + idx}</span>
          ))}
        </div>
        {/* Code body (Strictly text only - NO dangerouslySetInnerHTML) */}
        <pre className="flex-1 whitespace-pre m-0 p-0 overflow-visible text-slate-200">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
