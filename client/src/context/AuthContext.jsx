import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { authService } from '../services/authService';

// ============================================================
// AXIOGO ROLES
// ============================================================

export const ROLES = {
  ADMIN: 'ADMIN',
  AUTHORIZED: 'AUTHORIZED USER',
  STANDARD: 'STANDARD USER',
};

const AuthContext = createContext(null);

// ============================================================
// ROLE RESOLUTION
// ============================================================

/**
 * TEMPORARY role resolution.
 *
 * Current phase:
 *     Supabase user metadata → role
 *
 * Final architecture:
 *     Supabase user ID
 *          ↓
 *     AxioGo profiles table
 *          ↓
 *     FastAPI RBAC
 *          ↓
 *     authoritative role
 *
 * We will replace this with the backend profile
 * lookup once the Supabase profiles table is created.
 */
const getRoleFromUser = (user) => {
  const role =
    user?.user_metadata?.role;

  if (
    role &&
    Object.values(ROLES).includes(role)
  ) {
    return role;
  }

  return ROLES.STANDARD;
};

// ============================================================
// USER MAPPING
// ============================================================

const mapSupabaseUser = (user) => {
  if (!user) {
    return null;
  }

  const metadata =
    user.user_metadata || {};

  const name =
    metadata.username ||
    metadata.full_name ||
    metadata.name ||
    user.email?.split('@')[0] ||
    'AxioGo User';

  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]
      )
      .join('')
      .toUpperCase() || 'AX';

  return {
    id: user.id,

    name,

    username:
      metadata.username ||
      name,

    email:
      user.email || '',

    department:
      metadata.department || '',

    dateOfBirth:
      metadata.date_of_birth ||
      '',

    avatar:
      metadata.avatar ||
      initials,
  };
};

// ============================================================
// AUTH PROVIDER
// ============================================================

export const AuthProvider = ({
  children,
}) => {
  const [
    session,
    setSession,
  ] = useState(null);

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  const [
    currentRole,
    setCurrentRole,
  ] = useState(ROLES.STANDARD);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ==========================================================
  // APPLY SESSION
  // ==========================================================

  const applySession = (
    newSession
  ) => {
    setSession(newSession);

    if (newSession?.user) {
      const user =
        mapSupabaseUser(
          newSession.user
        );

      const role =
        getRoleFromUser(
          newSession.user
        );

      setCurrentUser(user);
      setCurrentRole(role);
    } else {
      setCurrentUser(null);
      setCurrentRole(
        ROLES.STANDARD
      );
    }
  };

  // ==========================================================
  // INITIALIZE AUTH
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth =
      async () => {
        try {
          const existingSession =
            await authService.getSession();

          if (!mounted) {
            return;
          }

          applySession(
            existingSession
          );
        } catch (error) {
          console.error(
            'Failed to initialize authentication:',
            error
          );

          if (mounted) {
            applySession(null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    initializeAuth();

    // ========================================================
    // SUPABASE AUTH LISTENER
    // ========================================================

    const {
      data: {
        subscription,
      },
    } =
      authService.onAuthStateChange(
        (_event, newSession) => {
          if (!mounted) {
            return;
          }

          applySession(
            newSession
          );

          setLoading(false);
        }
      );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    email,
    password
  ) => {
    const data =
      await authService.login(
        email,
        password
      );

    /*
     * Supabase's auth listener will normally
     * update the state automatically.
     *
     * We also apply the returned session
     * immediately for a responsive UI.
     */
    if (data?.session) {
      applySession(
        data.session
      );
    }

    return data;
  };

  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  const loginWithGoogle =
    async () => {
      return authService.loginWithGoogle();
    };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {
    /*
     * First clear the local application state.
     *
     * This guarantees that the UI immediately
     * becomes unauthenticated even if Supabase
     * takes a moment to finish the request.
     */
    applySession(null);

    try {
      await authService.logout();
    } catch (error) {
      /*
       * If Supabase reports an error, keep the
       * local application logged out rather than
       * leaving the user inside the protected app.
       */
      console.error(
        'Failed to sign out from Supabase:',
        error
      );

      throw error;
    }
  };

  // ==========================================================
  // DEVELOPMENT ROLE COMPATIBILITY
  // ==========================================================

  /**
   * IMPORTANT:
   *
   * This is retained temporarily so existing components
   * that import switchRole do not immediately break.
   *
   * It is NOT authoritative authentication.
   *
   * The Header no longer exposes this functionality.
   *
   * Once the FastAPI/Supabase RBAC layer is connected,
   * this function should be removed completely.
   */
  const switchRole = (
    newRole
  ) => {
    if (!import.meta.env.DEV) {
      return;
    }

    if (
      Object.values(ROLES).includes(
        newRole
      )
    ) {
      setCurrentRole(
        newRole
      );
    }
  };

  // ==========================================================
  // FRONTEND PERMISSIONS
  // ==========================================================

  /*
   * These are UI visibility helpers only.
   *
   * REAL authorization will eventually happen
   * inside FastAPI.
   */

  const canAccessRawData =
    currentRole ===
    ROLES.ADMIN ||
    currentRole ===
    ROLES.AUTHORIZED;

  const canAccessDatabricksOps =
    currentRole ===
    ROLES.ADMIN;

  const canAccessPowerBiRefresh =
    currentRole ===
    ROLES.ADMIN ||
    currentRole ===
    ROLES.AUTHORIZED;

  const canApproveHighRiskActions =
    currentRole ===
    ROLES.ADMIN;

  const canManageUsers =
    currentRole ===
    ROLES.ADMIN;

  const canUploadDatasets =
    currentRole ===
    ROLES.ADMIN;

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
    session,

    currentUser,

    currentRole,

    loading,

    login,

    loginWithGoogle,

    logout,

    /*
     * Temporary compatibility only.
     */
    switchRole,

    ROLES,

    permissions: {
      canAccessRawData,

      canAccessDatabricksOps,

      canAccessPowerBiRefresh,

      canApproveHighRiskActions,

      canManageUsers,

      canUploadDatasets,
    },
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// USE AUTH
// ============================================================

export const useAuth = () => {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};