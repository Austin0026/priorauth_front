import React, { useState, useEffect } from 'react';
import { fetchCaseDetail } from '../../services/reviewerCaseService';
import { CaseDetail } from '../../types/reviewer';
import { useReviewer } from '../../context/ReviewerContext';
import { ClinicalArtifactsViewer } from './ClinicalArtifactsViewer';
import { PolicyEvaluationPanel } from './PolicyEvaluationPanel';
import { AdjudicationActionPanel } from './AdjudicationActionPanel';
import { AuditTimelineTab } from './AuditTimelineTab';
import { StatusBadge } from '../common/StatusBadge';
import { ArrowLeft, Clock, ShieldAlert, FileText, KeyRound, CheckCircle2, AlertOctagon } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';

export const CaseWorkspace: React.FC = () => {
  const { selectedCaseId, setActiveTab } = useReviewer();
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'evidence' | 'audit'>('evidence');

  useEffect(() => {
    if (selectedCaseId) {
      loadCase(selectedCaseId);
    }
  }, [selectedCaseId]);

  const loadCase = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchCaseDetail(id);
      setCaseDetail(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !caseDetail) {
    return (
      <div className="space-y-6">
        <button onClick={() => setActiveTab('queue')} className="btn-command-secondary text-xs">
          <ArrowLeft size={16} /> Back to Review Queue
        </button>
        <LoadingState message="Loading clinical records and deterministic criteria checklist..." />
      </div>
    );
  }

  const isStat = caseDetail.urgency === 'stat' || caseDetail.red_flags_present;

  return (
    <div className="space-y-6">
      {/* Top Bar with Navigation & Case ID */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActiveTab('queue')}
          className="btn-command-secondary text-xs self-start"
        >
          <ArrowLeft size={16} />
          <span>Back to Worklist</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveWorkspaceTab('evidence')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeWorkspaceTab === 'evidence'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText size={14} />
              <span>Clinical Evidence &amp; Policy</span>
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('audit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeWorkspaceTab === 'audit'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <KeyRound size={14} />
              <span>Audit Hash Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case Header Banner */}
      <div
        className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-card ${
          isStat ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Case: {caseDetail.case_id}
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {caseDetail.patient_name}
              </h1>
              <StatusBadge status={caseDetail.outcome || caseDetail.status} size="md" />
              {isStat && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1 animate-pulse">
                  <AlertOctagon size={13} />
                  <span>STAT RED FLAG PEND</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600">
              <div>
                <strong className="text-slate-800">Procedure:</strong> CPT {caseDetail.cpt_code} - {caseDetail.cpt_description}
              </div>
              <div>
                <strong className="text-slate-800">Diagnosis:</strong> ICD-10 {caseDetail.icd10_code} ({caseDetail.icd10_description})
              </div>
              <div>
                <strong className="text-slate-800">Member ID:</strong> <span className="font-mono">{caseDetail.patient_id}</span>
              </div>
            </div>
          </div>

          {/* SLA Countdown Timer */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-4 text-xs shrink-0 self-start lg:self-center">
            <Clock size={20} className={isStat ? 'text-rose-600' : 'text-amber-600'} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Adjudication SLA Deadline</div>
              <div className="font-bold text-slate-900 text-sm">
                {caseDetail.sla_deadline ? new Date(caseDetail.sla_deadline).toLocaleString() : '72-Hour Standard SLA'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      {activeWorkspaceTab === 'evidence' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            {/* Left Pane: Attached Documents, Imaging & EHR Narrative */}
            <ClinicalArtifactsViewer caseDetail={caseDetail} />

            {/* Right Pane: Policy Checklist & RAG Grounding */}
            <PolicyEvaluationPanel caseDetail={caseDetail} />
          </div>

          {/* Bottom Pane: Reviewer Determination Action Bar */}
          <AdjudicationActionPanel
            caseDetail={caseDetail}
            onDeterminationUpdated={(updated) => setCaseDetail(updated)}
          />
        </div>
      ) : (
        <AuditTimelineTab caseId={caseDetail.case_id} />
      )}
    </div>
  );
};
