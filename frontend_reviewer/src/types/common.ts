export type ReviewerTab = 'queue' | 'case_workspace' | 'observability' | 'policy_graph' | 'pipeline_trace' | 'audit_explorer' | 'settings';

export interface NotificationItem {
  id: string;
  type: 'urgent' | 'sla_warning' | 'rfi_update' | 'policy_sync';
  title: string;
  message: string;
  timestamp: string;
  caseId?: string;
  read: boolean;
}

export interface ReviewerProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  queueRole: 'Lead Medical Director' | 'Clinical Adjudicator' | 'Auditor';
}
