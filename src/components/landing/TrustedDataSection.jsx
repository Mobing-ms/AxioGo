import React, { useState } from 'react';
import { Database, Layers, CheckCircle2, ArrowRight, Server, Cpu, ShieldCheck } from 'lucide-react';

export const TrustedDataSection = () => {
  const [activeStage, setActiveStage] = useState('GOLD');

  const pipelineStages = [
    {
      id: 'DATASET',
      label: 'RAW INGESTION',
      sub: 'Parquet / CSV / Streams',
      status: 'Complete',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      dotColor: 'bg-emerald-500',
      description: 'Enterprise automotive IoT telemetry, SAP work orders, and fuel card logs.'
    },
    {
      id: 'BRONZE',
      label: 'INTAKE / BRONZE',
      sub: 'Databricks Volume Intake',
      status: 'Complete',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      dotColor: 'bg-emerald-500',
      description: 'Raw immutable data lakehouse tables stored securely inside enterprise cloud.'
    },
    {
      id: 'SILVER',
      label: 'FORGE / SILVER',
      sub: 'Standardized Delta Lake',
      status: 'Processing',
      color: 'border-axio-red text-axio-red bg-axio-red/10',
      dotColor: 'bg-axio-red animate-pulse',
      description: 'Schema enforcement, null handling, unit normalization, and deduplication.'
    },
    {
      id: 'GOLD',
      label: 'INSIGHT / GOLD',
      sub: 'Business Aggregates',
      status: 'Complete',
      color: 'border-axio-cyan text-axio-cyan bg-axio-cyan/10',
      dotColor: 'bg-axio-cyan',
      description: 'Trusted analytics-ready tables for vehicle telemetry, maintenance, and claims.'
    },
    {
      id: 'CATALOG',
      label: 'DATA CATALOG',
      sub: 'Unity Catalog Sync',
      status: 'Complete',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      dotColor: 'bg-emerald-500',
      description: 'AxioGo metadata indexing, freshness tracking, and security labeling.'
    },
    {
      id: 'ANALYTICS',
      label: 'AXIOGO INTELLIGENCE',
      sub: 'AXIS & Decision Engine',
      status: 'Active',
      color: 'border-axio-red text-white bg-axio-red/20',
      dotColor: 'bg-axio-red animate-ping',
      description: 'Natural language reasoning over trusted business context and analytics.'
    }
  ];

  return (
    <section className="py-24 bg-axio-bg border-b border-axio-border relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-axio-cyan/10 border border-axio-cyan/30 text-axio-cyan font-mono text-xs font-semibold mb-4">
            <Database className="w-3.5 h-3.5" />
            <span>01. DATA ENGINEERING LAYER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            TRUSTED DATA.
          </h2>
          <p className="text-base sm:text-lg text-axio-text-secondary leading-relaxed font-sans">
            AxioGo sits <span className="text-white font-semibold underline decoration-axio-red decoration-2">ABOVE</span> the existing enterprise Databricks Lakehouse foundation — honoring enterprise security without duplicating raw storage.
          </p>
        </div>

        {/* Databricks vs AxioGo Architecture Box */}
        <div className="p-6 sm:p-8 bg-axio-panel border border-axio-border rounded-xl shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 font-mono text-[10px] text-axio-muted border-b border-l border-axio-border bg-axio-bg">
            ARCHITECTURE BOUNDARY
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Databricks Side */}
            <div className="lg:col-span-5 p-5 bg-axio-bg border border-axio-border rounded-lg text-left font-mono">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-5 h-5 text-axio-cyan" />
                <span className="text-sm font-bold text-white">EXISTING DATABRICKS FOUNDATION</span>
              </div>
              <p className="text-xs text-axio-muted leading-relaxed mb-4">
                Remains the data-engineering platform. Handles ETL, Delta Lake, Unity Catalog, and raw Spark compute.
              </p>
              <div className="space-y-1.5 text-[11px] text-axio-text-sub">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-axio-green" /> Bronze / Silver / Gold Lakehouse Storage</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-axio-green" /> Spark Jobs & Scheduled Pipelines</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-axio-green" /> Enterprise Governance & Encryption</div>
              </div>
            </div>

            {/* Connection Flow Divider */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-axio-red/10 border border-axio-red/40 flex items-center justify-center text-axio-red my-2">
                <ArrowRight className="w-6 h-6 rotate-90 lg:rotate-0" />
              </div>
              <span className="font-mono text-[10px] text-axio-muted uppercase tracking-wider">SECURE CONNECTOR</span>
            </div>

            {/* AxioGo Layer */}
            <div className="lg:col-span-5 p-5 bg-axio-card border border-axio-red/30 rounded-lg text-left font-mono">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-axio-red" />
                <span className="text-sm font-bold text-white">AXIOGO DECISION LAYER</span>
              </div>
              <p className="text-xs text-axio-muted leading-relaxed mb-4">
                Adds business context, AXIS multi-agent intelligence, conversational query, and controlled autonomous actions.
              </p>
              <div className="space-y-1.5 text-[11px] text-axio-text-sub">
                <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-axio-red" /> AXIS Multi-Agent Reasoning</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-axio-red" /> Business Context & RAG Index</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-axio-red" /> Controlled Autonomous Execution</div>
              </div>
            </div>

          </div>
        </div>

        {/* Animated Data Pipeline Stages */}
        <div className="mt-12">
          <h3 className="text-sm font-mono font-bold text-axio-muted uppercase tracking-wider mb-6 text-center">
            LIVE PIPELINE PROGRESSION VISUALIZER
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {pipelineStages.map((stage) => {
              const isSelected = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-4 rounded-lg border text-left font-mono transition-all ${
                    isSelected 
                      ? 'bg-axio-card border-axio-red shadow-lg shadow-axio-red/10 scale-105' 
                      : 'bg-axio-panel border-axio-border hover:border-axio-border-bright'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${stage.color}`}>
                      {stage.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white mb-1">{stage.label}</div>
                  <div className="text-[10px] text-axio-muted truncate">{stage.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Pipeline Stage View */}
          {activeStage && (
            <div className="mt-4 p-4 bg-axio-card border border-axio-border rounded-lg text-left font-mono text-xs">
              <span className="text-axio-red font-bold uppercase">STAGE DETAILS ({activeStage}): </span>
              <span className="text-axio-text-sub">
                {pipelineStages.find(s => s.id === activeStage)?.description}
              </span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
