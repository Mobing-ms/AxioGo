import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReports, generateNewReport } from '../../services/reportService';
import { RoleBadge } from '../common/RoleBadge';
import { FileText, Download, Plus, CheckCircle2, RefreshCw, X, FileCheck, Layers } from 'lucide-react';

export const ReportsView = () => {
  const { currentRole } = useAuth();
  const [reports, setReports] = useState(getReports());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('Q3 Enterprise Vehicle Maintenance Analysis');
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [selectedCategory, setSelectedCategory] = useState('Root Cause Analysis');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateReport = async () => {
    setIsGenerating(true);
    const newRep = await generateNewReport(reportTitle, selectedFormat, selectedCategory);
    setReports(prev => [newRep, ...prev]);
    setIsGenerating(false);
    setIsModalOpen(false);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-mono text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-axio-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-axio-green" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">ENTERPRISE REPORTS CENTER</h1>
            <RoleBadge role={currentRole} />
          </div>
          <p className="text-xs text-axio-text-secondary">
            Multi-format decision intelligence reports synthesized directly by AXIS Report Agent.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-axio-red hover:bg-red-600 text-white font-bold text-xs rounded shadow-lg shadow-axio-red/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE REPORT</span>
        </button>
      </div>

      {/* Reports Directory Table */}
      <div className="bg-axio-panel border border-axio-border rounded-lg overflow-hidden shadow-2xl mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-axio-card border-b border-axio-border text-axio-muted uppercase text-[10px]">
              <tr>
                <th className="p-4">Report Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Format</th>
                <th className="p-4">Created By</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Size</th>
                <th className="p-4 text-right">Actions</th>
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
                  <td className="p-4 text-axio-cyan">{rep.type}</td>
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
                    <button className="px-3 py-1.5 bg-axio-bg hover:bg-axio-hover border border-axio-border text-xs rounded text-white flex items-center gap-1 ml-auto">
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

      {/* Create Report Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 bg-axio-panel border border-axio-border rounded-lg shadow-2xl font-mono text-left">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-axio-muted hover:text-white rounded hover:bg-axio-card"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-white uppercase mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-axio-green" />
              <span>SYNTHESIZE REPORT FROM AXIS ANALYTICS</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-axio-muted text-[10px] uppercase mb-1">Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-axio-bg border border-axio-border rounded px-3 py-2 text-white focus:outline-none focus:border-axio-green"
                />
              </div>

              <div>
                <label className="block text-axio-muted text-[10px] uppercase mb-1">Target Format</label>
                <div className="grid grid-cols-4 gap-2">
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
                <label className="block text-axio-muted text-[10px] uppercase mb-1">Report Category</label>
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

              <div className="p-3 bg-axio-bg border border-axio-border rounded text-[11px] text-axio-muted">
                AXIS Report Agent will automatically pull Gold tables, chart visualizations, and recommendation lists into the export bundle.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-axio-border">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-axio-bg border border-axio-border rounded text-axio-text-sub"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleCreateReport}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-axio-green hover:bg-green-600 font-bold text-black rounded flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>SYNTHESIZING...</span>
                    </>
                  ) : (
                    <span>GENERATE REPORT</span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
