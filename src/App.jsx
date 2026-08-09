import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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

function MainAppContent() {
  const [activePage, setActivePage] = useState('landing');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Dedicated Login View
  if (activePage === 'login') {
    return <LoginView onLoginSuccess={() => setActivePage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-axio-bg text-axio-text font-sans selection:bg-axio-red selection:text-white flex flex-col justify-between">
      
      {/* Top Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* LANDING PAGE ROUTE */}
        {activePage === 'landing' && (
          <div>
            <HeroSection 
              onAskAxis={() => setActivePage('axis')} 
              onExplore={() => setActivePage('dashboard')} 
            />
            <ScrollTypography />
            <TrustedDataSection />
            <BusinessContextSection />
            <AxisDemoSection onOpenFullAxis={() => setActivePage('axis')} />
            <MultiAgentNetwork />
            <DecisionStorySection onOpenActions={() => setActivePage('actions')} />
            <AutomotiveDomains />
          </div>
        )}

        {/* AUTHENTICATED APP ROUTES */}
        {activePage === 'about' && <AboutView setActivePage={setActivePage} />}
        {activePage === 'dashboard' && <DashboardView setActivePage={setActivePage} />}
        {activePage === 'workspace' && (
          <WorkspaceView 
            setActivePage={setActivePage} 
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenActions={() => setActivePage('actions')}
          />
        )}
        {activePage === 'catalog' && (
          <DataCatalogView 
            setActivePage={setActivePage} 
            onOpenUploadModal={() => setIsUploadModalOpen(true)} 
          />
        )}
        {activePage === 'analytics' && <AnalyticsView setActivePage={setActivePage} />}
        {activePage === 'axis' && (
          <AxisWorkspace 
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)} 
            onOpenReports={() => setActivePage('reports')}
            onOpenActions={() => setActivePage('actions')}
          />
        )}
        {activePage === 'reports' && <ReportsView />}
        {activePage === 'powerbi' && <PowerBiView />}
        {activePage === 'actions' && <ActionsView />}
        {activePage === 'admin' && <AdminView />}
        {activePage === 'audit' && <AuditLogsView />}
        {activePage === 'settings' && <SettingsView />}
      </main>

      {/* Global Modals & Drawers */}
      <VoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
        onAxisResponse={() => {}}
      />

      <NotificationsDrawer 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      <DatasetUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onViewDataset={() => setActivePage('catalog')}
        onAskAxis={() => setActivePage('axis')}
      />

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <MainAppContent />
      </WorkspaceProvider>
    </AuthProvider>
  );
}
