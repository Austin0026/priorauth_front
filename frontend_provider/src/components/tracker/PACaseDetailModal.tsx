import React, { useState, useEffect } from 'react';
import { fetchCaseDecision } from '../../services/paCaseService';
import { DecisionResponse } from '../../types/case';
import { StatusBadge } from '../common/StatusBadge';
import { X, ShieldCheck, FileText, CheckCircle2, XCircle, AlertTriangle, Printer, Sparkles } from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface PACaseDetailModalProps {
  caseId: string;
  onClose: () => void;
  onOpenRFI?: () => void;
}

export const PACaseDetailModal: React.FC<PACaseDetailModalProps> = ({
  caseId,
  onClose,
  onOpenRFI,
}) => {
  const [decision, setDecision] = useState<DecisionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseDecision(caseId)
      .then(setDecision)
      .finally(() => setLoading(false));
  }, [caseId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Prior Auth Case Determination</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {caseId}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Deterministic Rule Engine &amp; CMS Policy Audit Trail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
              title="Print Determination Letter"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {loading || !decision ? (
            <LoadingSkeleton rows={5} />
          ) : (
            <>
              {/* Determination Banner */}
              <div className="p-5 rounded-xl border bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Official Determination
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={decision.outcome} size="lg" />
                    <span className="text-slate-500 text-xs">
                      Evaluated: {new Date(decision.evaluated_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Engine Version</span>
                  <span className="font-semibold text-slate-700">{decision.evaluator_version}</span>
                </div>
              </div>

              {/* Rationale & Decision Message */}
              {decision.message && (
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span>Decision Rationale &amp; Clinical Summary</span>
                  </div>
                  <p className="text-indigo-800 leading-relaxed">{decision.message}</p>
                </div>
              )}

              {/* Criteria Breakdown */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  CMS Policy Criteria Breakdown (LCD L34220)
                </h3>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {decision.criteria.map((c) => {
                    const isSatisfied = c.status === 'SATISFIED';
                    const isWaived = c.status === 'NOT_APPLICABLE';

                    return (
                      <div key={c.criterion_id} className="p-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{c.description}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {c.criterion_id}
                            </span>
                          </div>
                          <p className="text-slate-600">{c.evidence_summary || c.reason}</p>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] shrink-0 ${
                            isSatisfied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isWaived
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Policy References */}
              {decision.policy_refs && decision.policy_refs.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Linked CMS Policies
                  </h4>
                  <div className="space-y-1">
                    {decision.policy_refs.map((p, idx) => (
                      <div key={idx} className="text-slate-600">
                        &bull; <strong>{p.lcd_id || p.article_id}:</strong> {p.lcd_title || p.article_title || 'Lumbar Spine MRI Coverage Policy'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close
          </button>

          {decision && (decision.outcome === 'REQUEST_INFO' || decision.outcome === 'rfi_requested') && onOpenRFI && (
            <button onClick={onOpenRFI} className="btn-primary text-xs bg-amber-600 hover:bg-amber-700">
              <FileText size={14} />
              <span>Submit Additional Info (RFI)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
