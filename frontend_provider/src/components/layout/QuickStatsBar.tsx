import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface QuickStatsBarProps {
  approvedCount?: number;
  inReviewCount?: number;
  rfiCount?: number;
  pendedCount?: number;
}

export const QuickStatsBar: React.FC<QuickStatsBarProps> = ({
  approvedCount = 14,
  inReviewCount = 3,
  rfiCount = 1,
  pendedCount = 1,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 leading-tight">{approvedCount}</div>
          <div className="text-xs text-slate-500 font-medium">Approved PAs (MTD)</div>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Clock size={20} />
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900 leading-tight">{inReviewCount}</div>
          <div className="text-xs text-slate-500 font-medium">Under Active Review</div>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="text-xl font-bold text-amber-700 leading-tight">{rfiCount}</div>
          <div className="text-xs text-slate-500 font-medium">RFI Info Needed</div>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <div className="text-xl font-bold text-purple-700 leading-tight">{pendedCount}</div>
          <div className="text-xs text-slate-500 font-medium">Urgent / Pended</div>
        </div>
      </div>
    </div>
  );
};
