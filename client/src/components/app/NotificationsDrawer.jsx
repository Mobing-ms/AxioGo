import React, { useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  X,
  Bell,
  CheckCircle2,
  Zap,
  BarChart2,
  Check
} from 'lucide-react';

export const NotificationsDrawer = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    clearNotifications
  } = useWorkspace();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">

      {/* Backdrop */}

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm drawer-backdrop"
        onClick={onClose}
      />

      {/* Ambient red glow */}

      <div className="absolute top-20 right-0 w-[350px] h-[350px] bg-axio-red/[0.06] blur-[120px] rounded-full pointer-events-none" />

      {/* Drawer */}

      <aside
        className="
          absolute top-0 right-0
          h-full w-full sm:w-[420px]
          bg-axio-panel/95
          backdrop-blur-2xl
          shadow-[-20px_0_70px_rgba(0,0,0,0.45)]
          drawer-enter
          overflow-hidden
        "
      >

        {/* Top red accent */}

        <div className="absolute top-0 right-0 w-48 h-px bg-gradient-to-l from-axio-red via-red-400/50 to-transparent" />

        {/* Subtle background grid */}

        <div className="absolute inset-0 bg-tech-grid opacity-[0.045] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">

          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="px-6 pt-6 pb-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="relative">

                  <div className="absolute inset-0 bg-axio-red/20 blur-xl rounded-full" />

                  <div className="relative w-10 h-10 rounded-xl bg-axio-red/10 flex items-center justify-center text-axio-red">

                    <Bell className="w-5 h-5" />

                  </div>

                </div>

                <div>

                  <div className="text-[9px] text-axio-red font-bold tracking-[0.2em] mb-0.5">
                    AXIOGO · SYSTEM
                  </div>

                  <h2 className="text-base font-display font-bold text-white uppercase tracking-wider">
                    Notifications
                  </h2>

                </div>

              </div>

              <button
                onClick={onClose}
                className="
                  p-2 rounded-lg
                  text-axio-muted
                  hover:text-white
                  hover:bg-white/[0.05]
                  transition-all
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="mt-5 h-px bg-gradient-to-r from-axio-red/30 via-axio-border/30 to-transparent" />

          </div>

          {/* ======================================================
              CONTENT
          ====================================================== */}

          <div className="flex-1 overflow-y-auto px-6 pb-6">

            {notifications.length === 0 ? (

              /* EMPTY STATE */

              <div className="h-full flex flex-col items-center justify-center text-center">

                <div className="relative mb-5">

                  <div className="absolute inset-0 bg-axio-red/10 blur-2xl rounded-full" />

                  <div className="relative w-16 h-16 rounded-2xl bg-white/[0.025] flex items-center justify-center">

                    <Bell className="w-7 h-7 text-axio-muted" />

                  </div>

                </div>

                <h3 className="text-sm font-bold text-white mb-2">
                  ALL CLEAR
                </h3>

                <p className="text-xs text-axio-muted font-sans">
                  No new system notifications.
                </p>

              </div>

            ) : (

              <div>

                {/* Notification count + clear */}

                <div className="flex items-center justify-between mb-5">

                  <div className="text-[10px] text-axio-muted uppercase tracking-wider">

                    <span className="text-white font-bold">
                      {notifications.length}
                    </span>{' '}
                    notifications

                  </div>

                  <button
                    onClick={clearNotifications}
                    className="
                      text-[10px]
                      text-axio-muted
                      hover:text-axio-red
                      font-bold
                      uppercase
                      tracking-wider
                      transition-colors
                    "
                  >
                    Clear All
                  </button>

                </div>

                {/* Notification list */}

                <div className="space-y-3">

                  {notifications.map((n, index) => (

                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`
                        notification-item
                        group
                        relative
                        p-4
                        rounded-xl
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        ${n.read
                          ? 'bg-white/[0.015] opacity-60'
                          : 'bg-axio-red/[0.045] shadow-[0_8px_30px_rgba(255,48,70,0.05)]'
                        }
                      `}
                      style={{
                        animationDelay: `${index * 70}ms`
                      }}
                    >

                      {/* Unread indicator */}

                      {!n.read && (
                        <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-axio-red rounded-full shadow-[0_0_10px_rgba(255,48,70,0.5)]" />
                      )}

                      <div className="flex items-start gap-3">

                        {/* Icon */}

                        <div
                          className={`
                            shrink-0
                            w-9 h-9
                            rounded-lg
                            flex items-center justify-center
                            ${n.read
                              ? 'bg-white/[0.025] text-axio-muted'
                              : 'bg-axio-red/10 text-axio-red'
                            }
                          `}
                        >

                          {n.title?.toLowerCase().includes('action') ? (
                            <Zap className="w-4 h-4" />
                          ) : n.title?.toLowerCase().includes('report') ? (
                            <BarChart2 className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}

                        </div>

                        {/* Content */}

                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-3 mb-1">

                            <span className="font-bold text-white text-xs leading-tight">
                              {n.title}
                            </span>

                            <span className="shrink-0 text-[9px] text-axio-muted">
                              {n.time}
                            </span>

                          </div>

                          <p className="text-[11px] text-axio-text-secondary leading-relaxed font-sans">
                            {n.message}
                          </p>

                          {/* Read state */}

                          <div className="mt-3 flex items-center justify-between">

                            <span
                              className={`
                                text-[8px]
                                uppercase
                                tracking-wider
                                font-bold
                                ${n.read
                                  ? 'text-axio-muted'
                                  : 'text-axio-red'
                                }
                              `}
                            >
                              {n.read ? 'READ' : 'NEW'}
                            </span>

                            {n.read && (
                              <Check className="w-3 h-3 text-axio-muted" />
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

          {/* ======================================================
              FOOTER
          ====================================================== */}

          {notifications.length > 0 && (

            <div className="relative z-10 px-6 py-4">

              <div className="flex items-center gap-2 text-[9px] text-axio-muted uppercase tracking-wider">

                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />

                <span>
                  System monitoring active
                </span>

              </div>

            </div>

          )}

        </div>

      </aside>

      {/* ==========================================================
          ANIMATIONS
      ========================================================== */}

      <style>{`

        .drawer-enter {
          animation: drawerEnter 400ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .drawer-backdrop {
          animation: backdropEnter 300ms ease both;
        }

        .notification-item {
          animation: notificationEnter 450ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes drawerEnter {
          from {
            opacity: 0;
            transform: translateX(100%);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes backdropEnter {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes notificationEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {

          .drawer-enter,
          .drawer-backdrop,
          .notification-item {
            animation: none;
          }

        }

      `}</style>

    </div>
  );
};