import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppTab, AlertNotification } from '../types/common';
import { checkBackendHealth } from '../services/apiClient';

interface ProviderContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  openPatientChart: (patientId: string) => void;
  startNewPAForPatient: (patientId: string) => void;
  notifications: AlertNotification[];
  addNotification: (notification: Omit<AlertNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  backendOnline: boolean;
  refreshBackendStatus: () => Promise<void>;
  selectedCaseIdForDetail: string | null;
  setSelectedCaseIdForDetail: (caseId: string | null) => void;
  rfiCaseId: string | null;
  setRfiCaseId: (caseId: string | null) => void;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const ProviderContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('patients');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [selectedCaseIdForDetail, setSelectedCaseIdForDetail] = useState<string | null>(null);
  const [rfiCaseId, setRfiCaseId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<AlertNotification[]>([
    {
      id: 'NOTIF-1',
      type: 'warning',
      title: 'RFI Action Required',
      message: 'Reviewer requested additional documentation for Marcus Brody (PA-2026-0819-02).',
      timestamp: '10 mins ago',
      linkTab: 'tracker',
      linkId: 'PA-2026-0819-02',
    },
    {
      id: 'NOTIF-2',
      type: 'success',
      title: 'Prior Auth Approved',
      message: 'Lumbar MRI for Eleanor Vance (PA-2026-0819-01) has been approved by CMS deterministic rules.',
      timestamp: '2 hours ago',
      linkTab: 'tracker',
      linkId: 'PA-2026-0819-01',
    },
  ]);

  const refreshBackendStatus = async () => {
    const health = await checkBackendHealth();
    setBackendOnline(health.online);
  };

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  const openPatientChart = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient_chart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startNewPAForPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('new_pa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addNotification = (notif: Omit<AlertNotification, 'id' | 'timestamp'>) => {
    const newNotif: AlertNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <ProviderContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        openPatientChart,
        startNewPAForPatient,
        notifications,
        addNotification,
        dismissNotification,
        backendOnline,
        refreshBackendStatus,
        selectedCaseIdForDetail,
        setSelectedCaseIdForDetail,
        rfiCaseId,
        setRfiCaseId,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvider = () => {
  const ctx = useContext(ProviderContext);
  if (!ctx) {
    throw new Error('useProvider must be used within ProviderContextProvider');
  }
  return ctx;
};
