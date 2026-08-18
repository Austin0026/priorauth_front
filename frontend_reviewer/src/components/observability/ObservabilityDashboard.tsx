import React, { useState, useEffect } from 'react';
import { fetchObservabilityMetrics } from '../../services/metricsService';
import { SystemMetrics } from '../../types/observability';
import { MetricCard } from '../common/MetricCard';
import { BarChart3, CheckCircle2, Clock, Zap, AlertTriangle, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { LoadingState } from '../common/LoadingState';

export const ObservabilityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObservabilityMetrics()
      .then(setMetrics)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return <LoadingState message="Fetching real-time observability telemetry and SLA metrics..." />;
  }

  return (
    <div className="space-y-6 text-xs">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 size={22} className="text-sky-400" />
          <span>Operational Observability &amp; SLA Telemetry</span>
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Real-time metrics on deterministic rule engine throughput, turnaround time SLAs, and AI extraction latency.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Cases Processed"
          value={metrics.totalCasesProcessed.toLocaleString()}
          subValue="Month to date"
          change="+18.4% vs last mo"
          trend="up"
          icon={Activity}
          variant="primary"
        />

        <MetricCard
          label="Auto-Approval Rate"
          value={`${metrics.autoApprovalRate}%`}
          subValue="Deterministic CMS LCD Match"
          change="+4.2%"
          trend="up"
          icon={CheckCircle2}
          variant="success"
        />

        <MetricCard
          label="SLA Compliance Rate"
          value={`${metrics.slaComplianceRate}%`}
          subValue="Target: 98.0%"
          change="0 breaches"
          trend="up"
          icon={ShieldCheck}
          variant="info"
        />

        <MetricCard
          label="Avg Turnaround Time"
          value={`${metrics.avgTurnaroundHours} Hours`}
          subValue="72h statutory max"
          change="-45 mins"
          trend="up"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* System Latency & Architecture Benchmark */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Cpu size={18} className="text-sky-400" />
            <span>Dual Engine Architecture Latency Breakdown</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Optimal Performance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Deterministic CMS Policy Rules Engine</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">{metrics.deterministicRuleLatencyMs} ms</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Fast, authoritative evaluation over local SQLite / PostgreSQL rules and LCD criteria trees. Zero hallucinations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">AI Evidence Extraction &amp; RAG Retrieval</span>
              <span className="font-mono text-sky-400 font-bold text-sm">{metrics.aiExtractionAvgLatencyMs} ms</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Groq LLaMA 3.3 70B clinical entity parser &amp; pgvector semantic embedding retrieval over CMS LCD chunks.
            </p>
          </div>
        </div>
      </div>

      {/* Daily Throughput Chart Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Throughput */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-extrabold text-white text-sm">7-Day Case Adjudication Volume</h3>

          <div className="space-y-2">
            {metrics.dailyThroughput.map((d) => {
              const total = d.approved + d.pended + d.rfi + d.denied;
              const approveWidth = `${(d.approved / total) * 100}%`;
              const rfiWidth = `${(d.rfi / total) * 100}%`;
              const pendedWidth = `${(d.pended / total) * 100}%`;
              const deniedWidth = `${(d.denied / total) * 100}%`;

              return (
                <div key={d.date} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-mono font-bold text-slate-300">{d.date}</span>
                    <span className="text-slate-400">{total} cases ({d.approved} approved)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
                    <div style={{ width: approveWidth }} className="bg-emerald-500 h-full" title={`Approved: ${d.approved}`} />
                    <div style={{ width: rfiWidth }} className="bg-amber-500 h-full" title={`RFI: ${d.rfi}`} />
                    <div style={{ width: pendedWidth }} className="bg-purple-500 h-full" title={`Pended: ${d.pended}`} />
                    <div style={{ width: deniedWidth }} className="bg-rose-500 h-full" title={`Denied: ${d.denied}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Approved</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> RFI Requested</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Pended / Review</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Denied</span>
          </div>
        </div>

        {/* Top CPT Volume Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="font-extrabold text-white text-sm">Top Procedure Volume &amp; Pass Rate</h3>

          <div className="divide-y divide-slate-800">
            {metrics.topCptDistribution.map((item) => (
              <div key={item.cpt} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded text-[10px]">
                      CPT {item.cpt}
                    </span>
                    <span className="font-semibold text-slate-200 text-xs">{item.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{item.volume} cases evaluated</span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-emerald-400 text-xs">{item.passRate}%</span>
                  <span className="text-[10px] text-slate-500 block">Pass Rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
