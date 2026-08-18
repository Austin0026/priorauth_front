import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface ReadinessScoreGaugeProps {
  score: number; // 0 to 100
  label: string;
  passedCount?: number;
  totalCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ReadinessScoreGauge: React.FC<ReadinessScoreGaugeProps> = ({
  score,
  label,
  passedCount,
  totalCount,
  size = 'md',
}) => {
  const clampedScore = Math.min(100, Math.max(0, score));

  // Determine styling
  let strokeColor = '#16a34a'; // green
  let bgColor = 'bg-emerald-50 text-emerald-900 border-emerald-200';
  let badgeColor = 'bg-emerald-600 text-white';
  let Icon = ShieldCheck;

  if (label.includes('URGENT') || label.includes('HIGH RISK')) {
    strokeColor = '#dc2626'; // red
    bgColor = 'bg-rose-50 text-rose-950 border-rose-200';
    badgeColor = 'bg-rose-600 text-white';
    Icon = AlertOctagon;
  } else if (label.includes('MODERATE') || label.includes('RFI')) {
    strokeColor = '#d97706'; // amber
    bgColor = 'bg-amber-50 text-amber-950 border-amber-200';
    badgeColor = 'bg-amber-600 text-white';
    Icon = AlertTriangle;
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className={`p-4 rounded-xl border flex items-center gap-4 ${bgColor} transition-all`}>
      <div className="relative shrink-0 flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={strokeColor}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
            {clampedScore}%
          </span>
          <span className="text-[10px] font-medium text-slate-500 uppercase mt-0.5">Readiness</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeColor}`}>
            {label}
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {totalCount !== undefined && passedCount !== undefined
            ? `${passedCount} of ${totalCount} clinical policy checks satisfied`
            : 'Pre-check evaluation based on CMS LCD L34220 rules'}
        </p>
      </div>
    </div>
  );
};
