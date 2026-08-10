import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleBadge } from '../common/RoleBadge';
import {
  Layers,
  Database,
  BarChart2,
  Bot,
  FileText,
  Activity
} from 'lucide-react';

import { DashboardView } from './DashboardView';
import { DataCatalogView } from './DataCatalogView';
import { AnalyticsView } from './AnalyticsView';
import { AxisWorkspace } from './AxisWorkspace';
import { ReportsView } from './ReportsView';

export const WorkspaceView = ({
  setActivePage,
  onOpenUploadModal,
  onOpenVoiceModal,
  onOpenActions
}) => {
  const { currentRole } = useAuth();
  const { activeWorkspace } = useWorkspace();

  const [workspaceTab, setWorkspaceTab] = useState('Overview');

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.workspace-scroll-reveal'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('workspace-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [workspaceTab]);

  const tabs = [
    {
      name: 'Overview',
      icon: Activity
    },
    {
      name: 'Datasets',
      icon: Database
    },
    {
      name: 'Analytics',
      icon: BarChart2
    },
    {
      name: 'AXIS',
      icon: Bot
    },
    {
      name: 'Reports',
      icon: FileText
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-axio-bg">

      {/* ============================================================
          AMBIENT BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 bg-tech-grid opacity-[0.07] pointer-events-none" />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-axio-red/[0.045] rounded-full blur-[150px] pointer-events-none" />

      <div className="fixed bottom-[-180px] right-[-120px] w-[420px] h-[420px] bg-axio-red/[0.02] rounded-full blur-[150px] pointer-events-none" />

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ========================================================
            HEADER
        ======================================================== */}

        <section className="workspace-scroll-reveal workspace-reveal mb-9">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="relative">

                  <div className="absolute inset-0 bg-axio-red/20 blur-xl rounded-full" />

                  <div className="relative w-10 h-10 rounded-xl bg-axio-red/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-axio-red" />
                  </div>

                </div>

                <div>

                  <div className="text-[9px] text-axio-red font-bold tracking-[0.2em] uppercase mb-1">
                    AXIOGO · ENTERPRISE
                  </div>

                  <div className="flex items-center gap-2">

                    <span className="text-[10px] text-axio-muted uppercase tracking-wider">
                      ACTIVE WORKSPACE
                    </span>

                    <span className="w-1 h-1 rounded-full bg-axio-red" />

                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">
                      {activeWorkspace}
                    </span>

                  </div>

                </div>

              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">

                ENTERPRISE{' '}

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-axio-red via-red-400 to-white">
                  WORKSPACE
                </span>

              </h1>

              <p className="max-w-2xl mt-4 text-sm text-axio-text-secondary font-sans leading-relaxed">
                Your unified environment for trusted enterprise data,
                analytics, AXIS intelligence, and decision workflows.
              </p>

            </div>

            <div className="self-start sm:self-auto">

              <RoleBadge role={currentRole} />

            </div>

          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-axio-red/40 via-axio-border/20 to-transparent" />

        </section>

        {/* ========================================================
            WORKSPACE NAVIGATION
        ======================================================== */}

        <section
          className="workspace-scroll-reveal workspace-reveal mb-8"
          style={{ transitionDelay: '100ms' }}
        >

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">

            {tabs.map((tab) => {

              const IconComponent = tab.icon;
              const isActive = workspaceTab === tab.name;

              return (
                <button
                  key={tab.name}
                  onClick={() => setWorkspaceTab(tab.name)}
                  className={`
                    relative
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-xl
                    whitespace-nowrap
                    text-[11px]
                    font-semibold
                    transition-all
                    duration-300
                    ${isActive
                      ? 'text-white bg-axio-red/[0.08] shadow-[0_0_25px_rgba(255,48,70,0.06)]'
                      : 'text-axio-muted hover:text-white hover:bg-white/[0.025]'
                    }
                  `}
                >

                  <IconComponent
                    className={`
                      w-3.5
                      h-3.5
                      transition-colors
                      ${isActive
                        ? 'text-axio-red'
                        : 'text-axio-muted'
                      }
                    `}
                  />

                  <span>{tab.name}</span>

                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-axio-red rounded-full shadow-[0_0_10px_rgba(255,48,70,0.45)]" />
                  )}

                </button>
              );
            })}

          </div>

        </section>

        {/* ========================================================
            ACTIVE WORKSPACE CONTENT
        ======================================================== */}

        <section
          key={workspaceTab}
          className="workspace-content-enter"
        >

          {/* OVERVIEW */}

          {workspaceTab === 'Overview' && (
            <DashboardView
              setActivePage={setActivePage}
            />
          )}

          {/* DATASETS */}

          {workspaceTab === 'Datasets' && (
            <DataCatalogView
              setActivePage={setActivePage}
              onOpenUploadModal={onOpenUploadModal}
            />
          )}

          {/* ANALYTICS */}

          {workspaceTab === 'Analytics' && (
            <AnalyticsView
              setActivePage={setActivePage}
            />
          )}

          {/* AXIS */}

          {workspaceTab === 'AXIS' && (
            <AxisWorkspace
              onOpenVoiceModal={onOpenVoiceModal}
              onOpenReports={() => setActivePage('reports')}
              onOpenActions={onOpenActions}
            />
          )}

          {/* REPORTS */}

          {workspaceTab === 'Reports' && (
            <ReportsView />
          )}

        </section>

      </main>

      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style>{`

        .workspace-reveal {
          opacity: 0;
          transform: translateY(26px);
          filter: blur(4px);

          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms ease;
        }

        .workspace-reveal.workspace-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        .workspace-content-enter {
          animation:
            workspaceContentIn
            500ms
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        @keyframes workspaceContentIn {

          from {
            opacity: 0;
            transform: translateY(14px);
            filter: blur(3px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }

        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {

          .workspace-reveal,
          .workspace-content-enter {
            opacity: 1;
            transform: none;
            filter: none;
            animation: none;
            transition: none;
          }

        }

      `}</style>

    </div>
  );
};