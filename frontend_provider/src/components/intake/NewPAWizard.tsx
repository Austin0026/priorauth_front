import React, { useState, useEffect } from 'react';
import { useProvider } from '../../context/ProviderContext';
import { PatientDemographics, ClinicalEvidence } from '../../types/clinical';
import { evaluateClinicalPreCheck } from '../../services/paCaseService';
import { fetchPatientFullChart } from '../../services/patientService';
import { StepPatientSelect } from './StepPatientSelect';
import { StepRequestDetails } from './StepRequestDetails';
import { StepClinicalEvidence } from './StepClinicalEvidence';
import { StepPolicyPreCheck } from './StepPolicyPreCheck';
import { StepDocumentUpload } from './StepDocumentUpload';
import { StepSummarySubmit } from './StepSummarySubmit';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, FilePlus2 } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Patient & Payer' },
  { id: 2, label: 'Procedure & Diagnosis' },
  { id: 3, label: 'Clinical Evidence' },
  { id: 4, label: 'Policy Pre-Check' },
  { id: 5, label: 'Attachments' },
  { id: 6, label: 'Review & Submit' },
];

export const NewPAWizard: React.FC = () => {
  const { selectedPatientId, setActiveTab } = useProvider();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [demographics, setDemographics] = useState<PatientDemographics>({
    name: 'Eleanor Vance',
    age: 52,
    gender: 'Female',
    dateOfBirth: '1974-03-12',
    memberId: selectedPatientId || 'MEM-948201',
    orderingNpi: '1928374650',
    orderingProviderName: 'Dr. Sarah Lin, MD',
    cptCode: '72148',
    cptDescription: 'MRI Lumbar Spine without Contrast',
    icd10Code: 'M54.16',
    icd10Description: 'Radiculopathy, lumbar region',
    serviceDate: '2026-08-22',
    jurisdiction: 'J-F',
    facilityName: 'St. Jude Regional Orthopedic Center',
    urgency: 'standard',
  });

  const [evidence, setEvidence] = useState<ClinicalEvidence>({
    diagnosis_icd10: 'M54.16',
    symptoms: ['Left lumbar radicular pain', 'L5 dermatomal numbness'],
    conservative_therapy_weeks: 8,
    conservative_therapy_types: ['Physical therapy', 'Meloxicam NSAID'],
    neurological_symptoms: true,
    neurological_exam_documented: true,
    prior_lumbar_imaging: true,
    prior_imaging_date: '2026-05-02',
    red_flags_present: false,
    red_flag_details: [],
    clinical_notes: [
      'Eight weeks of physical therapy completed. Lumbar X-ray confirms disc narrowing at L4-L5.',
    ],
  });

  const [rawNotesText, setRawNotesText] = useState<string>(
    'Patient returns for follow-up of refractory left lower extremity radicular pain in L5 distribution. Has completed 8 weeks of formal physical therapy and 10 weeks of prescription NSAIDs without durable symptom resolution. Physical examination demonstrates positive Straight Leg Raise on left at 45 degrees, decreased left patellar/Achilles reflexes (1+), and 4/5 left great toe extensor weakness. Lumbar X-rays from 2026-05-02 demonstrated L4-L5 disc narrowing. No red flags (no saddle anesthesia, normal bowel/bladder function).'
  );

  const [attachments, setAttachments] = useState<string[]>([
    'Physical_Therapy_Discharge_Summary_PeakMotion.pdf',
    'Lumbar_Spine_XRay_Report_2026-05-02.pdf',
  ]);

  // If initial patient selected from chart, load their details
  useEffect(() => {
    if (selectedPatientId) {
      fetchPatientFullChart(selectedPatientId).then((full) => {
        if (full) {
          setDemographics((prev) => ({
            ...prev,
            name: full.demographics.fullName,
            memberId: full.demographics.memberId,
            dateOfBirth: full.demographics.birthDate,
            gender: full.demographics.gender,
            icd10Code: full.conditions[0]?.code || prev.icd10Code,
            icd10Description: full.conditions[0]?.name || prev.icd10Description,
          }));

          const hasPT = full.conservativeCareHistory.length > 0;
          const totalWeeks = full.conservativeCareHistory.reduce((s, c) => s + c.weeksCompleted, 0);
          const hasXray = full.imagingHistory.some((i) => i.modality === 'X-Ray');

          setEvidence((prev) => ({
            ...prev,
            conservative_therapy_weeks: totalWeeks || 8,
            prior_lumbar_imaging: hasXray,
            neurological_symptoms: true,
          }));
        }
      });
    }
  }, [selectedPatientId]);

  // Compute live deterministic pre-check assessment
  const preCheck = evaluateClinicalPreCheck(evidence, rawNotesText, demographics);

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Wizard Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FilePlus2 size={22} className="text-indigo-600" />
            <span>Prior Authorization Intake Wizard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and submit an electronic prior authorization request with live CMS policy pre-check.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('patients')}
          className="btn-ghost text-xs self-start"
        >
          <ArrowLeft size={16} />
          <span>Exit Wizard</span>
        </button>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] gap-2">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2.5 text-xs font-semibold p-1.5 rounded-lg transition-colors ${
                    isCurrent
                      ? 'text-indigo-700 font-bold'
                      : isCompleted
                      ? 'text-emerald-700 hover:text-emerald-800'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : step.id}
                  </span>
                  <span className="whitespace-nowrap">{step.label}</span>
                </button>
                {step.id < STEPS.length && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded ${
                      step.id < currentStep ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle">
        {currentStep === 1 && (
          <StepPatientSelect
            demographics={demographics}
            setDemographics={setDemographics}
          />
        )}
        {currentStep === 2 && (
          <StepRequestDetails
            demographics={demographics}
            setDemographics={setDemographics}
          />
        )}
        {currentStep === 3 && (
          <StepClinicalEvidence
            evidence={evidence}
            setEvidence={setEvidence}
            rawNotesText={rawNotesText}
            setRawNotesText={setRawNotesText}
          />
        )}
        {currentStep === 4 && <StepPolicyPreCheck preCheck={preCheck} />}
        {currentStep === 5 && (
          <StepDocumentUpload
            attachments={attachments}
            setAttachments={setAttachments}
            cptCode={demographics.cptCode}
            icd10Code={demographics.icd10Code}
          />
        )}
        {currentStep === 6 && (
          <StepSummarySubmit
            demographics={demographics}
            evidence={evidence}
            preCheck={preCheck}
            attachments={attachments}
            rawNotesText={rawNotesText}
          />
        )}

        {/* Wizard Controls Footer */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary text-xs disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Step {currentStep} of 6
              </span>
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary text-xs"
              >
                <span>{currentStep === 5 ? 'Review Summary' : 'Next Step'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
