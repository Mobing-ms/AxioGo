import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';
import {
  RefreshCw,
  CheckCircle2,
  BarChart2,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

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

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.powerbi-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('powerbi-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-axio-bg">

      {/* ============================================================
          AMBIENT BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 bg-tech-grid opacity-[0.10] pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-axio-red/[0.055] rounded-full blur-[150px] pointer-events-none" />

      <div className="fixed bottom-[-180px] right-[-120px] w-[400px] h-[400px] bg-axio-red/[0.025] rounded-full blur-[150px] pointer-events-none" />

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <section className="powerbi-scroll-reveal powerbi-reveal mb-10">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="relative">

                  <div className="absolute inset-0 bg-axio-red/20 blur-xl rounded-full" />

                  <div className="relative w-9 h-9 rounded-xl bg-axio-red/10 flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-axio-red" />
                  </div>

                </div>

                <span className="text-[9px] text-axio-red font-bold tracking-[0.2em] uppercase">
                  AXIOGO · ENTERPRISE REPORTING
                </span>

                <RoleBadge role={currentRole} />

              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                POWER BI{' '}

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                  REPORTING
                </span>

              </h1>

              <p className="max-w-2xl mt-5 text-sm sm:text-base text-axio-text-secondary leading-relaxed font-sans">
                Power BI remains available for enterprise reporting.
                AxioGo complements Power BI with decision intelligence.
              </p>

            </div>

            {permissions.canAccessPowerBiRefresh && (

              <button
                onClick={handleRefreshPowerBi}
                disabled={isRefreshing}
                className="
                  group
                  shrink-0
                  flex items-center justify-center gap-2
                  px-5 py-3
                  bg-axio-red
                  hover:bg-red-500
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  text-white
                  font-bold
                  text-xs
                  rounded-xl
                  shadow-[0_12px_30px_rgba(255,48,70,0.16)]
                  transition-all
                  hover:-translate-y-0.5
                "
              >

                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''
                    }`}
                />

                <span>
                  {isRefreshing
                    ? 'REFRESHING CACHE...'
                    : 'REFRESH POWER BI'}
                </span>

                {!isRefreshing && (
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                )}

              </button>

            )}

          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border/30 to-transparent" />

        </section>

        {/* ========================================================
            REPORT CONTAINER
        ======================================================== */}

        <section
          className="powerbi-scroll-reveal powerbi-reveal"
          style={{ transitionDelay: '120ms' }}
        >

          <div className="relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.25)]">

            {/* Top accent */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px bg-gradient-to-r from-transparent via-axio-red/60 to-transparent" />

            {/* ====================================================
                REPORT HEADER
            ==================================================== */}

            <div className="p-5 sm:p-6">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="relative">

                    <span className="absolute inset-0 bg-axio-red/20 blur-md rounded-full" />

                    <span className="relative block w-2.5 h-2.5 rounded-full bg-axio-red" />

                  </div>

                  <div>

                    <div className="text-[9px] text-axio-red font-bold tracking-[0.15em] uppercase mb-1">
                      EMBEDDED POWER BI REPORT
                    </div>

                    <span className="font-display font-bold text-sm text-white">
                      FLEET OPERATIONS EXECUTIVE SUITE
                    </span>

                  </div>

                </div>

                <span className="text-[10px] text-axio-muted">
                  Last Cache Refresh:{' '}
                  <span className="text-axio-text-secondary">
                    {lastRefreshed}
                  </span>
                </span>

              </div>

            </div>

            {/* ====================================================
                EMBEDDED REPORT AREA
            ==================================================== */}

            <div className="px-5 sm:px-6 pb-6">

              <div className="relative min-h-[430px] rounded-2xl overflow-hidden bg-axio-bg/80">

                {/* Grid */}

                <div className="absolute inset-0 bg-tech-grid opacity-[0.14]" />

                {/* Red ambient center */}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[260px] bg-axio-red/[0.035] rounded-full blur-[100px]" />

                {/* Content */}

                <div className="relative z-10 min-h-[430px] flex flex-col items-center justify-center p-6 text-center">

                  <div className="relative mb-5">

                    <div className="absolute inset-0 bg-axio-red/20 blur-2xl rounded-full" />

                    <div className="relative w-20 h-20 rounded-2xl bg-axio-red/10 flex items-center justify-center">

                      <BarChart2 className="w-9 h-9 text-axio-red animate-pulse" />

                    </div>

                  </div>

                  <div className="text-[9px] text-axio-red font-bold tracking-[0.2em] uppercase mb-2">
                    REPORTING LAYER
                  </div>

                  <h2 className="text-lg sm:text-xl font-display font-bold text-white mb-3">
                    POWER BI EMBEDDED DASHBOARD READY
                  </h2>

                  <p className="max-w-md text-xs text-axio-text-secondary mb-8 font-sans leading-relaxed">
                    Displaying live Power BI report tiles synchronized
                    with Databricks Gold Layer dataset{' '}
                    <span className="text-white font-mono">
                      insight_fleet_operations
                    </span>.
                  </p>

                  {/* ==================================================
                      STATUS METRICS
                  ================================================== */}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">

                    {/* Cache */}

                    <div className="group p-4 rounded-xl bg-white/[0.025] hover:bg-white/[0.04] transition-all">

                      <span className="text-[9px] text-axio-muted block mb-2">
                        POWER BI CACHE
                      </span>

                      <div className="flex items-center gap-2">

                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />

                        <span className="text-emerald-400 font-bold text-[10px]">
                          SYNCHRONIZED
                        </span>

                      </div>

                    </div>

                    {/* Data Source */}

                    <div className="group p-4 rounded-xl bg-white/[0.025] hover:bg-white/[0.04] transition-all">

                      <span className="text-[9px] text-axio-muted block mb-2">
                        DATA SOURCE
                      </span>

                      <span className="text-axio-red font-bold text-[10px]">
                        DATABRICKS GOLD
                      </span>

                    </div>

                    {/* API */}

                    <div className="group p-4 rounded-xl bg-white/[0.025] hover:bg-white/[0.04] transition-all">

                      <span className="text-[9px] text-axio-muted block mb-2">
                        REST API STATUS
                      </span>

                      <span className="text-white font-bold text-[10px]">
                        200 OK
                      </span>

                    </div>

                    {/* Security */}

                    <div className="group p-4 rounded-xl bg-white/[0.025] hover:bg-white/[0.04] transition-all">

                      <span className="text-[9px] text-axio-muted block mb-2">
                        SECURITY
                      </span>

                      <div className="flex items-center gap-2">

                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />

                        <span className="text-emerald-400 font-bold text-[10px]">
                          RLS ENFORCED
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================================
            FOOTER STATUS
        ======================================================== */}

        <div
          className="powerbi-scroll-reveal powerbi-reveal flex items-center justify-center gap-2 mt-7 text-[9px] text-axio-muted uppercase tracking-wider"
          style={{ transitionDelay: '220ms' }}
        >

          <Sparkles className="w-3.5 h-3.5 text-axio-red" />

          <span>
            POWER BI REPORTING · AXIOGO DECISION INTELLIGENCE
          </span>

        </div>

      </main>

      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style>{`

        .powerbi-reveal {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(4px);

          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms ease;
        }

        .powerbi-reveal.powerbi-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {

          .powerbi-reveal {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

        }

      `}</style>

    </div>
  );
};