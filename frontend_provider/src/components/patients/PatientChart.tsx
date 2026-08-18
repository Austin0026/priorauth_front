import React, { useState, useEffect } from 'react';
import { useProvider } from '../../context/ProviderContext';
import { fetchPatientFullChart } from '../../services/patientService';
import { PatientFullRecord } from '../../types/clinical';
import { ArrowLeft, FilePlus2, Activity, Pill, Bone, HeartPulse, FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export const PatientChart: React.FC = () => {
  const { selectedPatientId, setActiveTab, startNewPAForPatient } = useProvider();
  const [chart, setChart] = useState<PatientFullRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState<'overview' | 'conditions' | 'meds' | 'imaging' | 'therapy' | 'notes'>('overview');

  useEffect(() => {
    if (selectedPatientId) {
      loadChart(selectedPatientId);
    }
  }, [selectedPatientId]);

  const loadChart = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchPatientFullChart(id);
      setChart(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !chart) {
    return (
      <div className="space-y-6">
        <button onClick={() => setActiveTab('patients')} className="btn-ghost text-xs">
          <ArrowLeft size={16} /> Back to Patient Directory
        </button>
        <LoadingSkeleton rows={6} type="card" />
      </div>
    );
  }

  const { demographics, vitals, conditions, medications, imagingHistory, conservativeCareHistory, clinicalNotes, allergies } = chart;

  return (
    <div className="space-y-6">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActiveTab('patients')}
          className="btn-ghost text-xs self-start"
        >
          <ArrowLeft size={16} />
          <span>Back to Patient Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startNewPAForPatient(chart.patient_id)}
            className="btn-primary"
          >
            <FilePlus2 size={16} />
            <span>Initiate Prior Auth for {demographics.fullName.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Patient Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              {demographics.fullName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {demographics.fullName}
                </h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {demographics.memberId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {demographics.gender} &bull; DOB: {demographics.birthDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-slate-500 mt-2">
                <div><strong className="text-slate-700">Insurance:</strong> {demographics.insurancePayer}</div>
                <div><strong className="text-slate-700">PCP:</strong> {demographics.primaryCareDoctor}</div>
                <div><strong className="text-slate-700">Contact:</strong> {demographics.phone}</div>
              </div>
            </div>
          </div>

          {/* Vitals Summary Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-4 text-xs shrink-0">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Blood Pressure</div>
              <div className="font-bold text-slate-800 text-sm">{vitals.bloodPressure}</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Heart Rate</div>
              <div className="font-bold text-slate-800 text-sm">{vitals.heartRate} bpm</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">BMI</div>
              <div className="font-bold text-slate-800 text-sm">{vitals.bmi}</div>
            </div>
          </div>
        </div>

        {/* Allergies & Alerts banner */}
        <div className="pt-4 flex items-center gap-2 text-xs flex-wrap">
          <span className="font-bold text-rose-700 flex items-center gap-1 shrink-0">
            <AlertCircle size={14} /> Allergies:
          </span>
          {allergies.map((a, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-medium">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Chart Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'EHR Summary', icon: Activity },
          { id: 'conditions', label: `Active Diagnoses (${conditions.length})`, icon: HeartPulse },
          { id: 'meds', label: `Medications (${medications.length})`, icon: Pill },
          { id: 'imaging', label: `Imaging & Diagnostics (${imagingHistory.length})`, icon: Bone },
          { id: 'therapy', label: `Conservative Care (${conservativeCareHistory.length})`, icon: Shield },
          { id: 'notes', label: `Clinical Notes (${clinicalNotes.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeChartTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChartTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeChartTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conservative Care & Prior PA Pre-Requisites */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Shield size={18} className="text-indigo-600" />
                Prior Auth Prerequisites & Conservative Care
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                CMS LCD L34220 Target
              </span>
            </div>

            {conservativeCareHistory.length > 0 ? (
              <div className="space-y-3">
                {conservativeCareHistory.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{item.therapyType} ({item.weeksCompleted} weeks completed)</span>
                      <span className="text-emerald-700 font-semibold">{item.outcome}</span>
                    </div>
                    <div className="text-slate-500">Provider: {item.provider}</div>
                    <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 mt-1 italic">
                      "{item.notes}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                No prior conservative care trials recorded in this EHR.
              </div>
            )}
          </div>

          {/* Attached Imaging History */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bone size={18} className="text-indigo-600" />
                Radiology & Prior Plain Films
              </h3>
            </div>

            {imagingHistory.length > 0 ? (
              <div className="space-y-3">
                {imagingHistory.map((img) => (
                  <div key={img.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{img.modality}: {img.bodyPart}</span>
                      <span className="text-slate-500 font-normal">{img.studyDate}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Findings:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{img.findings}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="font-bold text-slate-700">Impression:</span>
                      <p className="text-slate-800 mt-0.5 whitespace-pre-line">{img.impression}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                Warning: No prior plain radiograph (X-Ray) found in records. CMS LCD L34220 requires plain films before MRI.
              </div>
            )}
          </div>
        </div>
      )}

      {activeChartTab === 'conditions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="divide-y divide-slate-100">
            {conditions.map((c) => (
              <div key={c.code} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span>{c.name}</span>
                  </div>
                  <div className="text-slate-500 mt-1">Onset Date: {c.onsetDate} &bull; Verification: {c.verificationStatus}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold capitalize">
                  {c.clinicalStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeChartTab === 'meds' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="divide-y divide-slate-100">
            {medications.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{m.name} - {m.dosage}</div>
                  <div className="text-slate-500 mt-1">Frequency: {m.frequency} &bull; Prescriber: {m.prescriber}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold capitalize">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeChartTab === 'imaging' && (
        <div className="space-y-4">
          {imagingHistory.map((img) => (
            <div key={img.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">{img.modality} - {img.bodyPart}</span>
                <span className="text-xs text-slate-500 font-medium">Study Date: {img.studyDate} (Accession: {img.accessionNumber})</span>
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900">Findings:</strong> {img.findings}
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-xs border border-slate-200">
                <strong className="text-slate-900">Impression:</strong>
                <p className="mt-1 whitespace-pre-line text-slate-800">{img.impression}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChartTab === 'therapy' && (
        <div className="space-y-4">
          {conservativeCareHistory.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">{t.therapyType}</span>
                <span className="text-xs font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {t.weeksCompleted} Weeks ({t.sessionsCompleted} Sessions)
                </span>
              </div>
              <div className="text-xs text-slate-500">Provider: {t.provider} &bull; Start Date: {t.startDate}</div>
              <div className="p-3 bg-slate-50 rounded-lg text-xs border border-slate-200">
                <strong className="text-slate-900">Therapist Notes & Response:</strong>
                <p className="mt-1 text-slate-700">{t.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChartTab === 'notes' && (
        <div className="space-y-4">
          {clinicalNotes.map((n) => (
            <div key={n.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{n.noteType}</span>
                  <span className="text-slate-400 ml-2">by {n.author} ({n.authorRole})</span>
                </div>
                <span className="text-slate-500 font-medium">{n.date}</span>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line pt-2">
                {n.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
