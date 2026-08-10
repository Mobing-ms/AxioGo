import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_ACTIONS,
  executeAction,
  approveAction,
  rejectAction,
} from '../../services/actionService';
import { RoleBadge } from '../common/RoleBadge';

import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  X,
  Play,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';


export const ActionsView = () => {
  const { currentRole, permissions } = useAuth();

  const [actionsList, setActionsList] = useState(INITIAL_ACTIONS);
  const [selectedActionModal, setSelectedActionModal] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [rejectReason, setRejectReason] = useState('');


  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.action-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);


  /* ============================================================
     ACTION LOGIC
  ============================================================ */

  const handleExecuteLowRisk = async (actionId) => {
    setIsProcessingAction(true);

    try {
      const res = await executeAction(actionId);

      setActionsList((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
              ...a,
              status: 'COMPLETED',
              executedAt: res.executedAt,
            }
            : a
        )
      );
    } finally {
      setIsProcessingAction(false);
    }
  };


  const handleApproveHighRisk = async (actionId) => {
    setIsProcessingAction(true);

    try {
      const res = await approveAction(actionId);

      setActionsList((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
              ...a,
              status: 'COMPLETED',
              executedAt: res.executedAt,
            }
            : a
        )
      );

      setSelectedActionModal(null);
    } finally {
      setIsProcessingAction(false);
    }
  };


  const handleRejectHighRisk = async (actionId) => {
    setIsProcessingAction(true);

    try {
      await rejectAction(actionId, rejectReason);

      setActionsList((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
              ...a,
              status: 'REJECTED',
            }
            : a
        )
      );

      setSelectedActionModal(null);
      setRejectReason('');
    } finally {
      setIsProcessingAction(false);
    }
  };


  return (
    <>
      {/* ============================================================
          LOCAL SCROLL REVEAL STYLES
      ============================================================ */}

      <style>{`
        .action-scroll-reveal {
          opacity: 0;
          transform: translateY(45px);
          filter: blur(7px);

          transition:
            opacity 750ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 750ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 750ms cubic-bezier(0.22, 1, 0.36, 1);

          will-change:
            opacity,
            transform,
            filter;
        }

        .action-scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .action-scroll-reveal,
          .action-scroll-reveal.is-visible {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }
        }
      `}</style>


      <div className="relative min-h-screen overflow-hidden bg-axio-bg">

        {/* ============================================================
            BACKGROUND
        ============================================================ */}

        <div className="fixed inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-axio-red/6 rounded-full blur-[150px] pointer-events-none" />

        <div className="fixed top-[45%] right-[-200px] w-[400px] h-[400px] bg-axio-red/4 rounded-full blur-[150px] pointer-events-none" />

        <div className="fixed bottom-[-200px] left-[-150px] w-[400px] h-[400px] bg-axio-cyan/2 rounded-full blur-[150px] pointer-events-none" />


        {/* ============================================================
            MAIN CONTENT
        ============================================================ */}

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">


          {/* ========================================================
              HEADER
          ======================================================== */}

          <section
            className="action-scroll-reveal mb-14"
          >

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <span className="relative flex items-center justify-center">

                    <span className="absolute w-8 h-8 rounded-full bg-axio-red/10 blur-md" />

                    <Zap className="relative w-5 h-5 text-axio-red" />

                  </span>


                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-axio-red uppercase">
                    AXIOGO · CONTROL LAYER
                  </span>


                  <RoleBadge role={currentRole} />

                </div>


                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                  AUTONOMOUS{' '}

                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">

                    ACTION CENTER

                  </span>

                </h1>


                <p className="mt-5 max-w-2xl text-sm sm:text-base text-axio-text-secondary font-sans leading-relaxed">

                  Controlled execution with human-in-the-loop authorization and
                  risk scoring.

                </p>

              </div>


              <div className="flex items-center gap-2 text-[10px] font-mono text-axio-muted uppercase tracking-wider">

                <span className="w-1.5 h-1.5 rounded-full bg-axio-red shadow-[0_0_10px_rgba(255,48,70,0.7)] animate-pulse" />

                ACTION GOVERNANCE ACTIVE

              </div>

            </div>


            <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border to-transparent" />

          </section>


          {/* ========================================================
              CONTROL FLOW
          ======================================================== */}

          <section
            className="action-scroll-reveal mb-12"
            style={{
              transitionDelay: '120ms',
            }}
          >

            <div className="relative overflow-x-auto rounded-2xl bg-axio-panel/50 backdrop-blur-xl">

              <div className="min-w-[850px] px-6 py-6">

                <div className="flex items-center justify-between gap-5">

                  <div className="flex items-center gap-2 text-axio-cyan font-bold text-[10px] tracking-wider whitespace-nowrap">

                    <span className="w-2 h-2 rounded-full bg-axio-cyan" />

                    INSIGHT

                  </div>


                  <ArrowRight className="w-3.5 h-3.5 text-axio-border" />


                  <div className="flex items-center gap-2 text-axio-text-sub text-[10px] whitespace-nowrap">

                    <span className="w-2 h-2 rounded-full bg-axio-text-sub" />

                    RECOMMENDATION

                  </div>


                  <ArrowRight className="w-3.5 h-3.5 text-axio-border" />


                  <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] whitespace-nowrap">

                    <span className="w-2 h-2 rounded-full bg-amber-400" />

                    RISK CLASSIFICATION

                  </div>


                  <ArrowRight className="w-3.5 h-3.5 text-axio-border" />


                  <div className="flex items-center gap-2 text-axio-red font-bold text-[10px] whitespace-nowrap">

                    <span className="w-2 h-2 rounded-full bg-axio-red shadow-[0_0_8px_rgba(255,48,70,0.6)] animate-pulse" />

                    HUMAN APPROVAL PAUSE

                  </div>


                  <ArrowRight className="w-3.5 h-3.5 text-axio-border" />


                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] whitespace-nowrap">

                    <span className="w-2 h-2 rounded-full bg-emerald-400" />

                    EXECUTION &amp; AUDIT

                  </div>

                </div>


                <div className="mt-5 h-px bg-gradient-to-r from-axio-cyan/10 via-axio-red/40 to-emerald-400/10" />

              </div>

            </div>

          </section>


          {/* ========================================================
              ACTION CARDS
          ======================================================== */}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {actionsList.map((act, index) => (

              <article
                key={act.id}
                className="
                  action-scroll-reveal
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  bg-axio-panel/55
                  backdrop-blur-xl
                  p-6
                  sm:p-7
                  transition-all
                  duration-500
                  hover:-translate-y-1
                "
                style={{
                  transitionDelay: `${Math.min(
                    index * 100,
                    500
                  )}ms`,
                }}
              >

                {/* Hover accent */}

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-px bg-gradient-to-r from-transparent via-axio-red/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


                {/* Status */}

                <div className="flex items-center justify-between gap-3 mb-6">

                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[9px] tracking-wider ${act.risk === 'HIGH'
                        ? 'bg-axio-red/10 text-axio-red'
                        : 'bg-axio-cyan/8 text-axio-cyan'
                      }`}
                  >
                    RISK: {act.risk}
                  </span>


                  <span
                    className={`text-[9px] px-2.5 py-1 rounded-full tracking-wider ${act.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : act.status === 'REJECTED'
                          ? 'bg-axio-red/10 text-axio-red'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                  >
                    STATUS: {act.status}
                  </span>

                </div>


                {/* Title */}

                <div className="mb-6">

                  <h3 className="text-base font-bold text-white mb-2 font-sans">
                    {act.title}
                  </h3>

                  <p className="text-xs text-axio-text-secondary leading-relaxed font-sans">
                    {act.reason}
                  </p>

                </div>


                {/* Metadata */}

                <div className="p-4 rounded-xl bg-axio-bg/45 space-y-2 text-[10px] mb-6">

                  <div>
                    <span className="text-axio-muted">
                      Requested By:
                    </span>{' '}

                    <span className="text-white">
                      {act.requestedBy}
                    </span>
                  </div>


                  <div>
                    <span className="text-axio-muted">
                      Target System:
                    </span>{' '}

                    <span className="text-axio-red">
                      {act.targetSystem}
                    </span>
                  </div>


                  <div>
                    <span className="text-axio-muted">
                      Impact:
                    </span>{' '}

                    <span className="text-axio-text-sub">
                      {act.impact}
                    </span>
                  </div>

                </div>


                {/* Action */}

                <div className="flex items-center justify-end">

                  {act.status === 'AVAILABLE' &&
                    act.risk === 'LOW' && (

                      <button
                        onClick={() =>
                          handleExecuteLowRisk(act.id)
                        }
                        disabled={isProcessingAction}
                        className="group/button px-5 py-2.5 bg-axio-red hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-white text-[10px] rounded-lg flex items-center gap-2 shadow-[0_10px_30px_rgba(255,48,70,0.15)] hover:shadow-[0_12px_35px_rgba(255,48,70,0.25)] transition-all duration-300 hover:-translate-y-0.5"
                      >

                        {isProcessingAction ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}

                        <span>
                          EXECUTE ACTION
                        </span>


                        {!isProcessingAction && (
                          <ArrowRight className="w-3 h-3 transition-transform group-hover/button:translate-x-0.5" />
                        )}

                      </button>

                    )}


                  {act.status === 'AWAITING_APPROVAL' &&
                    act.risk === 'HIGH' && (

                      <button
                        onClick={() =>
                          setSelectedActionModal(act)
                        }
                        className="px-5 py-2.5 bg-axio-red hover:bg-red-500 font-bold text-white text-[10px] rounded-lg flex items-center gap-2 shadow-[0_10px_35px_rgba(255,48,70,0.18)] hover:shadow-[0_15px_45px_rgba(255,48,70,0.28)] transition-all duration-300 hover:-translate-y-0.5"
                      >

                        <ShieldAlert className="w-4 h-4" />

                        <span>
                          REVIEW &amp; APPROVE
                        </span>

                      </button>

                    )}


                  {act.status === 'COMPLETED' && (

                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">

                      <CheckCircle2 className="w-4 h-4" />

                      EXECUTED ({act.executedAt})

                    </span>

                  )}


                  {act.status === 'REJECTED' && (

                    <span className="text-axio-red text-[10px] font-bold flex items-center gap-1.5">

                      <X className="w-4 h-4" />

                      ACTION REJECTED

                    </span>

                  )}

                </div>

              </article>

            ))}

          </section>

        </main>


        {/* ============================================================
            APPROVAL MODAL
        ============================================================ */}

        {selectedActionModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-axio-panel/95 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.7)]">

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-axio-red/10 blur-[50px] pointer-events-none" />


              <button
                onClick={() =>
                  setSelectedActionModal(null)
                }
                className="absolute top-5 right-5 z-10 p-2 rounded-full text-axio-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>


              <div className="relative p-7 sm:p-8">

                <div className="flex items-center gap-3 mb-6 text-axio-red">

                  <div className="relative">

                    <span className="absolute inset-0 rounded-full bg-axio-red/15 blur-md" />

                    <ShieldAlert className="relative w-7 h-7" />

                  </div>


                  <h2 className="text-sm uppercase tracking-[0.12em] font-bold">
                    HIGH RISK ACTION APPROVAL PAUSED
                  </h2>

                </div>


                <div className="space-y-5 text-xs font-sans mb-7">

                  <div className="p-4 bg-axio-red/6 rounded-xl">

                    <span className="text-white font-bold block mb-1">
                      {selectedActionModal.title}
                    </span>

                    <span className="text-axio-text-secondary">

                      Target:{' '}

                      <span className="text-axio-red">
                        {selectedActionModal.targetSystem}
                      </span>

                    </span>

                  </div>


                  <p className="text-axio-text-secondary leading-relaxed">

                    This execution will commit Databricks production
                    resources and mutate operational shop schedules.
                    Explicit Admin approval is required by enterprise policy.

                  </p>


                  <div>

                    <label className="block font-mono text-[9px] text-axio-muted uppercase tracking-wider mb-2">

                      Rejection Reason (If Rejecting)

                    </label>


                    <input
                      type="text"
                      placeholder="Optional reason for audit logs..."
                      value={rejectReason}
                      onChange={(e) =>
                        setRejectReason(e.target.value)
                      }
                      className="w-full bg-axio-bg/60 rounded-lg px-4 py-3 text-white font-mono text-xs placeholder:text-axio-muted focus:outline-none focus:ring-1 focus:ring-axio-red/40 transition-all"
                    />

                  </div>

                </div>


                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-5">

                  <button
                    onClick={() =>
                      handleRejectHighRisk(
                        selectedActionModal.id
                      )
                    }
                    disabled={isProcessingAction}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white/3 hover:bg-axio-red/8 text-axio-red font-bold text-[10px] rounded-lg transition-all disabled:opacity-50"
                  >
                    REJECT ACTION
                  </button>


                  {permissions.canApproveHighRiskActions ? (

                    <button
                      onClick={() =>
                        handleApproveHighRisk(
                          selectedActionModal.id
                        )
                      }
                      disabled={isProcessingAction}
                      className="w-full sm:w-auto px-6 py-2.5 bg-axio-red hover:bg-red-500 disabled:opacity-50 font-bold text-white text-[10px] rounded-lg flex items-center justify-center gap-2 shadow-[0_10px_35px_rgba(255,48,70,0.18)] transition-all"
                    >

                      {isProcessingAction ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}

                      <span>
                        APPROVE &amp; EXECUTE
                      </span>

                    </button>

                  ) : (

                    <span className="text-[10px] text-axio-red font-bold text-center">
                      ADMIN ROLE REQUIRED TO APPROVE
                    </span>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
};