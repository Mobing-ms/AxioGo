import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';
import { Shield, Users, Server, Cpu, CheckCircle2, RefreshCw, Key, Settings, AlertTriangle } from 'lucide-react';

export const AdminView = () => {
  const { currentRole, switchRole } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState('Monitoring');

  const usersList = [
    { id: 'usr_1', name: 'Alex Vance', email: 'a.vance@fleet.com', role: ROLES.ADMIN, status: 'Active', lastActive: '2m ago' },
    { id: 'usr_2', name: 'Sarah Analyst', email: 's.analyst@fleet.com', role: ROLES.AUTHORIZED, status: 'Active', lastActive: '15m ago' },
    { id: 'usr_3', name: 'Mark Standard', email: 'm.standard@fleet.com', role: ROLES.STANDARD, status: 'Active', lastActive: '1h ago' }
  ];

  const systemHealth = [
    { name: 'API GATEWAY', status: 'HEALTHY', latency: '4.2ms', icon: Server },
    { name: 'DATABRICKS LAKEHOUSE', status: 'HEALTHY', latency: '12ms', icon: Server },
    { name: 'AXIS MULTI-AGENT ENGINE', status: 'HEALTHY', latency: '18ms', icon: Cpu },
    { name: 'VOICE STT SERVICE', status: 'HEALTHY', latency: '24ms', icon: RefreshCw },
    { name: 'VOICE TTS SERVICE', status: 'HEALTHY', latency: '15ms', icon: RefreshCw },
    { name: 'POWER BI SERVICE API', status: 'HEALTHY', latency: '35ms', icon: Server }
  ];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-axio-red" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">ENTERPRISE ADMINISTRATION</h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Platform monitoring  |  User RBAC management  |  Databricks ops  |  AI copilot configuration
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-axio-border mb-8 gap-2 text-xs">
        {['Monitoring', 'User Management', 'Databricks Ops', 'AI Configuration'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveAdminTab(tab)}
            className={`px-4 py-2 border-b-2 font-bold transition-all ${activeAdminTab === tab ? 'border-axio-red text-white' : 'border-transparent text-axio-muted hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MONITORING TAB */}
      {activeAdminTab === 'Monitoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth.map((sys) => {
              const IconComp = sys.icon;
              return (
                <div key={sys.name} className="p-4 bg-axio-panel border border-axio-border rounded-lg flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-axio-muted block">{sys.name}</span>
                    <span className="text-axio-green font-bold flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{sys.status}</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-axio-text-sub bg-axio-bg border border-axio-border px-2 py-1 rounded">
                    {sys.latency}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeAdminTab === 'User Management' && (
        <div className="bg-axio-panel border border-axio-border rounded-lg overflow-hidden font-mono text-xs shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-axio-card text-axio-muted uppercase text-[10px]">
              <tr><th className="p-4">User</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-axio-border text-axio-text-sub">
              {usersList.map(u => (
                <tr key={u.id}>
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4 text-axio-muted">{u.email}</td>
                  <td className="p-4"><RoleBadge role={u.role} /></td>
                  <td className="p-4 text-axio-green">{u.status}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => switchRole(u.role)}
                      className="px-2.5 py-1 bg-axio-bg border border-axio-border hover:bg-axio-card text-axio-cyan rounded"
                    >
                      Test Role Context
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DATABRICKS OPS TAB */}
      {activeAdminTab === 'Databricks Ops' && (
        <div className="p-6 bg-axio-panel border border-axio-border rounded-lg space-y-4 font-mono text-xs">
          <h3 className="font-bold text-white text-sm">DATABRICKS WORKSPACE INTEGRATION OPTIONS</h3>
          <p className="text-axio-text-secondary font-sans">
            AxioGo interfaces with Databricks REST API v2.1 for catalog syncing and job execution.
          </p>
          <div className="p-4 bg-axio-bg border border-axio-border rounded text-axio-cyan font-bold">
            HOST: https://adb-fleet-enterprise.azuredatabricks.net | TOKEN: dapi_●●●●●●●●●●●● (VERIFIED)
          </div>
        </div>
      )}

      {/* AI CONFIGURATION TAB */}
      {activeAdminTab === 'AI Configuration' && (
        <div className="p-6 bg-axio-panel border border-axio-border rounded-lg space-y-4 font-mono text-xs">
          <h3 className="font-bold text-white text-sm">AXIS MULTI-AGENT ENGINE PARAMS</h3>
          <p className="text-axio-text-secondary font-sans">
            Configure temperature, max tokens, and RAG chunk retrieval boundaries.
          </p>
          <div className="space-y-2 max-w-md">
            <div><span className="text-axio-muted block">RAG VECTOR CHUNK LIMIT:</span><input type="number" defaultValue={8} className="bg-axio-bg border border-axio-border px-3 py-1.5 rounded text-white w-full" /></div>
            <div><span className="text-axio-muted block">MAX GENERATION TOKENS:</span><input type="number" defaultValue={2048} className="bg-axio-bg border border-axio-border px-3 py-1.5 rounded text-white w-full" /></div>
          </div>
        </div>
      )}

    </div>
  );
};
