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

const getRoleFromUser = (user) => {
  const role = user?.role;

  if (role === 'ADMIN') {
    return ROLES.ADMIN;
  }
  if (role === 'AUTHORIZED_USER' || role === 'AUTHORIZED USER' || role === 'AUTHORIZED') {
    return ROLES.AUTHORIZED;
  }

  return ROLES.STANDARD;
};

// ============================================================
// USER MAPPING
// ============================================================

const mapBackendUser = (user) => {
  if (!user) {
    return null;
  }

  const name = user.name || user.email?.split('@')[0] || 'AxioGo User';

  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'AX';

  return {
    id: user.id,
    name,
    username: user.username || name,
    email: user.email || '',
    role: user.role,
    permissions: user.permissions || [],
    avatar: user.avatar || initials,
  };
};

// ============================================================
// AUTH PROVIDER
// ============================================================

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(ROLES.STANDARD);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // APPLY SESSION
  // ==========================================================

  const applySession = (newSession) => {
    setSession(newSession);

    if (newSession?.user) {
      const user = mapBackendUser(newSession.user);
      const role = getRoleFromUser(newSession.user);

      setCurrentUser(user);
      setCurrentRole(role);
    } else {
      setCurrentUser(null);
      setCurrentRole(ROLES.STANDARD);
    }
  };

  // ==========================================================
  // INITIALIZE AUTH
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const existingSession = await authService.getSession();

        if (!mounted) return;
        applySession(existingSession);
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
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

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (email, password) => {
    const data = await authService.login(email, password);

    if (data?.session) {
      applySession(data.session);
    }

    return data;
  };

  // ==========================================================
  // REGISTER
  // ==========================================================

  const register = async (payload) => {
    const data = await authService.register(payload);

    if (data?.session) {
      applySession(data.session);
    }

    return data;
  };

  // ==========================================================
  // VERIFY SIGNUP OTP
  // ==========================================================

  const verifySignupOtp = async (email, token) => {
    const data = await authService.verifySignupOtp(email, token);

    if (data?.session) {
      applySession(data.session);
    }

    return data;
  };

  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  const loginWithGoogle = async () => {
    return authService.loginWithGoogle();
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {
    applySession(null);

    try {
      await authService.logout();
    } catch (error) {
      console.error('Failed to sign out from backend:', error);
      throw error;
    }
  };

  // ==========================================================
  // DEVELOPMENT ROLE SWITCHING
  // ==========================================================

  const switchRole = (newRole) => {
    if (!import.meta.env.DEV) return;

    if (Object.values(ROLES).includes(newRole)) {
      setCurrentRole(newRole);
    }
  };

  // ==========================================================
  // FRONTEND PERMISSIONS
  // ==========================================================

  const canAccessRawData =
    currentRole === ROLES.ADMIN || currentRole === ROLES.AUTHORIZED;

  const canAccessDatabricksOps = currentRole === ROLES.ADMIN;

  const canAccessPowerBiRefresh =
    currentRole === ROLES.ADMIN || currentRole === ROLES.AUTHORIZED;

  const canApproveHighRiskActions = currentRole === ROLES.ADMIN;

  const canManageUsers = currentRole === ROLES.ADMIN;

  const canUploadDatasets = currentRole === ROLES.ADMIN;

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
    session,
    currentUser,
    currentRole,
    loading,
    login,
    register,
    verifySignupOtp,
    loginWithGoogle,
    logout,
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// USE AUTH HOOK
// ============================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};