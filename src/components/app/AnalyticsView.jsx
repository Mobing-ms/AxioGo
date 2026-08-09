import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MAINTENANCE_BY_CATEGORY, CLAIMS_SEVERITY_BREAKDOWN, AI_INSIGHT_CARDS } from '../../services/analyticsService';
import { getReports, generateNewReport } from '../../services/reportService';
import { RoleBadge } from '../common/RoleBadge';
import { 
  BarChart2, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Plus, 
  Download, 
  FileCheck,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export const AnalyticsView = ({ setActivePage }) => {
  const { currentRole, permissions } = useAuth();
  const [activeTab, setActiveTab] = useState('Analytics'); // Analytics, PowerBI, Reports
  const [reports, setReports] = useState(getReports());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('Q3 Enterprise Vehicle Maintenance Analysis');
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [selectedCategory, setSelectedCategory] = useState('Root Cause Analysis');
  const [isGenerating, setIsGenerating] = useState(false);

  // Power BI Refresh State
  const [isPowerBiRefreshing, setIsPowerBiRefreshing] = useState(false);
  const [powerBiRefreshedAt, setPowerBiRefreshedAt] = useState('10 minutes ago');

  const handleRefreshPowerBi = () => {
    setIsPowerBiRefreshing(true);
    setTimeout(() => {
      setIsPowerBiRefreshing(false);
      setPowerBiRefreshedAt('Just now');
    }, 1800);
  };

  const handleCreateReport = async () => {
    setIsGenerating(true);
    const newRep = await generateNewReport(reportTitle, selectedFormat, selectedCategory);
    setReports(prev => [newRep, ...prev]);
    setIsGenerating(false);
    setIsModalOpen(false);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-axio-red" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display">ANALYTICS & REPORTS HUB</h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Unified suite combining dark automotive analytics, Power BI enterprise reporting, and multi-format report synthesis.
          </p>
        </div>

        <button
          onClick={() => setActivePage('axis')}
          className="flex items-center gap-2 px-5 py-2 bg-axio-red hover:bg-red-600 text-white rounded font-bold text-xs shadow-lg shadow-axio-red/20 transition-all font-tech"
        >
          <Bot className="w-4 h-4" />
          <span>ANALYZE WITH AXIS</span>
        </button>
      </div>

      {/* Sub-tabs for Combined Analytics & Reports Page */}
      <div className="flex border-b border-axio-border mb-8 gap-2 text-xs">
        {[
          { id: 'Analytics', label: 'Fleet Analytics' },
          { id: 'PowerBI', label: 'Power BI Embedded' },
          { id: 'Reports', label: 'Report Generator' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 border-b-2 font-bold transition-all ${
              activeTab === t.id ? 'border-axio-red text-white' : 'border-transparent text-axio-muted hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FLEET ANALYTICS */}
      {activeTab === 'Analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Maintenance Cost by Category */}
            <div className="lg:col-span-7 p-6 bg-axio-panel border border-axio-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-tech">
                  <TrendingUp className="w-4 h-4 text-axio-red" />
                  <span>MAINTENANCE EXPENDITURE BY CATEGORY ($)</span>
                </h2>
                <span className="text-[10px] text-axio-muted">DELTA GOLD LAYER AGGREGATE</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MAINTENANCE_BY_CATEGORY}>
                    <XAxis dataKey="category" stroke="#7F8B98" fontSize={10} />
                    <YAxis stroke="#7F8B98" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#090C11', borderColor: '#202731', fontSize: '11px' }} />
                    <Bar dataKey="cost" fill="#FF3046" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insurance Claims Breakdown */}
            <div className="lg:col-span-5 p-6 bg-axio-panel border border-axio-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-tech">
                  <AlertTriangle className="w-4 h-4 text-axio-cyan" />
                  <span>CLAIMS SEVERITY DISTRIBUTION</span>
                </h2>
                <span className="text-[10px] text-axio-muted">YTD CLAIMS</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={CLAIMS_SEVERITY_BREAKDOWN} 
                      dataKey="count" 
                      nameKey="status" 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={50} 
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {CLAIMS_SEVERITY_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#090C11', borderColor: '#202731', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* AI Insight Context Transfer Banner */}
          <div className="p-6 bg-axio-panel border border-axio-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-axio-red" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-tech">AXIS CONTEXTUAL ANALYSIS</h3>
              </div>
              <button onClick={() => setActivePage('axis')} className="text-xs text-axio-cyan hover:underline flex items-center gap-1">
                <span>TRANSFER FILTERS TO AXIS CHAT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-axio-text-secondary leading-relaxed font-sans">
              Carries current telemetry parameters and vehicle group analytics directly into the AXIS natural language conversational engine.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: POWER BI EMBEDDED */}
      {activeTab === 'PowerBI' && (
        <div className="bg-axio-panel border border-axio-border rounded-lg p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-axio-border">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide font-tech">EMBEDDED POWER BI SUITE</h2>
              <p className="text-xs text-axio-muted">Last Cache Sync: {powerBiRefreshedAt}</p>
            </div>

            {permissions.canAccessPowerBiRefresh && (
              <button
                onClick={handleRefreshPowerBi}
                disabled={isPowerBiRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded transition-all font-tech"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPowerBiRefreshing ? 'animate-spin' : ''}`} />
                <span>{isPowerBiRefreshing ? 'REFRESHING...' : 'REFRESH POWER BI'}</span>
              </button>
            )}
          </div>

          <div className="relative min-h-[380px] bg-axio-bg border border-axio-border rounded-lg flex flex-col items-center justify-center p-8 text-center">
            <BarChart2 className="w-16 h-16 text-amber-400 mb-4 animate-pulse" />
            <h3 className="text-base font-bold text-white mb-2">POWER BI EXECUTIVE DASHBOARD EMBEDDED</h3>
            <p className="max-w-md text-xs text-axio-text-secondary mb-6 font-sans">
              Power BI reports remain fully operational for executive reporting over the Databricks Lakehouse.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl text-xs font-tech">
              <div className="p-3 bg-axio-card border border-axio-border rounded text-center">
                <span className="text-[10px] text-axio-muted block">POWER BI CACHE</span>
                <span className="text-axio-green font-bold">SYNCHRONIZED</span>
              </div>
              <div className="p-3 bg-axio-card border border-axio-border rounded text-center">
                <span className="text-[10px] text-axio-muted block">DATA LAYER</span>
                <span className="text-axio-cyan font-bold">DATABRICKS GOLD</span>
              </div>
              <div className="p-3 bg-axio-card border border-axio-border rounded text-center">
                <span className="text-[10px] text-axio-muted block">REST API</span>
                <span className="text-white font-bold">200 OK</span>
              </div>
              <div className="p-3 bg-axio-card border border-axio-border rounded text-center">
                <span className="text-[10px] text-axio-muted block">RLS GOVERNANCE</span>
                <span className="text-axio-green font-bold">ENFORCED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORT GENERATOR */}
      {activeTab === 'Reports' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-axio-green hover:bg-green-600 text-black font-bold text-xs rounded shadow-lg transition-all font-tech"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE NEW REPORT</span>
            </button>
          </div>

          <div className="bg-axio-panel border border-axio-border rounded-lg overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-axio-card border-b border-axio-border text-axio-muted uppercase text-[10px] font-tech">
                <tr>
                  <th className="p-4">Report Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Format</th>
                  <th className="p-4">Created By</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Size</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-axio-border text-axio-text-sub">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-axio-card/60 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-axio-green" />
                        <span>{rep.title}</span>
                      </div>
                      <span className="block text-[10px] text-axio-muted font-normal mt-0.5">{rep.summary}</span>
                    </td>
                    <td className="p-4 text-axio-cyan font-semibold">{rep.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                        rep.format === 'PDF' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        rep.format === 'Excel' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        rep.format === 'PowerPoint' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                        'bg-blue-500/10 border-blue-500/30 text-blue-400'
                      }`}>
                        {rep.format}
                      </span>
                    </td>
                    <td className="p-4 text-axio-text-secondary">{rep.createdBy}</td>
                    <td className="p-4 text-axio-muted">{rep.createdAt}</td>
                    <td className="p-4 text-white font-semibold">{rep.size}</td>
                    <td className="p-4 text-right">
                      <button className="px-3 py-1 bg-axio-bg hover:bg-axio-hover border border-axio-border text-xs rounded text-white inline-flex items-center gap-1 font-tech">
                        <Download className="w-3.5 h-3.5 text-axio-cyan" />
                        <span>DOWNLOAD</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Report Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
          <div className="relative w-full max-w-lg p-6 bg-axio-panel border border-axio-border rounded-lg shadow-2xl text-left">
            
            <h2 className="text-base font-bold text-white uppercase mb-4 flex items-center gap-2 font-display">
              <FileText className="w-5 h-5 text-axio-green" />
              <span>SYNTHESIZE REPORT FROM AXIS ANALYTICS</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-axio-muted text-[10px] uppercase mb-1 font-tech">Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-axio-bg border border-axio-border rounded px-3 py-2 text-white focus:outline-none focus:border-axio-green"
                />
              </div>

              <div>
                <label className="block text-axio-muted text-[10px] uppercase mb-1 font-tech">Target Format</label>
                <div className="grid grid-cols-4 gap-2 font-tech">
                  {['PDF', 'Excel', 'PowerPoint', 'Word'].map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`py-2 rounded border font-bold transition-colors ${
                        selectedFormat === fmt 
                          ? 'bg-axio-green text-black border-axio-green' 
                          : 'bg-axio-bg text-axio-text-sub border-axio-border'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-axio-muted text-[10px] uppercase mb-1 font-tech">Report Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-axio-bg border border-axio-border rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option>Root Cause Analysis</option>
                  <option>Sustainability & EV Transition</option>
                  <option>Executive Operational Briefing</option>
                  <option>Insurance Claims & Risk Settlement</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-axio-border font-tech">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-axio-bg border border-axio-border rounded text-axio-text-sub">
                  CANCEL
                </button>
                <button
                  onClick={handleCreateReport}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-axio-green hover:bg-green-600 font-bold text-black rounded flex items-center gap-2"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>GENERATE REPORT</span>}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
