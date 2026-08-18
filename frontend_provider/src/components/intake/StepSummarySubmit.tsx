import React, { useState } from 'react';
import { PatientDemographics, ClinicalEvidence } from '../../types/clinical';
import { PreCheckAssessment } from '../../types/criteria';
import { submitPACase, saveDraftCase } from '../../services/paCaseService';
import { useProvider } from '../../context/ProviderContext';
import { CheckCircle2, ShieldCheck, FileEdit, Send, Sparkles, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';

interface StepSummarySubmitProps {
  demographics: PatientDemographics;
  evidence: ClinicalEvidence;
  preCheck: PreCheckAssessment;
  attachments: string[];
  rawNotesText: string;
}

export const StepSummarySubmit: React.FC<StepSummarySubmitProps> = ({
  demographics,
  evidence,
  preCheck,
  attachments,
  rawNotesText,
}) => {
  const { setActiveTab, setSelectedCaseIdForDetail, addNotification } = useProvider();
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    caseId: string;
    trackingCode: string;
    status: string;
    outcome?: string;
  } | null>(null);

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      const res = await saveDraftCase({
        patient_id: demographics.memberId,
        cpt_code: demographics.cptCode,
        icd10_code: demographics.icd10Code,
        service_date: demographics.serviceDate,
        ordering_provider_npi: demographics.orderingNpi,
        ordering_provider_name: demographics.orderingProviderName,
        jurisdiction: demographics.jurisdiction,
        evidence,
        attachments,
        raw_clinical_notes: rawNotesText,
        urgency: demographics.urgency,
        demographics_snapshot: demographics,
      });

      addNotification({
        type: 'info',
        title: 'Draft Saved',
        message: `PA draft for ${demographics.name} was saved (${res.draftId}).`,
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmitFinal = async () => {
    setSubmitting(true);
    try {
      const result = await submitPACase({
        patient_id: demographics.memberId,
        cpt_code: demographics.cptCode,
        icd10_code: demographics.icd10Code,
        service_date: demographics.serviceDate,
        ordering_provider_npi: demographics.orderingNpi,
        ordering_provider_name: demographics.orderingProviderName,
        jurisdiction: demographics.jurisdiction,
        evidence,
        attachments,
        raw_clinical_notes: rawNotesText,
        urgency: demographics.urgency,
      });

      setSubmittedResult(result);

      addNotification({
        type: result.outcome === 'APPROVE' ? 'success' : result.outcome === 'REQUEST_INFO' ? 'warning' : 'info',
        title: result.outcome === 'APPROVE' ? 'Prior Auth Approved!' : 'Prior Auth Submitted',
        message: `Case ${result.caseId} (${result.trackingCode}) - Determination: ${result.outcome || result.status}`,
        linkTab: 'tracker',
        linkId: result.caseId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedResult) {
    const isApprove = submittedResult.outcome === 'APPROVE' || submittedResult.status === 'approved';
    const isRFI = submittedResult.outcome === 'REQUEST_INFO' || submittedResult.status === 'rfi_requested';

    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-card text-center space-y-6 max-w-xl mx-auto my-4 animate-in fade-in zoom-in duration-200">
        <div
          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
            isApprove
              ? 'bg-emerald-100 text-emerald-600'
              : isRFI
              ? 'bg-amber-100 text-amber-600'
              : 'bg-purple-100 text-purple-600'
          }`}
        >
          {isApprove ? (
            <CheckCircle2 size={36} />
          ) : isRFI ? (
            <AlertTriangle size={36} />
          ) : (
            <ShieldCheck size={36} />
          )}
        </div>

        <div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            Tracking Code: {submittedResult.trackingCode}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
            {isApprove ? 'Authorization Issued Instantly' : isRFI ? 'RFI Requested by Rule Engine' : 'Case Submitted for Clinical Review'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {isApprove
              ? 'All CMS LCD L34220 criteria were satisfied deterministically. Official authorization letter is ready for printing.'
              : isRFI
              ? 'The rule engine detected missing conservative care documentation. You can respond directly in the PA Tracker.'
              : 'Emergency indication detected. Routed to medical director review queue with 24-hour priority turnaround.'}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Case ID:</span>
            <span className="font-mono font-bold text-slate-900">{submittedResult.caseId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Patient:</span>
            <span className="font-bold text-slate-900">{demographics.name} ({demographics.memberId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service:</span>
            <span className="font-bold text-slate-900">CPT {demographics.cptCode} - {demographics.cptDescription}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Engine Outcome:</span>
            <span className={`font-bold ${isApprove ? 'text-emerald-700' : isRFI ? 'text-amber-700' : 'text-purple-700'}`}>
              {submittedResult.outcome || submittedResult.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setSelectedCaseIdForDetail(submittedResult.caseId);
              setActiveTab('tracker');
            }}
            className="btn-primary w-full sm:w-auto"
          >
            <span>View in PA Tracker</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className="btn-secondary w-full sm:w-auto"
          >
            <span>Back to Patient Directory</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Step 6: Review &amp; Submit Prior Authorization</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify all details before submitting to the payer and CMS deterministic rules engine.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient & Provider */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">
            Patient &amp; Provider Identification
          </h3>
          <div className="space-y-1 text-slate-700">
            <div><strong>Patient Name:</strong> {demographics.name}</div>
            <div><strong>Member ID:</strong> <span className="font-mono">{demographics.memberId}</span></div>
            <div><strong>DOB:</strong> {demographics.dateOfBirth} ({demographics.gender})</div>
            <div><strong>Ordering Physician:</strong> {demographics.orderingProviderName} (NPI: {demographics.orderingNpi})</div>
            <div><strong>MAC Jurisdiction:</strong> {demographics.jurisdiction}</div>
          </div>
        </div>

        {/* Clinical Request */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">
            Requested Procedure &amp; Diagnosis
          </h3>
          <div className="space-y-1 text-slate-700">
            <div><strong>CPT Code:</strong> <span className="font-mono font-bold">{demographics.cptCode}</span> - {demographics.cptDescription}</div>
            <div><strong>ICD-10 Code:</strong> <span className="font-mono font-bold">{demographics.icd10Code}</span> - {demographics.icd10Description}</div>
            <div><strong>Planned Date:</strong> {demographics.serviceDate}</div>
            <div><strong>Urgency:</strong> <span className="capitalize font-bold text-slate-900">{demographics.urgency || 'Standard'}</span></div>
          </div>
        </div>

        {/* Clinical Evidence Summary */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-2 text-xs md:col-span-2">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">
            Clinical Evidence &amp; Rule Compliance Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Conservative Care:</span>
              <span className="font-bold text-slate-900">{evidence.conservative_therapy_weeks ?? 0} Weeks Completed</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Prior Lumbar X-Ray:</span>
              <span className="font-bold text-slate-900">{evidence.prior_lumbar_imaging ? 'Verified / Corroborated' : 'Missing'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Neurological Deficit:</span>
              <span className="font-bold text-slate-900">{evidence.neurological_symptoms ? 'Present (Radiculopathy)' : 'None'}</span>
            </div>
          </div>

          <div className="pt-2 text-slate-500 text-[11px]">
            <strong>Attachments ({attachments.length}):</strong> {attachments.length > 0 ? attachments.join(', ') : 'None attached'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={savingDraft || submitting}
          className="btn-secondary w-full sm:w-auto"
        >
          <FileEdit size={16} />
          <span>{savingDraft ? 'Saving Draft...' : 'Save as Draft'}</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSubmitFinal}
            disabled={submitting || savingDraft}
            className="btn-primary w-full sm:w-auto px-6 py-3 text-base shadow-md hover:shadow-lg"
          >
            <Send size={18} />
            <span>{submitting ? 'Submitting & Evaluating...' : 'Submit Prior Authorization'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
