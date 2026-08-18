import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading case details and deterministic policy audit trail...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
      <div className="w-10 h-10 rounded-full bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center animate-spin">
        <Sparkles size={20} />
      </div>
      <p className="text-xs font-semibold text-slate-300">{message}</p>
    </div>
  );
};
