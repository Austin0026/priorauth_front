import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; type?: 'list' | 'card' | 'chart' }> = ({
  rows = 4,
  type = 'list',
}) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-100 rounded w-1/2"></div>
            <div className="h-3 bg-slate-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-slate-100 rounded-full w-20"></div>
        </div>
      ))}
    </div>
  );
};
