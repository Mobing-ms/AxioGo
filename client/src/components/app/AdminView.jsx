import React, { useState, useEffect } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';

import {
  Shield,
  Users,
  Server,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Settings,
  ArrowRight,
} from 'lucide-react';

export const AdminView = () => {
  const { currentRole, switchRole } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState('Monitoring');

  const usersList = [
    {
      id: 'usr_1',
      name: 'Alex Vance',
      email: 'a.vance@fleet.com',
      role: ROLES.ADMIN,
      status: 'Active',
      lastActive: '2m ago',
    },
    {
      id: 'usr_2',
      name: 'Sarah Analyst',
      email: 's.analyst@fleet.com',
      role: ROLES.AUTHORIZED,
      status: 'Active',
      lastActive: '15m ago',
    },
    {
      id: 'usr_3',
      name: 'Mark Standard',
      email: 'm.standard@fleet.com',
      role: ROLES.STANDARD,
      status: 'Active',
      lastActive: '1h ago',
    },
  ];

  const systemHealth = [
    {
      name: 'API GATEWAY',
      status: 'HEALTHY',
      latency: '4.2ms',
      icon: Server,
    },
    {
      name: 'DATABRICKS LAKEHOUSE',
      status: 'HEALTHY',
      latency: '12ms',
      icon: Server,
    },
    {
      name: 'AXIS MULTI-AGENT ENGINE',
      status: 'HEALTHY',
      latency: '18ms',
      icon: Cpu,
    },
    {
      name: 'VOICE STT SERVICE',
      status: 'HEALTHY',
      latency: '24ms',
      icon: RefreshCw,
    },
    {
      name: 'VOICE TTS SERVICE',
      status: 'HEALTHY',
      latency: '15ms',
      icon: RefreshCw,
    },
    {
      name: 'POWER BI SERVICE API',
      status: 'HEALTHY',
      latency: '35ms',
      icon: Server,
    },
  ];

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.admin-scroll-reveal'
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
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [activeAdminTab]);

  return (
    <>
      {/* ============================================================
          SCROLL REVEAL STYLES
          ============================================================ */}

      <style>{`
        .admin-scroll-reveal {
          opacity: 0;
          transform: translateY(42px);
          filter: blur(6px);
          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform, filter;
        }

        .admin-scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-scroll-reveal,
          .admin-scroll-reveal.is-visible {
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

        <div className="fixed top-[40%] right-[-200px] w-[450px] h-[450px] bg-axio-red/4 rounded-full blur-[150px] pointer-events-none" />

        <div className="fixed bottom-[-200px] left-[-150px] w-[400px] h-[400px] bg-axio-cyan/2 rounded-full blur-[150px] pointer-events-none" />


        {/* ============================================================
            MAIN CONTENT
            ============================================================ */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">


          {/* ========================================================
              HEADER
              ======================================================== */}

          <section className="admin-scroll-reveal mb-12">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <span className="relative flex items-center justify-center">

                    <span className="absolute w-8 h-8 rounded-full bg-axio-red/10 blur-md" />

                    <Shield className="relative w-5 h-5 text-axio-red" />

                  </span>

                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-axio-red uppercase">
                    AXIOGO · ADMIN CONTROL
                  </span>

                  <RoleBadge role={currentRole} />

                </div>


                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                  ENTERPRISE{' '}

                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                    ADMINISTRATION
                  </span>

                </h1>


                <p className="mt-5 max-w-3xl text-sm sm:text-base text-axio-text-secondary font-sans leading-relaxed">
                  Platform monitoring&nbsp; | &nbsp;User RBAC management&nbsp; |
                  &nbsp;Databricks ops&nbsp; | &nbsp;AI copilot configuration
                </p>

              </div>


              <div className="flex items-center gap-2 text-[10px] font-mono text-axio-muted uppercase tracking-wider">

                <span className="w-1.5 h-1.5 rounded-full bg-axio-red shadow-[0_0_10px_rgba(255,48,70,0.7)] animate-pulse" />

                ADMIN CONTROL ACTIVE

              </div>

            </div>


            <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border to-transparent" />

          </section>


          {/* ========================================================
              ADMIN TABS
              ======================================================== */}

          <section
            className="admin-scroll-reveal mb-10"
            style={{
              transitionDelay: '100ms',
            }}
          >

            <div className="flex flex-wrap items-center gap-2">

              {[
                'Monitoring',
                'User Management',
                'Databricks Ops',
                'AI Configuration',
              ].map((tab) => {

                const isActive = activeAdminTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveAdminTab(tab)}
                    className={`
                      relative
                      px-4
                      py-2.5
                      rounded-lg
                      text-[10px]
                      font-mono
                      font-bold
                      tracking-wide
                      transition-all
                      duration-300

                      ${isActive
                        ? 'bg-axio-red/10 text-white shadow-[0_8px_25px_rgba(255,48,70,0.08)]'
                        : 'text-axio-muted hover:text-white hover:bg-axio-panel/60'
                      }
                    `}
                  >

                    {tab}

                    {isActive && (
                      <span className="absolute left-3 right-3 bottom-0 h-px bg-axio-red shadow-[0_0_8px_rgba(255,48,70,0.5)]" />
                    )}

                  </button>
                );

              })}

            </div>

          </section>


          {/* ========================================================
              MONITORING
              ======================================================== */}

          {activeAdminTab === 'Monitoring' && (
            <section className="admin-scroll-reveal">

              <div className="mb-5 flex items-center gap-2">

                <Server className="w-4 h-4 text-axio-red" />

                <span className="text-[10px] font-mono font-bold text-axio-muted tracking-[0.16em] uppercase">
                  SYSTEM HEALTH
                </span>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {systemHealth.map((sys, index) => {

                  const IconComp = sys.icon;

                  return (
                    <div
                      key={sys.name}
                      className="admin-scroll-reveal group relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl p-5 transition-all duration-500 hover:-translate-y-1"
                      style={{
                        transitionDelay: `${150 + Math.min(index * 90, 450)}ms`,
                      }}
                    >

                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-axio-red/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <div className="flex items-center gap-2 mb-3">

                            <IconComp className="w-4 h-4 text-axio-red" />

                            <span className="text-[9px] text-axio-muted font-mono tracking-wider">
                              SERVICE
                            </span>

                          </div>


                          <span className="text-[10px] text-axio-muted block">
                            {sys.name}
                          </span>


                          <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-2 text-[10px]">

                            <CheckCircle2 className="w-3.5 h-3.5" />

                            {sys.status}

                          </span>

                        </div>


                        <span className="text-[10px] text-axio-text-sub bg-axio-bg/60 px-2.5 py-1.5 rounded-lg font-mono">
                          {sys.latency}
                        </span>

                      </div>


                      <div className="mt-5 h-px bg-gradient-to-r from-axio-red/20 via-axio-border to-transparent" />

                    </div>
                  );

                })}

              </div>

            </section>
          )}


          {/* ========================================================
              USER MANAGEMENT
              ======================================================== */}

          {activeAdminTab === 'User Management' && (
            <section className="admin-scroll-reveal">

              <div className="flex items-center gap-2 mb-5">

                <Users className="w-4 h-4 text-axio-red" />

                <span className="text-[10px] font-mono font-bold text-axio-muted tracking-[0.16em] uppercase">
                  ENTERPRISE USER DIRECTORY
                </span>

              </div>


              <div
                className="overflow-x-auto rounded-2xl bg-axio-panel/55 backdrop-blur-xl"
                style={{
                  transitionDelay: '150ms',
                }}
              >

                <table className="w-full min-w-[800px] text-left font-mono text-xs">

                  <thead>

                    <tr className="text-axio-muted uppercase text-[9px] tracking-wider">

                      <th className="p-5">
                        User
                      </th>

                      <th className="p-5">
                        Email
                      </th>

                      <th className="p-5">
                        Role
                      </th>

                      <th className="p-5">
                        Status
                      </th>

                      <th className="p-5">
                        Last Active
                      </th>

                      <th className="p-5 text-right">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {usersList.map((u) => (

                      <tr
                        key={u.id}
                        className="group transition-colors hover:bg-white/[0.015]"
                      >

                        <td className="p-5 text-white font-bold">
                          {u.name}
                        </td>

                        <td className="p-5 text-axio-muted">
                          {u.email}
                        </td>

                        <td className="p-5">
                          <RoleBadge role={u.role} />
                        </td>

                        <td className="p-5">

                          <span className="flex items-center gap-2 text-emerald-400">

                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                            {u.status}

                          </span>

                        </td>

                        <td className="p-5 text-axio-muted">
                          {u.lastActive}
                        </td>

                        <td className="p-5 text-right">

                          <button
                            onClick={() => switchRole(u.role)}
                            className="group/button px-3 py-2 bg-axio-red/5 hover:bg-axio-red/10 text-axio-red rounded-lg transition-all flex items-center gap-2 ml-auto"
                          >

                            <span>
                              TEST ROLE CONTEXT
                            </span>

                            <ArrowRight className="w-3 h-3 transition-transform group-hover/button:translate-x-0.5" />

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>
          )}


          {/* ========================================================
              DATABRICKS OPS
              ======================================================== */}

          {activeAdminTab === 'Databricks Ops' && (
            <section
              className="admin-scroll-reveal"
              style={{
                transitionDelay: '100ms',
              }}
            >

              <div className="max-w-4xl rounded-2xl bg-axio-panel/55 backdrop-blur-xl p-7 sm:p-8">

                <div className="flex items-center gap-3 mb-6">

                  <Server className="w-5 h-5 text-axio-red" />

                  <h3 className="font-display font-bold text-white text-sm tracking-wide">
                    DATABRICKS WORKSPACE INTEGRATION OPTIONS
                  </h3>

                </div>


                <p className="text-sm text-axio-text-secondary font-sans leading-relaxed mb-6">
                  AxioGo interfaces with Databricks REST API v2.1 for catalog syncing and job execution.
                </p>


                <div className="p-4 rounded-xl bg-axio-bg/60 font-mono text-xs">

                  <span className="text-axio-muted">
                    HOST:
                  </span>{' '}

                  <span className="text-white">
                    https://adb-fleet-enterprise.azuredatabricks.net
                  </span>

                  <br />

                  <span className="text-axio-muted">
                    TOKEN:
                  </span>{' '}

                  <span className="text-axio-red">
                    dapi_●●●●●●●●●●●●
                  </span>

                  <span className="ml-2 text-emerald-400">
                    (VERIFIED)
                  </span>

                </div>

              </div>

            </section>
          )}


          {/* ========================================================
              AI CONFIGURATION
              ======================================================== */}

          {activeAdminTab === 'AI Configuration' && (
            <section
              className="admin-scroll-reveal"
              style={{
                transitionDelay: '100ms',
              }}
            >

              <div className="max-w-4xl rounded-2xl bg-axio-panel/55 backdrop-blur-xl p-7 sm:p-8">

                <div className="flex items-center gap-3 mb-6">

                  <Cpu className="w-5 h-5 text-axio-red" />

                  <h3 className="font-display font-bold text-white text-sm tracking-wide">
                    AXIS MULTI-AGENT ENGINE PARAMS
                  </h3>

                </div>


                <p className="text-sm text-axio-text-secondary font-sans leading-relaxed mb-7">
                  Configure temperature, max tokens, and RAG chunk retrieval boundaries.
                </p>


                <div className="space-y-5 max-w-md">

                  <div>

                    <label className="text-[9px] text-axio-muted block mb-2 font-mono tracking-wider">
                      RAG VECTOR CHUNK LIMIT:
                    </label>

                    <input
                      type="number"
                      defaultValue={8}
                      className="w-full bg-axio-bg/60 rounded-lg px-4 py-3 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-axio-red/40 transition-all"
                    />

                  </div>


                  <div>

                    <label className="text-[9px] text-axio-muted block mb-2 font-mono tracking-wider">
                      MAX GENERATION TOKENS:
                    </label>

                    <input
                      type="number"
                      defaultValue={2048}
                      className="w-full bg-axio-bg/60 rounded-lg px-4 py-3 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-axio-red/40 transition-all"
                    />

                  </div>


                  <button
                    className="
                      mt-2
                      px-5
                      py-2.5
                      bg-axio-red
                      hover:bg-red-500
                      text-white
                      text-[10px]
                      font-bold
                      rounded-lg
                      flex
                      items-center
                      gap-2
                      shadow-[0_10px_30px_rgba(255,48,70,0.15)]
                      transition-all
                      hover:-translate-y-0.5
                    "
                  >

                    <Settings className="w-3.5 h-3.5" />

                    APPLY CONFIGURATION

                  </button>

                </div>

              </div>

            </section>
          )}

        </div>

      </div>
    </>
  );
};