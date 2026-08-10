import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleBadge } from '../common/RoleBadge';
import {
  FLEET_KPIS,
  TELEMETRY_ACTIVITY_DATA,
  AI_INSIGHT_CARDS
} from '../../services/analyticsService';

import {
  Truck,
  Users,
  Wrench,
  ShieldAlert,
  Bot,
  ArrowRight,
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DashboardView = ({ setActivePage }) => {
  const { currentRole } = useAuth();

  const {
    activeWorkspace,
    activeFilters,
    setActiveFilters
  } = useWorkspace();

  const iconMap = {
    Truck,
    Users,
    Wrench,
    ShieldAlert
  };

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.dashboard-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
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

      <div className="fixed inset-0 bg-tech-grid opacity-[0.12] pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-axio-red/7 rounded-full blur-[150px] pointer-events-none" />

      <div className="fixed top-[35%] right-[-250px] w-[500px] h-[500px] bg-axio-red/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="fixed bottom-[-250px] left-[-200px] w-[500px] h-[500px] bg-axio-cyan/2 rounded-full blur-[160px] pointer-events-none" />

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">

        {/* ========================================================
            COMMAND CENTER HEADER
        ======================================================== */}

        <section className="dashboard-scroll-reveal dashboard-reveal mb-10">

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <span className="relative flex items-center justify-center">

                  <span className="absolute w-8 h-8 rounded-full bg-axio-red/10 blur-md" />

                  <span className="relative w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                </span>

                <span className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-bold">
                  SYSTEM OPERATIONAL
                </span>

                <RoleBadge role={currentRole} />

              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                AUTOMOTIVE{' '}

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                  COMMAND CENTER
                </span>

              </h1>

              <p className="mt-4 text-sm text-axio-text-secondary font-sans">

                Workspace:{' '}

                <span className="text-white font-semibold">
                  {activeWorkspace}
                </span>

                <span className="mx-2 text-axio-muted">
                  /
                </span>

                Status:{' '}

                <span className="text-emerald-400">
                  Databricks Synced
                </span>

              </p>

            </div>

            {/* ==================================================
                FILTER BAR
            ================================================== */}

            <div className="flex flex-wrap items-center gap-2">

              <select
                value={activeFilters.dateRange}
                onChange={(e) =>
                  setActiveFilters((prev) => ({
                    ...prev,
                    dateRange: e.target.value
                  }))
                }
                className="bg-white/[0.025] backdrop-blur-md rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-axio-red/40 transition-all"
              >
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Q3 YTD</option>
              </select>

              <select
                value={activeFilters.vehicleGroup}
                onChange={(e) =>
                  setActiveFilters((prev) => ({
                    ...prev,
                    vehicleGroup: e.target.value
                  }))
                }
                className="bg-white/[0.025] backdrop-blur-md rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-axio-red/40 transition-all max-w-[230px]"
              >
                <option>All Vehicle Groups</option>
                <option>
                  Vehicle Group A (Heavy Transport)
                </option>
                <option>
                  Vehicle Group B (Regional Freight)
                </option>
                <option>
                  Vehicle Group C (Last-Mile Delivery)
                </option>
              </select>

              <button
                onClick={() => setActivePage('axis')}
                className="group flex items-center gap-2 px-4 py-2.5 bg-axio-red hover:bg-red-500 text-white rounded-xl font-bold text-xs transition-all shadow-[0_10px_30px_rgba(255,48,70,0.15)] hover:-translate-y-0.5"
              >
                <Bot className="w-3.5 h-3.5" />

                <span>
                  ASK AXIS
                </span>

                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />

              </button>

            </div>

          </div>

          <div className="mt-7 h-px bg-gradient-to-r from-axio-red/40 via-axio-border/40 to-transparent" />

        </section>

        {/* ========================================================
            KPI CARDS
        ======================================================== */}

        <section className="dashboard-scroll-reveal dashboard-reveal mb-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {FLEET_KPIS.map((kpi, index) => {

              const IconComp =
                iconMap[kpi.icon] || Truck;

              return (

                <div
                  key={kpi.id}
                  className="group relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl p-5 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    transitionDelay: `${index * 80}ms`
                  }}
                >

                  {/* Accent glow */}

                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-axio-red/5 rounded-full blur-3xl group-hover:bg-axio-red/10 transition-all duration-500" />

                  <div className="relative">

                    <div className="flex items-center justify-between mb-5">

                      <span className="text-[10px] text-axio-muted uppercase tracking-wider font-semibold">
                        {kpi.title}
                      </span>

                      <div className="p-2.5 rounded-xl bg-white/[0.025] text-axio-red group-hover:bg-axio-red/10 transition-all">
                        <IconComp className="w-4 h-4" />
                      </div>

                    </div>

                    <div className="text-3xl font-black text-white mb-2 font-sans tracking-tight">
                      {kpi.value}
                    </div>

                    <div className="flex items-center justify-between text-[10px]">

                      <span className="text-axio-muted">
                        {kpi.subtitle}
                      </span>

                      <span
                        className={`font-bold ${kpi.positive
                            ? 'text-emerald-400'
                            : 'text-axio-red'
                          }`}
                      >
                        {kpi.change}
                      </span>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        </section>

        {/* ========================================================
            TELEMETRY + SYSTEM HEALTH
        ======================================================== */}

        <section
          className="dashboard-scroll-reveal dashboard-reveal grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10"
          style={{ transitionDelay: '120ms' }}
        >

          {/* ======================================================
              TELEMETRY CHART
          ====================================================== */}

          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl p-6">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-axio-red/50 to-transparent" />

            <div className="flex items-start justify-between gap-4 mb-6">

              <div>

                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">

                  <Activity className="w-4 h-4 text-axio-red" />

                  <span>
                    FLEET TELEMETRY ACTIVITY & NETWORK LAG
                  </span>

                </h2>

                <p className="text-[11px] text-axio-muted mt-1">
                  Real-time IoT stream aggregated via Databricks Gold Layer
                </p>

              </div>

              <button
                onClick={() => setActivePage('analytics')}
                className="group hidden sm:flex text-xs text-axio-red hover:text-white items-center gap-1 transition-colors"
              >
                <span>
                  DEEP ANALYTICS
                </span>

                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>

            </div>

            <div className="h-64 w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart data={TELEMETRY_ACTIVITY_DATA}>

                  <defs>

                    <linearGradient
                      id="dashboardGradUnits"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#FF3046"
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="95%"
                        stopColor="#FF3046"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#202731"
                    opacity={0.45}
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#7F8B98"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#7F8B98"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090C11',
                      border: 'none',
                      fontSize: '11px',
                      borderRadius: '10px'
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="activeUnits"
                    stroke="#FF3046"
                    fill="url(#dashboardGradUnits)"
                    strokeWidth={2}
                    fillOpacity={1}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* ======================================================
              DATA QUALITY
          ====================================================== */}

          <div className="lg:col-span-4 relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl p-6 flex flex-col justify-between">

            <div>

              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">

                <CheckCircle2 className="w-4 h-4 text-emerald-400" />

                <span>
                  DATA QUALITY & FRESHNESS
                </span>

              </h3>

              <div className="space-y-5">

                {/* Quality */}

                <div>

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-axio-muted">
                      OVERALL QUALITY SCORE
                    </span>

                    <span className="text-emerald-400 font-bold">
                      98.4%
                    </span>

                  </div>

                  <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">

                    <div
                      className="bg-emerald-400 h-full w-[98.4%] rounded-full"
                    />

                  </div>

                </div>

                {/* Telemetry */}

                <div>

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-axio-muted">
                      TELEMETRY STREAM LAG
                    </span>

                    <span className="text-axio-red font-bold">
                      4.2 ms
                    </span>

                  </div>

                  <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">

                    <div
                      className="bg-axio-red h-full w-[94%] rounded-full"
                    />

                  </div>

                </div>

                {/* Unity */}

                <div>

                  <div className="flex justify-between text-xs mb-1">

                    <span className="text-axio-muted">
                      UNITY CATALOG SYNC
                    </span>

                    <span className="text-white font-bold">
                      OPTIMAL
                    </span>

                  </div>

                  <span className="text-[10px] text-axio-muted">
                    Last verified 2 minutes ago
                  </span>

                </div>

              </div>

            </div>

            <button
              onClick={() => setActivePage('axis')}
              className="group w-full mt-7 py-3 bg-axio-red/10 hover:bg-axio-red text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >

              <Bot className="w-4 h-4 text-axio-red group-hover:text-white" />

              <span>
                ANALYZE WITH AXIS
              </span>

              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />

            </button>

          </div>

        </section>

        {/* ========================================================
            AI INSIGHTS
        ======================================================== */}

        <section
          className="dashboard-scroll-reveal dashboard-reveal"
          style={{ transitionDelay: '200ms' }}
        >

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">

              <Sparkles className="w-4 h-4 text-axio-red" />

              <span>
                AXIS DETECTED FLEET INSIGHTS
              </span>

            </h3>

            <span className="text-[9px] text-axio-muted tracking-wider">
              AUTOMATICALLY SYNTHESIZED BY ANALYTICS AGENT
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {AI_INSIGHT_CARDS.map((ins, index) => (

              <div
                key={ins.id}
                className="group relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl p-5 transition-all duration-500 hover:-translate-y-1"
                style={{
                  transitionDelay: `${index * 90}ms`
                }}
              >

                <div className="absolute -top-20 -right-20 w-40 h-40 bg-axio-red/4 rounded-full blur-3xl group-hover:bg-axio-red/8 transition-all duration-500" />

                <div className="relative">

                  <div className="flex items-center justify-between mb-4">

                    <span
                      className={`text-[9px] px-2.5 py-1 rounded-full font-bold ${ins.severity === 'HIGH'
                          ? 'bg-axio-red/10 text-axio-red'
                          : ins.severity === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                    >
                      {ins.severity} PRIORITY
                    </span>

                    <span className="text-[10px] text-axio-muted">
                      {ins.domain}
                    </span>

                  </div>

                  <h4 className="font-bold text-sm text-white mb-2 font-sans">
                    {ins.title}
                  </h4>

                  <p className="text-[11px] text-axio-text-secondary leading-relaxed mb-5 font-sans">
                    {ins.description}
                  </p>

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[10px] text-axio-muted truncate max-w-[180px]">
                      {ins.suggestedAction}
                    </span>

                    <button
                      onClick={() =>
                        setActivePage('axis')
                      }
                      className="group/ask shrink-0 text-axio-red font-bold hover:text-white transition-colors flex items-center gap-1"
                    >
                      ASK AXIS

                      <ArrowRight className="w-3 h-3 transition-transform group-hover/ask:translate-x-0.5" />

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

      {/* ============================================================
          SCROLL REVEAL STYLES
      ============================================================ */}

      <style>{`
        .dashboard-reveal {
          opacity: 0;
          transform: translateY(32px);
          filter: blur(4px);
          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms ease;
        }

        .dashboard-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-reveal {
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