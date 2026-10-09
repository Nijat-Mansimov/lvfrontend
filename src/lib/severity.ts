export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational' | 'not_analyzed';

export type Verdict = 'known_malware' | 'high_priority_review' | 'needs_review' | 'no_known_threat';

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  informational: 4,
  not_analyzed: 5,
};

export function getSeverityFromScore(score: number | null | undefined): Severity {
  if (score === null || score === undefined) return 'not_analyzed';
  if (score >= 80) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 20) return 'medium';
  if (score >= 1) return 'low';
  return 'informational';
}

export function getSeverityLabel(severity: Severity | string): string {
  switch (severity) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    case 'informational':
      return 'Info';
    case 'not_analyzed':
      return 'Not Analyzed';
    default:
      return severity;
  }
}

export function getVerdictLabel(verdict: Verdict | string | null | undefined): string {
  switch (verdict) {
    case 'known_malware':
      return 'Known malware';
    case 'high_priority_review':
      return 'High priority review';
    case 'needs_review':
      return 'Needs review';
    case 'no_known_threat':
      return 'No known threat';
    default:
      return 'Pending assessment';
  }
}

export function getSeverityBadgeStyles(severity: Severity | string): {
  bg: string;
  text: string;
  border: string;
  indicator: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-50 text-red-700',
        text: 'text-red-700',
        border: 'border-red-200',
        indicator: 'bg-red-600',
      };
    case 'high':
      return {
        bg: 'bg-orange-50 text-orange-700',
        text: 'text-orange-700',
        border: 'border-orange-200',
        indicator: 'bg-orange-500',
      };
    case 'medium':
      return {
        bg: 'bg-amber-50 text-amber-800',
        text: 'text-amber-800',
        border: 'border-amber-200',
        indicator: 'bg-amber-500',
      };
    case 'low':
      return {
        bg: 'bg-sky-50 text-sky-700',
        text: 'text-sky-700',
        border: 'border-sky-200',
        indicator: 'bg-sky-500',
      };
    case 'informational':
    default:
      return {
        bg: 'bg-slate-50 text-slate-700',
        text: 'text-slate-700',
        border: 'border-slate-200',
        indicator: 'bg-slate-400',
      };
  }
}
