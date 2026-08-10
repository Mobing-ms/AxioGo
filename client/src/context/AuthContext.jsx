import React, { createContext, useContext, useState } from 'react';

// Exactly 3 enterprise roles defined in PRD
export const ROLES = {
  ADMIN: 'ADMIN',
  AUTHORIZED: 'AUTHORIZED USER',
  STANDARD: 'STANDARD USER'
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to ADMIN for rich demo exploration, with instant role switcher UI
  const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_enterprise_01',
    name: 'Alex Vance',
    email: 'a.vance@fleet-enterprise.com',
    department: 'Vehicle Operations & Fleet Analytics',
    avatar: 'AV'
  });

  const switchRole = (newRole) => {
    if (Object.values(ROLES).includes(newRole)) {
      setCurrentRole(newRole);
    }
  };

  // RBAC Permission Helpers
  const canAccessRawData = currentRole === ROLES.ADMIN || currentRole === ROLES.AUTHORIZED;
  const canAccessDatabricksOps = currentRole === ROLES.ADMIN;
  const canAccessPowerBiRefresh = currentRole === ROLES.ADMIN || currentRole === ROLES.AUTHORIZED;
  const canApproveHighRiskActions = currentRole === ROLES.ADMIN;
  const canManageUsers = currentRole === ROLES.ADMIN;
  const canUploadDatasets = currentRole === ROLES.ADMIN;

  return (
    <AuthContext.Provider value={{
      currentRole,
      currentUser,
      switchRole,
      ROLES,
      permissions: {
        canAccessRawData,
        canAccessDatabricksOps,
        canAccessPowerBiRefresh,
        canApproveHighRiskActions,
        canManageUsers,
        canUploadDatasets
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
