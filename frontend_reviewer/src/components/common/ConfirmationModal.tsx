import React from 'react';
import { X, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionLabel: string;
  actionVariant?: 'success' | 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  actionLabel,
  actionVariant = 'primary',
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  const btnClasses = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white',
  };

  const Icon =
    actionVariant === 'danger'
      ? AlertOctagon
      : actionVariant === 'warning'
      ? AlertTriangle
      : CheckCircle2;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              actionVariant === 'danger'
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : actionVariant === 'warning'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-sky-950 text-sky-400 border border-sky-800'
            }`}
          >
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 text-xs font-bold rounded-lg shadow transition-colors ${btnClasses[actionVariant]}`}
          >
            {isProcessing ? 'Recording...' : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
