import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

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

// Auth
import { LoginView } from './components/app/LoginView';

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
import { SettingsView } from './components/app/SettingsView';


/* ================================================================
   AUTHENTICATION LOADING SCREEN
================================================================ */

function AuthLoadingScreen() {
  return (
    <div className="
      min-h-screen
      w-full
      bg-axio-bg
      text-white
      flex
      items-center
      justify-center
    ">
      <div className="
        flex
        flex-col
        items-center
        gap-5
      ">

        <div className="
          text-3xl
          font-black
          tracking-[-0.06em]
        ">
          AXIO<span className="text-axio-red">GO</span>
        </div>

        <div className="
          flex
          items-center
          gap-2
          text-[9px]
          uppercase
          tracking-[0.3em]
          text-axio-muted
        ">
          <span className="
            w-1.5
            h-1.5
            rounded-full
            bg-axio-red
            animate-pulse
            shadow-[0_0_10px_rgba(255,48,70,0.7)]
          " />

          AUTHENTICATING
        </div>

      </div>
    </div>
  );
}


/* ================================================================
   SCROLL REVEAL
================================================================ */

const ScrollReveal = ({
  children,
  delay = 0,
}) => {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const prefersReducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(element);
          }
        },
        {
          threshold: 0.08,
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
   Only rendered after successful authentication.
================================================================ */

function MainAppContent() {
  const [activePage, setActivePage] =
    useState('landing');

  const [isVoiceModalOpen, setIsVoiceModalOpen] =
    useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);

  const { logout } = useAuth();


  /* ================================================================
     LOGOUT
  ================================================================= */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        'Logout failed:',
        error
      );
    }
  };


  return (
    <div className="
      min-h-screen
      bg-axio-bg
      text-white
    ">

      {/* ==========================================================
          SCROLL REVEAL STYLES
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
        onLogout={handleLogout}
      />


      {/* ==========================================================
          MAIN CONTENT
      ========================================================== */}

      <main className="flex-1">

        {/* ========================================================
            LANDING PAGE
        ======================================================== */}

        {activePage === 'landing' && (
          <div>

            <HeroSection
              onAskAxis={() =>
                setActivePage('axis')
              }
              onExplore={() =>
                setActivePage('dashboard')
              }
            />

            <ScrollTypography />

            <ScrollReveal delay={0}>
              <TrustedDataSection />
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <BusinessContextSection />
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <AxisDemoSection
                onOpenFullAxis={() =>
                  setActivePage('axis')
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <MultiAgentNetwork />
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <DecisionStorySection
                onOpenActions={() =>
                  setActivePage('actions')
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <AutomotiveDomains />
            </ScrollReveal>

          </div>
        )}


        {/* ABOUT */}

        {activePage === 'about' && (
          <AboutView
            setActivePage={setActivePage}
          />
        )}


        {/* DASHBOARD */}

        {activePage === 'dashboard' && (
          <DashboardView
            setActivePage={setActivePage}
          />
        )}


        {/* WORKSPACE */}

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


        {/* DATA CATALOG */}

        {activePage === 'catalog' && (
          <DataCatalogView
            setActivePage={setActivePage}
            onOpenUploadModal={() =>
              setIsUploadModalOpen(true)
            }
          />
        )}


        {/* ANALYTICS */}

        {activePage === 'analytics' && (
          <AnalyticsView
            setActivePage={setActivePage}
          />
        )}


        {/* AXIS */}

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


        {/* REPORTS */}

        {activePage === 'reports' && (
          <ReportsView />
        )}


        {/* POWER BI */}

        {activePage === 'powerbi' && (
          <PowerBiView />
        )}


        {/* ACTIONS */}

        {activePage === 'actions' && (
          <ActionsView />
        )}


        {/* ADMIN */}

        {activePage === 'admin' && (
          <AdminView />
        )}


        {/* AUDIT */}

        {activePage === 'audit' && (
          <AuditLogsView />
        )}


        {/* SETTINGS */}

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
   AUTHENTICATION GATE
================================================================ */

function AuthenticatedApp() {
  const {
    session,
    loading,
  } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    return (
      <LoginView
        onLoginSuccess={() => {
          // Supabase's auth state listener updates
          // the session automatically.
        }}
      />
    );
  }

  return <MainAppContent />;
}


/* ================================================================
   ROOT APP
================================================================ */

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AuthenticatedApp />
      </WorkspaceProvider>
    </AuthProvider>
  );
}