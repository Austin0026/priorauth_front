export interface CMSPolicyItem {
  id: string;
  type: 'LCD' | 'NCD' | 'Article';
  policyNumber: string;
  title: string;
  jurisdiction: string;
  effectiveDate: string;
  lastRevisedDate?: string;
  cptCodes: string[];
  coveredIcd10Codes: string[];
  summary: string;
  criteriaRequirements: {
    id: string;
    section: string;
    requirement: string;
    mandatory: boolean;
    evidenceNeeded: string;
  }[];
}

export interface PolicyLookupResponse {
  cptCode: string;
  procedureDescription: string;
  primaryPolicy?: CMSPolicyItem;
  relatedPolicies: CMSPolicyItem[];
  commonRequiredEvidence: string[];
  contraindications: string[];
  isPriorAuthRequired: boolean;
}
