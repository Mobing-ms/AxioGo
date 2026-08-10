import React, { useEffect, useState } from 'react';
import {
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Bot
} from 'lucide-react';
import { validateDatasetUpload } from '../../services/datasetService';

export const DatasetUploadModal = ({
  isOpen,
  onClose,
  onViewDataset,
  onAskAxis
}) => {
  const [step, setStep] = useState('SELECT');
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStatusText, setPipelineStatusText] = useState('');

  /* ============================================================
     UPLOAD LOGIC — PRESERVED
  ============================================================ */

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
    setPipelineStatusText(
      'Ingesting file into Databricks Volume...'
    );

    setTimeout(() => {
      setPipelineProgress(35);
      setPipelineStatusText(
        'Intake / Bronze raw table created...'
      );

      setTimeout(() => {
        setPipelineProgress(70);
        setPipelineStatusText(
          'Forge / Silver Delta standardization & schema validation...'
        );

        setTimeout(() => {
          setPipelineProgress(90);
          setPipelineStatusText(
            'Insight / Gold table aggregation & Unity Catalog indexing...'
          );

          setTimeout(() => {
            setPipelineProgress(100);
            setStep('COMPLETE');
          }, 800);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  /* ============================================================
     MODAL
  ============================================================ */

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">

      {/* Ambient red light */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-axio-red/[0.06] rounded-full blur-[140px] pointer-events-none" />

      {/* Ambient cyan kept extremely subtle */}

      <div className="absolute top-1/3 right-1/4 w-[300px] h-[250px] bg-axio-cyan/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Modal */}

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-axio-panel/90 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.55)] font-mono text-left modal-enter">

        {/* Top ambient accent */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-axio-red to-transparent" />

        {/* Subtle grid */}

        <div className="absolute inset-0 bg-tech-grid opacity-[0.06] pointer-events-none rounded-2xl" />

        <div className="relative z-10 p-6 sm:p-8">

          {/* ====================================================
              CLOSE
          ==================================================== */}

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-axio-muted hover:text-white hover:bg-white/[0.05] transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ====================================================
              HEADER
          ==================================================== */}

          <div className="flex items-start gap-4 mb-7 pr-8">

            <div className="relative shrink-0">

              <div className="absolute inset-0 rounded-xl bg-axio-red/20 blur-xl" />

              <div className="relative w-11 h-11 rounded-xl bg-axio-red/10 flex items-center justify-center text-axio-red">

                <Upload className="w-5 h-5" />

              </div>

            </div>

            <div>

              <div className="text-[9px] text-axio-red font-bold tracking-[0.2em] mb-1">
                AXIOGO · DATA INGESTION
              </div>

              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                ENTERPRISE DATASET INTAKE
              </h2>

              <p className="text-xs text-axio-text-secondary mt-2 font-sans leading-relaxed">
                Upload automotive datasets into the enterprise
                Lakehouse pipeline. Databricks handles storage
                while AxioGo indexes business context.
              </p>

            </div>

          </div>

          {/* ====================================================
              STEP INDICATOR
          ==================================================== */}

          <div className="flex items-center justify-between mb-8 px-1">

            {[
              ['SELECT', '01', 'SELECT FILE'],
              ['VALIDATE', '02', 'VALIDATE'],
              ['PROCESSING', '03', 'PROCESS'],
              ['COMPLETE', '04', 'COMPLETE']
            ].map(([id, number, label], index) => {

              const isActive = step === id;

              const isComplete =
                (id === 'SELECT' &&
                  ['VALIDATE', 'PROCESSING', 'COMPLETE'].includes(step)) ||
                (id === 'VALIDATE' &&
                  ['PROCESSING', 'COMPLETE'].includes(step)) ||
                (id === 'PROCESSING' &&
                  step === 'COMPLETE');

              return (
                <React.Fragment key={id}>

                  <div className="flex flex-col items-center gap-1.5">

                    <div
                      className={`
                        w-8 h-8 rounded-full
                        flex items-center justify-center
                        text-[9px] font-bold
                        transition-all duration-500
                        ${isActive
                          ? 'bg-axio-red text-white shadow-[0_0_20px_rgba(255,48,70,0.25)] scale-110'
                          : isComplete
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-white/[0.03] text-axio-muted'
                        }
                      `}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        number
                      )}
                    </div>

                    <span
                      className={`
                        text-[8px] sm:text-[9px]
                        font-bold tracking-wider
                        ${isActive
                          ? 'text-white'
                          : isComplete
                            ? 'text-emerald-400'
                            : 'text-axio-muted'
                        }
                      `}
                    >
                      {label}
                    </span>

                  </div>

                  {index < 3 && (
                    <div className="flex-1 h-px mx-2 bg-gradient-to-r from-white/[0.04] via-axio-border/30 to-white/[0.04]" />
                  )}

                </React.Fragment>
              );
            })}

          </div>

          {/* ====================================================
              SELECT FILE
          ==================================================== */}

          {step === 'SELECT' && (

            <div className="step-enter">

              <label className="group relative block cursor-pointer">

                <div className="relative overflow-hidden rounded-2xl bg-white/[0.015] hover:bg-white/[0.025] transition-all duration-500">

                  {/* Hover glow */}

                  <div className="absolute inset-0 bg-gradient-to-br from-axio-red/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative py-12 px-6 text-center">

                    <div className="relative inline-flex mb-5">

                      <div className="absolute inset-0 bg-axio-red/20 blur-2xl rounded-full group-hover:bg-axio-red/30 transition-all" />

                      <div className="relative w-16 h-16 rounded-2xl bg-axio-red/10 flex items-center justify-center text-axio-red group-hover:scale-105 transition-transform duration-300">

                        <Upload className="w-7 h-7" />

                      </div>

                    </div>

                    <p className="text-sm text-white font-bold mb-2">
                      DROP ENTERPRISE DATASET
                    </p>

                    <p className="text-[10px] text-axio-muted mb-6 font-sans">
                      CSV · JSON · PARQUET · EXCEL
                    </p>

                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-axio-red hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-[0_10px_25px_rgba(255,48,70,0.15)] transition-all">

                      <Upload className="w-3.5 h-3.5" />

                      BROWSE FILE

                      <ArrowRight className="w-3 h-3" />

                    </span>

                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".csv,.json,.parquet,.xlsx"
                      className="hidden"
                    />

                  </div>

                </div>

              </label>

            </div>
          )}

          {/* ====================================================
              VALIDATE
          ==================================================== */}

          {step === 'VALIDATE' && validationResult && (

            <div className="space-y-5 step-enter">

              {/* Validation status */}

              <div
                className={`
                  p-5 rounded-xl
                  ${validationResult.valid
                    ? 'bg-emerald-500/[0.04]'
                    : 'bg-axio-red/[0.05]'
                  }
                `}
              >

                <div className="flex items-start gap-3">

                  {validationResult.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-axio-red shrink-0 mt-0.5" />
                  )}

                  <div>

                    <div
                      className={`font-bold text-xs ${validationResult.valid
                          ? 'text-emerald-400'
                          : 'text-axio-red'
                        }`}
                    >
                      {validationResult.valid
                        ? 'VALIDATION SUCCESSFUL'
                        : 'VALIDATION ERROR'}
                    </div>

                    <div className="text-axio-text-sub mt-2 text-[11px] font-sans">
                      {validationResult.valid
                        ? `File: ${validationResult.fileName} (${validationResult.fileSize})`
                        : validationResult.error}
                    </div>

                  </div>

                </div>

              </div>

              {/* Schema */}

              {validationResult.valid && (

                <div className="rounded-xl bg-white/[0.02] overflow-hidden">

                  <div className="px-4 py-3 text-[9px] text-axio-muted font-bold uppercase tracking-wider">
                    DETECTED SCHEMA PREVIEW
                  </div>

                  <div className="px-4 pb-3">

                    {validationResult.detectedSchema.map((col) => (

                      <div
                        key={col.name}
                        className="flex items-center justify-between gap-4 py-2.5 text-[10px] group"
                      >

                        <span className="text-axio-red font-bold">
                          {col.name}
                        </span>

                        <span className="text-axio-muted">
                          {col.type}
                        </span>

                        <span className="text-emerald-400">
                          {col.status}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>
              )}

              {/* Actions */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  onClick={() => setStep('SELECT')}
                  className="px-4 py-2.5 text-axio-text-sub hover:text-white text-xs font-bold rounded-lg hover:bg-white/[0.03] transition-all"
                >
                  CANCEL
                </button>

                {validationResult.valid && (

                  <button
                    onClick={handleStartProcessing}
                    className="group px-5 py-2.5 bg-axio-red hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-[0_10px_25px_rgba(255,48,70,0.15)] flex items-center gap-2 transition-all"
                  >

                    CONFIRM & INGEST

                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />

                  </button>

                )}

              </div>

            </div>
          )}

          {/* ====================================================
              PROCESSING
          ==================================================== */}

          {step === 'PROCESSING' && (

            <div className="py-8 text-center step-enter">

              <div className="relative inline-flex mb-6">

                <div className="absolute inset-0 bg-axio-red/20 blur-2xl rounded-full" />

                <div className="relative w-16 h-16 rounded-full bg-axio-red/10 flex items-center justify-center">

                  <RefreshCw className="w-7 h-7 text-axio-red animate-spin" />

                </div>

              </div>

              <div className="text-sm font-bold text-white mb-4">
                {pipelineStatusText}
              </div>

              {/* Progress */}

              <div className="w-full max-w-md mx-auto">

                <div className="flex justify-between text-[9px] text-axio-muted mb-2">

                  <span>
                    PIPELINE PROGRESS
                  </span>

                  <span className="text-axio-red font-bold">
                    {pipelineProgress}%
                  </span>

                </div>

                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-axio-red to-red-400 rounded-full transition-all duration-700 relative"
                    style={{
                      width: `${pipelineProgress}%`
                    }}
                  >

                    <div className="absolute inset-0 bg-white/20 animate-pulse" />

                  </div>

                </div>

              </div>

              {/* Pipeline stages */}

              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mt-8">

                {[
                  ['Volume Intake', 25],
                  ['Bronze Table', 50],
                  ['Silver Delta', 75],
                  ['Gold Catalog', 100]
                ].map(([label, threshold]) => {

                  const complete =
                    pipelineProgress >= threshold;

                  return (
                    <div
                      key={label}
                      className={`
                        p-3 rounded-xl
                        text-[9px]
                        transition-all duration-500
                        ${complete
                          ? 'bg-emerald-500/[0.06] text-emerald-400'
                          : 'bg-white/[0.02] text-axio-muted'
                        }
                      `}
                    >

                      <div className="flex justify-center mb-2">

                        {complete ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-axio-muted mt-1" />
                        )}

                      </div>

                      {label}

                    </div>
                  );
                })}

              </div>

            </div>
          )}

          {/* ====================================================
              COMPLETE
          ==================================================== */}

          {step === 'COMPLETE' && (

            <div className="py-7 text-center step-enter">

              <div className="relative inline-flex mb-6">

                <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full" />

                <div className="relative w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400">

                  <CheckCircle2 className="w-8 h-8" />

                </div>

              </div>

              <h3 className="text-xl font-display font-bold text-white mb-2">
                DATASET SUCCESSFULLY INGESTED
              </h3>

              <p className="text-xs text-axio-text-secondary font-sans max-w-md mx-auto leading-relaxed">
                Dataset is now available in the Databricks Gold
                Layer and indexed in the AxioGo Enterprise Catalog.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">

                <button
                  onClick={() => {
                    onClose();

                    if (onViewDataset) {
                      onViewDataset();
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs font-bold rounded-lg transition-all"
                >
                  VIEW IN CATALOG
                </button>

                <button
                  onClick={() => {
                    onClose();

                    if (onAskAxis) {
                      onAskAxis();
                    }
                  }}
                  className="group w-full sm:w-auto px-5 py-3 bg-axio-red hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow-[0_10px_25px_rgba(255,48,70,0.18)] flex items-center justify-center gap-2 transition-all"
                >

                  <Bot className="w-4 h-4" />

                  ASK AXIS ABOUT DATASET

                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />

                </button>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ============================================================
          ANIMATION STYLES
      ============================================================ */}

      <style>{`

        .modal-enter {
          animation: modalEnter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .step-enter {
          animation: stepEnter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes modalEnter {

          from {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
            filter: blur(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

        }

        @keyframes stepEnter {

          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .modal-enter,
          .step-enter {
            animation: none;
          }

        }

      `}</style>

    </div>
  );
};