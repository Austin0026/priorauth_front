import React from 'react';
import { ClinicalEvidence } from '../../types/clinical';
import { ShieldAlert, FileText, CheckSquare } from 'lucide-react';

interface StepClinicalEvidenceProps {
  evidence: ClinicalEvidence;
  setEvidence: React.Dispatch<React.SetStateAction<ClinicalEvidence>>;
  rawNotesText: string;
  setRawNotesText: (notes: string) => void;
}

export const StepClinicalEvidence: React.FC<StepClinicalEvidenceProps> = ({
  evidence,
  setEvidence,
  rawNotesText,
  setRawNotesText,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Step 3: Clinical Evidence & Medical Necessity</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter clinical facts used by the deterministic CMS policy rules engine (LCD L34220).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Conservative Care Duration */}
        <div className="space-y-2">
          <label className="input-label">Conservative Therapy Duration (Weeks)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="52"
              placeholder="e.g. 8"
              value={evidence.conservative_therapy_weeks ?? ''}
              onChange={(e) =>
                setEvidence((prev) => ({
                  ...prev,
                  conservative_therapy_weeks: e.target.value === '' ? null : Number(e.target.value),
                }))
              }
              className="input-base text-xs font-semibold"
            />
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Weeks Completed</span>
          </div>
          <p className="text-[11px] text-slate-400">
            CMS LCD requires &ge; 6 weeks of non-operative care (PT / NSAIDs) unless red flags are present.
          </p>
        </div>

        {/* Prior Lumbar X-Ray */}
        <div className="space-y-2">
          <label className="input-label">Prior Plain Lumbar Radiograph (X-Ray)</label>
          <select
            value={evidence.prior_lumbar_imaging === null ? '' : String(evidence.prior_lumbar_imaging)}
            onChange={(e) =>
              setEvidence((prev) => ({
                ...prev,
                prior_lumbar_imaging: e.target.value === '' ? null : e.target.value === 'true',
              }))
            }
            className="input-base text-xs font-semibold"
          >
            <option value="">-- Select Status --</option>
            <option value="true">Completed &amp; Corroborated</option>
            <option value="false">Not Performed / Missing</option>
          </select>
          <p className="text-[11px] text-slate-400">
            Plain radiographs rule out acute structural fractures or instability.
          </p>
        </div>

        {/* Neurological Symptoms / Exam */}
        <div className="space-y-2">
          <label className="input-label">Documented Neurologic Deficit / Radiculopathy</label>
          <select
            value={evidence.neurological_symptoms === null ? '' : String(evidence.neurological_symptoms)}
            onChange={(e) =>
              setEvidence((prev) => ({
                ...prev,
                neurological_symptoms: e.target.value === '' ? null : e.target.value === 'true',
                neurological_exam_documented: e.target.value === 'true',
              }))
            }
            className="input-base text-xs font-semibold"
          >
            <option value="">-- Select Exam Finding --</option>
            <option value="true">Present (Positive SLR, reflex reduction, or dermatomal deficit)</option>
            <option value="false">Absent / Normal Neurological Exam</option>
          </select>
          <p className="text-[11px] text-slate-400">
            Required per Article A57206 for radiculopathy indication.
          </p>
        </div>

        {/* Red Flags / Emergency Exceptions */}
        <div className="space-y-2">
          <label className="input-label">Emergency Red Flags (Cauda Equina / Acute Deficit)</label>
          <select
            value={evidence.red_flags_present === null ? '' : String(evidence.red_flags_present)}
            onChange={(e) =>
              setEvidence((prev) => ({
                ...prev,
                red_flags_present: e.target.value === '' ? null : e.target.value === 'true',
              }))
            }
            className="input-base text-xs font-semibold"
          >
            <option value="false">None Documented (Routine Authorization)</option>
            <option value="true">Present &ndash; Urgent Emergency Exception (STAT Review)</option>
          </select>
          <p className="text-[11px] text-slate-400">
            Waives conservative therapy requirement for immediate clinical triage.
          </p>
        </div>
      </div>

      {/* Clinical Notes Narrative Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="input-label flex items-center gap-1.5">
            <FileText size={14} className="text-indigo-600" />
            <span>Clinical Narrative &amp; Physical Exam Notes</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setRawNotesText(
                'Patient completed 8 weeks of supervised physical therapy at Peak Motion and 10 weeks of prescription NSAIDs without durable relief. Physical examination shows positive left Straight Leg Raise at 45 degrees, decreased left patellar/Achilles reflexes (1+), and 4/5 left EHL weakness. Lumbar X-rays from 2026-05-02 show L4-L5 disc space narrowing. No red flags (normal bowel/bladder).'
              );
              setEvidence((prev) => ({
                ...prev,
                conservative_therapy_weeks: 8,
                prior_lumbar_imaging: true,
                neurological_symptoms: true,
                red_flags_present: false,
              }));
            }}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline"
          >
            Insert Eleanor Vance Sample Note
          </button>
        </div>
        <textarea
          rows={5}
          value={rawNotesText}
          onChange={(e) => setRawNotesText(e.target.value)}
          placeholder="Paste or type relevant clinical progress notes, therapist summary, imaging reports, and neurological exam details..."
          className="input-base text-xs font-sans leading-relaxed"
        />
      </div>
    </div>
  );
};
