import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { AlertNotification } from '../../types/common';

interface ToastAlertProps {
  notifications: AlertNotification[];
  onDismiss: (id: string) => void;
  onNavigate?: (tab: any, id?: string) => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({ notifications, onDismiss, onNavigate }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {notifications.map((n) => {
        let bg = 'bg-slate-900 text-white border-slate-800';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (n.type === 'success') {
          bg = 'bg-emerald-900/95 text-white border-emerald-700/50';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-300';
        } else if (n.type === 'warning') {
          bg = 'bg-amber-900/95 text-white border-amber-700/50';
          Icon = AlertTriangle;
          iconColor = 'text-amber-300';
        } else if (n.type === 'danger') {
          bg = 'bg-rose-900/95 text-white border-rose-700/50';
          Icon = AlertCircle;
          iconColor = 'text-rose-300';
        }

        return (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${bg}`}
          >
            <Icon size={18} className={`shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold tracking-tight">{n.title}</h4>
                <span className="text-[10px] text-slate-300/80">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-snug">{n.message}</p>
              {n.linkTab && onNavigate && (
                <button
                  onClick={() => onNavigate(n.linkTab, n.linkId)}
                  className="mt-2 text-xs font-semibold underline hover:text-white transition-colors"
                >
                  View in {n.linkTab === 'tracker' ? 'PA Tracker' : n.linkTab} &rarr;
                </button>
              )}
            </div>
            <button
              onClick={() => onDismiss(n.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
