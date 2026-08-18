export type AppTab = 'patients' | 'patient_chart' | 'new_pa' | 'tracker' | 'policies';

export interface AlertNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  linkTab?: AppTab;
  linkId?: string;
}

export interface BreadcrumbItem {
  label: string;
  tab?: AppTab;
  id?: string;
}
