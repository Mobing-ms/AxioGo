import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAuditLogs } from '../../services/auditService';
import { RoleBadge } from '../common/RoleBadge';
import {
  ShieldCheck,
  Filter,
  AlertTriangle,
  FileText,
  Search,
} from 'lucide-react';

export const AuditLogsView = () => {
  const { currentRole } = useAuth();

  const [logs, setLogs] = useState(getAuditLogs());
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    return severityFilter === 'ALL' || l.severity === severityFilter;
  });

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.audit-scroll-reveal'
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
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-axio-bg">

      {/* ============================================================
          AMBIENT BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-axio-red/6 rounded-full blur-[150px] pointer-events-none" />

      <div className="fixed top-[45%] right-[-220px] w-[450px] h-[450px] bg-axio-red/4 rounded-full blur-[150px] pointer-events-none" />

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 font-sans">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <section className="audit-scroll-reveal action-reveal mb-10">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              {/* Eyebrow */}

              <div className="flex items-center gap-3 mb-4">

                <span className="relative flex items-center justify-center">
                  <span className="absolute w-9 h-9 rounded-full bg-axio-red/10 blur-md" />

                  <ShieldCheck className="relative w-5 h-5 text-axio-red" />
                </span>

                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-axio-red uppercase">
                  AXIOGO · SECURITY & GOVERNANCE
                </span>

                <RoleBadge role={currentRole} />
              </div>

              {/* Heading */}

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                ENTERPRISE{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                  AUDIT LOGS
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-sm sm:text-base text-axio-text-secondary leading-relaxed">
                Immutable security and execution audit trail across
                enterprise user roles, platform activity, and AXIS
                agent operations.
              </p>

            </div>

            {/* Status */}

            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              AUDIT STREAM ACTIVE
            </div>

          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border to-transparent" />

        </section>

        {/* ========================================================
            FILTER BAR
        ======================================================== */}

        <section
          className="audit-scroll-reveal action-reveal mb-8"
          style={{ transitionDelay: '120ms' }}
        >

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-2 text-[10px] text-axio-muted uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-axio-red" />
              <span>Filter Severity</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              {['ALL', 'HIGH', 'CRITICAL', 'NEUTRAL'].map((sev) => {

                const isActive = severityFilter === sev;

                return (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`
                      relative px-3.5 py-2 rounded-lg
                      text-[9px] font-bold tracking-wider
                      transition-all duration-300
                      ${isActive
                        ? 'bg-axio-red text-white shadow-[0_8px_25px_rgba(255,48,70,0.16)]'
                        : 'bg-axio-panel/50 text-axio-muted hover:text-white hover:bg-axio-panel'
                      }
                    `}
                  >
                    {sev}

                    {isActive && (
                      <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-px bg-red-300 blur-[1px]" />
                    )}
                  </button>
                );
              })}

            </div>

          </div>

        </section>

        {/* ========================================================
            AUDIT TABLE
        ======================================================== */}

        <section
          className="audit-scroll-reveal action-reveal"
          style={{ transitionDelay: '220ms' }}
        >

          <div className="relative overflow-hidden rounded-2xl bg-axio-panel/55 backdrop-blur-xl">

            {/* Top ambient line */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-axio-red/50 to-transparent" />

            {/* Table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] text-left font-mono text-xs">

                <thead>

                  <tr className="text-axio-muted uppercase text-[9px] tracking-wider">

                    <th className="p-5">
                      Timestamp (UTC)
                    </th>

                    <th className="p-5">
                      User
                    </th>

                    <th className="p-5">
                      Role
                    </th>

                    <th className="p-5">
                      Event
                    </th>

                    <th className="p-5">
                      Resource
                    </th>

                    <th className="p-5">
                      Action Details
                    </th>

                    <th className="p-5 text-right">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredLogs.map((log) => (

                    <tr
                      key={log.id}
                      className={`
                        group
                        transition-all duration-300
                        hover:bg-white/[0.015]
                        ${log.severity === 'CRITICAL'
                          ? 'bg-axio-red/[0.025]'
                          : ''
                        }
                      `}
                    >

                      {/* Timestamp */}

                      <td className="p-5 text-axio-muted whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* User */}

                      <td className="p-5 font-bold text-white whitespace-nowrap">
                        {log.user}
                      </td>

                      {/* Role */}

                      <td className="p-5">
                        <RoleBadge
                          role={log.role}
                          compact
                        />
                      </td>

                      {/* Event */}

                      <td className="p-5">

                        <div className="flex items-center gap-2">

                          {log.severity === 'CRITICAL' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-axio-red" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-axio-red/70" />
                          )}

                          <span className="text-axio-red font-bold">
                            {log.event}
                          </span>

                        </div>

                      </td>

                      {/* Resource */}

                      <td className="p-5 text-axio-text-secondary">
                        {log.resource}
                      </td>

                      {/* Action */}

                      <td className="p-5 font-sans text-axio-text-sub max-w-xs">
                        {log.action}
                      </td>

                      {/* Status */}

                      <td className="p-5 text-right">

                        <span
                          className={`
                            inline-flex items-center gap-1.5
                            px-2.5 py-1
                            rounded-full
                            text-[9px]
                            font-bold
                            ${log.status === 'SUCCESS'
                              ? 'bg-emerald-500/8 text-emerald-400'
                              : 'bg-axio-red/10 text-axio-red'
                            }
                          `}
                        >

                          <span
                            className={`
                              w-1.5 h-1.5 rounded-full
                              ${log.status === 'SUCCESS'
                                ? 'bg-emerald-400'
                                : 'bg-axio-red'
                              }
                            `}
                          />

                          {log.status}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Empty state */}

            {filteredLogs.length === 0 && (
              <div className="py-20 text-center">

                <Search className="w-8 h-8 text-axio-muted mx-auto mb-3" />

                <p className="text-sm text-white font-semibold">
                  No audit events found
                </p>

                <p className="text-xs text-axio-muted mt-1">
                  Try changing the severity filter.
                </p>

              </div>
            )}

          </div>

        </section>

        {/* ========================================================
            FOOTER STATUS
        ======================================================== */}

        <section
          className="audit-scroll-reveal action-reveal mt-6"
          style={{ transitionDelay: '320ms' }}
        >

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[9px] font-mono text-axio-muted">

            <span>
              {filteredLogs.length} EVENTS DISPLAYED
            </span>

            <span className="flex items-center gap-2">

              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

              IMMUTABLE AUDIT STREAM

            </span>

          </div>

        </section>

      </main>
    </div>
  );
};