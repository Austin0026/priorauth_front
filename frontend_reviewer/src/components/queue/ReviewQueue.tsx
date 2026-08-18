import React, { useState, useEffect } from 'react';
import { fetchReviewQueue } from '../../services/reviewerCaseService';
import { CaseSummary } from '../../types/reviewer';
import { useReviewer } from '../../context/ReviewerContext';
import { StatusBadge } from '../common/StatusBadge';
import { Search, AlertOctagon, Clock, CheckCircle2, ChevronRight, ShieldCheck, ClipboardCheck, CircleAlert } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';

export const ReviewQueue: React.FC = () => {
  const { openCaseWorkspace, setQueueCounts, queueCounts } = useReviewer();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'pended' | 'rfi' | 'completed'>('all');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchReviewQueue();
      setCases(data);

      const urgentCount = data.filter((c) => c.urgency === 'stat' || c.red_flags_present).length;
      const pendedCount = data.filter((c) => c.status === 'pending_review' || c.outcome === 'PEND').length;
      const rfiCount = data.filter((c) => c.status === 'rfi_requested' || c.outcome === 'REQUEST_INFO').length;
      const completedCount = data.filter((c) => c.status === 'approved' || c.status === 'denied').length;

      setQueueCounts({
        all: data.length,
        urgent: urgentCount,
        pended: pendedCount,
        rfi: rfiCount,
        completed: completedCount,
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    const match =
      c.case_id.toLowerCase().includes(q) ||
      (c.patient_name && c.patient_name.toLowerCase().includes(q)) ||
      c.patient_id.toLowerCase().includes(q) ||
      c.cpt_code.includes(q) ||
      c.icd10_code.toLowerCase().includes(q);

    if (!match) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return c.urgency === 'stat' || c.red_flags_present;
    if (activeFilter === 'pended') return c.status === 'pending_review' || c.outcome === 'PEND';
    if (activeFilter === 'rfi') return c.status === 'rfi_requested' || c.outcome === 'REQUEST_INFO';
    if (activeFilter === 'completed') return c.status === 'approved' || c.status === 'denied';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck size={22} className="text-sky-600" />
            <span>Clinical Review Worklist</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review prior authorization requests, clinical evidence, and policy requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="panel-dark p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center"><ClipboardCheck size={19} /></div>
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Open reviews</p><p className="text-xl font-extrabold text-slate-900">{queueCounts.all}</p></div>
        </div>
        <div className="panel-dark p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><Clock size={19} /></div>
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Awaiting decision</p><p className="text-xl font-extrabold text-slate-900">{queueCounts.pended}</p></div>
        </div>
        <div className="panel-dark p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center"><CircleAlert size={19} /></div>
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Priority clinical cases</p><p className="text-xl font-extrabold text-slate-900">{queueCounts.urgent}</p></div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-subtle flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Case ID, Patient, CPT, or ICD-10..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Cases' },
            { id: 'urgent', label: 'Urgent / Red Flag' },
            { id: 'pended', label: 'Pending Determination' },
            { id: 'rfi', label: 'RFI Sent' },
            { id: 'completed', label: 'Completed' },
          ].map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Queue List Cards */}
      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
          <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">No pending cases in this queue view</h3>
          <p className="text-xs text-slate-500">All cases under this filter have been adjudicated.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden divide-y divide-slate-200">
          {filtered.map((c) => {
            const isStat = c.urgency === 'stat' || c.red_flags_present;
            const isRFI = c.status === 'rfi_requested' || c.outcome === 'REQUEST_INFO';

            return (
              <div
                key={c.case_id}
                className={`p-5 hover:bg-sky-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isStat ? 'border-l-4 border-l-rose-500 bg-rose-50/60' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                      {c.case_id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {c.patient_name || `Patient ${c.patient_id}`}
                    </span>
                    <StatusBadge status={c.outcome || c.status} size="sm" />
                    {isStat && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold flex items-center gap-1">
                        <AlertOctagon size={11} />
                        <span>STAT EMERGENCY</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-800">CPT {c.cpt_code}:</strong> {c.cpt_description} &bull; <strong className="text-slate-800">ICD-10:</strong> {c.icd10_code} ({c.icd10_description})
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>Submitted: {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(c.created_at).toLocaleDateString()})</span>
                    {c.sla_deadline && (
                      <span className={`flex items-center gap-1 font-semibold ${isStat ? 'text-rose-600' : 'text-amber-700'}`}>
                        <Clock size={12} />
                        SLA Deadline: {new Date(c.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Adjudicate Action Button */}
                <div className="shrink-0 self-end md:self-center">
                  <button
                    onClick={() => openCaseWorkspace(c.case_id)}
                    className="btn-command-primary flex items-center gap-1.5"
                  >
                    <span>Open Clinical Workspace</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
