import React, { useState, useEffect } from 'react';
import { fetchPatientsList } from '../../services/patientService';
import { PatientBrief, PatientDemographics } from '../../types/clinical';
import { User, Check, Search } from 'lucide-react';

interface StepPatientSelectProps {
  demographics: PatientDemographics;
  setDemographics: React.Dispatch<React.SetStateAction<PatientDemographics>>;
  onPatientSelected?: (patientId: string) => void;
}

export const StepPatientSelect: React.FC<StepPatientSelectProps> = ({
  demographics,
  setDemographics,
  onPatientSelected,
}) => {
  const [patients, setPatients] = useState<PatientBrief[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatientsList().then(setPatients);
  }, []);

  const handleSelect = (p: PatientBrief) => {
    setDemographics((prev) => ({
      ...prev,
      name: p.name || `Patient ${p.patient_id}`,
      memberId: p.patient_id,
      gender: p.gender,
      dateOfBirth: p.birth_date,
    }));
    if (onPatientSelected) onPatientSelected(p.patient_id);
  };

  const filtered = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Step 1: Select Patient & Verify Coverage</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select an active patient from the EHR roster to auto-populate coverage demographics and historical records.
        </p>
      </div>

      {/* Patient Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search patient by name or Member ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-9 text-xs"
        />
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((p) => {
          const isSelected = demographics.memberId === p.patient_id;
          return (
            <div
              key={p.patient_id}
              onClick={() => handleSelect(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {p.patient_id} &bull; DOB: {p.birth_date}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coverage & Ordering Details Form */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Ordering Provider & Jurisdiction
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Ordering Provider Name</label>
            <input
              type="text"
              value={demographics.orderingProviderName}
              onChange={(e) =>
                setDemographics((prev) => ({ ...prev, orderingProviderName: e.target.value }))
              }
              className="input-base text-xs"
            />
          </div>

          <div>
            <label className="input-label">Ordering Provider NPI</label>
            <input
              type="text"
              value={demographics.orderingNpi}
              onChange={(e) =>
                setDemographics((prev) => ({ ...prev, orderingNpi: e.target.value }))
              }
              className="input-base text-xs font-mono"
            />
          </div>

          <div>
            <label className="input-label">MAC Jurisdiction / Payer</label>
            <select
              value={demographics.jurisdiction}
              onChange={(e) =>
                setDemographics((prev) => ({ ...prev, jurisdiction: e.target.value }))
              }
              className="input-base text-xs"
            >
              <option value="J-F">Jurisdiction J-F (Noridian Healthcare Solutions)</option>
              <option value="J-K">Jurisdiction J-K (National Government Services - NGS)</option>
              <option value="J-E">Jurisdiction J-E (Noridian)</option>
              <option value="Commercial">Commercial Standard</option>
            </select>
          </div>

          <div>
            <label className="input-label">Servicing Facility / Hospital</label>
            <input
              type="text"
              value={demographics.facilityName || 'St. Jude Regional Orthopedic Center'}
              onChange={(e) =>
                setDemographics((prev) => ({ ...prev, facilityName: e.target.value }))
              }
              className="input-base text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
