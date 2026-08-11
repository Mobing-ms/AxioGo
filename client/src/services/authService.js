import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Sign in an existing AxioGo user.
   */
  async login(email, password) {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Create a new AxioGo user.
   *
   * Every newly created account starts as
   * STANDARD USER.
   *
   * The user cannot choose ADMIN or
   * AUTHORIZED USER from the frontend.
   */
  async register({
    email,
    password,
    username,
    fullName,
    dateOfBirth,
  }) {
    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,

        options: {
          data: {
            username:
              username?.trim() || null,

            full_name:
              fullName?.trim() || null,

            date_of_birth:
              dateOfBirth || null,

            // New users always start here.
            // Backend/RBAC can later promote them.
            role: 'STANDARD USER',
          },
        },
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Verify the 6-digit email OTP
   * sent after account creation.
   */
  async verifySignupOtp(email, token) {
    const { data, error } =
      await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: 'email',
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Resend the signup verification OTP/email.
   */
  async resendSignupOtp(email) {
    const { data, error } =
      await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Send a password-reset email.
   *
   * Supabase handles the reset email.
   */
  async sendPasswordReset(email) {
    const { data, error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Update the user's password after
   * they return from the password-reset flow.
   */
  async updatePassword(password) {
    const { data, error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Sign out the currently authenticated user.
   *
   * This removes the real Supabase session.
   */
  async logout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },

  /**
   * Get the currently persisted Supabase session.
   *
   * Used when the application starts or
   * the browser is refreshed.
   */
  async getSession() {
    const { data, error } =
      await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  },

  /**
   * Listen for Supabase authentication changes.
   *
   * Examples:
   * - SIGNED_IN
   * - SIGNED_OUT
   * - TOKEN_REFRESHED
   * - USER_UPDATED
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(
      callback
    );
  },

  /**
   * Start Google OAuth.
   */
  async loginWithGoogle() {
    const { data, error } =
      await supabase.auth.signInWithOAuth({
        provider: 'google',

        options: {
          redirectTo:
            window.location.origin,
        },
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};