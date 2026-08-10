import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { RoleBadge } from '../common/RoleBadge';
import { Layers, Database, BarChart2, Bot, FileText, Activity } from 'lucide-react';
import { DashboardView } from './DashboardView';
import { DataCatalogView } from './DataCatalogView';
import { AnalyticsView } from './AnalyticsView';
import { AxisWorkspace } from './AxisWorkspace';
import { ReportsView } from './ReportsView';

export const WorkspaceView = ({ setActivePage, onOpenUploadModal, onOpenVoiceModal, onOpenActions }) => {
  const { currentRole } = useAuth();
  const { activeWorkspace, setActiveWorkspace } = useWorkspace();
  const [workspaceTab, setWorkspaceTab] = useState('Overview');

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-axio-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-axio-red/10 border border-axio-red/30 text-axio-red">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">ENTERPRISE WORKSPACE</h1>
            <p className="text-xs text-axio-text-secondary">Current Active Domain Context: <span className="text-axio-cyan font-bold">{activeWorkspace}</span></p>
          </div>
        </div>
        <RoleBadge role={currentRole} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-axio-border mb-8 gap-2 text-xs overflow-x-auto">
        {['Overview', 'Datasets', 'Analytics', 'AXIS', 'Reports'].map(tab => (
          <button
            key={tab}
            onClick={() => setWorkspaceTab(tab)}
            className={`px-4 py-2 border-b-2 font-bold transition-all whitespace-nowrap ${workspaceTab === tab ? 'border-axio-red text-white' : 'border-transparent text-axio-muted hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Selected Workspace Tab */}
      {workspaceTab === 'Overview' && <DashboardView setActivePage={setActivePage} />}
      {workspaceTab === 'Datasets' && <DataCatalogView setActivePage={setActivePage} onOpenUploadModal={onOpenUploadModal} />}
      {workspaceTab === 'Analytics' && <AnalyticsView setActivePage={setActivePage} />}
      {workspaceTab === 'AXIS' && <AxisWorkspace onOpenVoiceModal={onOpenVoiceModal} onOpenReports={() => setActivePage('reports')} onOpenActions={onOpenActions} />}
      {workspaceTab === 'Reports' && <ReportsView />}

    </div>
  );
};
