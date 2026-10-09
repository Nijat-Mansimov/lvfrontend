import { describe, it, expect } from 'vitest';
import { getSeverityFromScore, getVerdictLabel, getSeverityLabel } from '@/lib/severity';
import { formatCompactNumber, formatNumber } from '@/lib/formatting';

describe('Severity Helpers', () => {
  it('correctly categorizes scores into severity bands', () => {
    expect(getSeverityFromScore(95)).toBe('critical');
    expect(getSeverityFromScore(80)).toBe('critical');
    expect(getSeverityFromScore(75)).toBe('high');
    expect(getSeverityFromScore(50)).toBe('high');
    expect(getSeverityFromScore(35)).toBe('medium');
    expect(getSeverityFromScore(20)).toBe('medium');
    expect(getSeverityFromScore(15)).toBe('low');
    expect(getSeverityFromScore(1)).toBe('low');
    expect(getSeverityFromScore(0)).toBe('informational');
    expect(getSeverityFromScore(null)).toBe('not_analyzed');
  });

  it('translates verdicts to correct SOC analyst copy', () => {
    expect(getVerdictLabel('known_malware')).toBe('Known malware');
    expect(getVerdictLabel('high_priority_review')).toBe('High priority review');
    expect(getVerdictLabel('needs_review')).toBe('Needs review');
    expect(getVerdictLabel('no_known_threat')).toBe('No known threat');
  });

  it('formats compact and regular numbers correctly', () => {
    expect(formatCompactNumber(9400)).toBe('9.4K');
    expect(formatCompactNumber(65000)).toBe('65K');
    expect(formatCompactNumber(1200000)).toBe('1.2M');
    expect(formatCompactNumber(42)).toBe('42');
    expect(formatNumber(58855)).toBe('58,855');
  });
});
