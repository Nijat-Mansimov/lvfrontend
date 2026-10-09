import React from 'react';
import { cn } from '@/lib/cn';
import { AlertOctagon, AlertTriangle, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { Severity } from '@/lib/severity';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'informational' | 'blocked' | 'ungoverned' | 'allowed' | 'security_boost' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'neutral', size = 'sm', children, ...props }: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 rounded-md gap-1.5 font-medium',
  };

  const variantStyles = {
    critical: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200/80 dark:border-red-900/60',
    high: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200/80 dark:border-orange-900/60',
    medium: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60',
    low: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200/80 dark:border-sky-900/60',
    informational: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    blocked: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 font-semibold',
    ungoverned: 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700',
    allowed: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-semibold',
    security_boost: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-900/60',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0 leading-none whitespace-nowrap',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity | string;
  className?: string;
}) {
  const s = (severity || '').toLowerCase();
  if (s === 'critical') {
    return (
      <Badge variant="critical" className={cn('gap-1', className)}>
        <AlertOctagon className="w-3 h-3 text-red-600 dark:text-red-400" />
        Critical
      </Badge>
    );
  }
  if (s === 'high') {
    return (
      <Badge variant="high" className={cn('gap-1', className)}>
        <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
        High
      </Badge>
    );
  }
  if (s === 'medium') {
    return (
      <Badge variant="medium" className={cn('gap-1', className)}>
        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
        Med
      </Badge>
    );
  }
  if (s === 'low') {
    return (
      <Badge variant="low" className={cn('gap-1', className)}>
        <AlertTriangle className="w-3 h-3 text-sky-600 dark:text-sky-400" />
        Low
      </Badge>
    );
  }
  return (
    <Badge variant="informational" className={className}>
      Info
    </Badge>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'blocked') {
    return (
      <Badge variant="blocked" className={cn('gap-1', className)}>
        <span className="w-1.5 h-1.5 rounded-xs bg-red-600 dark:bg-red-400" />
        Blocked
      </Badge>
    );
  }
  if (s === 'allowed') {
    return (
      <Badge variant="allowed" className={cn('gap-1', className)}>
        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        Allowed
      </Badge>
    );
  }
  return (
    <Badge variant="ungoverned" className={cn('gap-1.5', className)}>
      <span className="w-2 h-2 rounded-full border border-dashed border-slate-400 dark:border-slate-500" />
      Ungoverned
    </Badge>
  );
}

export function SecurityBoostBadge({ className }: { className?: string }) {
  return (
    <Badge variant="security_boost" className={cn('gap-1', className)}>
      <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
      Security boost
    </Badge>
  );
}
