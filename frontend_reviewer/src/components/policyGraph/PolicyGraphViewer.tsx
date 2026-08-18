import React, { useState, useEffect } from 'react';
import { fetchPolicyKnowledgeGraph, fetchPolicySyncStatistics, triggerManualPolicySync } from '../../services/policyGraphService';
import { PolicyKnowledgeGraph, CMSPolicySyncStats } from '../../types/policyGraph';
import { Network, RefreshCw, Layers, Database, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';

export const PolicyGraphViewer: React.FC = () => {
  const [graph, setGraph] = useState<PolicyKnowledgeGraph | null>(null);
  const [syncStats, setSyncStats] = useState<CMSPolicySyncStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [g, s] = await Promise.all([
        fetchPolicyKnowledgeGraph(),
        fetchPolicySyncStatistics(),
      ]);
      setGraph(g);
      setSyncStats(s);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await triggerManualPolicySync(true);
      setSyncMessage(res.message);
      await loadData();
    } finally {
      setSyncing(false);
    }
  };

  if (loading || !graph || !syncStats) {
    return <LoadingState message="Loading CMS policy knowledge graph and embedding statistics..." />;
  }

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Network size={22} className="text-sky-400" />
            <span>CMS Policy Knowledge Graph &amp; Sync Manager</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Interactive representation of Medicare LCDs, Billing Articles, criteria nodes, and continuous CMS API sync.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="btn-command-primary self-start"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Synchronizing CMS...' : 'Trigger Manual Sync'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Sync Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active LCD Policies</span>
          <div className="text-xl font-bold text-white">{syncStats.lcds} Documents</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Billing Articles</span>
          <div className="text-xl font-bold text-white">{syncStats.articles} Articles</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Policy Chunk Chunks</span>
          <div className="text-xl font-bold text-white">{syncStats.policy_chunks} Indexed</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">pgvector Embeddings</span>
          <div className="text-xl font-bold text-emerald-400">{syncStats.chunks_with_embeddings} Dense Vectors</div>
        </div>
      </div>

      {/* Interactive Policy Graph Map */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-sky-400" />
            <span className="font-bold text-white text-sm">Policy Logic Graph: Lumbar MRI (CPT 72148)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Last Snapshot: {graph.updatedAt}</span>
        </div>

        {/* Visual Graph Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
          {/* Col 1: CPT Code */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-sky-950 text-sky-400 border border-sky-800 mx-auto flex items-center justify-center font-bold">
              CPT
            </div>
            <div>
              <div className="font-bold text-white text-xs">CPT 72148</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Lumbar Spine MRI (w/o)</div>
            </div>
            <span className="text-[9px] font-mono text-sky-300 bg-sky-950 px-2 py-0.5 rounded">
              Entry Node
            </span>
          </div>

          {/* Col 2: CMS Policy */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 mx-auto flex items-center justify-center font-bold">
              LCD
            </div>
            <div>
              <div className="font-bold text-white text-xs">LCD L34220</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Noridian Healthcare Solutions</div>
            </div>
            <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded">
              Active Policy Node
            </span>
          </div>

          {/* Col 3: Criteria & Clauses */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-center">
            <div className="text-[10px] font-bold uppercase text-slate-400 text-center mb-1">
              Required Criteria Clauses
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200">
              &bull; 6-Wk Conservative Care
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200">
              &bull; Prior Lumbar Plain X-Ray
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200">
              &bull; Radiculopathy Exam Finding
            </div>
            <div className="p-2 rounded bg-purple-950/80 border border-purple-800 text-[11px] font-semibold text-purple-300">
              &bull; Red Flag Exception Clause
            </div>
          </div>

          {/* Col 4: Deterministic Decision */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 mx-auto flex items-center justify-center font-bold">
              OUT
            </div>
            <div>
              <div className="font-bold text-emerald-400 text-xs">Deterministic Verdict</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Approve / RFI / Pend</div>
            </div>
            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">
              Terminal Outcome
            </span>
          </div>
        </div>
      </div>

      {/* Recent Policy Document Versions */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
        <h3 className="font-extrabold text-white text-sm">Recent Policy Version Changelog</h3>
        <div className="divide-y divide-slate-800">
          {syncStats.recent_versions.map((v) => (
            <div key={v.document_id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded">
                  {v.document_id}
                </span>
                <span className="text-slate-300">{v.document_type} (Version {v.version}.0)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                <span>Status: <strong className="text-emerald-400">{v.status}</strong></span>
                <span>{new Date(v.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
