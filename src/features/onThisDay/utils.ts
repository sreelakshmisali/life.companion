import { toDateKey } from '@/utils/date';

interface LookbackDef {
  key: string;
  label: string;
  days: number;
}

/** Approximate but readable — this is a cozy journal, not a calendar app,
 * so "a month ago" means 30 days rather than fussing over month lengths. */
const LOOKBACKS: LookbackDef[] = [
  { key: 'week', label: 'A week ago', days: 7 },
  { key: 'month', label: 'A month ago', days: 30 },
  { key: 'year', label: 'A year ago', days: 365 },
];

export function getLookbackTargets(): { key: string; label: string; dateKey: string; dateLabel: string }[] {
  return LOOKBACKS.map(({ key, label, days }) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return {
      key,
      label,
      dateKey: toDateKey(d),
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  });
}
