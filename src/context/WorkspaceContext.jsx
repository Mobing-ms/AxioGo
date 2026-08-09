import React, { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState('Global Operations');
  const [selectedDataset, setSelectedDataset] = useState('Vehicle Telemetry');
  const [activeFilters, setActiveFilters] = useState({
    dateRange: 'Last 30 Days',
    domain: 'Fleet Operations',
    vehicleGroup: 'Vehicle Group A',
    severity: 'All'
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Dataset Processing Complete',
      message: 'Vehicle Telemetry v2.4 successfully ingested into Gold Catalog.',
      time: '10m ago',
      type: 'pipeline',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Action Requires Approval',
      message: 'High-risk Databricks job trigger requested by AXIS Workflow Agent.',
      time: '25m ago',
      type: 'action',
      read: false
    },
    {
      id: 'notif_3',
      title: 'Power BI Dataset Refreshed',
      message: 'Fleet Operations Report updated with latest Databricks metrics.',
      time: '1h ago',
      type: 'powerbi',
      read: true
    }
  ]);

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <WorkspaceContext.Provider value={{
      activeWorkspace,
      setActiveWorkspace,
      selectedDataset,
      setSelectedDataset,
      activeFilters,
      setActiveFilters,
      notifications,
      markNotificationRead,
      clearNotifications
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
