export interface CMSAuditEvent {
  id: string;
  case_id: string;
  event_timestamp: string;
  event_type: 'INITIAL_INTAKE' | 'EVALUATION' | 'RFI_REQUESTED' | 'RFI_RESPONSE' | 'HUMAN_OVERRIDE' | 'DETERMINATION_ISSUED';
  patient_id: string;
  procedure_code: string;
  diagnosis_codes: string[];
  policy_id: string;
  policy_version_number: number;
  policy_effective_date?: string;
  rules_engine_version: string;
  ai_model_version?: string;
  recommendation: string;
  confidence_score?: string | number;
  criteria_results: Record<string, any>;
  missing_evidence?: Record<string, any>;
  reviewer_id?: string;
  reviewer_notes?: string;
  reviewer_decision?: string;
  audit_hash: string;
  verified?: boolean;
}

export interface AuditHashVerification {
  eventId: string;
  caseId: string;
  computedHash: string;
  storedHash: string;
  isValid: boolean;
  algorithm: 'SHA-256';
  verifiedAt: string;
  auditPayloadSummary: Record<string, any>;
}

export interface StateReconstructionSnapshot {
  eventId: string;
  caseId: string;
  timestamp: string;
  rulesEngineVersion: string;
  policyVersion: string;
  reconstructedCriteriaState: Record<string, { status: string; evidence: string; policyRef: string }>;
  reconstructedClinicalFacts: Record<string, any>;
  systemOutcome: string;
  snapshotIntegrityStatus: 'VERIFIED' | 'TAMPERED';
}
