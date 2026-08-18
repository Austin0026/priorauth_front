import React, { useState, useEffect } from 'react';
import { fetchPatientsList } from '../../services/patientService';
import { PatientBrief } from '../../types/clinical';
import { useProvider } from '../../context/ProviderContext';
import { Search, UserPlus, FilePlus2, ChevronRight, User, Calendar, Stethoscope, Sparkles } from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export const PatientList: React.FC = () => {
  const { openPatientChart, startNewPAForPatient } = useProvider();
  const [patients, setPatients] = useState<PatientBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mri_candidates' | 'recent'>('all');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await fetchPatientsList();
      setPatients(data);
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(q)) ||
      p.patient_id.toLowerCase().includes(q) ||
      (p.mrn && p.mrn.toLowerCase().includes(q)) ||
      (p.primary_physician && p.primary_physician.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (selectedFilter === 'recent') {
      return p.last_visit_date && p.last_visit_date.includes('2026-08');
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a patient to inspect their longitudinal EHR record or initiate a new Prior Authorization request.
          </p>
        </div>
        <button
          onClick={() => startNewPAForPatient('MEM-948201')}
          className="btn-primary"
        >
          <FilePlus2 size={16} />
          <span>New Prior Auth Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, Member ID, MRN, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Patients ({patients.length})
          </button>
          <button
            onClick={() => setSelectedFilter('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedFilter === 'recent'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Recently Seen
          </button>
        </div>
      </div>

      {/* Patient Cards / Table */}
      {loading ? (
        <LoadingSkeleton rows={5} type="list" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching patients found"
          description="Try modifying your search query or clear the filter."
          actionLabel="Reset Search"
          onAction={() => {
            setSearchQuery('');
            setSelectedFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((p) => {
              return (
                <div
                  key={p.patient_id}
                  className="p-4 sm:p-5 hover:bg-indigo-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 transition-colors">
                      <User size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => openPatientChart(p.patient_id)}
                          className="font-bold text-slate-900 group-hover:text-indigo-600 text-base text-left hover:underline"
                        >
                          {p.name || `Patient ${p.patient_id}`}
                        </button>
                        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {p.patient_id}
                        </span>
                        {p.mrn && (
                          <span className="text-xs text-slate-400 font-mono">
                            {p.mrn}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400" />
                          DOB: {p.birth_date} ({p.gender})
                        </span>
                        <span className="flex items-center gap-1">
                          <Stethoscope size={13} className="text-slate-400" />
                          {p.primary_physician || 'Dr. Sarah Lin, MD'}
                        </span>
                        {p.last_visit_date && (
                          <span className="text-slate-400">
                            Last visit: {p.last_visit_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openPatientChart(p.patient_id)}
                      className="btn-secondary text-xs py-2 px-3"
                    >
                      <span>Open Chart</span>
                    </button>
                    <button
                      onClick={() => startNewPAForPatient(p.patient_id)}
                      className="btn-primary text-xs py-2 px-3.5"
                    >
                      <Sparkles size={14} />
                      <span>Request PA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
