import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAuditLogs } from '../../services/auditService';
import { RoleBadge } from '../common/RoleBadge';
import { ShieldCheck, Filter, AlertTriangle, FileText, Search } from 'lucide-react';

export const AuditLogsView = () => {
  const { currentRole } = useAuth();
  const [logs, setLogs] = useState(getAuditLogs());
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredLogs = logs.filter(l => {
    return severityFilter === 'ALL' || l.severity === severityFilter;
  });

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-axio-green" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">ENTERPRISE AUDIT LOGS</h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Immutable security and execution audit trail across all enterprise user roles and AXIS agents.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-axio-muted uppercase text-[10px]">Filter Severity:</span>
          {['ALL', 'HIGH', 'CRITICAL', 'NEUTRAL'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded border transition-colors ${
                severityFilter === sev
                  ? 'bg-axio-red text-white border-axio-red font-bold'
                  : 'bg-axio-panel text-axio-text-sub border-axio-border hover:border-axio-border-bright'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-axio-panel border border-axio-border rounded-lg overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-axio-card border-b border-axio-border text-axio-muted uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Event</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Action Details</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-axio-border text-axio-text-sub">
              {filteredLogs.map((log) => (
                <tr key={log.id} className={`hover:bg-axio-card/60 transition-colors ${
                  log.severity === 'CRITICAL' ? 'bg-axio-red/5' : ''
                }`}>
                  <td className="p-4 text-axio-muted font-mono">{log.timestamp}</td>
                  <td className="p-4 font-bold text-white">{log.user}</td>
                  <td className="p-4"><RoleBadge role={log.role} compact /></td>
                  <td className="p-4 text-axio-cyan font-bold">{log.event}</td>
                  <td className="p-4 text-axio-text-secondary">{log.resource}</td>
                  <td className="p-4 font-sans text-axio-text-sub max-w-xs">{log.action}</td>
                  <td className="p-4 text-right font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      'bg-axio-red/10 border-axio-red/30 text-axio-red'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
