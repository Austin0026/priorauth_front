import React, { useState } from 'react';
import { CaseDetail, ReviewAction } from '../../types/reviewer';
import { submitAdjudicationDetermination } from '../../services/reviewerCaseService';
import { useReviewer } from '../../context/ReviewerContext';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { CheckCircle2, XCircle, AlertTriangle, ShieldAlert, Send, Sparkles } from 'lucide-react';

interface AdjudicationActionPanelProps {
  caseDetail: CaseDetail;
  onDeterminationUpdated: (updated: CaseDetail) => void;
}

export const AdjudicationActionPanel: React.FC<AdjudicationActionPanelProps> = ({
  caseDetail,
  onDeterminationUpdated,
}) => {
  const { reviewerProfile } = useReviewer();
  const [selectedAction, setSelectedAction] = useState<ReviewAction>('approve');
  const [rationaleNotes, setRationaleNotes] = useState<string>(
    'Clinical review confirms emergency exception criteria under LCD L34220 Section B.4 due to acute Cauda Equina presentation. Immediate Lumbar MRI authorized.'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExecuteDetermination = async () => {
    setIsSubmitting(true);
    try {
      const updated = await submitAdjudicationDetermination(caseDetail.case_id, {
        reviewer_id: reviewerProfile.id,
        action: selectedAction,
        notes: rationaleNotes,
      });
      setIsModalOpen(false);
      onDeterminationUpdated(updated);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalConfig = () => {
    switch (selectedAction) {
      case 'approve':
        return {
          title: 'Confirm Authorization Approval',
          message: `Are you sure you want to issue prior authorization approval for ${caseDetail.patient_name} (CPT ${caseDetail.cpt_code})?`,
          actionLabel: 'Issue Approval',
          actionVariant: 'success' as const,
        };
      case 'deny':
        return {
          title: 'Confirm Adverse Determination (Denial)',
          message: `Are you sure you want to issue a formal coverage denial for ${caseDetail.patient_name}? Adverse determination letters will be generated.`,
          actionLabel: 'Confirm Denial',
          actionVariant: 'danger' as const,
        };
      case 'request_info':
        return {
          title: 'Dispatch Formal RFI Notice',
          message: `Are you sure you want to request additional documentation from the ordering provider? SLA deadline will pause.`,
          actionLabel: 'Dispatch RFI',
          actionVariant: 'warning' as const,
        };
      case 'maintain_pend':
        return {
          title: 'Maintain Pend / Route for Specialty Review',
          message: `Are you sure you want to maintain PEND status for senior medical director peer review?`,
          actionLabel: 'Maintain PEND',
          actionVariant: 'primary' as const,
        };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-xl p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-white text-sm">Adjudication Action Console</h3>
          <p className="text-slate-400 text-[11px]">
            Reviewer: <strong className="text-slate-200">{reviewerProfile.name}</strong> ({reviewerProfile.title})
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          Case: {caseDetail.case_id}
        </span>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => {
            setSelectedAction('approve');
            setRationaleNotes('Clinical criteria satisfied. Prior authorization issued for Lumbar MRI (CPT 72148).');
          }}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            selectedAction === 'approve'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 size={18} className={selectedAction === 'approve' ? 'text-emerald-400' : 'text-slate-500'} />
          <span>Approve Case</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedAction('deny');
            setRationaleNotes('Coverage criteria unmet per LCD L34220 Section B.1. Lack of documented 6-week conservative care trial.');
          }}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            selectedAction === 'deny'
              ? 'bg-rose-950/90 text-rose-300 border-rose-600 ring-2 ring-rose-500/20 shadow-md font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <XCircle size={18} className={selectedAction === 'deny' ? 'text-rose-400' : 'text-slate-500'} />
          <span>Deny Coverage</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedAction('request_info');
            setRationaleNotes('Requesting documentation of 6-week conservative physical therapy and prior plain lumbar radiograph report.');
          }}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            selectedAction === 'request_info'
              ? 'bg-amber-950/90 text-amber-300 border-amber-600 ring-2 ring-amber-500/20 shadow-md font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle size={18} className={selectedAction === 'request_info' ? 'text-amber-400' : 'text-slate-500'} />
          <span>Request Info (RFI)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedAction('maintain_pend');
            setRationaleNotes('Maintaining PEND status. Case escalated to Senior Medical Director for peer-to-peer review.');
          }}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
            selectedAction === 'maintain_pend'
              ? 'bg-sky-950/90 text-sky-300 border-sky-600 ring-2 ring-sky-500/20 shadow-md font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert size={18} className={selectedAction === 'maintain_pend' ? 'text-sky-400' : 'text-slate-500'} />
          <span>Maintain PEND</span>
        </button>
      </div>

      {/* Reviewer Rationale Notes */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Reviewer Determination Clinical Rationale &amp; Audit Trail Notes
        </label>
        <textarea
          rows={3}
          value={rationaleNotes}
          onChange={(e) => setRationaleNotes(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
          placeholder="Document the exact clinical reasoning, LCD policy clauses, or peer discussion notes..."
        />
      </div>

      {/* Confirm & Submit Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-500">
          Overrides are cryptographically hashed and logged to the audit repository.
        </span>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
            selectedAction === 'approve'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : selectedAction === 'deny'
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : selectedAction === 'request_info'
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-sky-600 hover:bg-sky-500 text-white'
          }`}
        >
          <Send size={15} />
          <span>Confirm Adjudication Determination</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        actionLabel={modalConfig.actionLabel}
        actionVariant={modalConfig.actionVariant}
        onConfirm={handleExecuteDetermination}
        onCancel={() => setIsModalOpen(false)}
        isProcessing={isSubmitting}
      />
    </div>
  );
};
