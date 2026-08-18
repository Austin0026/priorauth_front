import React, { useState, useEffect } from 'react';
import { fetchPACases } from '../../services/paCaseService';
import { CaseSummary } from '../../types/case';
import { useProvider } from '../../context/ProviderContext';
import { StatusBadge } from '../common/StatusBadge';
import { PACaseDetailModal } from './PACaseDetailModal';
import { RFIResponseModal } from './RFIResponseModal';
import { Search, Filter, Clock, AlertTriangle, FileText, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export const PATrackerList: React.FC = () => {
  const { selectedCaseIdForDetail, setSelectedCaseIdForDetail, rfiCaseId, setRfiCaseId } = useProvider();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await fetchPACases();
      setCases(data);
    } finally {
      setLoading(false);
    }
  };

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    const matchQuery =
      c.case_id.toLowerCase().includes(q) ||
      (c.tracking_code && c.tracking_code.toLowerCase().includes(q)) ||
      (c.patient_name && c.patient_name.toLowerCase().includes(q)) ||
      c.patient_id.toLowerCase().includes(q) ||
      c.cpt_code.includes(q) ||
      c.icd10_code.toLowerCase().includes(q);

    if (!matchQuery) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'approved') return c.status === 'approved' || c.outcome === 'APPROVE';
    if (statusFilter === 'rfi') return c.status === 'rfi_requested' || c.outcome === 'REQUEST_INFO';
    if (statusFilter === 'pended') return c.status === 'pending_review' || c.outcome === 'PEND';
    if (statusFilter === 'in_review') return c.status === 'in_review' || c.status === 'submitted';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Prior Authorization Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time determination status, review feedback, and respond to Additional Information (RFI) requests.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Case ID, Tracking Code, Patient, or CPT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'approved', label: 'Approved' },
            { id: 'rfi', label: 'RFI Action Needed' },
            { id: 'pended', label: 'Pended / Review' },
            { id: 'in_review', label: 'In Review' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === f.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case List Table */}
      {loading ? (
        <LoadingSkeleton rows={5} type="list" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No authorization requests found"
          description="No cases match your active filters. Try clearing your search query."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((c) => {
              const isRFI = c.status === 'rfi_requested' || c.outcome === 'REQUEST_INFO';
              const isApproved = c.status === 'approved' || c.outcome === 'APPROVE';

              return (
                <div
                  key={c.case_id}
                  className="p-4 sm:p-5 hover:bg-indigo-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {c.patient_name || `Patient ${c.patient_id}`}
                        </span>
                        <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                          {c.tracking_code || c.case_id}
                        </span>
                        <StatusBadge status={c.outcome || c.status} size="sm" />
                      </div>

                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-800">CPT {c.cpt_code}:</strong> {c.cpt_description || 'Lumbar MRI without contrast'} &bull; <strong className="text-slate-800">ICD-10:</strong> {c.icd10_code}
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400">
                        <span>Submitted: {new Date(c.created_at).toLocaleDateString()}</span>
                        {c.sla_deadline && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock size={12} />
                            SLA Deadline: {new Date(c.sla_deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* RFI Warning Banner */}
                      {isRFI && c.rfi_question && (
                        <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Reviewer Request:</span>
                            <p className="mt-0.5 text-amber-800 leading-relaxed">{c.rfi_question}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    {isRFI && (
                      <button
                        onClick={() => setRfiCaseId(c.case_id)}
                        className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <FileText size={14} />
                        <span>Respond to RFI</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedCaseIdForDetail(c.case_id)}
                      className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                    >
                      <span>Case Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCaseIdForDetail && (
        <PACaseDetailModal
          caseId={selectedCaseIdForDetail}
          onClose={() => setSelectedCaseIdForDetail(null)}
          onOpenRFI={() => {
            const cid = selectedCaseIdForDetail;
            setSelectedCaseIdForDetail(null);
            setRfiCaseId(cid);
          }}
        />
      )}

      {/* RFI Response Modal */}
      {rfiCaseId && (
        <RFIResponseModal
          caseId={rfiCaseId}
          onClose={() => setRfiCaseId(null)}
          onSuccess={() => {
            setRfiCaseId(null);
            loadCases();
          }}
        />
      )}
    </div>
  );
};
