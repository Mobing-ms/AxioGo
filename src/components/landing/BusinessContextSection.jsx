import React from 'react';
import { BookOpen, FileText, Layers, Target, Shield, HelpCircle, Check } from 'lucide-react';

export const BusinessContextSection = () => {
  const contextConcepts = [
    { label: 'KPI DEFINITION', value: 'Fleet Maintenance Cost per Mile ($0.42)', icon: Target, color: 'text-axio-cyan' },
    { label: 'BUSINESS RULE', value: 'Coolant temp > 105°C triggers shop recall', icon: Shield, color: 'text-axio-red' },
    { label: 'OWNER', value: 'Asset Mgmt & Logistics Team', icon: Layers, color: 'text-emerald-400' },
    { label: 'FRESHNESS SLA', value: 'Real-time (5s telemetry sync)', icon: BookOpen, color: 'text-amber-400' },
    { label: 'SOP POLICY', value: 'Vehicle Group A warranty claim protocol', icon: FileText, color: 'text-blue-400' }
  ];

  return (
    <section className="py-24 bg-axio-bg border-b border-axio-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-axio-red/10 border border-axio-red/30 text-axio-red font-mono text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>02. BUSINESS CONTEXT & RAG LAYER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            DATA ISN'T ENOUGH. <br />
            <span className="text-axio-cyan">CONTEXT GIVES DATA MEANING.</span>
          </h2>
          <p className="text-base sm:text-lg text-axio-text-secondary font-sans leading-relaxed">
            AXIS understands what enterprise data <span className="text-white font-semibold underline decoration-axio-cyan decoration-2">means</span> to the business, not only what database columns are named.
          </p>
        </div>

        {/* Column Name vs Business Definition Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Traditional Raw Column View */}
          <div className="p-6 bg-axio-panel border border-axio-border rounded-xl font-mono text-left opacity-60 hover:opacity-100 transition-opacity">
            <div className="text-xs text-axio-muted mb-2 font-bold uppercase tracking-wider">TRADITIONAL SQL BI INTERACTION</div>
            <div className="p-3 bg-axio-bg border border-axio-border rounded text-axio-text-sub text-xs mb-4">
              <code>SELECT SUM(m_cost) FROM db.tbl WHERE cat = 4;</code>
            </div>
            <p className="text-xs text-axio-muted leading-relaxed">
              Requires users or analysts to memorize raw table names, numerical category flags, and SQL syntax. Breaks when business definitions evolve.
            </p>
          </div>

          {/* AxioGo Business Context Layer */}
          <div className="p-6 bg-axio-card border border-axio-red/40 rounded-xl font-mono text-left shadow-xl shadow-axio-red/5">
            <div className="text-xs text-axio-red mb-2 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4 text-axio-red" />
              <span>AXIOGO CONTEXTUALIZED REASONING</span>
            </div>
            <div className="p-3 bg-axio-red/10 border border-axio-red/30 rounded text-white text-xs mb-4 font-semibold">
              "Why did maintenance costs increase in Vehicle Group A?"
            </div>
            <p className="text-xs text-axio-text-sub leading-relaxed">
              AXIS maps <code className="text-axio-cyan">maintenance_cost</code> using the organization's approved SAP formula, accounts for warranty rules, and filters by Vehicle Group A automatically.
            </p>
          </div>

        </div>

        {/* Structured vs Unstructured Knowledge Flow */}
        <div className="p-8 bg-axio-panel border border-axio-border rounded-xl font-mono text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Layers className="w-4 h-4 text-axio-cyan" />
            <span>UNIFIED KNOWLEDGE & RAG ARCHITECTURE</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Structured Box */}
            <div className="p-4 bg-axio-bg border border-axio-border rounded-lg">
              <div className="text-xs font-bold text-axio-cyan mb-2">STRUCTURED ENTERPRISE DATA</div>
              <ul className="text-xs text-axio-text-sub space-y-1.5">
                <li>• Databricks Delta Lake Tables</li>
                <li>• Real-time IoT Vehicle Telemetry</li>
                <li>• Master Vehicle Registry & SAP Work Orders</li>
                <li>• Insurance Claims & Financial Ledgers</li>
              </ul>
            </div>

            {/* Unstructured Box */}
            <div className="p-4 bg-axio-bg border border-axio-border rounded-lg">
              <div className="text-xs font-bold text-axio-red mb-2">UNSTRUCTURED ORGANIZATIONAL KNOWLEDGE</div>
              <ul className="text-xs text-axio-text-sub space-y-1.5">
                <li>• Standard Operating Procedures (SOPs)</li>
                <li>• Warranty Policies & OEM Repair Manuals</li>
                <li>• Driver Safety Guidelines & Compliance Docs</li>
                <li>• Previous AXIS Analytical Reports & Notes</li>
              </ul>
            </div>

          </div>

          <div className="mt-6 text-center text-xs text-axio-muted pt-4 border-t border-axio-border">
            Both structured data and unstructured policies flow into AXIS to deliver accurate, enterprise-compliant decision intelligence.
          </div>
        </div>

      </div>
    </section>
  );
};
