import { apiClient } from '../lib/apiClient';

// Fallback constants to prevent any React compilation/import errors
export const FLEET_KPIS = [];
export const TELEMETRY_ACTIVITY_DATA = [];
export const MAINTENANCE_BY_CATEGORY = [];
export const CLAIMS_SEVERITY_BREAKDOWN = [];
export const AI_INSIGHT_CARDS = [];

export const getFleetKPIs = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await apiClient.get(`/analytics/fleet-kpis?${query}`);
  return res.data;
};

export const getTelemetryData = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await apiClient.get(`/analytics/telemetry-activity?${query}`);
  return res.data;
};

export const getMaintenanceCategories = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await apiClient.get(`/analytics/maintenance-categories?${query}`);
  return res.data;
};

export const getClaimsSeverity = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await apiClient.get(`/analytics/claims-severity?${query}`);
  return res.data;
};

export const getAiInsights = async () => {
  const res = await apiClient.get('/analytics/ai-insights');
  return res.data;
};
