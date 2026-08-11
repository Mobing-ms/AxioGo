import {
  apiClient,
  setTokens,
  clearTokens,
  getStoredRefreshToken,
} from '../lib/apiClient';

import {
  supabase,
  isSupabaseConfigured,
} from '../lib/supabase';

const normalizeEmail = (email) =>
  String(email || '').trim().toLowerCase();

const requireSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase;
};

const getErrorMessage = (error) => {
  if (!error) return '';

  return String(
    error?.message ||
    error?.detail ||
    error?.error_description ||
    ''
  );
};

const getErrorStatus = (error) =>
  Number(
    error?.status ??
    error?.statusCode ??
    error?.response?.status ??
    0
  );

export const authService = {

  // ============================================================
  // LOGIN
  // ============================================================

  async login(email, password) {
    const normalizedEmail = normalizeEmail(email);

    try {
      const tokens = await apiClient.post(
        '/auth/login',
        {
          email: normalizedEmail,
          password,
        },
        { auth: false }
      );

      setTokens(tokens);

      const user = await this.getCurrentUser();

      return {
        session: {
          tokens,
          user,
        },
        user,
      };

    } catch (error) {

      const status = getErrorStatus(error);
      const message = getErrorMessage(error);
      const lower = message.toLowerCase();

      if (
        lower.includes('created with google') ||
        lower.includes('continue with google')
      ) {
        throw new Error(
          'This account was created with Google. Please continue with Google to sign in.'
        );
      }

      if (status === 403) {
        throw new Error(
          'Please verify your email before signing in.'
        );
      }

      if (
        status === 401 ||
        lower.includes('invalid email or password')
      ) {
        throw new Error(
          'Invalid email or password.'
        );
      }

      throw error;
    }
  },

  // ============================================================
  // REGISTER
  // ============================================================

  async register({
    email,
    password,
    username,
    fullName,
    dateOfBirth,
  }) {
    const normalizedEmail = normalizeEmail(email);

    const name =
      String(fullName || username || normalizedEmail.split('@')[0])
        .trim();

    const client = requireSupabase();

    /*
     * IMPORTANT:
     *
     * First create the Supabase Auth account.
     * Supabase is responsible for sending the OTP.
     *
     * We do NOT create an AxioGo JWT here.
     */

    const {
      data: supabaseData,
      error: supabaseError,
    } = await client.auth.signUp({
      email: normalizedEmail,
      password,

      options: {
        data: {
          username: username?.trim() || null,
          full_name: name,
          date_of_birth: dateOfBirth || null,
          role: 'STANDARD_USER',
        },
      },
    });

    if (supabaseError) {
      const status = getErrorStatus(supabaseError);
      const message = getErrorMessage(supabaseError);
      const lower = message.toLowerCase();

      if (
        status === 429 ||
        lower.includes('rate limit') ||
        lower.includes('rate_limit')
      ) {
        throw new Error(
          'Too many email requests. Please wait a moment and try again.'
        );
      }

      if (
        lower.includes('already registered') ||
        lower.includes('already exists') ||
        lower.includes('user already')
      ) {
        throw new Error(
          'An account with this email address already exists. Please sign in instead.'
        );
      }

      throw new Error(
        message || 'Unable to create the account.'
      );
    }

    /*
     * Now synchronize the AxioGo backend user.
     *
     * The backend creates the user as INACTIVE.
     * It becomes ACTIVE only after OTP verification.
     */

    try {

      await apiClient.post(
        '/auth/register',
        {
          name,
          email: normalizedEmail,
          password,
          username: username?.trim() || null,
          date_of_birth: dateOfBirth || null,
        },
        { auth: false }
      );

    } catch (backendError) {

      const status = getErrorStatus(backendError);
      const message = getErrorMessage(backendError);
      const lower = message.toLowerCase();

      if (
        status === 409 ||
        lower.includes('already exists') ||
        lower.includes('created with google')
      ) {

        /*
         * Supabase signup succeeded but AxioGo already has
         * an account. Do not destroy the Supabase account.
         *
         * If the backend account is already active, this is
         * a genuine duplicate.
         */

        if (lower.includes('created with google')) {
          throw new Error(
            'This account was created with Google. Please continue with Google to sign in.'
          );
        }

        throw new Error(
          'An account with this email address already exists. Please sign in instead.'
        );
      }

      throw backendError;
    }

    /*
     * If Supabase returned a session immediately, email
     * confirmation is disabled. Exchange it for AxioGo JWT.
     *
     * Normally, with email OTP enabled, session will be null.
     */

    if (supabaseData?.session?.access_token) {

      const tokens = await apiClient.post(
        '/auth/verify-email',
        {
          supabase_access_token:
            supabaseData.session.access_token,
        },
        { auth: false }
      );

      setTokens(tokens);

      const user = await this.getCurrentUser();

      return {
        session: {
          tokens,
          user,
        },
        user,
      };
    }

    /*
     * Normal OTP path.
     */

    return {
      verificationRequired: true,
      email: normalizedEmail,
      user: supabaseData?.user || null,
    };
  },

  // ============================================================
  // VERIFY SIGNUP OTP
  // ============================================================

  async verifySignupOtp(email, token) {

    const client = requireSupabase();

    const normalizedEmail =
      normalizeEmail(email);

    const cleanToken =
      String(token || '').trim();

    if (!cleanToken) {
      throw new Error(
        'Please enter the verification code.'
      );
    }

    const {
      data,
      error,
    } = await client.auth.verifyOtp({
      email: normalizedEmail,
      token: cleanToken,
      type: 'signup',
    });

    if (error) {
      throw new Error(
        error.message ||
        'Invalid or expired verification code.'
      );
    }

    if (!data?.session?.access_token) {
      throw new Error(
        'Email verification succeeded, but Supabase did not return a session.'
      );
    }

    /*
     * Tell FastAPI that the Supabase email has been verified.
     * FastAPI activates the AxioGo user and creates the normal
     * AxioGo JWT.
     */

    const tokens = await apiClient.post(
      '/auth/verify-email',
      {
        supabase_access_token:
          data.session.access_token,
      },
      { auth: false }
    );

    setTokens(tokens);

    const user =
      await this.getCurrentUser();

    return {
      session: {
        tokens,
        user,
      },
      user,
    };
  },

  // ============================================================
  // RESEND OTP
  // ============================================================

  async resendSignupOtp(email) {

    const client =
      requireSupabase();

    const {
      error,
    } = await client.auth.resend({
      type: 'signup',
      email: normalizeEmail(email),
    });

    if (error) {
      throw new Error(
        error.message ||
        'Unable to resend the verification code.'
      );
    }

    return true;
  },

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  async sendPasswordReset(email) {

    const client =
      requireSupabase();

    const {
      error,
    } = await client.auth.resetPasswordForEmail(
      normalizeEmail(email),
      {
        redirectTo:
          window.location.origin,
      }
    );

    if (error) {
      throw new Error(
        error.message ||
        'Unable to send the password reset email.'
      );
    }

    return true;
  },

  // ============================================================
  // UPDATE PASSWORD
  // ============================================================

  async updatePassword(password) {

    const client =
      requireSupabase();

    const {
      error,
    } = await client.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(
        error.message ||
        'Unable to update the password.'
      );
    }

    return true;
  },

  // ============================================================
  // CURRENT USER
  // ============================================================

  async getCurrentUser() {
    return await apiClient.get(
      '/auth/me'
    );
  },

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  async loginWithGoogle() {

    const client =
      requireSupabase();

    const {
      data,
      error,
    } = await client.auth.signInWithOAuth({
      provider: 'google',

      options: {
        redirectTo:
          window.location.origin,
      },
    });

    if (error) {
      throw new Error(
        error.message ||
        'Unable to continue with Google.'
      );
    }

    /*
     * OAuth redirects the browser to Google.
     *
     * There is intentionally no session here yet.
     * AuthContext will restore the Supabase session
     * after Google redirects back to AxioGo.
     */

    return data;
  },

  // ============================================================
  // RESTORE SESSION
  // ============================================================

  async getSession() {

    /*
     * First try the AxioGo backend JWT.
     */

    const refreshToken =
      getStoredRefreshToken();

    if (refreshToken) {

      try {

        const tokens =
          await apiClient.post(
            '/auth/refresh',
            {
              refresh_token:
                refreshToken,
            },
            { auth: false }
          );

        setTokens(tokens);

        const user =
          await this.getCurrentUser();

        return {
          session: {
            tokens,
            user,
          },
          user,
        };

      } catch {

        clearTokens();
      }
    }

    /*
     * Then check Supabase.
     *
     * This is especially important after
     * Google redirects back to the application.
     */

    if (
      !isSupabaseConfigured ||
      !supabase
    ) {
      return null;
    }

    const {
      data,
      error,
    } =
      await supabase.auth.getSession();

    if (
      error ||
      !data?.session
    ) {
      return null;
    }

    const session =
      data.session;

    const user =
      session.user;

    const provider =
      user?.app_metadata?.provider ||
      user?.identities?.find(
        (identity) =>
          identity.provider === 'google'
      )?.provider;

    /*
     * Google OAuth session.
     *
     * Exchange it for AxioGo JWT.
     */

    if (provider === 'google') {

      const tokens =
        await apiClient.post(
          '/auth/google',
          {
            supabase_access_token:
              session.access_token,
          },
          { auth: false }
        );

      setTokens(tokens);

      const backendUser =
        await this.getCurrentUser();

      return {
        session: {
          tokens,
          user: backendUser,
        },
        user: backendUser,
      };
    }

    /*
     * Local signup session can exist immediately after
     * OTP verification. If the backend JWT isn't present,
     * exchange the verified Supabase session.
     */

    if (
      user?.email_confirmed_at
    ) {

      try {

        const tokens =
          await apiClient.post(
            '/auth/verify-email',
            {
              supabase_access_token:
                session.access_token,
            },
            { auth: false }
          );

        setTokens(tokens);

        const backendUser =
          await this.getCurrentUser();

        return {
          session: {
            tokens,
            user: backendUser,
          },
          user: backendUser,
        };

      } catch {
        return null;
      }
    }

    return null;
  },

  // ============================================================
  // AUTH STATE CHANGE
  // ============================================================

  onAuthStateChange(callback) {

    if (
      isSupabaseConfigured &&
      supabase
    ) {
      return supabase.auth.onAuthStateChange(
        callback
      );
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => { },
        },
      },
    };
  },

  // ============================================================
  // LOGOUT
  // ============================================================

  async logout() {

    try {

      await apiClient.post(
        '/auth/logout'
      );

    } catch {
      // Backend logout is audit-only
      // in the current V1 architecture.
    }

    clearTokens();

    if (
      isSupabaseConfigured &&
      supabase
    ) {

      try {
        await supabase.auth.signOut();
      } catch {
        // Continue clearing local state.
      }
    }

    return true;
  },
};