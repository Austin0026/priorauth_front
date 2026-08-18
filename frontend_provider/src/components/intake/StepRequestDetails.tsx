import React from 'react';
import { PatientDemographics } from '../../types/clinical';
import { Sparkles, AlertCircle } from 'lucide-react';

interface StepRequestDetailsProps {
  demographics: PatientDemographics;
  setDemographics: React.Dispatch<React.SetStateAction<PatientDemographics>>;
}

const COMMON_CPT_OPTIONS = [
  { code: '72148', desc: 'MRI Lumbar Spine without Contrast', lcd: 'LCD L34220' },
  { code: '72149', desc: 'MRI Lumbar Spine with Contrast', lcd: 'LCD L34220' },
  { code: '72158', desc: 'MRI Lumbar Spine without & with Contrast', lcd: 'LCD L34220' },
  { code: '73721', desc: 'MRI Lower Extremity Joint (Knee) without Contrast', lcd: 'LCD L33796' },
];

const COMMON_ICD_OPTIONS = [
  { code: 'M54.16', desc: 'Radiculopathy, lumbar region (L4/L5)', match: true },
  { code: 'M51.26', desc: 'Other intervertebral disc displacement, lumbar region', match: true },
  { code: 'G83.4', desc: 'Cauda equina syndrome (Emergency indication)', match: true, urgent: true },
  { code: 'M54.50', desc: 'Low back pain, unspecified (Requires 6-wk PT proof)', match: false },
];

export const StepRequestDetails: React.FC<StepRequestDetailsProps> = ({
  demographics,
  setDemographics,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Step 2: Procedure & Diagnostic Codes</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Specify the requested imaging CPT code, planned service date, and primary ICD-10 diagnosis code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CPT Code Selection */}
        <div className="space-y-2">
          <label className="input-label">Requested Procedure (CPT Code)</label>
          <select
            value={demographics.cptCode}
            onChange={(e) => {
              const match = COMMON_CPT_OPTIONS.find((c) => c.code === e.target.value);
              setDemographics((prev) => ({
                ...prev,
                cptCode: e.target.value,
                cptDescription: match ? match.desc : prev.cptDescription,
              }));
            }}
            className="input-base text-xs font-semibold"
          >
            {COMMON_CPT_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.desc} ({c.lcd})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">
            Selected CPT routes directly to deterministic CMS policy engine.
          </p>
        </div>

        {/* Service Date */}
        <div className="space-y-2">
          <label className="input-label">Planned Service Date</label>
          <input
            type="date"
            value={demographics.serviceDate}
            onChange={(e) =>
              setDemographics((prev) => ({ ...prev, serviceDate: e.target.value }))
            }
            className="input-base text-xs"
          />
          <p className="text-[11px] text-slate-400">
            Service must be performed within 90 days of authorization issuance.
          </p>
        </div>

        {/* ICD-10 Diagnosis Code */}
        <div className="space-y-2">
          <label className="input-label">Primary Diagnosis (ICD-10-CM)</label>
          <select
            value={demographics.icd10Code}
            onChange={(e) => {
              const match = COMMON_ICD_OPTIONS.find((i) => i.code === e.target.value);
              setDemographics((prev) => ({
                ...prev,
                icd10Code: e.target.value,
                icd10Description: match ? match.desc : prev.icd10Description,
              }));
            }}
            className="input-base text-xs font-semibold"
          >
            {COMMON_ICD_OPTIONS.map((i) => (
              <option key={i.code} value={i.code}>
                {i.code} - {i.desc}
              </option>
            ))}
          </select>
          {demographics.icd10Code === 'M54.50' && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>
                Non-specific back pain (M54.50) requires rigorous proof of failed conservative therapy.
              </span>
            </div>
          )}
          {demographics.icd10Code === 'G83.4' && (
            <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-[11px] flex items-center gap-2">
              <Sparkles size={14} className="shrink-0 text-purple-600" />
              <span>
                Emergency Indication: Conservative care requirement will be automatically waived for STAT review.
              </span>
            </div>
          )}
        </div>

        {/* Urgency Level */}
        <div className="space-y-2">
          <label className="input-label">Request Urgency / Triage Level</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setDemographics((prev) => ({ ...prev, urgency: 'standard' }))
              }
              className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                demographics.urgency !== 'urgent' && demographics.urgency !== 'stat'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold">Standard Review</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">72-Hour Turnaround</div>
            </button>

            <button
              type="button"
              onClick={() =>
                setDemographics((prev) => ({ ...prev, urgency: 'stat' }))
              }
              className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                demographics.urgency === 'urgent' || demographics.urgency === 'stat'
                  ? 'border-rose-600 bg-rose-50 text-rose-900 ring-1 ring-rose-500/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-rose-700">Urgent / STAT</div>
              <div className="text-[10px] text-rose-600/80 font-normal mt-0.5">24-Hour Expedited</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
