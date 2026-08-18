import React, { useState, useEffect } from 'react';
import { fetchCaseAuditEvents, verifyAuditEventHash, exportAuditReport } from '../../services/auditService';
import { CMSAuditEvent, AuditHashVerification } from '../../types/audit';
import { FileSearch, Search, KeyRound, ShieldCheck, Download, CheckCircle2, History, RefreshCw } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';

export const AuditExplorer: React.FC = () => {
  const [events, setEvents] = useState<CMSAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadAllEvents();
  }, []);

  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchCaseAuditEvents('ALL');
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (eventId: string, caseId: string) => {
    setVerifyingId(eventId);
    try {
      const res = await verifyAuditEventHash(eventId, caseId);
      setVerifiedMap((prev) => ({ ...prev, [eventId]: res.isValid }));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    const blob = await exportAuditReport('ALL', format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms_audit_trail_export_${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.id.toLowerCase().includes(q) ||
      e.case_id.toLowerCase().includes(q) ||
      e.event_type.toLowerCase().includes(q) ||
      e.patient_id.toLowerCase().includes(q) ||
      e.audit_hash.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileSearch size={22} className="text-sky-400" />
            <span>Cryptographic Audit Trail Repository</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Immutable SHA-256 hashed ledger of every intake, deterministic rule evaluation, and human reviewer determination.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => handleExport('json')}
            className="btn-command-secondary flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-command-secondary flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Event ID, Case ID, Event Type, Patient ID, or SHA-256 Hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <LoadingState message="Loading immutable cryptographic audit records..." />
      ) : (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 shadow-xl overflow-hidden divide-y divide-slate-800">
          {filtered.map((evt) => {
            const isVerified = verifiedMap[evt.id] || evt.verified;

            return (
              <div key={evt.id} className="p-5 hover:bg-slate-800/40 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                      {evt.event_type}
                    </span>
                    <span className="font-bold text-white text-xs">{evt.id}</span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Case: <strong className="text-slate-200">{evt.case_id}</strong> &bull; Patient: {evt.patient_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerify(evt.id, evt.case_id)}
                      disabled={verifyingId === evt.id}
                      className="btn-command-secondary text-[10px] py-1 px-2.5 flex items-center gap-1"
                    >
                      <ShieldCheck size={13} className="text-emerald-400" />
                      <span>{verifyingId === evt.id ? 'Checking...' : 'Verify Cryptographic Hash'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-slate-300 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Procedure / CPT:</span>
                    <span className="font-mono text-white">CPT {evt.procedure_code}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Policy Reference:</span>
                    <span className="font-mono text-white">{evt.policy_id} (v{evt.policy_version_number})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">System Recommendation:</span>
                    <strong className="text-emerald-400">{evt.recommendation}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Timestamp:</span>
                    <span className="font-mono text-slate-400">{new Date(evt.event_timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* SHA-256 Hash Display */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3 overflow-hidden">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <KeyRound size={13} className="text-slate-500 shrink-0" />
                    <span className="font-mono text-[10px] text-slate-400 truncate">
                      SHA-256: {evt.audit_hash}
                    </span>
                  </div>
                  {isVerified && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={11} /> Verified Match
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
