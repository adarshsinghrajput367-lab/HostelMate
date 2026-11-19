import { AlertTriangle, Building2, ShieldCheck } from 'lucide-react';
import { InformationStatus } from '../../types';

interface StatusBadgeProps {
  status: InformationStatus;
  compact?: boolean;
}

export function InformationStatusBadge({ status, compact = false }: StatusBadgeProps) {
  if (status === 'checked_by_hostelmate') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md whitespace-nowrap">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
        <span>{compact ? 'Checked by HostelMate' : 'Checked by HostelMate'}</span>
      </span>
    );
  }

  if (status === 'operator_provided') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md whitespace-nowrap">
        <Building2 className="w-3.5 h-3.5 shrink-0 text-teal-700" aria-hidden="true" />
        <span>Provided by operator</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md whitespace-nowrap">
      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700" aria-hidden="true" />
      <span>{compact ? 'Sample data (unverified)' : 'Sample data — not verified'}</span>
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'teal' | 'amber' | 'emerald' | 'rose';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    teal: 'bg-teal-50 text-teal-800 border-teal-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border whitespace-nowrap ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
