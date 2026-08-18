import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, FileEdit, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const norm = (status || '').toLowerCase().trim();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;
  let Icon = Clock;

  if (norm === 'approved' || norm === 'approve') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20';
    label = 'Approved';
    Icon = CheckCircle2;
  } else if (norm === 'denied' || norm === 'deny') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20';
    label = 'Denied';
    Icon = XCircle;
  } else if (norm === 'rfi_requested' || norm === 'request_info' || norm === 'rfi pending') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20';
    label = 'Info Requested (RFI)';
    Icon = AlertTriangle;
  } else if (norm === 'pending_review' || norm === 'pend' || norm === 'urgent red flag pend') {
    bg = 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20';
    label = 'Pended / Review';
    Icon = ShieldAlert;
  } else if (norm === 'in_review' || norm === 'submitted') {
    bg = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20';
    label = norm === 'submitted' ? 'Submitted' : 'In Review';
    Icon = Clock;
  } else if (norm === 'draft') {
    bg = 'bg-slate-100 text-slate-700 border-slate-300';
    label = 'Draft';
    Icon = FileEdit;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
