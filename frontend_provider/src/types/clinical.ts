export interface PatientBrief {
  patient_id: string;
  birth_date: string;
  gender: string;
  name?: string;
  mrn?: string;
  primary_physician?: string;
  active_conditions_count?: number;
  last_visit_date?: string;
}

export interface PatientDemographics {
  name: string;
  age: number;
  gender: string;
  dateOfBirth?: string;
  memberId: string;
  orderingNpi: string;
  orderingProviderName: string;
  cptCode: string;
  cptDescription: string;
  icd10Code: string;
  icd10Description: string;
  serviceDate: string;
  jurisdiction: string;
  facilityName?: string;
  urgency?: 'standard' | 'urgent' | 'stat';
}

export interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'discontinued';
  prescriber?: string;
}

export interface ConditionRecord {
  code: string;
  name: string;
  onsetDate: string;
  clinicalStatus: 'active' | 'resolved' | 'remission';
  verificationStatus: 'confirmed' | 'differential' | 'provisional';
}

export interface ImagingRecord {
  id: string;
  modality: 'X-Ray' | 'MRI' | 'CT' | 'Ultrasound';
  bodyPart: string;
  studyDate: string;
  accessionNumber: string;
  status: 'final' | 'preliminary';
  findings: string;
  impression: string;
  imageThumbnailUrl?: string;
}

export interface TherapyLog {
  id: string;
  therapyType: 'Physical Therapy' | 'Chiropractic' | 'NSAID Regimen' | 'Epidural Injection' | 'Acupuncture';
  startDate: string;
  endDate?: string;
  weeksCompleted: number;
  sessionsCompleted: number;
  outcome: 'No improvement' | 'Partial improvement' | 'Symptoms worsened';
  provider: string;
  notes: string;
}

export interface PatientFullRecord {
  patient_id: string;
  demographics: {
    fullName: string;
    birthDate: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
    insurancePayer: string;
    memberId: string;
    groupNumber: string;
    primaryCareDoctor: string;
  };
  vitals: {
    bloodPressure: string;
    heartRate: number;
    height: string;
    weight: string;
    bmi: number;
    recordedDate: string;
  };
  conditions: ConditionRecord[];
  medications: MedicationRecord[];
  imagingHistory: ImagingRecord[];
  conservativeCareHistory: TherapyLog[];
  clinicalNotes: {
    id: string;
    date: string;
    author: string;
    authorRole: string;
    noteType: string;
    text: string;
  }[];
  allergies: string[];
}

export interface ClinicalEvidence {
  diagnosis_icd10?: string;
  symptoms?: string[];
  conservative_therapy_weeks?: number | null;
  conservative_therapy_types?: string[];
  neurological_symptoms?: boolean | null;
  neurological_exam_documented?: boolean | null;
  prior_lumbar_imaging?: boolean | null;
  prior_imaging_date?: string | null;
  prior_imaging_modality?: string | null;
  red_flags_present?: boolean | null;
  red_flag_details?: string[];
  clinical_notes?: string[];
}
