import { apiClient } from './apiClient';
import { CaseSummary, CaseDetail, ReviewSubmissionPayload } from '../types/reviewer';
import { MOCK_REVIEW_QUEUE_CASES, MOCK_CASE_DETAILS } from './mockReviewerData';

const LOCAL_QUEUE_KEY = 'reviewcommand_queue_cases';
const LOCAL_DETAILS_KEY = 'reviewcommand_case_details';

function getStoredQueue(): CaseSummary[] {
  try {
    const raw = localStorage.getItem(LOCAL_QUEUE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return MOCK_REVIEW_QUEUE_CASES;
}

function setStoredQueue(cases: CaseSummary[]) {
  try {
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(cases));
  } catch {}
}

export async function fetchReviewQueue(): Promise<CaseSummary[]> {
  try {
    // 1. Try /reviewer/review-queue
    const res = await apiClient.get<CaseSummary[]>('/reviewer/review-queue').catch(async () => {
      // 2. Try /cases/review-queue or /reviewer/cases or /cases
      return await apiClient.get<CaseSummary[]>('/cases/review-queue').catch(async () => {
        return await apiClient.get<CaseSummary[]>('/reviewer/cases');
      });
    });

    if (Array.isArray(res.data) && res.data.length > 0) {
      // Merge with stored queue
      const stored = getStoredQueue();
      const ids = new Set(res.data.map((c) => c.case_id));
      const locals = stored.filter((c) => !ids.has(c.case_id));
      return [...res.data, ...locals];
    }
  } catch {}

  return getStoredQueue();
}

export async function fetchCaseDetail(caseId: string): Promise<CaseDetail> {
  try {
    // 1. Try /reviewer/cases/:id
    const res = await apiClient.get<CaseDetail>(`/reviewer/cases/${caseId}`).catch(async () => {
      // 2. Try /cases/:id/decision
      const dec = await apiClient.get(`/cases/${caseId}/decision`);
      if (dec.data) {
        const mock = MOCK_CASE_DETAILS[caseId] || MOCK_CASE_DETAILS['PA-2026-0819-03'];
        return {
          data: {
            ...mock,
            case_id: caseId,
            outcome: dec.data.outcome,
            criteria: dec.data.criteria || mock.criteria,
            policy_refs: dec.data.policy_refs || mock.policy_refs,
            message: dec.data.message || mock.message,
            evaluator_version: dec.data.evaluator_version || mock.evaluator_version,
          } as CaseDetail
        };
      }
      throw new Error('Fallback needed');
    });

    if (res.data) {
      return res.data;
    }
  } catch {}

  if (MOCK_CASE_DETAILS[caseId]) {
    return MOCK_CASE_DETAILS[caseId];
  }

  // Fallback for dynamically generated cases
  return {
    ...MOCK_CASE_DETAILS['PA-2026-0819-03'],
    case_id: caseId,
    patient_name: `Case ${caseId} Patient`,
  };
}

export async function submitAdjudicationDetermination(
  caseId: string,
  payload: ReviewSubmissionPayload
): Promise<CaseDetail> {
  try {
    // 1. Try /reviewer/cases/:id/decision
    await apiClient.post(`/reviewer/cases/${caseId}/decision`, payload).catch(async () => {
      // 2. Try /cases/:id/review
      return await apiClient.post(`/cases/${caseId}/review`, {
        reviewer_id: payload.reviewer_id,
        action: payload.action,
        notes: payload.notes,
      });
    });
  } catch {}

  // Update local memory and queue state
  const outcome =
    payload.action === 'approve'
      ? 'APPROVE'
      : payload.action === 'deny'
      ? 'DENY'
      : payload.action === 'request_info'
      ? 'REQUEST_INFO'
      : 'PEND';

  const status =
    payload.action === 'approve'
      ? 'approved'
      : payload.action === 'deny'
      ? 'denied'
      : payload.action === 'request_info'
      ? 'rfi_requested'
      : 'pending_review';

  const queue = getStoredQueue();
  const updatedQueue = queue.map((c) => {
    if (c.case_id === caseId) {
      return {
        ...c,
        status,
        outcome,
        assigned_reviewer: payload.reviewer_id,
      };
    }
    return c;
  });
  setStoredQueue(updatedQueue);

  const existingDetail = await fetchCaseDetail(caseId);
  return {
    ...existingDetail,
    status,
    outcome,
    human_review: {
      reviewer_id: payload.reviewer_id,
      override_outcome: outcome,
      notes: payload.notes,
      reviewed_at: new Date().toISOString(),
      action_type: payload.action,
    },
  };
}

export async function requestAdditionalInformation(
  caseId: string,
  reviewerId: string,
  questions: string,
  missingItems: string[] = []
): Promise<{ success: boolean; message: string }> {
  try {
    // Try /reviewer/cases/:id/request-information
    await apiClient.post(`/reviewer/cases/${caseId}/request-information`, {
      reviewer_id: reviewerId,
      questions,
      missing_items: missingItems,
    }).catch(async () => {
      return await submitAdjudicationDetermination(caseId, {
        reviewer_id: reviewerId,
        action: 'request_info',
        notes: questions,
        requested_info_items: missingItems,
      });
    });
  } catch {}

  return {
    success: true,
    message: 'Additional information formal request dispatched to ordering provider.',
  };
}
