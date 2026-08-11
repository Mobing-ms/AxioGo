import { apiClient, setTokens, clearTokens } from '../lib/apiClient';

export async function login(email, password) {
  const tokens = await apiClient.post('/auth/login', { email, password }, { auth: false });
  setTokens(tokens);
  const me = await apiClient.get('/auth/me');
  return me;
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout', {});
  } finally {
    clearTokens();
  }
}

export async function getCurrentUser() {
  return apiClient.get('/auth/me');
}
