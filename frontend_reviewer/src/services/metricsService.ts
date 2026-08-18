import { apiClient } from './apiClient';
import { SystemMetrics } from '../types/observability';
import { MOCK_OBSERVABILITY_METRICS } from './mockReviewerData';

export async function fetchObservabilityMetrics(): Promise<SystemMetrics> {
  try {
    const res = await apiClient.get<SystemMetrics>('/operations/observability/metrics');
    if (res.data) return res.data;
  } catch {}
  return MOCK_OBSERVABILITY_METRICS;
}
