import React from 'react';
import { useReviewer } from '../../context/ReviewerContext';
import { ReviewerTab } from '../../types/common';
import {
  ListOrdered,
  FileCheck2,
  BarChart3,
  Network,
  GitFork,
  FileSearch,
  ShieldCheck,
} from 'lucide-react';

export const ReviewerSidebar: React.FC = () => {
  const { activeTab, setActiveTab, selectedCaseId, queueCounts } = useReviewer();

  const navItems: { id: ReviewerTab; label: string; icon: any; badge?: string; badgeColor?: string }[] = [
    {
      id: 'queue',
      label: 'Review Queue',
      icon: ListOrdered,
      badge: `${queueCounts.urgent + queueCounts.pended}`,
      badgeColor: queueCounts.urgent > 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700',
    },
    ...(selectedCaseId
      ? [
          {
            id: 'case_workspace' as ReviewerTab,
            label: 'Case Workspace',
            icon: FileCheck2,
            badge: selectedCaseId.slice(-4),
            badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
          },
        ]
      : []),
    { id: 'observability', label: 'Observability & Metrics', icon: BarChart3 },
    { id: 'policy_graph', label: 'CMS Policy Graph & Sync', icon: Network },
    { id: 'pipeline_trace', label: 'Multi-Agent Pipeline Trace', icon: GitFork },
    { id: 'audit_explorer', label: 'Cryptographic Audit Log', icon: FileSearch },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white border-r border-slate-200 p-4 space-y-6">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Adjudication Console
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={isActive ? 'text-sky-600' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* SLA Triage Indicator */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
        <div className="flex items-center justify-between font-bold text-slate-900">
          <span className="flex items-center gap-1.5 text-sky-600">
            <ShieldCheck size={15} />
            <span>SLA Performance</span>
          </span>
          <span className="text-emerald-700">99.4%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.4%' }} />
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          Average turnaround time: <strong className="text-slate-800">3.8 hours</strong> (Compliance standard: 72h).
        </p>
      </div>
    </aside>
  );
};
