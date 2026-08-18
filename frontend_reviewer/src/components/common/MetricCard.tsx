import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  change,
  trend,
  icon: Icon,
  variant = 'primary',
}) => {
  const iconVariants = {
    primary: 'bg-sky-50 text-sky-600 border-sky-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    danger: 'bg-rose-50 text-rose-600 border-rose-200',
    info: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-subtle space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconVariants[variant]}`}>
          <Icon size={18} />
        </div>
      </div>

      <div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {(subValue || change) && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
            {change && (
              <span
                className={`font-semibold ${
                  trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500'
                }`}
              >
                {change}
              </span>
            )}
            {subValue && <span>{subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
