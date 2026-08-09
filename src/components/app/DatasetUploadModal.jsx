import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertTriangle, FileText, RefreshCw, ArrowRight, Bot } from 'lucide-react';
import { validateDatasetUpload } from '../../services/datasetService';

export const DatasetUploadModal = ({ isOpen, onClose, onViewDataset, onAskAxis }) => {
  const [step, setStep] = useState('SELECT'); // SELECT, VALIDATE, PREVIEW, PROCESSING, COMPLETE
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStatusText, setPipelineStatusText] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const res = validateDatasetUpload(file);
    setValidationResult(res);
    setStep('VALIDATE');
  };

  const handleStartProcessing = () => {
    setStep('PROCESSING');
    setPipelineProgress(10);
    setPipelineStatusText('Ingesting file into Databricks Volume...');

    setTimeout(() => {
      setPipelineProgress(35);
      setPipelineStatusText('Intake / Bronze raw table created...');
      
      setTimeout(() => {
        setPipelineProgress(70);
        setPipelineStatusText('Forge / Silver Delta standardization & schema validation...');

        setTimeout(() => {
          setPipelineProgress(90);
          setPipelineStatusText('Insight / Gold table aggregation & Unity Catalog indexing...');

          setTimeout(() => {
            setPipelineProgress(100);
            setStep('COMPLETE');
          }, 800);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl p-6 bg-axio-panel border border-axio-border rounded-lg shadow-2xl font-mono text-left">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-axio-muted hover:text-white rounded hover:bg-axio-card"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-axio-red" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">ENTERPRISE DATASET INTAKE UPLOAD</h2>
        </div>

        <p className="text-xs text-axio-text-secondary mb-6 font-sans">
          Upload new automotive datasets into the enterprise Lakehouse pipeline. Databricks handles storage while AxioGo indexes business context.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 text-[10px] text-axio-muted border-b border-axio-border pb-3">
          <span className={step === 'SELECT' ? 'text-axio-red font-bold' : 'text-axio-text-sub'}>1. SELECT FILE</span>
          <span>→</span>
          <span className={step === 'VALIDATE' ? 'text-axio-red font-bold' : 'text-axio-text-sub'}>2. VALIDATE</span>
          <span>→</span>
          <span className={step === 'PROCESSING' ? 'text-axio-red font-bold animate-pulse' : 'text-axio-text-sub'}>3. PROCESSING</span>
          <span>→</span>
          <span className={step === 'COMPLETE' ? 'text-axio-green font-bold' : 'text-axio-text-sub'}>4. COMPLETE</span>
        </div>

        {/* SELECT STEP */}
        {step === 'SELECT' && (
          <div className="p-8 border-2 border-dashed border-axio-border hover:border-axio-cyan/50 rounded-lg text-center bg-axio-bg/50 transition-colors">
            <Upload className="w-10 h-10 text-axio-cyan mx-auto mb-3" />
            <p className="text-xs text-white font-bold mb-1">Drag & drop enterprise file here</p>
            <p className="text-[10px] text-axio-muted mb-4">Supports CSV, JSON, Parquet, and Excel (.xlsx)</p>
            
            <label className="px-5 py-2.5 bg-axio-red hover:bg-red-600 text-white font-bold text-xs rounded cursor-pointer transition-colors inline-block">
              BROWSE FILE
              <input type="file" onChange={handleFileChange} accept=".csv,.json,.parquet,.xlsx" className="hidden" />
            </label>
          </div>
        )}

        {/* VALIDATE / PREVIEW STEP */}
        {step === 'VALIDATE' && validationResult && (
          <div className="space-y-4 text-xs">
            {validationResult.valid ? (
              <div className="p-4 bg-axio-green/10 border border-axio-green/30 rounded flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-axio-green shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-axio-green">VALIDATION SUCCESSFUL</div>
                  <div className="text-axio-text-sub mt-1">File: {validationResult.fileName} ({validationResult.fileSize})</div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-axio-red/10 border border-axio-red/30 rounded flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-axio-red shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-axio-red">VALIDATION ERROR</div>
                  <div className="text-axio-text-sub mt-1">{validationResult.error}</div>
                </div>
              </div>
            )}

            {validationResult.valid && (
              <div className="p-4 bg-axio-bg border border-axio-border rounded">
                <div className="text-[10px] text-axio-muted font-bold uppercase mb-2">DETECTED SCHEMA PREVIEW</div>
                <div className="space-y-1 font-mono text-[11px]">
                  {validationResult.detectedSchema.map(col => (
                    <div key={col.name} className="flex justify-between border-b border-axio-border/50 py-1">
                      <span className="text-axio-cyan font-bold">{col.name}</span>
                      <span className="text-axio-muted">{col.type}</span>
                      <span className="text-axio-green">{col.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-axio-border">
              <button onClick={() => setStep('SELECT')} className="px-4 py-2 bg-axio-bg border border-axio-border rounded text-axio-text-sub">
                CANCEL
              </button>
              {validationResult.valid && (
                <button onClick={handleStartProcessing} className="px-6 py-2 bg-axio-red hover:bg-red-600 font-bold text-white rounded">
                  CONFIRM & INGEST PIPELINE
                </button>
              )}
            </div>
          </div>
        )}

        {/* PROCESSING ANIMATION STEP */}
        {step === 'PROCESSING' && (
          <div className="py-8 text-center space-y-6">
            <RefreshCw className="w-10 h-10 text-axio-red animate-spin mx-auto" />
            <div>
              <div className="text-sm font-bold text-white mb-2">{pipelineStatusText}</div>
              <div className="w-full bg-axio-card h-3 rounded-full overflow-hidden max-w-md mx-auto border border-axio-border">
                <div className="bg-axio-red h-full transition-all duration-500" style={{ width: `${pipelineProgress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-[10px]">
              <div className={`p-2 rounded border ${pipelineProgress >= 25 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-axio-bg border-axio-border text-axio-muted'}`}>Volume Intake</div>
              <div className={`p-2 rounded border ${pipelineProgress >= 50 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-axio-bg border-axio-border text-axio-muted'}`}>Bronze Table</div>
              <div className={`p-2 rounded border ${pipelineProgress >= 75 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-axio-bg border-axio-border text-axio-muted'}`}>Silver Delta</div>
              <div className={`p-2 rounded border ${pipelineProgress >= 100 ? 'bg-axio-cyan/10 border-axio-cyan text-axio-cyan' : 'bg-axio-bg border-axio-border text-axio-muted'}`}>Gold Catalog</div>
            </div>
          </div>
        )}

        {/* COMPLETE STEP */}
        {step === 'COMPLETE' && (
          <div className="py-6 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-axio-green/20 border border-axio-green flex items-center justify-center text-axio-green mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">DATASET SUCCESSFULLY INGESTED!</h3>
              <p className="text-xs text-axio-text-secondary font-sans">
                Dataset is now available in Databricks Gold Layer and indexed in AxioGo Enterprise Catalog.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => { onClose(); if (onViewDataset) onViewDataset(); }}
                className="px-5 py-2.5 bg-axio-panel border border-axio-border hover:border-axio-border-bright text-white text-xs font-bold rounded"
              >
                VIEW IN CATALOG
              </button>

              <button 
                onClick={() => { onClose(); if (onAskAxis) onAskAxis(); }}
                className="px-6 py-2.5 bg-axio-red hover:bg-red-600 text-white font-bold text-xs rounded flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>ASK AXIS ABOUT NEW DATASET</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
