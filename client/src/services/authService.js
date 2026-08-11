import { apiClient, setTokens, clearTokens, getStoredRefreshToken } from '../lib/apiClient';

export const authService = {
  /**
   * Sign in an existing AxioGo user via FastAPI backend.
   */
  async login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const tokens = await apiClient.post('/auth/login', {
      email: normalizedEmail,
      password,
    }, { auth: false });

    setTokens(tokens);
    const user = await this.getCurrentUser();
    return { session: { tokens, user }, user };
  },

  /**
   * Create a new AxioGo user via FastAPI backend.
   */
  async register({
    email,
    password,
    username,
    fullName,
    dateOfBirth,
  }) {
    const normalizedEmail = email.trim().toLowerCase();
    const name = (fullName || username || normalizedEmail.split('@')[0]).trim();

    const tokens = await apiClient.post('/auth/register', {
      name,
      email: normalizedEmail,
      password,
      username: username?.trim() || null,
      date_of_birth: dateOfBirth || null,
    }, { auth: false });

    setTokens(tokens);
    const user = await this.getCurrentUser();
    return { session: { tokens, user }, user };
  },

  /**
   * Fetch currently authenticated user identity and role from backend.
   */
  async getCurrentUser() {
    return await apiClient.get('/auth/me');
  },

  /**
   * Verify signup OTP. Stubbed for V1 backend authentication.
   */
  async verifySignupOtp() {
    return { success: true };
  },

  /**
   * Resend signup OTP. Stubbed for V1 backend authentication.
   */
  async resendSignupOtp() {
    return { success: true };
  },

  /**
   * Send a password-reset email.
   */
  async sendPasswordReset() {
    return { success: true };
  },

  /**
   * Update the user's password.
   */
  async updatePassword() {
    return { success: true };
  },

  /**
   * Sign out the currently authenticated user.
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Backend logout call failed or was already unauthorized:', err);
    } finally {
      clearTokens();
    }
    return true;
  },

  /**
   * Restore existing session from stored refresh token.
   */
  async getSession() {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const tokens = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      }, { auth: false });

      setTokens(tokens);
      const user = await this.getCurrentUser();
      return { tokens, user };
    } catch {
      clearTokens();
      return null;
    }
  },

  /**
   * Dummy listener wrapper for backward compatibility.
   */
  onAuthStateChange() {
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },

  /**
   * Start Google OAuth.
   */
  async loginWithGoogle() {
    throw new Error('Google OAuth is not configured in this environment.');
  },
};