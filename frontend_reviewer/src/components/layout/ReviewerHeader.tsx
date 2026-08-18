import React from 'react';
import { useReviewer } from '../../context/ReviewerContext';
import { ShieldAlert, Bell, Activity, RefreshCw, Sparkles, UserCheck } from 'lucide-react';

export const ReviewerHeader: React.FC = () => {
  const { backendOnline, refreshBackendStatus, notifications, queueCounts, reviewerProfile, setActiveTab } = useReviewer();
  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="clinical-brand-mark w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
            <ShieldAlert size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">CarePoint</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                CLINICAL REVIEW
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Prior Authorization Clinical Review</p>
          </div>
        </div>

        {/* Live Status & Reviewer Profile */}
        <div className="flex items-center gap-3">
          {/* Urgent Queue Counter Pill */}
          {queueCounts.urgent > 0 && (
            <button
              onClick={() => setActiveTab('queue')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{queueCounts.urgent} STAT / Red Flag</span>
            </button>
          )}

          {/* Backend Connection */}
          <button
            onClick={refreshBackendStatus}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              backendOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
            title={backendOnline ? 'FastAPI API Connected' : 'Demo Mode Active'}
          >
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{backendOnline ? 'Engine Online' : 'Mock Mode'}</span>
            <RefreshCw size={11} className="opacity-70 hover:opacity-100" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveTab('queue')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Reviewer Profile */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              AV
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">{reviewerProfile.name}</div>
              <div className="text-[10px] text-slate-500">{reviewerProfile.queueRole}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
