import React from 'react';
import { CaseDetail, CriterionResult } from '../../types/reviewer';
import { BookOpen, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';

interface PolicyEvaluationPanelProps {
  caseDetail: CaseDetail;
}

export const PolicyEvaluationPanel: React.FC<PolicyEvaluationPanelProps> = ({ caseDetail }) => {
  const criteria = caseDetail.criteria || [];
  const confidence = caseDetail.ai_confidence_score ? Math.round(caseDetail.ai_confidence_score * 100) : 95;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-sky-400" />
          <span className="font-bold text-white text-xs uppercase tracking-wider">
            Deterministic Policy Engine Evaluation
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
          LCD L34220
        </span>
      </div>

      {/* Body */}
      <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
        {/* Engine Verdict Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Recommendation
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {caseDetail.evaluator_version}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                caseDetail.outcome === 'APPROVE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : caseDetail.outcome === 'REQUEST_INFO'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-purple-950 text-purple-300 border border-purple-800'
              }`}
            >
              {caseDetail.outcome || caseDetail.status}
            </span>
            <span className="text-slate-400 text-[11px]">
              Grounding Confidence: <strong className="text-white">{confidence}%</strong>
            </span>
          </div>

          {caseDetail.message && (
            <p className="text-slate-300 text-xs leading-relaxed pt-1 border-t border-slate-800/80">
              {caseDetail.message}
            </p>
          )}
        </div>

        {/* Criteria Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Coverage Criteria Evaluation
            </span>
            <span className="text-[10px] text-slate-500">
              {criteria.filter((c) => c.status === 'SATISFIED' || c.status === 'NOT_APPLICABLE').length} of {criteria.length} passed
            </span>
          </div>

          <div className="space-y-2.5">
            {criteria.map((c) => {
              const isSat = c.status === 'SATISFIED';
              const isWaived = c.status === 'NOT_APPLICABLE';

              return (
                <div
                  key={c.criterion_id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{c.description}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                          {c.criterion_id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.evidence_summary || c.reason}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isSat ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                          <CheckCircle2 size={12} /> Satisfied
                        </span>
                      ) : isWaived ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 font-bold">
                          Waived
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                          <XCircle size={12} /> Unmet
                        </span>
                      )}
                    </div>
                  </div>

                  {c.policy_reference && (
                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Ref: {c.policy_reference}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Policy References Citations */}
        {caseDetail.policy_refs && caseDetail.policy_refs.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Authoritative CMS Policies
            </span>
            <div className="space-y-1 text-slate-300">
              {caseDetail.policy_refs.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span>
                    &bull; <strong>{p.lcd_id || p.article_id}:</strong> {p.lcd_title || p.article_title}
                  </span>
                  <ExternalLink size={12} className="text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
