import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CopyButtonProps {
  value: string;
  className?: string;
  size?: 'sm' | 'md';
  label?: string;
}

export function CopyButton({ value, className, size = 'sm', label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
      className={cn(
        'inline-flex items-center gap-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {label && <span>{copied ? 'Copied' : label}</span>}
    </button>
  );
}
