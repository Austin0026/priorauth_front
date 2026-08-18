import React from 'react';
import { useProvider } from '../../context/ProviderContext';
import { Stethoscope, Bell, Sparkles, Activity, RefreshCw } from 'lucide-react';

export const ProviderHeader: React.FC = () => {
  const { backendOnline, refreshBackendStatus, notifications, setActiveTab } = useProvider();
  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / App Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">CarePoint</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                PROVIDER PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Prior Authorization Decision Support</p>
          </div>
        </div>

        {/* Right: Quick Actions & Status */}
        <div className="flex items-center gap-3">
          {/* Backend Connectivity Indicator */}
          <button
            onClick={refreshBackendStatus}
            title={backendOnline ? 'Backend Connected (FastAPI)' : 'Offline / Demo Mode (Mock Engine Active)'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              backendOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{backendOnline ? 'API Connected' : 'Demo Mode'}</span>
            <RefreshCw size={11} className="opacity-60 hover:opacity-100" />
          </button>

          {/* CMS Policy Rule Engine Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
            <Sparkles size={13} className="text-indigo-600" />
            <span>CMS Rules v4.2</span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveTab('tracker')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Provider Profile Summary */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              SL
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">Dr. Sarah Lin, MD</div>
              <div className="text-[10px] text-slate-500">Orthopedic Spine &bull; NPI 1928374650</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
