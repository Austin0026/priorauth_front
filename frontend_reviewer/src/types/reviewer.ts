export type ReviewAction = 'approve' | 'deny' | 'request_info' | 'maintain_pend';

export interface CriterionResult {
  criterion_id: string;
  description: string;
  status: 'SATISFIED' | 'NOT_SATISFIED' | 'UNKNOWN' | 'NOT_APPLICABLE';
  reason?: string;
  evidence_summary?: string;
  policy_reference?: string;
  is_critical?: boolean;
}

export interface PolicyRef {
  lcd_id?: string | null;
  lcd_title?: string | null;
  article_id?: string | null;
  article_title?: string | null;
  cpt_code?: string | null;
  section?: string | null;
}

export interface HumanReviewRecord {
  reviewer_id: string;
  override_outcome: string;
  notes?: string | null;
  reviewed_at: string;
  action_type?: ReviewAction;
}

export interface CaseSummary {
  case_id: string;
  patient_id: string;
  patient_name?: string;
  cpt_code: string;
  cpt_description?: string;
  icd10_code: string;
  icd10_description?: string;
  status: string;
  outcome?: string | null;
  created_at: string;
  priority_score?: number;
  urgency?: 'standard' | 'urgent' | 'stat';
  sla_deadline?: string;
  assigned_reviewer?: string;
  red_flags_present?: boolean;
}

export interface CaseDetail extends CaseSummary {
  criteria: CriterionResult[];
  policy_refs: PolicyRef[];
  evaluated_at: string;
  evaluator_version: string;
  message?: string | null;
  clinical_evidence?: {
    diagnosis_icd10?: string;
    conservative_therapy_weeks?: number;
    conservative_therapy_types?: string[];
    prior_lumbar_imaging?: boolean;
    prior_imaging_date?: string;
    neurological_symptoms?: boolean;
    neurological_exam_documented?: boolean;
    red_flags_present?: boolean;
    red_flag_details?: string[];
    clinical_notes?: string[];
  };
  attached_documents?: {
    id: string;
    name: string;
    type: string;
    uploaded_at: string;
    url?: string;
    ocr_snippet?: string;
  }[];
  fhir_bundle_summary?: {
    patient_id: string;
    encounter_date: string;
    diagnoses: string[];
    medications: string[];
  };
  human_review?: HumanReviewRecord | null;
  ai_confidence_score?: number;
  readiness_percentage?: number;
}

export interface ReviewSubmissionPayload {
  reviewer_id: string;
  action: ReviewAction;
  notes: string;
  denial_reasons?: string[];
  requested_info_items?: string[];
  authorization_duration_days?: number;
}
