import React, { useState } from 'react';
import { CaseDetail } from '../../types/reviewer';
import { FileText, Bone, Code, ShieldAlert, Sparkles, Download, Eye } from 'lucide-react';

interface ClinicalArtifactsViewerProps {
  caseDetail: CaseDetail;
}

export const ClinicalArtifactsViewer: React.FC<ClinicalArtifactsViewerProps> = ({ caseDetail }) => {
  const [activeSubTab, setActiveSubTab] = useState<'notes' | 'mri' | 'xray' | 'fhir'>('notes');
  const evidence = caseDetail.clinical_evidence;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
      {/* Sub-header Tabs */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'notes'
              ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText size={14} />
          <span>Clinical Progress Notes</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mri')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'mri'
              ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Bone size={14} />
          <span>MRI Imaging Artifacts</span>
        </button>

        <button
          onClick={() => setActiveSubTab('xray')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'xray'
              ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Bone size={14} />
          <span>Lumbar Plain Radiographs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fhir')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'fhir'
              ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Code size={14} />
          <span>FHIR R4 Bundle</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
        {activeSubTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                EHR Clinical Narrative
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Synthea EHR Extract</span>
            </div>

            {evidence?.clinical_notes && evidence.clinical_notes.length > 0 ? (
              evidence.clinical_notes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300 leading-relaxed font-sans"
                >
                  <p className="whitespace-pre-line">{note}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No narrative notes attached.</p>
            )}

            {/* Structured Findings Table */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2.5">
              <span className="font-bold text-white text-xs uppercase tracking-wider block">
                Structured Evidence Extract
              </span>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Conservative Therapy:</span>
                  <span className="font-bold text-white">
                    {evidence?.conservative_therapy_weeks ?? 0} Weeks Completed
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Prior Plain Imaging:</span>
                  <span className="font-bold text-white">
                    {evidence?.prior_lumbar_imaging ? 'Documented (Plain X-Ray)' : 'Not Performed'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Neurologic Deficit:</span>
                  <span className="font-bold text-white">
                    {evidence?.neurological_symptoms ? 'Documented (Radiculopathy / SLR+)' : 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Emergency Red Flag:</span>
                  <span
                    className={`font-bold ${
                      evidence?.red_flags_present ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {evidence?.red_flags_present ? 'PRESENT (STAT Review)' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'mri' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Lumbar MRI Protocol Preview
              </span>
              <span className="text-[10px] text-sky-400 font-mono">CPT {caseDetail.cpt_code}</span>
            </div>

            {/* Diagnostic Visualization Box */}
            <div className="bg-black rounded-xl p-6 border border-slate-800 flex flex-col items-center justify-center space-y-4">
              <div className="w-56 h-56 bg-slate-950 border border-slate-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
                <svg width="180" height="180" viewBox="0 0 180 180" className="text-slate-600">
                  <rect width="180" height="180" fill="#050811" />
                  {/* Simulated Lumbar spine MRI sagittal slice */}
                  <path d="M90 20 V 160" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
                  <rect x="75" y="30" width="30" height="18" rx="3" fill="#64748b" opacity="0.8" />
                  <rect x="75" y="55" width="30" height="18" rx="3" fill="#64748b" opacity="0.8" />
                  <rect x="75" y="80" width="30" height="18" rx="3" fill="#64748b" opacity="0.8" />
                  <rect x="75" y="105" width="30" height="18" rx="3" fill="#64748b" opacity="0.8" />
                  {/* L4-L5 herniation indicator */}
                  <circle cx="108" cy="114" r="5" fill="#f43f5e" className="animate-ping opacity-75" />
                  <circle cx="108" cy="114" r="4" fill="#f43f5e" />
                  <rect x="75" y="130" width="30" height="18" rx="3" fill="#64748b" opacity="0.8" />
                </svg>
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400">
                  Sagittal T2 MRI Slice
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-xs font-bold text-white">MRI Lumbar Spine (w/o Contrast)</div>
                <p className="text-[11px] text-slate-400 max-w-sm">
                  Corroborates severe L4-L5 disc extrusion with left lateral recess stenosis and root impingement.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'xray' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                Plain Radiographs (2 Views AP/Lateral)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Lumbar Spine Plain Radiograph Report</span>
                <span className="text-[10px] text-slate-400 font-mono">Accession ACC-2026-8819</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                <strong>Findings:</strong> Vertebral alignment is intact. Mild disc space narrowing noted at L4-L5 interspace. No spondylolysis or acute fracture identified. Pedicles intact.
              </p>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200">
                <strong>Impression:</strong> Moderate degenerative disc disease L4-L5. Corroborates prerequisite requirement for CMS LCD L34220 Section B.2.
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'fhir' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                HL7 FHIR R4 Bundle Record
              </span>
              <span className="text-[10px] font-mono text-sky-400">JSON Format</span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-300/90 overflow-x-auto leading-relaxed max-h-96">
{JSON.stringify(
  {
    resourceType: 'Bundle',
    type: 'collection',
    id: `fhir-${caseDetail.case_id}`,
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: caseDetail.patient_id,
          name: [{ text: caseDetail.patient_name }],
        },
      },
      {
        resource: {
          resourceType: 'ServiceRequest',
          status: 'active',
          intent: 'order',
          code: {
            coding: [
              { system: 'http://www.ama-assn.org/go/cpt', code: caseDetail.cpt_code, display: caseDetail.cpt_description },
            ],
          },
          reasonCode: [
            {
              coding: [
                { system: 'http://hl7.org/fhir/sid/icd-10-cm', code: caseDetail.icd10_code, display: caseDetail.icd10_description },
              ],
            },
          ],
        },
      },
    ],
  },
  null,
  2
)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
