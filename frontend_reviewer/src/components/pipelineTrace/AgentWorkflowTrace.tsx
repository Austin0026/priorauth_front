import React, { useState } from 'react';
import { GitFork, CheckCircle2, Clock, Sparkles, Cpu, Layers, Terminal, ChevronDown, ChevronRight } from 'lucide-react';

const MOCK_PIPELINE_STEPS = [
  {
    id: 'node-intake',
    name: 'Intake & Admin Validation',
    status: 'completed',
    durationMs: 24,
    description: 'Validates CPT code 72148, ICD-10 G83.4, patient eligibility, and MAC Jurisdiction J-F.',
    outputSummary: { valid: true, jurisdiction: 'J-F', cpt_valid: true },
  },
  {
    id: 'node-extract',
    name: 'LLM Evidence Extraction (Groq LLaMA 3.3 70B)',
    status: 'completed',
    durationMs: 1240,
    description: 'Parses unstructured clinical notes, extracts conservative care weeks, prior imaging, and neurological exam details.',
    outputSummary: {
      conservative_weeks: 0,
      neurologic_deficits: ['saddle_anesthesia', 'urinary_retention', 'foot_drop'],
      red_flags_present: true,
      confidence: 0.96,
    },
  },
  {
    id: 'node-rag',
    name: 'Hybrid Policy Retrieval & pgvector Search',
    status: 'completed',
    durationMs: 380,
    description: 'Retrieves authoritative CMS LCD L34220 chunks and Article A57206 coverage requirements based on dense semantic embeddings.',
    outputSummary: {
      primary_policy: 'LCD L34220',
      chunks_retrieved: 4,
      top_similarity_score: 0.94,
    },
  },
  {
    id: 'node-rules',
    name: 'Deterministic Policy Rules Engine',
    status: 'completed',
    durationMs: 38,
    description: 'Authoritative rules engine evaluates clinical facts against deterministic LCD L34220 criteria trees.',
    outputSummary: {
      'LCD-34220-C1': 'WAIVED (Emergency Exemption)',
      'LCD-34220-C2': 'SATISFIED',
      'LCD-34220-C3': 'SATISFIED',
      'LCD-34220-C4': 'SATISFIED (Red Flag Active)',
    },
  },
  {
    id: 'node-triage',
    name: 'Urgency & Red Flag Triage',
    status: 'completed',
    durationMs: 18,
    description: 'Calculates SLA priority score (98/100) and triggers STAT 24-hour medical director review routing.',
    outputSummary: { priority_score: 98, triage_route: 'STAT_MEDICAL_DIRECTOR', sla_hours: 24 },
  },
  {
    id: 'node-audit',
    name: 'Cryptographic Audit Hash Synthesis',
    status: 'completed',
    durationMs: 14,
    description: 'Generates immutable SHA-256 hash of all intermediate facts and logs event to audit repository.',
    outputSummary: {
      audit_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      immutable_log: 'VERIFIED',
    },
  },
];

export const AgentWorkflowTrace: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<string | null>('node-extract');

  const totalDuration = MOCK_PIPELINE_STEPS.reduce((sum, s) => sum + s.durationMs, 0);

  return (
    <div className="space-y-6 text-xs">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <GitFork size={22} className="text-sky-400" />
            <span>Multi-Agent LangGraph Pipeline Trace</span>
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Step-by-step execution timeline for case PA-2026-0819-03 showing node durations, LLM extraction facts, and deterministic rule transitions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <Clock size={16} className="text-sky-400" />
          <span className="text-slate-400">Total Execution Time:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">{totalDuration} ms</span>
        </div>
      </div>

      {/* Model & Runtime Telemetry Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">LLM Inference Provider</span>
          <div className="font-bold text-white text-sm">Groq Cloud (LLaMA 3.3 70B Versatile)</div>
          <div className="text-[11px] text-slate-500">Temp: 0.2 &bull; Tokens Used: 642 &bull; Latency: 1.24s</div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Vector Embeddings</span>
          <div className="font-bold text-white text-sm">pgvector / nomic-embed-text-v1.5</div>
          <div className="text-[11px] text-slate-500">768 Dim &bull; Cosine Distance &bull; Top-4 Chunks</div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Orchestrator Engine</span>
          <div className="font-bold text-white text-sm">LangGraph v0.1.8 / FastAPI</div>
          <div className="text-[11px] text-slate-500">6 Graph Nodes &bull; Strict Deterministic Rules Hand-off</div>
        </div>
      </div>

      {/* Pipeline Node Timeline */}
      <div className="space-y-3">
        <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
          Pipeline Execution Steps ({MOCK_PIPELINE_STEPS.length} Nodes)
        </span>

        <div className="space-y-3">
          {MOCK_PIPELINE_STEPS.map((step, idx) => {
            const isExpanded = expandedStep === step.id;

            return (
              <div
                key={step.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all"
              >
                <div
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs">{step.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {step.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-emerald-400 font-bold text-xs">
                      {step.durationMs} ms
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Output JSON */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase font-bold">
                      <Terminal size={12} className="text-sky-400" />
                      <span>Node Output State Snapshot</span>
                    </div>
                    <pre className="p-3 bg-slate-900 rounded-lg text-sky-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                      {JSON.stringify(step.outputSummary, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
