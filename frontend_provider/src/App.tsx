import React from 'react';
import { useProvider } from './context/ProviderContext';
import { ProviderHeader } from './components/layout/ProviderHeader';
import { ProviderSidebar } from './components/layout/ProviderSidebar';
import { QuickStatsBar } from './components/layout/QuickStatsBar';
import { PatientList } from './components/patients/PatientList';
import { PatientChart } from './components/patients/PatientChart';
import { NewPAWizard } from './components/intake/NewPAWizard';
import { PATrackerList } from './components/tracker/PATrackerList';
import { PolicyExplorer } from './components/policies/PolicyExplorer';
import { ToastAlert } from './components/common/ToastAlert';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedCaseIdForDetail, notifications, dismissNotification } = useProvider();

  const handleToastNavigate = (tab: any, id?: string) => {
    setActiveTab(tab);
    if (tab === 'tracker' && id) {
      setSelectedCaseIdForDetail(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <ProviderHeader />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <ProviderSidebar />

        {/* Dynamic Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Quick Metrics Bar on main dashboard tabs */}
          {(activeTab === 'patients' || activeTab === 'tracker') && (
            <QuickStatsBar />
          )}

          {/* Active Tab View */}
          {activeTab === 'patients' && <PatientList />}
          {activeTab === 'patient_chart' && <PatientChart />}
          {activeTab === 'new_pa' && <NewPAWizard />}
          {activeTab === 'tracker' && <PATrackerList />}
          {activeTab === 'policies' && <PolicyExplorer />}
        </main>
      </div>

      {/* Floating Toast Alerts */}
      <ToastAlert
        notifications={notifications}
        onDismiss={dismissNotification}
        onNavigate={handleToastNavigate}
      />
    </div>
  );
};
