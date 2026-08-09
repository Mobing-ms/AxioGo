import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { getDatasets, getDatasetById } from '../../services/datasetService';
import { RoleBadge } from '../common/RoleBadge';
import { 
  Database, 
  Search, 
  Filter, 
  Upload, 
  Bot, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  Table, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const DataCatalogView = ({ setActivePage, onOpenUploadModal }) => {
  const { currentRole, permissions } = useAuth();
  const { setSelectedDataset } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [detailDataset, setDetailDataset] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const datasets = getDatasets();

  // Role filtering: Standard Users see catalog list but hidden raw SQL / deep schemas
  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'ALL' || d.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const handleAskAxisAboutDataset = (datasetName) => {
    setSelectedDataset(datasetName);
    setActivePage('axis');
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-axio-cyan" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">ENTERPRISE DATA CATALOG</h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Indexed Databricks Delta tables with business context & RAG metadata bindings.
          </p>
        </div>

        {permissions.canUploadDatasets && (
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-axio-red hover:bg-red-600 text-white rounded font-bold text-xs shadow-lg shadow-axio-red/20 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>UPLOAD NEW DATASET</span>
          </button>
        )}
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-axio-muted" />
          <input
            type="text"
            placeholder="Search datasets, columns, owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-axio-panel border border-axio-border rounded text-xs text-white focus:outline-none focus:border-axio-cyan"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
          <span className="text-axio-muted uppercase text-[10px] font-semibold">Domain:</span>
          {['ALL', 'TELEMETRY', 'MAINTENANCE', 'FUEL', 'CLAIMS', 'ACCIDENTS', 'DRIVERS', 'VEHICLES', 'FLEET OPERATIONS'].map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded border transition-colors whitespace-nowrap ${
                selectedDomain === dom
                  ? 'bg-axio-cyan text-black border-axio-cyan font-bold'
                  : 'bg-axio-panel hover:bg-axio-card text-axio-text-sub border-axio-border'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

      </div>

      {/* Dataset Directory Table */}
      <div className="bg-axio-panel border border-axio-border rounded-lg overflow-hidden shadow-2xl mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-axio-card border-b border-axio-border text-axio-muted uppercase text-[10px]">
              <tr>
                <th className="p-4">Dataset</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Data Quality</th>
                <th className="p-4">Freshness</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Records</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-axio-border text-axio-text-sub">
              {filteredDatasets.map((ds) => (
                <tr key={ds.id} className="hover:bg-axio-card/60 transition-colors">
                  <td className="p-4 font-bold text-white">
                    <button 
                      onClick={() => { setDetailDataset(ds); setActiveTab('Overview'); }}
                      className="hover:text-axio-cyan text-left flex items-center gap-2"
                    >
                      <Table className="w-4 h-4 text-axio-cyan" />
                      <span>{ds.name}</span>
                    </button>
                    <span className="block text-[10px] text-axio-muted font-normal truncate max-w-xs">{ds.description}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-axio-bg border border-axio-border text-[10px] text-axio-text-secondary">
                      {ds.domain}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-axio-green font-bold">{ds.qualityScore}%</span>
                  </td>
                  <td className="p-4 text-axio-muted">{ds.freshness}</td>
                  <td className="p-4 text-axio-text-secondary">{ds.owner}</td>
                  <td className="p-4 font-semibold text-white">{ds.recordCount}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setDetailDataset(ds); setActiveTab('Overview'); }}
                        className="px-2.5 py-1 bg-axio-bg hover:bg-axio-hover border border-axio-border text-xs rounded text-axio-text-sub"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleAskAxisAboutDataset(ds.name)}
                        className="px-2.5 py-1 bg-axio-red/10 border border-axio-red/30 hover:bg-axio-red/20 text-axio-red font-bold text-xs rounded flex items-center gap-1"
                      >
                        <Bot className="w-3 h-3" />
                        <span>ASK AXIS</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Dataset Modal Drawer */}
      {detailDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] p-6 bg-axio-panel border border-axio-border rounded-lg shadow-2xl overflow-y-auto font-mono text-left">
            
            <button 
              onClick={() => setDetailDataset(null)}
              className="absolute top-4 right-4 p-1.5 text-axio-muted hover:text-white rounded hover:bg-axio-card"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-axio-cyan" />
              <div>
                <h2 className="text-lg font-bold text-white">{detailDataset.name}</h2>
                <p className="text-xs text-axio-muted">Domain: {detailDataset.domain} | Location: {detailDataset.location}</p>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-axio-border mb-6 gap-2 text-xs">
              {['Overview', 'Schema', 'Lineage', 'Quality', 'Business Context'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border-b-2 font-bold transition-all ${
                    activeTab === tab 
                      ? 'border-axio-red text-white' 
                      : 'border-transparent text-axio-muted hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'Overview' && (
              <div className="space-y-4 text-xs">
                <p className="text-axio-text-secondary leading-relaxed font-sans">{detailDataset.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-axio-bg border border-axio-border rounded-lg">
                  <div><span className="text-axio-muted block text-[10px]">OWNER</span><span className="font-bold text-white">{detailDataset.owner}</span></div>
                  <div><span className="text-axio-muted block text-[10px]">FRESHNESS</span><span className="font-bold text-axio-cyan">{detailDataset.freshness}</span></div>
                  <div><span className="text-axio-muted block text-[10px]">QUALITY SCORE</span><span className="font-bold text-axio-green">{detailDataset.qualityScore}%</span></div>
                  <div><span className="text-axio-muted block text-[10px]">RECORD COUNT</span><span className="font-bold text-white">{detailDataset.recordCount}</span></div>
                </div>
              </div>
            )}

            {activeTab === 'Schema' && (
              <div className="space-y-3 text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-axio-card text-axio-muted uppercase text-[10px]">
                    <tr><th className="p-3">Column</th><th className="p-3">Type</th><th className="p-3">Description</th><th className="p-3">Quality</th></tr>
                  </thead>
                  <tbody className="divide-y divide-axio-border text-axio-text-sub">
                    {detailDataset.schema.map(col => (
                      <tr key={col.name}>
                        <td className="p-3 font-bold text-axio-cyan">{col.name}</td>
                        <td className="p-3 text-axio-muted">{col.type}</td>
                        <td className="p-3 font-sans text-axio-text-secondary">{col.description}</td>
                        <td className="p-3 text-axio-green">{col.quality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Lineage' && (
              <div className="p-6 bg-axio-bg border border-axio-border rounded-lg text-xs space-y-3 font-mono">
                <div className="text-axio-cyan font-bold mb-2">DATABRICKS LAKEHOUSE LINEAGE TRAIL</div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-axio-card border border-axio-border rounded">Source: {detailDataset.lineage.source}</span>
                  <span>→</span>
                  <span className="p-2 bg-axio-card border border-axio-border rounded text-emerald-400">{detailDataset.lineage.bronzeTable}</span>
                  <span>→</span>
                  <span className="p-2 bg-axio-card border border-axio-border rounded text-axio-red">{detailDataset.lineage.silverTable}</span>
                  <span>→</span>
                  <span className="p-2 bg-axio-card border border-axio-border rounded text-axio-cyan font-bold">{detailDataset.lineage.goldTable}</span>
                </div>
              </div>
            )}

            {activeTab === 'Business Context' && (
              <div className="space-y-4 text-xs font-sans">
                <div className="p-4 bg-axio-bg border border-axio-border rounded-lg">
                  <span className="font-mono text-axio-red font-bold block mb-1">BUSINESS DEFINITION</span>
                  <p className="text-axio-text-sub">{detailDataset.businessContext.definition}</p>
                </div>
                <div className="p-4 bg-axio-bg border border-axio-border rounded-lg">
                  <span className="font-mono text-axio-cyan font-bold block mb-1">BUSINESS RULES</span>
                  <p className="text-axio-text-sub">{detailDataset.businessContext.businessRules}</p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-axio-border flex items-center justify-between">
              <span className="text-xs text-axio-muted">Last updated: {detailDataset.updatedAt}</span>
              <button
                onClick={() => {
                  handleAskAxisAboutDataset(detailDataset.name);
                  setDetailDataset(null);
                }}
                className="px-6 py-2.5 bg-axio-red hover:bg-red-600 text-white font-mono text-xs font-bold rounded shadow-lg flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>ASK AXIS ABOUT THIS DATASET</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
