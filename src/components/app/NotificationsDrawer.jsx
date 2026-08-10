import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { X, Bell, CheckCircle2, Zap, BarChart2, Check } from 'lucide-react';

export const NotificationsDrawer = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications } = useWorkspace();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-axio-panel border-l border-axio-border h-full p-6 shadow-2xl overflow-y-auto font-mono text-left">

        <div className="flex items-center justify-between pb-4 border-b border-axio-border mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-axio-red" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">SYSTEM NOTIFICATIONS</h2>
          </div>
          <button onClick={onClose} className="p-1 text-axio-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-axio-muted">
            NO NEW NOTIFICATIONS
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={clearNotifications}
                className="text-[10px] text-axio-muted hover:text-white"
              >
                Clear All
              </button>
            </div>

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-lg border text-xs cursor-pointer transition-all ${n.read
                    ? 'bg-axio-bg/50 border-axio-border opacity-70'
                    : 'bg-axio-card border-axio-red/18 shadow-lg'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">{n.title}</span>
                  <span className="text-[10px] text-axio-muted">{n.time}</span>
                </div>
                <p className="text-[11px] text-axio-text-secondary leading-relaxed font-sans">{n.message}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
