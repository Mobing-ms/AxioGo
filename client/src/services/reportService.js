import { apiClient } from '../lib/apiClient';

// Export an empty array to prevent React import errors during component initialization
export const INITIAL_REPORTS = [];

export const getReports = async () => {
  return await apiClient.get('/reports');
};

export const generateNewReport = async (title, format, category) => {
  const payload = {
    title: title || 'AxioGo AI Decision Intelligence Report',
    type: category || 'Analytics Summary',
    format: format || 'PDF',
    summary: 'Synthesized report generated directly from AXIS multi-agent analytical context.'
  };
  return await apiClient.post('/reports', payload);
};
