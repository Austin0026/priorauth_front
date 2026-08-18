import React, { useState, useEffect } from 'react';
import { lookupPolicies } from '../../services/policyService';
import { CMSPolicyItem } from '../../types/policy';
import { useProvider } from '../../context/ProviderContext';
import { BookOpen, Search, FileText, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export const PolicyExplorer: React.FC = () => {
  const { startNewPAForPatient } = useProvider();
  const [policies, setPolicies] = useState<CMSPolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<CMSPolicyItem | null>(null);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await lookupPolicies();
      setPolicies(data);
      if (data.length > 0) setSelectedPolicy(data[0]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = policies.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.policyNumber.toLowerCase().includes(q) ||
      p.cptCodes.some((c) => c.includes(q)) ||
      p.coveredIcd10Codes.some((icd) => icd.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen size={22} className="text-indigo-600" />
            <span>CMS Policy Explorer &amp; Coverage Rules</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore Medicare Local Coverage Determinations (LCDs) and Articles governing prior authorization rules.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by CPT (72148), LCD Number (L34220), Diagnosis (M54.16), or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 text-xs"
          />
        </div>
      </div>

      {/* 2-Pane Policy Browser */}
      {loading ? (
        <LoadingSkeleton rows={5} type="card" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No policies matched"
          description="Try searching with a CPT code like 72148 or LCD number."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Policy List */}
          <div className="space-y-3 lg:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Policies ({filtered.length})
            </div>
            {filtered.map((p) => {
              const isSelected = selectedPolicy?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPolicy(p)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {p.policyNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">Eff: {p.effectiveDate}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs mt-2 leading-snug">{p.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.cptCodes.map((c) => (
                      <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        CPT {c}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Policy Detail & Criteria */}
          {selectedPolicy && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle lg:col-span-2 space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {selectedPolicy.policyNumber}
                    </span>
                    <span className="text-slate-400 font-medium">{selectedPolicy.jurisdiction}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-2">{selectedPolicy.title}</h2>
                </div>

                <button
                  onClick={() => startNewPAForPatient('MEM-948201')}
                  className="btn-primary shrink-0 self-start"
                >
                  <Sparkles size={14} />
                  <span>Use in New Prior Auth</span>
                </button>
              </div>

              {/* Policy Summary */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Policy Summary &amp; Scope
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedPolicy.summary}
                </p>
              </div>

              {/* Covered CPT & ICD-10 Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Applicable CPT Codes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPolicy.cptCodes.map((c) => (
                      <span key={c} className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-indigo-700 border border-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Covered Primary ICD-10 Indications
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPolicy.coveredIcd10Codes.map((icd) => (
                      <span key={icd} className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-emerald-700 border border-slate-200">
                        {icd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mandatory Deterministic Criteria Breakdown */}
              <div className="space-y-3">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Mandatory Coverage Requirements &amp; Evidence Standards
                </span>

                <div className="space-y-3">
                  {selectedPolicy.criteriaRequirements.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs">{req.section}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {req.id}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{req.requirement}</p>
                      <div className="pt-1 text-[11px] text-slate-500">
                        <strong className="text-slate-700">Required Documentation:</strong> {req.evidenceNeeded}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
