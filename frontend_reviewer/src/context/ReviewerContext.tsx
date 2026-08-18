import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReviewerTab, NotificationItem, ReviewerProfile } from '../types/common';
import { checkBackendHealth } from '../services/apiClient';

interface ReviewerContextType {
  activeTab: ReviewerTab;
  setActiveTab: (tab: ReviewerTab) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (caseId: string | null) => void;
  openCaseWorkspace: (caseId: string) => void;
  reviewerProfile: ReviewerProfile;
  setReviewerProfile: React.Dispatch<React.SetStateAction<ReviewerProfile>>;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  backendOnline: boolean;
  refreshBackendStatus: () => Promise<void>;
  queueCounts: { all: number; urgent: number; pended: number; rfi: number; completed: number };
  setQueueCounts: React.Dispatch<React.SetStateAction<{ all: number; urgent: number; pended: number; rfi: number; completed: number }>>;
}

const ReviewerContext = createContext<ReviewerContextType | undefined>(undefined);

export const ReviewerContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ReviewerTab>('queue');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('PA-2026-0819-03');
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  const [reviewerProfile, setReviewerProfile] = useState<ReviewerProfile>({
    id: 'rev-lead-01',
    name: 'Dr. Alexander Vance, MD',
    title: 'Chief Medical Officer',
    specialty: 'Orthopedic Spine Surgery / Neuroradiology',
    queueRole: 'Lead Medical Director',
  });

  const [queueCounts, setQueueCounts] = useState({
    all: 4,
    urgent: 1,
    pended: 2,
    rfi: 1,
    completed: 1,
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'N-1',
      type: 'urgent',
      title: 'STAT Emergency Red Flag',
      message: 'Case PA-2026-0819-03 (Samantha Reed) flagged for acute Cauda Equina Syndrome.',
      timestamp: '5 mins ago',
      caseId: 'PA-2026-0819-03',
      read: false,
    },
    {
      id: 'N-2',
      type: 'sla_warning',
      title: 'SLA Approaching (4h Remaining)',
      message: 'Case PA-2026-0819-03 requires adjudication determination by 19:45 UTC.',
      timestamp: '15 mins ago',
      caseId: 'PA-2026-0819-03',
      read: false,
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

  const openCaseWorkspace = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('case_workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <ReviewerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCaseId,
        setSelectedCaseId,
        openCaseWorkspace,
        reviewerProfile,
        setReviewerProfile,
        notifications,
        dismissNotification,
        backendOnline,
        refreshBackendStatus,
        queueCounts,
        setQueueCounts,
      }}
    >
      {children}
    </ReviewerContext.Provider>
  );
};

export const useReviewer = () => {
  const ctx = useContext(ReviewerContext);
  if (!ctx) {
    throw new Error('useReviewer must be used within ReviewerContextProvider');
  }
  return ctx;
};
