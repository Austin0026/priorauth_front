export enum CriterionStatus {
  SATISFIED = 'SATISFIED',
  NOT_SATISFIED = 'NOT_SATISFIED',
  UNKNOWN = 'UNKNOWN',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export interface CriterionResult {
  criterion_id: string;
  description: string;
  status: CriterionStatus | 'SATISFIED' | 'NOT_SATISFIED' | 'UNKNOWN' | 'NOT_APPLICABLE';
  evidence_summary?: string;
  reason?: string;
  policy_reference?: string;
  is_critical?: boolean;
}

export interface PreCheckAssessment {
  readinessPercentage: number;
  readinessLabel: 'SUBMISSION READY' | 'MODERATE RISK / RFI LIKELY' | 'HIGH RISK OF DENIAL' | 'URGENT RED FLAG PEND';
  readinessColor: string;
  criteriaResults: CriterionResult[];
  missingCriteria: string[];
  warningAlerts: string[];
  redFlagAlerts: string[];
  passedCount: number;
  totalCount: number;
  canSubmitWithoutWarning: boolean;
  activePolicyLabel?: string;
  policyMismatch?: boolean;
  policyMismatchMessage?: string | null;
}
