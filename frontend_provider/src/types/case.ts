import { ClinicalEvidence, PatientDemographics } from './clinical';
import { CriterionResult } from './criteria';

export type CaseStatus = 'draft' | 'submitted' | 'in_review' | 'pending_review' | 'approved' | 'denied' | 'rfi_requested';

export interface CaseSummary {
  case_id: string;
  patient_id: string;
  patient_name?: string;
  cpt_code: string;
  cpt_description?: string;
  icd10_code: string;
  icd10_description?: string;
  status: CaseStatus | string;
  outcome?: 'APPROVE' | 'DENY' | 'PEND' | 'REQUEST_INFO' | string | null;
  created_at: string;
  updated_at?: string;
  tracking_code?: string;
  urgency?: 'standard' | 'urgent' | 'stat';
  sla_deadline?: string;
  rfi_question?: string;
  rfi_requested_at?: string;
}

export interface CaseCreatePayload {
  patient_id: string;
  cpt_code: string;
  icd10_code: string;
  service_date?: string;
  ordering_provider_npi?: string;
  ordering_provider_name?: string;
  jurisdiction?: string;
  evidence?: ClinicalEvidence;
  attachments?: string[];
  raw_clinical_notes?: string;
  urgency?: 'standard' | 'urgent' | 'stat';
}

export interface CaseDraftPayload extends CaseCreatePayload {
  draft_id?: string;
  step_saved?: number;
  demographics_snapshot?: Partial<PatientDemographics>;
}

export interface DecisionPolicyRef {
  lcd_id?: string | null;
  lcd_title?: string | null;
  article_id?: string | null;
  article_title?: string | null;
  cpt_code?: string | null;
  section_ref?: string | null;
}

export interface DecisionResponse {
  case_id: string;
  outcome: 'APPROVE' | 'DENY' | 'PEND' | 'REQUEST_INFO' | string;
  criteria: CriterionResult[];
  policy_refs: DecisionPolicyRef[];
  evaluated_at: string;
  evaluator_version: string;
  message?: string | null;
  clinical_rationale?: string;
  readiness_score?: number;
  next_steps?: string[];
  missing_evidence?: string[];
}

export interface DocumentUploadResponse {
  id: string;
  filename: string;
  document_type: string;
  file_size_bytes: number;
  uploaded_at: string;
  ocr_extracted_entities?: {
    entity_type: string;
    text: string;
    confidence: number;
  }[];
  mapped_evidence?: {
    criterion_id: string;
    matched: boolean;
    evidence_text: string;
  }[];
}
