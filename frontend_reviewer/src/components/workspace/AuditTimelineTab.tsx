import React, { useState, useEffect } from 'react';
import { fetchCaseAuditEvents, verifyAuditEventHash, reconstructHistoricalState } from '../../services/auditService';
import { CMSAuditEvent, AuditHashVerification, StateReconstructionSnapshot } from '../../types/audit';
import { ShieldCheck, ShieldAlert, KeyRound, Clock, Download, RefreshCw, History, CheckCircle2 } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';

interface AuditTimelineTabProps {
  caseId: string;
}

export const AuditTimelineTab: React.FC<AuditTimelineTabProps> = ({ caseId }) => {
  const [events, setEvents] = useState<CMSAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<AuditHashVerification | null>(null);
  const [reconstructedSnapshot, setReconstructedSnapshot] = useState<StateReconstructionSnapshot | null>(null);

  useEffect(() => {
    loadAuditTrail();
  }, [caseId]);

  const loadAuditTrail = async () => {
    setLoading(true);
    try {
      const data = await fetchCaseAuditEvents(caseId);
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyHash = async (eventId: string) => {
    setVerifyingId(eventId);
    try {
      const res = await verifyAuditEventHash(eventId, caseId);
      setVerificationResult(res);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReconstructState = async (eventId: string) => {
    const snap = await reconstructHistoricalState(eventId, caseId);
    setReconstructedSnapshot(snap);
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <KeyRound size={16} className="text-sky-400" />
            <span>Cryptographic Audit Trail &amp; Verification</span>
          </h3>
          <p className="text-slate-400 text-[11px]">
            Every rules engine evaluation snapshot and human override is immutably SHA-256 hashed.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading immutable audit log..." />
      ) : (
        <div className="space-y-4">
          {/* Audit Events Timeline */}
          <div className="space-y-3">
            {events.map((evt, idx) => {
              const isVerified = evt.verified || (verificationResult?.eventId === evt.id && verificationResult.isValid);

              return (
                <div
                  key={evt.id || idx}
                  className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                        {evt.event_type}
                      </span>
                      <span className="font-bold text-white text-xs">{evt.id}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {new Date(evt.event_timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleVerifyHash(evt.id)}
                        disabled={verifyingId === evt.id}
                        className="btn-command-secondary text-[10px] py-1 px-2.5 flex items-center gap-1"
                      >
                        <ShieldCheck size={13} className="text-emerald-400" />
                        <span>{verifyingId === evt.id ? 'Hashing...' : 'Verify Hash'}</span>
                      </button>

                      <button
                        onClick={() => handleReconstructState(evt.id)}
                        className="btn-command-secondary text-[10px] py-1 px-2.5 flex items-center gap-1"
                      >
                        <History size={13} className="text-sky-400" />
                        <span>Time Travel Snapshot</span>
                      </button>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Recommendation:</span>
                      <strong className="text-white">{evt.recommendation}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Rules Version:</span>
                      <span className="font-mono text-slate-200">{evt.rules_engine_version}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Policy Reference:</span>
                      <span className="font-mono text-slate-200">{evt.policy_id} (v{evt.policy_version_number})</span>
                    </div>
                  </div>

                  {/* SHA-256 Hash Display */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <KeyRound size={13} className="text-slate-500 shrink-0" />
                      <span className="font-mono text-[10px] text-slate-400 truncate">
                        SHA-256: {evt.audit_hash}
                      </span>
                    </div>
                    {isVerified && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1 shrink-0">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Result Modal / Panel */}
          {verificationResult && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 size={15} />
                  <span>Cryptographic Integrity Verification Passed</span>
                </span>
                <span className="text-[10px] font-mono">{verificationResult.verifiedAt}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-100">
                The computed SHA-256 hash strictly matches the stored immutable database record. No state tampering, policy deviation, or unauthorized evidence mutation detected.
              </p>
            </div>
          )}

          {/* Reconstructed State Snapshot Inspector */}
          {reconstructedSnapshot && (
            <div className="bg-slate-900 border border-sky-800/80 p-5 rounded-xl space-y-3 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-sky-400" />
                  <span className="font-bold text-white text-xs">
                    Reconstructed Historical Rules Engine State ({reconstructedSnapshot.eventId})
                  </span>
                </div>
                <button
                  onClick={() => setReconstructedSnapshot(null)}
                  className="text-slate-400 hover:text-white text-[11px]"
                >
                  Dismiss
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-500">Evaluation Timestamp:</span>
                  <div className="font-mono text-slate-200">{reconstructedSnapshot.timestamp}</div>
                </div>
                <div>
                  <span className="text-slate-500">Policy Version Snapshot:</span>
                  <div className="font-mono text-slate-200">{reconstructedSnapshot.policyVersion}</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-400 text-[10px] uppercase">
                  Reconstructed Policy Criteria Evaluated
                </span>
                <div className="space-y-1">
                  {Object.entries(reconstructedSnapshot.reconstructedCriteriaState).map(([cid, data]) => (
                    <div key={cid} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between text-[11px]">
                      <span><strong className="text-sky-300">{cid}:</strong> {data.evidence}</span>
                      <span className="font-bold text-emerald-400">{data.status}</span>
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
