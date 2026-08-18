import axios from 'axios';

// Support VITE_API_URL or VITE_API_BASE_URL or fallback to http://localhost:8000
const baseURL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export async function checkBackendHealth(): Promise<{ online: boolean; version?: string }> {
  try {
    const res = await apiClient.get('/health', { timeout: 3000 });
    return {
      online: res.status >= 200 && res.status < 300,
      version: res.data?.evaluator_version || 'v1.0.0',
    };
  } catch {
    return { online: false };
  }
}
