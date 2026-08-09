import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_ACTIONS, executeAction, approveAction, rejectAction } from '../../services/actionService';
import { RoleBadge } from '../common/RoleBadge';
import { Zap, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw, X, Play, ShieldAlert } from 'lucide-react';

export const ActionsView = () => {
  const { currentRole, permissions } = useAuth();
  const [actionsList, setActionsList] = useState(INITIAL_ACTIONS);
  const [selectedActionModal, setSelectedActionModal] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleExecuteLowRisk = async (actionId) => {
    setIsProcessingAction(true);
    const res = await executeAction(actionId);
    setActionsList(prev => prev.map(a => a.id === actionId ? { ...a, status: 'COMPLETED', executedAt: res.executedAt } : a));
    setIsProcessingAction(false);
  };

  const handleApproveHighRisk = async (actionId) => {
    setIsProcessingAction(true);
    const res = await approveAction(actionId);
    setActionsList(prev => prev.map(a => a.id === actionId ? { ...a, status: 'COMPLETED', executedAt: res.executedAt } : a));
    setIsProcessingAction(false);
    setSelectedActionModal(null);
  };

  const handleRejectHighRisk = async (actionId) => {
    setIsProcessingAction(true);
    const res = await rejectAction(actionId, rejectReason);
    setActionsList(prev => prev.map(a => a.id === actionId ? { ...a, status: 'REJECTED' } : a));
    setIsProcessingAction(false);
    setSelectedActionModal(null);
    setRejectReason('');
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-axio-red" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">AUTONOMOUS ACTION CENTER</h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Controlled execution with human-in-the-loop authorization and risk scoring.
          </p>
        </div>
      </div>

      {/* Action Progression Visualizer */}
      <div className="p-4 bg-axio-panel border border-axio-border rounded-lg mb-8 font-mono text-xs flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 text-axio-cyan font-bold"><span className="w-2 h-2 rounded-full bg-axio-cyan" /> INSIGHT</div>
        <span>→</span>
        <div className="flex items-center gap-2 text-axio-text-sub"><span className="w-2 h-2 rounded-full bg-axio-text-sub" /> RECOMMENDATION</div>
        <span>→</span>
        <div className="flex items-center gap-2 text-amber-400 font-bold"><span className="w-2 h-2 rounded-full bg-amber-400" /> RISK CLASSIFICATION</div>
        <span>→</span>
        <div className="flex items-center gap-2 text-axio-red font-bold animate-pulse"><span className="w-2 h-2 rounded-full bg-axio-red" /> HUMAN APPROVAL PAUSE</div>
        <span>→</span>
        <div className="flex items-center gap-2 text-emerald-400 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-400" /> EXECUTION & AUDIT</div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actionsList.map((act) => (
          <div key={act.id} className="p-6 bg-axio-panel border border-axio-border rounded-lg font-mono text-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] border ${
                act.risk === 'HIGH' 
                  ? 'bg-axio-red/10 border-axio-red/40 text-axio-red' 
                  : 'bg-axio-cyan/10 border-axio-cyan/40 text-axio-cyan'
              }`}>
                RISK: {act.risk}
              </span>

              <span className={`text-[10px] px-2 py-0.5 rounded border ${
                act.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                act.status === 'REJECTED' ? 'bg-axio-red/10 border-axio-red/30 text-axio-red' :
                'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
              }`}>
                STATUS: {act.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-1 font-sans">{act.title}</h3>
              <p className="text-[11px] text-axio-text-secondary leading-relaxed font-sans">{act.reason}</p>
            </div>

            <div className="p-3 bg-axio-bg border border-axio-border rounded text-[11px] space-y-1">
              <div><span className="text-axio-muted">Requested By:</span> <span className="text-white">{act.requestedBy}</span></div>
              <div><span className="text-axio-muted">Target System:</span> <span className="text-axio-cyan">{act.targetSystem}</span></div>
              <div><span className="text-axio-muted">Impact:</span> <span className="text-axio-text-sub">{act.impact}</span></div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              {act.status === 'AVAILABLE' && act.risk === 'LOW' && (
                <button
                  onClick={() => handleExecuteLowRisk(act.id)}
                  disabled={isProcessingAction}
                  className="px-4 py-2 bg-axio-cyan hover:bg-teal-400 font-bold text-black rounded flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>EXECUTE ACTION</span>
                </button>
              )}

              {act.status === 'AWAITING_APPROVAL' && act.risk === 'HIGH' && (
                <button
                  onClick={() => setSelectedActionModal(act)}
                  className="px-5 py-2 bg-axio-red hover:bg-red-600 font-bold text-white rounded shadow-lg shadow-axio-red/20 flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>REVIEW & APPROVE</span>
                </button>
              )}

              {act.status === 'COMPLETED' && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> EXECUTED ({act.executedAt})
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Human Approval Required Pause Modal */}
      {selectedActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 bg-axio-panel border border-axio-red/50 rounded-lg shadow-2xl font-mono text-left">
            
            <button onClick={() => setSelectedActionModal(null)} className="absolute top-4 right-4 text-axio-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-axio-red font-bold">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <h2 className="text-base uppercase tracking-wide">HIGH RISK ACTION APPROVAL PAUSED</h2>
            </div>

            <div className="space-y-4 text-xs font-sans mb-6">
              <div className="p-3 bg-axio-red/10 border border-axio-red/30 rounded text-axio-text-sub font-mono">
                <span className="text-white font-bold block">{selectedActionModal.title}</span>
                <span>Target: {selectedActionModal.targetSystem}</span>
              </div>

              <p className="text-axio-text-secondary leading-relaxed">
                This execution will commit Databricks production resources and mutate operational shop schedules. Explicit Admin approval is required by enterprise policy.
              </p>

              <div>
                <label className="block font-mono text-[10px] text-axio-muted uppercase mb-1">Rejection Reason (If Rejecting)</label>
                <input
                  type="text"
                  placeholder="Optional reason for audit logs..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-axio-bg border border-axio-border rounded px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-axio-border">
              <button
                onClick={() => handleRejectHighRisk(selectedActionModal.id)}
                disabled={isProcessingAction}
                className="px-4 py-2 bg-axio-bg border border-axio-border hover:bg-axio-red/20 text-axio-red font-bold rounded"
              >
                REJECT ACTION
              </button>

              {permissions.canApproveHighRiskActions ? (
                <button
                  onClick={() => handleApproveHighRisk(selectedActionModal.id)}
                  disabled={isProcessingAction}
                  className="px-6 py-2 bg-axio-red hover:bg-red-600 font-bold text-white rounded flex items-center gap-2 shadow-lg"
                >
                  {isProcessingAction ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>APPROVE & EXECUTE</span>
                </button>
              ) : (
                <span className="text-xs text-axio-red font-bold">ADMIN ROLE REQUIRED TO APPROVE</span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
