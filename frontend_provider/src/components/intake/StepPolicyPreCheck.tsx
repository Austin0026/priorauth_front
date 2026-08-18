import React from 'react';
import { PreCheckAssessment, CriterionStatus } from '../../types/criteria';
import { ReadinessScoreGauge } from '../common/ReadinessScoreGauge';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, BookOpen, AlertOctagon } from 'lucide-react';

interface StepPolicyPreCheckProps {
  preCheck: PreCheckAssessment;
}

export const StepPolicyPreCheck: React.FC<StepPolicyPreCheckProps> = ({ preCheck }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Step 4: Real-Time Policy Pre-Check</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Deterministic compliance audit against active CMS Local Coverage Determination (LCD L34220).
        </p>
      </div>

      {/* Readiness Gauge Banner */}
      <ReadinessScoreGauge
        score={preCheck.readinessPercentage}
        label={preCheck.readinessLabel}
        passedCount={preCheck.passedCount}
        totalCount={preCheck.totalCount}
      />

      {/* Red Flags / Emergency Warnings */}
      {preCheck.redFlagAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-purple-800">
            <AlertOctagon size={16} />
            <span>Emergency Red Flag Protocol Active</span>
          </div>
          {preCheck.redFlagAlerts.map((msg, i) => (
            <p key={i} className="text-purple-700">{msg}</p>
          ))}
        </div>
      )}

      {/* Missing Items & Warnings */}
      {preCheck.warningAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle size={16} />
            <span>Documentation Warnings Detected</span>
          </div>
          {preCheck.warningAlerts.map((msg, i) => (
            <p key={i} className="text-amber-700">&bull; {msg}</p>
          ))}
        </div>
      )}

      {/* Policy Criteria Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-600" />
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {preCheck.activePolicyLabel || 'CMS LCD L34220 Requirements Checklist'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            {preCheck.passedCount} of {preCheck.totalCount} checks met
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {preCheck.criteriaResults.map((c) => {
            const isSatisfied = (c.status as any) === CriterionStatus.SATISFIED || (c.status as any) === 'SATISFIED';
            const isWaived = (c.status as any) === CriterionStatus.NOT_APPLICABLE || (c.status as any) === 'NOT_APPLICABLE';

            return (
              <div key={c.criterion_id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">{c.description}</span>
                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {c.criterion_id}
                    </span>
                    {c.is_critical && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {c.evidence_summary}
                  </p>
                  {c.policy_reference && (
                    <div className="text-[10px] text-slate-400 font-medium">
                      Reference: {c.policy_reference}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {isSatisfied ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      <CheckCircle2 size={13} /> Met
                    </span>
                  ) : isWaived ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                      Waived
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      <XCircle size={13} /> Unmet
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
