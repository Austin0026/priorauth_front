import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

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
    bg = 'bg-sky-50 text-sky-700 border-sky-200 ring-1 ring-sky-500/20';
    label = norm === 'submitted' ? 'Submitted' : 'In Review';
    Icon = Clock;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono uppercase font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 15,
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
