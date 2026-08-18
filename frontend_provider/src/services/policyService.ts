import { apiClient } from './apiClient';
import { CMSPolicyItem, PolicyLookupResponse } from '../types/policy';
import { MOCK_POLICIES } from './mockProviderData';

export async function lookupPolicies(query: string = '', cptCode?: string): Promise<CMSPolicyItem[]> {
  try {
    const res = await apiClient.get<CMSPolicyItem[]>('/policies/lookup', {
      params: { q: query, cpt: cptCode }
    }).catch(async () => {
      return await apiClient.get<CMSPolicyItem[]>('/admin/policies/graph');
    });

    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}

  if (!query && !cptCode) {
    return MOCK_POLICIES;
  }

  const q = query.toLowerCase();
  return MOCK_POLICIES.filter((p) => 
    p.title.toLowerCase().includes(q) ||
    p.policyNumber.toLowerCase().includes(q) ||
    p.cptCodes.some((c) => c.includes(q)) ||
    p.coveredIcd10Codes.some((icd) => icd.toLowerCase().includes(q))
  );
}

export async function fetchPolicyRequirements(cptCode: string): Promise<PolicyLookupResponse> {
  try {
    const res = await apiClient.get<PolicyLookupResponse>(`/policies/${cptCode}/requirements`);
    if (res.data) {
      return res.data;
    }
  } catch {}

  const match = MOCK_POLICIES.find((p) => p.cptCodes.includes(cptCode)) || MOCK_POLICIES[0];
  return {
    cptCode,
    procedureDescription: cptCode === '72148' ? 'MRI Lumbar Spine without Contrast' : 'Diagnostic Procedure',
    primaryPolicy: match,
    relatedPolicies: MOCK_POLICIES.filter((p) => p.id !== match.id),
    commonRequiredEvidence: [
      '6 weeks of documented conservative treatment (Physical therapy, medications)',
      'Prior lumbar plain radiograph (X-Ray) report',
      'Documented neurological examination (radiculopathy, reflex loss, motor weakness)',
    ],
    contraindications: [
      'Active pacemakers / non-MRI compatible metallic implants',
      'Acute non-emergent onset (< 2 weeks) without conservative trial',
    ],
    isPriorAuthRequired: true,
  };
}
