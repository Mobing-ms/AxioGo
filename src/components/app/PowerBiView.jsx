import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';
import { RefreshCw, CheckCircle2, Layers, ExternalLink, BarChart2, ShieldCheck } from 'lucide-react';

export const PowerBiView = () => {
  const { currentRole, permissions } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('10 minutes ago');

  const handleRefreshPowerBi = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 2000);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">POWER BI ENTERPRISE REPORTING</h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Power BI remains available for enterprise reporting. AxioGo complements Power BI with decision intelligence.
          </p>
        </div>

        {permissions.canAccessPowerBiRefresh && (
          <button
            onClick={handleRefreshPowerBi}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded shadow-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'REFRESHING CACHE...' : 'REFRESH POWER BI'}</span>
          </button>
        )}
      </div>

      {/* Embedded Power BI Report Frame Simulation */}
      <div className="bg-axio-panel border border-axio-border rounded-lg p-6 shadow-2xl mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-axio-border mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="font-bold text-sm text-white">EMBEDDED POWER BI REPORT: FLEET OPERATIONS EXECUTIVE SUITE</span>
          </div>
          <span className="text-xs text-axio-muted">Last Cache Refresh: {lastRefreshed}</span>
        </div>

        {/* Mock Embedded Power BI Visualization Screen */}
        <div className="relative min-h-[400px] bg-axio-bg border border-axio-border rounded-lg flex flex-col items-center justify-center p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-tech-grid opacity-20" />
          
          <BarChart2 className="w-16 h-16 text-amber-400 mb-4 animate-pulse" />
          <h2 className="text-lg font-bold text-white mb-2">POWER BI EMBEDDED DASHBOARD READY</h2>
          <p className="max-w-md text-xs text-axio-text-secondary mb-6 font-sans">
            Displaying live Power BI report tiles synchronized with Databricks Gold Layer dataset `insight_fleet_operations`.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl font-mono text-xs">
            <div className="p-3 bg-axio-card border border-axio-border rounded">
              <span className="text-[10px] text-axio-muted block">POWER BI CACHE</span>
              <span className="text-axio-green font-bold">SYNCHRONIZED</span>
            </div>
            <div className="p-3 bg-axio-card border border-axio-border rounded">
              <span className="text-[10px] text-axio-muted block">DATA SOURCE</span>
              <span className="text-axio-cyan font-bold">DATABRICKS GOLD</span>
            </div>
            <div className="p-3 bg-axio-card border border-axio-border rounded">
              <span className="text-[10px] text-axio-muted block">REST API STATUS</span>
              <span className="text-white font-bold">200 OK</span>
            </div>
            <div className="p-3 bg-axio-card border border-axio-border rounded">
              <span className="text-[10px] text-axio-muted block">SECURITY</span>
              <span className="text-axio-green font-bold">RLS ENFORCED</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
