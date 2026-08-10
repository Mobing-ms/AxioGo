import React, { useEffect, useRef, useState } from 'react';

import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { VoiceModal } from './components/common/VoiceModal';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { ScrollTypography } from './components/landing/ScrollTypography';
import { TrustedDataSection } from './components/landing/TrustedDataSection';
import { BusinessContextSection } from './components/landing/BusinessContextSection';
import { AxisDemoSection } from './components/landing/AxisDemoSection';
import { MultiAgentNetwork } from './components/landing/MultiAgentNetwork';
import { DecisionStorySection } from './components/landing/DecisionStorySection';
import { AutomotiveDomains } from './components/landing/AutomotiveDomains';

// Authenticated Application Views
import { DashboardView } from './components/app/DashboardView';
import { WorkspaceView } from './components/app/WorkspaceView';
import { DataCatalogView } from './components/app/DataCatalogView';
import { DatasetUploadModal } from './components/app/DatasetUploadModal';
import { AnalyticsView } from './components/app/AnalyticsView';
import { AxisWorkspace } from './components/app/AxisWorkspace';
import { ReportsView } from './components/app/ReportsView';
import { PowerBiView } from './components/app/PowerBiView';
import { ActionsView } from './components/app/ActionsView';
import { AdminView } from './components/app/AdminView';
import { AuditLogsView } from './components/app/AuditLogsView';
import { NotificationsDrawer } from './components/app/NotificationsDrawer';
import { AboutView } from './components/app/AboutView';
import { LoginView } from './components/app/LoginView';
import { SettingsView } from './components/app/SettingsView';


/* ================================================================
   SCROLL REVEAL

   IMPORTANT:
   This is ONLY used for sections AFTER ScrollTypography.

   It does not wrap or modify ScrollTypography.
================================================================ */

const ScrollReveal = ({ children, delay = 0 }) => {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          // Only animate once.
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.08,

        /*
         * Start the reveal slightly before the
         * section reaches the viewport center.
         */
        rootMargin: '0px 0px -80px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={
        visible
          ? 'axio-scroll-reveal axio-scroll-reveal-visible'
          : 'axio-scroll-reveal'
      }
      style={{
        '--axio-reveal-delay': `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};


/* ================================================================
   MAIN APP CONTENT
================================================================ */

function MainAppContent() {
  const [activePage, setActivePage] = useState('landing');

  const [isVoiceModalOpen, setIsVoiceModalOpen] =
    useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);


  /* ================================================================
     LOGIN
  ================================================================= */

  if (activePage === 'login') {
    return (
      <LoginView
        onLoginSuccess={() => setActivePage('dashboard')}
      />
    );
  }


  return (
    <div className="min-h-screen bg-axio-bg text-white">

      {/* ==========================================================
          SCROLL REVEAL STYLES
          
          These styles only apply to the individual wrappers
          AFTER ScrollTypography.
      ========================================================== */}

      <style>{`

        .axio-scroll-reveal {
          opacity: 0;

          transform:
            translate3d(0, 70px, 0)
            scale(0.985);

          filter: blur(7px);

          transition:
            opacity 900ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 900ms cubic-bezier(0.16, 1, 0.3, 1);

          transition-delay:
            var(--axio-reveal-delay, 0ms);

          will-change:
            opacity,
            transform,
            filter;
        }


        .axio-scroll-reveal-visible {
          opacity: 1;

          transform:
            translate3d(0, 0, 0)
            scale(1);

          filter: blur(0);
        }


        @media (prefers-reduced-motion: reduce) {

          .axio-scroll-reveal {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }

        }


        @media (max-width: 640px) {

          .axio-scroll-reveal {
            transform:
              translate3d(0, 45px, 0)
              scale(0.99);

            filter: blur(5px);

            transition-duration: 750ms;
          }

          .axio-scroll-reveal-visible {
            transform:
              translate3d(0, 0, 0)
              scale(1);
          }

        }

      `}</style>


      {/* ==========================================================
          HEADER
      ========================================================== */}

      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenVoiceModal={() =>
          setIsVoiceModalOpen(true)
        }
        onOpenNotifications={() =>
          setIsNotificationsOpen(true)
        }
      />


      {/* ==========================================================
          MAIN CONTENT
      ========================================================== */}

      <main className="flex-1">

        {/* ========================================================
            LANDING PAGE

            IMPORTANT:
            NO overflow-hidden here.

            ScrollTypography uses position: sticky and MUST remain
            connected to the viewport scrolling context.
        ======================================================== */}

        {activePage === 'landing' && (
          <div>

            {/* ====================================================
                HERO

                Existing Hero animation remains untouched.
            ==================================================== */}

            <HeroSection
              onAskAxis={() =>
                setActivePage('axis')
              }
              onExplore={() =>
                setActivePage('dashboard')
              }
            />


            {/* ====================================================
                SCROLL TYPOGRAPHY

                DO NOT WRAP THIS.

                DO NOT PUT IT INSIDE A TRANSFORMED ELEMENT.

                DO NOT PUT IT INSIDE overflow-hidden.

                Its own sticky + scroll-progress system controls
                DATA → CONTEXT → INTELLIGENCE → DECISION → ACTION.
            ==================================================== */}

            <ScrollTypography />


            {/* ====================================================
                TRUSTED DATA

                Scroll-triggered reveal begins AFTER the
                typography animation.
            ==================================================== */}

            <ScrollReveal delay={0}>
              <TrustedDataSection />
            </ScrollReveal>


            {/* ====================================================
                BUSINESS CONTEXT
            ==================================================== */}

            <ScrollReveal delay={80}>
              <BusinessContextSection />
            </ScrollReveal>


            {/* ====================================================
                AXIS DEMO
            ==================================================== */}

            <ScrollReveal delay={120}>
              <AxisDemoSection
                onOpenFullAxis={() =>
                  setActivePage('axis')
                }
              />
            </ScrollReveal>


            {/* ====================================================
                MULTI-AGENT NETWORK
            ==================================================== */}

            <ScrollReveal delay={80}>
              <MultiAgentNetwork />
            </ScrollReveal>


            {/* ====================================================
                DECISION STORY
            ==================================================== */}

            <ScrollReveal delay={120}>
              <DecisionStorySection
                onOpenActions={() =>
                  setActivePage('actions')
                }
              />
            </ScrollReveal>


            {/* ====================================================
                AUTOMOTIVE DOMAINS
            ==================================================== */}

            <ScrollReveal delay={80}>
              <AutomotiveDomains />
            </ScrollReveal>

          </div>
        )}


        {/* ========================================================
            ABOUT
        ======================================================== */}

        {activePage === 'about' && (
          <AboutView
            setActivePage={setActivePage}
          />
        )}


        {/* ========================================================
            DASHBOARD
        ======================================================== */}

        {activePage === 'dashboard' && (
          <DashboardView
            setActivePage={setActivePage}
          />
        )}


        {/* ========================================================
            WORKSPACE
        ======================================================== */}

        {activePage === 'workspace' && (
          <WorkspaceView
            setActivePage={setActivePage}
            onOpenUploadModal={() =>
              setIsUploadModalOpen(true)
            }
            onOpenVoiceModal={() =>
              setIsVoiceModalOpen(true)
            }
            onOpenActions={() =>
              setActivePage('actions')
            }
          />
        )}


        {/* ========================================================
            DATA CATALOG
        ======================================================== */}

        {activePage === 'catalog' && (
          <DataCatalogView
            setActivePage={setActivePage}
            onOpenUploadModal={() =>
              setIsUploadModalOpen(true)
            }
          />
        )}


        {/* ========================================================
            ANALYTICS
        ======================================================== */}

        {activePage === 'analytics' && (
          <AnalyticsView
            setActivePage={setActivePage}
          />
        )}


        {/* ========================================================
            AXIS
        ======================================================== */}

        {activePage === 'axis' && (
          <AxisWorkspace
            onOpenVoiceModal={() =>
              setIsVoiceModalOpen(true)
            }
            onOpenReports={() =>
              setActivePage('reports')
            }
            onOpenActions={() =>
              setActivePage('actions')
            }
          />
        )}


        {/* ========================================================
            REPORTS
        ======================================================== */}

        {activePage === 'reports' && (
          <ReportsView />
        )}


        {/* ========================================================
            POWER BI
        ======================================================== */}

        {activePage === 'powerbi' && (
          <PowerBiView />
        )}


        {/* ========================================================
            ACTIONS
        ======================================================== */}

        {activePage === 'actions' && (
          <ActionsView />
        )}


        {/* ========================================================
            ADMIN
        ======================================================== */}

        {activePage === 'admin' && (
          <AdminView />
        )}


        {/* ========================================================
            AUDIT
        ======================================================== */}

        {activePage === 'audit' && (
          <AuditLogsView />
        )}


        {/* ========================================================
            SETTINGS
        ======================================================== */}

        {activePage === 'settings' && (
          <SettingsView />
        )}

      </main>


      {/* ==========================================================
          VOICE MODAL
      ========================================================== */}

      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() =>
          setIsVoiceModalOpen(false)
        }
        onAxisResponse={() => { }}
      />


      {/* ==========================================================
          NOTIFICATIONS
      ========================================================== */}

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() =>
          setIsNotificationsOpen(false)
        }
      />


      {/* ==========================================================
          DATASET UPLOAD
      ========================================================== */}

      <DatasetUploadModal
        isOpen={isUploadModalOpen}
        onClose={() =>
          setIsUploadModalOpen(false)
        }
        onViewDataset={() =>
          setActivePage('catalog')
        }
        onAskAxis={() =>
          setActivePage('axis')
        }
      />


      {/* ==========================================================
          FOOTER
      ========================================================== */}

      <Footer
        setActivePage={setActivePage}
      />

    </div>
  );
}


/* ================================================================
   ROOT APP
================================================================ */

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <MainAppContent />
      </WorkspaceProvider>
    </AuthProvider>
  );
}