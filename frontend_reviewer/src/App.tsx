import React from 'react';
import { useReviewer } from './context/ReviewerContext';
import { ReviewerHeader } from './components/layout/ReviewerHeader';
import { ReviewerSidebar } from './components/layout/ReviewerSidebar';
import { ReviewQueue } from './components/queue/ReviewQueue';
import { CaseWorkspace } from './components/workspace/CaseWorkspace';
import { ObservabilityDashboard } from './components/observability/ObservabilityDashboard';
import { PolicyGraphViewer } from './components/policyGraph/PolicyGraphViewer';
import { AgentWorkflowTrace } from './components/pipelineTrace/AgentWorkflowTrace';
import { AuditExplorer } from './components/audit/AuditExplorer';

export const App: React.FC = () => {
  const { activeTab } = useReviewer();

  return (
    <div className="reviewer-shell min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Header */}
      <ReviewerHeader />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <ReviewerSidebar />

        {/* Dynamic View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {activeTab === 'queue' && <ReviewQueue />}
          {activeTab === 'case_workspace' && <CaseWorkspace />}
          {activeTab === 'observability' && <ObservabilityDashboard />}
          {activeTab === 'policy_graph' && <PolicyGraphViewer />}
          {activeTab === 'pipeline_trace' && <AgentWorkflowTrace />}
          {activeTab === 'audit_explorer' && <AuditExplorer />}
        </main>
      </div>
    </div>
  );
};
